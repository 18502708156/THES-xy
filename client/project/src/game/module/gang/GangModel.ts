class GangModel extends BaseSystem {

	private mGangId: number = 0
	private mGangName: string
	private mReceiveCount: number

	private mMyGangInfo: MyGangInfo
	private mGangList: GangInfo[]
	private mAppliedMap: { [key: number]: number } = {}
	private mApplicantList: ApplicantInfo[]
	private mMemberList: GangMemberInfo[] = []
	private mSkillMap: { [key: number]: GangSkillInfo } = {}
	private mProtectorInfo: GangProtectorInfo

	public gangRecordInfo: GangRecordInfo = new GangRecordInfo();
	public gangProtectorTaskInfo: Sproto.protector_task_info[] = [];
	public mAppliedCount: number = 0
	public mGangBossInfo: GangBossInfo = new GangBossInfo();

	public panTaoHuiList: any[] = [];
	public panTaoHuiExp: number = 0;
	public rewardMark: number = 0;
	public getPantao: boolean = false;
	public mCoutributeCount: number

	public mRedPoint: GangModelRedPoint

	public constructor() {
		super()

		this.mRedPoint = new GangModelRedPoint
		this.mMyGangInfo = new MyGangInfo

		this.regNetMsg(S2cProtocol.sc_guild_info, this._DoInitInfo)
		this.regNetMsg(S2cProtocol.sc_guild_list, this._RecvGetBangList)
		this.regNetMsg(S2cProtocol.sc_guild_create_ret, this._RecvCreateGang)
		this.regNetMsg(S2cProtocol.sc_guild_apply_list, this._RecvAppliedGangList)
		this.regNetMsg(S2cProtocol.sc_guild_playerinfo, this._RecvMyOtherInfo)
		this.regNetMsg(S2cProtocol.sc_guild_apply, this._RecvApplicantList)
		this.regNetMsg(S2cProtocol.sc_guild_notice_apply, this._RecvNoticeJionGang)
		this.regNetMsg(S2cProtocol.sc_guild_autoadd_ret, this._RecvSetAutoJoin)

		this.regNetMsg(S2cProtocol.sc_guild_skill_info, this._RecvSeSkillData)
		this.regNetMsg(S2cProtocol.sc_guild_skill_learn_ret, this._RecvSeLearnSkillData)

		this.regNetMsg(S2cProtocol.sc_guild_members, this._RecvMemberList)
		this.regNetMsg(S2cProtocol.sc_guild_change_office_ret, this._RecvOfficeChange)
		this.regNetMsg(S2cProtocol.sc_guild_kick_ret, this._RecvKickOut)
		this.regNetMsg(S2cProtocol.sc_guild_fund, this._RecvCapitalChange)
		this.regNetMsg(S2cProtocol.sc_guild_join_info, this._RecvJoinInfo)
		this.RegNetMsgs(S2cProtocol.player_guild_change, this._RecvGuildChange)
		this.regNetMsg(S2cProtocol.sc_guild_change_notice_ret, this._RecvNoticeChange)
		this.regNetMsg(S2cProtocol.sc_guild_rename_ret, this._RecvChangeGangName)

		this.regNetMsg(S2cProtocol.sc_guild_record_data, this._RecvRecordInfo)
		this.regNetMsg(S2cProtocol.sc_guild_record_add, this._RecvAddRecordInfo)

		this.regNetMsg(S2cProtocol.sc_guild_donate_ret, this._RecvDonateData)
		this.regNetMsg(S2cProtocol.sc_guild_donate_info, this._RecvContributeCount)
		this.regNetMsg(S2cProtocol.sc_guild_protector_info, this._RecvProtectorData)

		this.regNetMsg(S2cProtocol.sc_guild_boss_info, this._RecvGangBossData)

		this.regNetMsg(S2cProtocol.sc_guild_peach_info, this._panTaoInfo)
		this.regNetMsg(S2cProtocol.sc_guild_peach_record, this._panTaoTol)
		this.regNetMsg(S2cProtocol.sc_guild_peach_record_add, this._addPantaoInfo)

		this.regNetMsg(S2cProtocol.sc_guild_protector_task_info, this._RecvProtectorTaskData)
	}

	public Init() {

	}

	//请求蟠桃数据
	public SendGetPanTaoHuiInfo() {
		this.Rpc(C2sProtocol.cs_guild_peach_info)
	}

	//蟠桃会信息
	private _panTaoInfo(rsp: Sproto.sc_guild_peach_info_request) {
		this.rewardMark = rsp.rewardMark;
		this.getPantao = rsp.eatStatus;
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO)
	}

	//蟠桃会总记录和经验
	private _panTaoTol(rsp: Sproto.sc_guild_peach_record_request) {
		this.panTaoHuiList = rsp.eatRecord;
		this.panTaoHuiExp = rsp.peachExp;
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO)
	}

	//蟠桃会添加一条记录
	private _addPantaoInfo(rsp: Sproto.sc_guild_peach_record_add_request) {
		this.panTaoHuiList.push(rsp.eatRecord);
		this.panTaoHuiExp = rsp.peachExp;
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_PANTAOINFO)
	}

	//使用蟠桃
	public panTaoeatPeach(id) {
		let config = GlobalConfig.ins().GuildPeachConfig[id]
		if (!Checker.Money(config.cost.id, config.cost.count, Checker.YUNBAO_FRAME))
			return
			
		if (this.getPantao) {
			UserTips.ins().showTips("今日已使用过该物品");
			return
		}
		let msg = new Sproto.cs_guild_peach_eat_request;
		msg.id = id;
		this.Rpc(C2sProtocol.cs_guild_peach_eat, msg);
	}

	//获取帮会等级
	public getGangLv(): number {
		let lv = 0
		if (this.myGangInfo && this.myGangInfo.mLevel) {
			lv = this.myGangInfo.mLevel
		}
		return lv
	}

	public getPanTaoRed(id) {
		if (!BitUtil.Has(this.rewardMark, id - 1)) {
			
			return false
		}
		if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {

			return 1
		}
		return 2
	}

	public getPanTaoJl(id) {
		if (!BitUtil.Has(this.rewardMark, id - 1)) {
			UserTips.ins().showTips("奖励已领取");
			return false
		}
		if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {
			UserTips.ins().showTips("未达到所需蟠桃值");
			return 1
		}
		return 2
	}

	//领取奖励
	public panTaoBoxPeach(id) {
		if (!BitUtil.Has(this.rewardMark, id - 1)) {
			UserTips.ins().showTips("奖励已领取");
			return
		}
		if (GlobalConfig.ins().GuildPeachRewardConfig[id].exp > this.panTaoHuiExp) {
			UserTips.ins().showTips("未达到所需蟠桃值");
			return
		}
		let msg = new Sproto.cs_guild_peach_reward_request;
		msg.id = id;
		this.Rpc(C2sProtocol.cs_guild_peach_reward, msg);
	}

	private _DoInitInfo(rsp: Sproto.sc_guild_info_request) {
		this.mGangId = rsp.id
		this.mGangName = rsp.name

		this.mMyGangInfo.UpdateInfo(rsp.summary, rsp.variable)

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_INIT)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO)
	}

	private _RecvGetBangList(rsp: Sproto.sc_guild_list_request) {
		this.mReceiveCount = rsp.receiveCount
		let guilds = rsp.guilds
		this.mGangList = new Array<GangInfo>();
		let idx = 1;
		for (let info of rsp.guilds) {
			let tempGangInfo = new GangInfo;
			tempGangInfo.UpdateInfo(info, idx)
			this.mGangList.push(tempGangInfo)
			idx++
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_LIST)
	}

	private _RecvCreateGang(rsp: Sproto.sc_guild_create_ret_request) {
		if (rsp.result != 0) 
			return

		this.mGangId = rsp.id
		this.Rpc(C2sProtocol.cs_guild_getinfo)
		GameGlobal.GangModel.SendGetPanTaoHuiInfo()
		GameGlobal.GangModel.sendGetSkillInfos()
		GameGlobal.GangModel.sendGetProtectorInfo()
		GameGlobal.GangMapModel.SendGetExchange()
		GameGlobal.GuildTeamModel.SendGetInfos()
		GameGlobal.GangModel.sendGetGangBossInfo()

		this._GangIdChange()
	}

	private _RecvAppliedGangList(rsp: Sproto.sc_guild_apply_list_request) {
		this.mAppliedMap = {}
		this.mAppliedCount = rsp.guilds.length
		for (let info of rsp.guilds) {
			let tempGangInfo = this.mAppliedMap[info.id]
			if (!tempGangInfo) {
				this.mAppliedMap[info.id] = info.id
			}
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLIED_LIST)
	}

	private _RecvMyOtherInfo(rsp: Sproto.sc_guild_playerinfo_request) {
		if (!this.mMyGangInfo)
			return

		this.mMyGangInfo.UpdateOtherInfo(rsp)
	}

	private _RecvApplicantList(rsp: Sproto.sc_guild_apply_request) {
		this.mApplicantList = new Array<ApplicantInfo>()

		for (let info of rsp.applyinfo) {
			let tempApplicantInfo = new ApplicantInfo
			tempApplicantInfo.UpdateInfo(info)
			this.mApplicantList.push(tempApplicantInfo)
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLICANT_LIST)
	}

	private _RecvNoticeJionGang(rsp: Sproto.sc_guild_notice_apply_request) {
		if (rsp.result == 0) {
			this.mGangId = 0
			ViewManager.ins().close(GangListWin)
			return
		}

		this.mGangId = rsp.id
		this.Rpc(C2sProtocol.cs_guild_getinfo)
		GameGlobal.GangModel.SendGetPanTaoHuiInfo()
		GameGlobal.GangModel.sendGetSkillInfos()
		GameGlobal.GangModel.sendGetProtectorInfo()
		GameGlobal.GangMapModel.SendGetExchange()
		GameGlobal.GuildTeamModel.SendGetInfos()
		GameGlobal.GangModel.sendGetGangBossInfo()

		this._GangIdChange()
	}

	private _RecvSetAutoJoin(rsp: Sproto.sc_guild_autoadd_ret_request) {
		this.mMyGangInfo.UpdateAutoJoinInfo(rsp.autoJoin, rsp.needPower)
		UserTips.ins().showTips("设置成功")
	}
	//获取技能信息
	private _RecvSeSkillData(rsp: Sproto.sc_guild_skill_info_request) {
		let skillInfos = rsp.skillInfos
		for (let skillInfo of skillInfos) {
			let gangSkillInfo = this.mSkillMap[skillInfo.posId]
			if (!gangSkillInfo) {
				gangSkillInfo = new GangSkillInfo
				this.mSkillMap[skillInfo.posId] = gangSkillInfo
			}

			gangSkillInfo.UpdateInfo(skillInfo)
		}
		skillInfos = skillInfos.sort(GangConst.sortSkill)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_SKILL_UP, skillInfos)
	}
	private _RecvSeLearnSkillData(rsp: Sproto.sc_guild_skill_learn_ret_request) {
		let skillInfo = rsp.skillInfo
		let gangSkillInfo = this.mSkillMap[skillInfo.posId]
		if (gangSkillInfo)
			gangSkillInfo.UpdateInfo(skillInfo)

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_SKILL_LEARN_UP, skillInfo)
	}


	private _RecvMemberList(rsp: Sproto.sc_guild_members_request) {
		this.mMemberList = new Array<GangMemberInfo>()

		for (let info of rsp.members) {
			let tempMemberInfo = new GangMemberInfo
			tempMemberInfo.UpdateInfo(info)
			this.mMemberList.push(tempMemberInfo)
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST)
	}

	private _RecvOfficeChange(rsp: Sproto.sc_guild_change_office_ret_request) {
		let playerId = rsp.playerid
		let office = rsp.office

		if (playerId == GameGlobal.actorModel.actorID) {
			this.myGangInfo.mOffice = office
		}
		for (let memberInfo of this.mMemberList) {
			if (memberInfo.mPlayerId == playerId) {
				memberInfo.mOffice = office
				break
			}
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_INFO)
	}

	private _RecvKickOut(rsp: Sproto.sc_guild_kick_ret_request) {
		let playerId = rsp.playerid
		let index = 0
		for (let memberInfo of this.mMemberList) {
			if (memberInfo.mPlayerId == playerId) {
				this.mMemberList.splice(index, 1)
				break
			}

			index++
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_MEMBER_LIST)
	}

	private _RecvCapitalChange(rsp: Sproto.sc_guild_fund_request) {
		if (!this.myGangInfo) {
			return
		}
		this.myGangInfo.mCapital = rsp.fund
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO)
	}

	private _RecvJoinInfo() {
		//有人申请加入帮会的通知  可用来显示红点
		this.SendGetApplicantList()
	}

	private _RecvGuildChange(rsp: Sproto.player_guild_change_request) {
		let oldId = this.mGangId
		this.mGangId = rsp.guildID
		this.mGangName = rsp.guildName
		if (oldId) {
			this.resetInfo()
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_EXIT_NOTICE)
	}

	private _RecvNoticeChange(rsp: Sproto.cs_guild_change_notice_request) {
		this.mMyGangInfo.mNotice = rsp.text
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO)
	}

	private _RecvChangeGangName(rsp: Sproto.sc_guild_rename_ret_request) {
		if (rsp.errorInfo) {
			UserTips.ins().showTips(rsp.errorInfo)
			return
		}

		this.mMyGangInfo.mGangName = rsp.newGuildName
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_BASE_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_CHANGE_NAME)
	}

	private _RecvRecordInfo(rsp: Sproto.sc_guild_record_data_request) {
		var infos = rsp.records;
		let msgList = []
		if (infos != null) {
			for (var i = 0; i < infos.length; i++) {
				let type = infos[i].type
				if (type == GangRecordInfo.History) {
					this.gangRecordInfo.addRecordToString(infos[i]);
				} else if (type == GangRecordInfo.Chat) {
					msgList.push(infos[i].chatRecord)
				}
				// this.gangRecordInfo.addRecordToString(infos[i]);
			}
		}
		if (msgList.length) {
			GameGlobal.Chat.DoGuildMessagess(msgList)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_RECORD)
	}
	private _RecvAddRecordInfo(rsp: Sproto.sc_guild_record_add_request) {
		let type = rsp.record.type
		if (type == GangRecordInfo.History) {
			this.gangRecordInfo.addRecordToString(rsp.record);
			GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_RECORD)
		} else if (type == GangRecordInfo.Chat) {
			GameGlobal.Chat.DoGuildMessages(rsp.record.chatRecord)
		}
	}
	private _RecvDonateData(rsp: Sproto.sc_guild_donate_ret_request) {
		if (!rsp.result) 
			return

		this.mCoutributeCount = rsp.totalNum
		UserTips.ins().showTips("捐献成功")
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT)
	}

	private _RecvContributeCount(rsp: Sproto.sc_guild_donate_info_request) {
		this.mCoutributeCount = rsp.totalNum
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT)
	}

	private _RecvProtectorData(rsp: Sproto.sc_guild_protector_info_request) {
		this.mProtectorInfo = new GangProtectorInfo
		this.mProtectorInfo.parser(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_PROTECTOR_INFO, rsp)
	}

	private _RecvProtectorTaskData(rsp: Sproto.sc_guild_protector_task_info_request) {
		if (rsp.taskinfos != null) {
			this.gangProtectorTaskInfo = rsp.taskinfos;
			GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_PROTECTOR_TASK_INFO, rsp)
		}
	}

	//返回帮会boss数据 更新也是这条
	private _RecvGangBossData(rsp: Sproto.sc_guild_boss_info_request) {
		// if(rsp.event == 1){
		//     //开始，进入副本战斗界面 指开始时间到了
		// 	ViewManager.ins().closeAll();
		// }
		// else 
		// {
		// 	if(rsp.event == 2)//指结束时间到了
		// 		ViewManager.ins().open(GangBossPanel);
		// }
		this.mGangBossInfo.UpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATA_GANG_BOSS_INFO, rsp)
	}

	private _GangIdChange() {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_ID_CHANGE)
	}

	// 发送请求--------------------------

	public SendGetPlayerInfo() {
		this.Rpc(C2sProtocol.cs_guild_getplayerinfo)
	}

	public SendGetGangBaseInfo() {
		this.Rpc(C2sProtocol.cs_guild_getinfo)
	}

	public SendCreateGang(id: number, name: string) {
		let req = new Sproto.cs_guild_create_request
		req.id = id
		req.name = name
		this.Rpc(C2sProtocol.cs_guild_create, req)
	}
	//帮会改名
	public sendChangeName(name: string) {
		let req = new Sproto.cs_guild_rename_request
		req.guildName = name
		this.Rpc(C2sProtocol.cs_guild_rename, req)
	}

	//帮会技能
	public sendGetSkillInfos() {
		let req = new Sproto.cs_guild_skill_info_request
		this.Rpc(C2sProtocol.cs_guild_skill_info, req);
	}
	//帮会技能
	public sendLearnGangSkill() {
		let req = new Sproto.cs_guild_skill_learn_request
		this.Rpc(C2sProtocol.cs_guild_skill_learn, req);
	}
	//获取帮会列表
	public SendGetGangList() {
		this.Rpc(C2sProtocol.cs_guild_getlist)
	}
	//获取申请列表
	public SendGetApplyList() {
		this.Rpc(C2sProtocol.cs_guild_apply_list)
	}
	//发送请求加入
	public SendJoinGang(id: number) {
		let req = new Sproto.cs_guild_join_request
		req.id = id
		this.Rpc(C2sProtocol.cs_guild_join, req)
	}

	public SendSetApply(playerId: number, isAgree: boolean) {
		let req = new Sproto.cs_guild_setapply_request
		req.playerid = playerId
		req.result = isAgree ? 1 : 0
		this.Rpc(C2sProtocol.cs_guild_setapply, req)
	}

	public SendAutoJoin(auto: number, power: number) {
		let req = new Sproto.cs_guild_setautoadd_request
		req.auto = auto
		req.power = power
		this.Rpc(C2sProtocol.cs_guild_setautoadd, req)
	}

	public SendGetApplicantList() {
		this.Rpc(C2sProtocol.cs_guild_getapply)
	}

	public SendGetMemberList() {
		this.Rpc(C2sProtocol.cs_guild_getmembers)
	}

	public SendExchangOffice(playerId: number, office: number) {
		let req = new Sproto.cs_guild_change_office_request
		req.playerid = playerId
		req.office = office

		this.Rpc(C2sProtocol.cs_guild_change_office, req)
	}

	public SendKickOutMember(playerId: number) {
		let req = new Sproto.cs_guild_kick_request
		req.playerid = playerId

		this.Rpc(C2sProtocol.cs_guild_kick, req)
	}

	public SendExit() {
		this.Rpc(C2sProtocol.cs_guild_quit)
	}

	public SendModifyNotice(text: string) {
		let req = new Sproto.cs_guild_change_notice_request
		req.text = text

		this.Rpc(C2sProtocol.cs_guild_change_notice, req)
	}

	public SendGetJuanXuanList(id: number) {
		let req = new Sproto.cs_guild_donate_request
		req.id = id
		this.Rpc(C2sProtocol.cs_guild_donate, req)
	}

	//发送获取帮派守护信息
	public sendGetProtectorInfo() {
		let req = new Sproto.cs_guild_protector_info_request
		this.Rpc(C2sProtocol.cs_guild_protector_info, req);
	}

	//发送获取帮派守护升级信息
	public sendProtectorUpLv() {
		let req = new Sproto.cs_guild_protector_uplevel_request
		this.Rpc(C2sProtocol.cs_guild_protector_uplevel, req);
	}

	//发送获取帮派守护每日奖励信息
	public sendGetProtectorEveryDataAward(id) {
		let req = new Sproto.cs_guild_protector_everyday_reward_request
		req.rewardId = id
		this.Rpc(C2sProtocol.cs_guild_protector_everyday_reward, req);
	}

	//帮会boss --------------------------------------
	//发送获取帮派守护每日奖励信息
	public sendGetGangBossInfo() {
		let req = new Sproto.cs_guild_boss_info_request
		this.Rpc(C2sProtocol.cs_guild_boss_info, req);
	}
	//发送挑战帮会boss
	public sendPKGangBoss() {
		let req = new Sproto.cs_guild_boss_pk_request
		this.Rpc(C2sProtocol.cs_guild_boss_pk, req);
	}
	//发送领取boss奖励
	public sendGetGangBossAward() {
		let req = new Sproto.cs_guild_boss_reward_request
		this.Rpc(C2sProtocol.cs_guild_boss_reward, req);
	}
	//-------------------------------------------------------------------

	public SendRecruitMember() {
		let req = new Sproto.cs_guild_member_recruit_request
		this.Rpc(C2sProtocol.cs_guild_member_recruit, req)
	}

	public resetInfo() {
		this.mMyGangInfo = new MyGangInfo
		this.mGangList = null
		this.mAppliedMap = {}
		this.mApplicantList = null
		this.mMemberList = []
		this.mSkillMap = {}
		this.mProtectorInfo = null
		this.gangRecordInfo = new GangRecordInfo
		this.gangProtectorTaskInfo = []
		this.panTaoHuiList = []
		this.panTaoHuiExp = 0
		this.rewardMark = 0
		this.getPantao = false
		this.mGangBossInfo = new GangBossInfo

		this._GangIdChange()
	}

	public get gangList() {
		return this.mGangList
	}

	public get myGangInfo() {
		return this.mMyGangInfo
	}

	public get applicantList() {
		return this.mApplicantList
	}

	public get memberList() {
		return this.mMemberList
	}

	public IsApplied(gangId) {
		return this.mAppliedMap[gangId] != null
	}

	public HasGang() {
		return this.mGangId > 0
	}

	public get protectorInfo() {
		return this.mProtectorInfo
	}

	public get receiveCount() {
		return this.mReceiveCount
	}

	public HandleApplicant(playerId) {
		let index = 0
		for (let applicantInfo of this.mApplicantList) {
			if (applicantInfo.mPlayerId == playerId) {
				this.mApplicantList.splice(index, 1)
				break
			}
			index++
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_APPLICANT_LIST)
	}

	public GetMemberInfoByPlayerId(playerId) {
		for (let memberInfo of this.mMemberList) {
			if (memberInfo.mPlayerId == playerId) {
				return memberInfo
			}
		}
	}

	public GetDeputyCount() {
		let count = 0
		for (let memberInfo of this.mMemberList) {
			if (memberInfo.mOffice == GangConst.DEPUTY_OFFICE) {
				count++
			}
		}

		return count
	}

	public HasPantao() {
		if (!this.HasGang())
			return false

		return !this.getPantao
	}

	public HasPanTaoAward() {
		if (!this.HasGang())
			return false

		for (let key in GameGlobal.Config.GuildPeachRewardConfig) {
			let awardId = parseInt(key)
			let config = GameGlobal.Config.GuildPeachRewardConfig[key]
			if (!BitUtil.Has(this.rewardMark, awardId - 1))
				continue

			if (config.exp <= this.panTaoHuiExp)
				return true
		}

		return false
	}

	public CanGangSkillUpgrade() {
		if (!this.HasGang())
			return false

		for (let posId in this.mSkillMap) {
			let gangSkillInfo = this.mSkillMap[posId]
			if (gangSkillInfo.CanUpgrade()) {
				return true
			}
		}

		return false
	}

	public CanGangProtectorUpgrade() {
		if (!this.HasGang() || !this.mProtectorInfo)
			return false

		let upgradeExp = GangConst.GetProtectorUpgradeExp(this.mProtectorInfo.protectorLv + 1)
		if (upgradeExp == -1)
			return false

		return this.mProtectorInfo.totalActive >= upgradeExp
	}

	public HasDailyAward() {
		if (!this.HasGang() || !this.mProtectorInfo)
			return false

		for (let key in GameGlobal.Config.GuildEverydayConfig) {
			let config = GameGlobal.Config.GuildEverydayConfig[key]
			if (config.exp <= this.mProtectorInfo.todayActive && (this.mProtectorInfo.rewardMark & Math.pow(2, config.id - 1)) > 0)
				return true
		}

		return false
	}

	public HasContributeAward() {
		if (!this.HasGang() || this.mCoutributeCount == null)
			return false

		if (this.mCoutributeCount >= GameGlobal.Config.GuildConfig.maxcount)
			return false

		for (let key in GameGlobal.Config.GuildDonateConfig) {
			let config = GameGlobal.Config.GuildDonateConfig[key]
			let cost = config.cost
			if (Checker.Data(cost, false))
				return true
		}

		return false
	}

	public HasGangBoss() {
		if (!this.HasGang())
			return false

		return this.mGangBossInfo.mHasAward || this.mGangBossInfo.mStatus == 1
	}

	public HasApplicant() {
		if (!this.HasGang() || !this.mApplicantList)
			return false

		return this.mApplicantList.length > 0
	}

	public IsGangBattleOpen() {
		if (!this.HasGang())
			return false

		return GameGlobal.ActivityModel.GetActivityOpenFlag(ActivityModel.TYPE_GANG_BATTLE)
	}

	public OpenGangView() {
		if (GameGlobal.GangModel.HasGang())
			ViewManager.ins().open(GangMainWin)
		else
			ViewManager.ins().open(GangListWin)
	}
}
