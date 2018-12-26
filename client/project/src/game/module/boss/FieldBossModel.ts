enum Enum_BOSSTYPE {
	field_boss = 1,
	public_boss = 2,
	person_boss = 3,
	vip_boss = 4,
}
class BossModel extends BaseSystem {

	private m_FieldBossInfo: FieldBossInfo[] = []
	private m_PublicBossInfo: PublicBossInfo[] = []
	private m_VipBossInfo: VipBossInfo[] = []

	/**挑战次数*/
	public pBossChallengenum: number = 0
	/**恢复时间 */
	public pBossRecovertiem: number = 0
	/***购买挑战次数 */
	public purchasecount: number = 0
	/**复活次数 */
	public reborncount: number = 0

	public bossRemind: number


	public constructor() {
		super()

		this.mRedPoint = new BossModelRedPoint()
	}


	public Init() {
		let config = GameGlobal.Config.FieldBossConfig
		for (let key in config) {
			let configData = config[key]
			let bossInfo = new FieldBossInfo()
			bossInfo.id = configData.id
			bossInfo.level = configData.level
			bossInfo.hp = 0
			bossInfo.ownerName = ""
			bossInfo.ownerGuildName = ""
			bossInfo.ownerHeadId = UIHelper.DEFUALT_HEAD_ID
			bossInfo.status = FieldBossState.CLOSE
			bossInfo.leftTime = 0
			this.m_FieldBossInfo.push(bossInfo)
		}
		config = GameGlobal.Config.PublicBossConfig
		for (let key in config) {
			let configData = config[key]
			let bossInfo = new PublicBossInfo()
			bossInfo.id = configData.id
			bossInfo.level = configData.level
			bossInfo.hp = 0
			// bossInfo.ownerName = ""
			// bossInfo.ownerGuildName = ""
			// bossInfo.ownerHeadId = UIHelper.DEFUALT_HEAD_ID
			bossInfo.status = FieldBossState.CLOSE
			// bossInfo.leftTime = 0
			this.m_PublicBossInfo.push(bossInfo)
		}
		config = GameGlobal.Config.VipBossConfig
		for (const item in config) {
			let pBoss = new VipBossInfo()
			pBoss.initLocalData(config[item])
			this.m_VipBossInfo.push(pBoss)
		}


		SortTools.sortMap(this.m_PublicBossInfo, 'id', true)
		SortTools.sortMap(this.m_FieldBossInfo, 'id', true)

		this.regNetMsg(S2cProtocol.sc_field_boss_base_list, this._DoBossList)
		this.regNetMsg(S2cProtocol.sc_field_boss_update_one, this._UpdateFieldBoss)

		this.regNetMsg(S2cProtocol.sc_public_boss_base_list, this._DoPublicList)
		this.regNetMsg(S2cProtocol.sc_public_boss_update_one, this._DoUpdatePublicBossOne)
		this.regNetMsg(S2cProtocol.sc_public_boss_update_challenge, this._DoUpdatePublicBossChallenge)
		this.regNetMsg(S2cProtocol.sc_public_boss_record_attack, this._DoPublicBossRecord)
		this.regNetMsg(S2cProtocol.sc_public_boss_record_kill, this._DoPublicBossKillRecord)
		this.regNetMsg(S2cProtocol.sc_public_boss_challenge_fail, this._DoPublicBossChallengeResult)
		this.regNetMsg(S2cProtocol.sc_public_boss_update_attack, this._DoPublicBossUpdateAtk)

		//vipboss
		this.regNetMsg(S2cProtocol.sc_vipboss_base_list, this.vipBossBase)
		this.regNetMsg(S2cProtocol.sc_vipboss_update_one, this.vipBossUpdateOne)

	}
	public getRemindByIndex(index) {
		return ((this.bossRemind >> (index + 1)) & 1) == 1;
	};
	public setRemind(value) {
		this.bossRemind ^= value;
		this.sendSaveRemind();
	};


	public GetBossInfoById(type: number, id: number): IBossInfo {
		if (type == Enum_BOSSTYPE.field_boss) {
			for (let info of this.m_FieldBossInfo) {
				if (info.id == id) {
					return info
				}
			}
		} else if (type == Enum_BOSSTYPE.public_boss) {
			for (let info of this.m_PublicBossInfo) {
				if (info.id == id) {
					return info
				}
			}
		}

		return null
	}

	public GetBossInfos(type: number): IBossInfo[] {
		if (type == Enum_BOSSTYPE.field_boss) {
			return this.m_FieldBossInfo
		} else if (type == Enum_BOSSTYPE.public_boss) {
			return this.m_PublicBossInfo
		}
		
	}

	public getVipBossInfo()
	{
		return this.m_VipBossInfo
	}

	public GetNextRefreshTime(): string {
		let openTime = this.GetOpenTime()
		let time = GameServer.serverTime * 1000
		if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
			let baseConfig = GameGlobal.Config.FieldBossCommonConfig
			let refreshtime = baseConfig.refreshtime
			let strTime = parseInt(refreshtime[0])
			return "0" + strTime + ":00:00"
		}
		let date = new Date(GameServer.serverTime * 1000)
		let hours = date.getHours()
		let minute = date.getMinutes()
		if (minute < 30) {
			minute = 30
		} else {
			hours = hours + 1
			minute = 0
		}
		return DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute) + ":00";
	}
	public GetRunTime(): string {
		let openTime = this.GetOpenTime()
		let time = GameServer.serverTime * 1000
		if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
			let baseConfig = GameGlobal.Config.FieldBossCommonConfig
			let refreshtime = baseConfig.refreshtime
			let strTime = parseInt(refreshtime[0])
			return "0" + strTime + ":00:00";
		}
		let date = new Date(GameServer.serverTime * 1000)
		let hours = date.getHours()
		let minute = date.getMinutes()
		if (minute < 30) {
			minute = 25
		} else {
			minute = 55
		}
		return DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute) + ":00";
	}
	// public static GetNextFreshTimeStr(bossInfo: FieldBossInfo) {
	// 	let str = ""
	// 	let baseConfig = GameGlobal.Config.FieldBossCommonConfig
	// 	let refreshtime = baseConfig.refreshtime
	// 	let strTime = parseInt(refreshtime[0])
	// 	if (bossInfo.status == FieldBossState.CLOSE) {
	// 		str = "0" + strTime + ":00"
	// 	} else {
	// 		let date = new Date(GameServer.serverTime * 1000)
	// 		let hours = date.getHours()
	// 		let minute = date.getMinutes()
	// 		if (minute < 30) {
	// 			minute = 30
	// 		} else {
	// 			hours = hours + 1
	// 			minute = 0
	// 		}
	// 		str = DateUtils.formatTimeNum(hours) + ":" + DateUtils.formatTimeNum(minute)
	// 	}
	// 	return `|C:0xF5D061&T:下次刷新时间：|C:0x019704&T:${str}|`
	// }

	private m_OpenTime: {
		mStart: number,
		mEnd: number,
		mCloseStart: number,
		mCloseEnd: number,
	} = null

	public OnDayTimer() {
		this.m_OpenTime = null
	}

	private GetOpenTime() {
		if (this.m_OpenTime == null) {
			let startDate = new Date(GameServer.serverTime * 1000)
			startDate.setHours(8, 0, 0, 0)
			let endDate = new Date(GameServer.serverTime * 1000)
			endDate.setDate(endDate.getDate() + 1)
			endDate.setHours(2, 25, 0, 0)
			let closeStart = new Date(GameServer.serverTime * 1000)
			closeStart.setHours(2, 25, 0, 0)
			let closeEnd = new Date(GameServer.serverTime * 1000)
			closeEnd.setHours(8, 0, 0, 0)
			this.m_OpenTime = {
				mStart: startDate.getTime(),
				mEnd: endDate.getTime(),
				mCloseStart: closeStart.getTime(),
				mCloseEnd: closeEnd.getTime()
			}
		}
		return this.m_OpenTime
	}

	// 是否是逃跑的状态
	public IsRun() {
		for (let info of this.m_FieldBossInfo) {
			if (info.status == FieldBossState.RUN) {
				return true
			}
		}
		return false
		// let curTime = GameServer.serverTime * 1000
		// let date = new Date(curTime)
		// let minute = date.getMinutes()
		// let t = GameGlobal.Config.FieldBossCommonConfig
		// if (minute <= 30) {
		// 	return minute >= t.escapetime
		// } else {
		// 	return minute >= (t.escapetime + 30)
		// }
	}

	public GetRunLeftTime(): number {
		let time = GameServer.serverTime * 1000
		let date = new Date(time)
		let minute = date.getMinutes()
		let t = GameGlobal.Config.FieldBossCommonConfig
		if (minute < 30) {
			date.setMinutes(t.escapetime, 0, 0)
		} else {
			date.setMinutes(t.escapetime + 30, 0, 0)
		}
		return date.getTime() - time
	}

	private mIsChallengeTime = {
		mTime: -1000,
		mIsChallenge: false
	}

	private _IsChallengeTime(): boolean {
		this.mIsChallengeTime.mTime = egret.getTimer()
		let openTime = this.GetOpenTime()
		let time = GameServer.serverTime * 1000
		if (time >= openTime.mCloseStart && time <= openTime.mCloseEnd) {
			return false
		}
		let date = new Date(GameServer.serverTime * 1000)
		let hours = date.getHours()
		let minute = date.getMinutes()
		let t = GameGlobal.Config.FieldBossCommonConfig
		if (minute < 30) {
			return minute < t.escapetime
		} else {
			return minute < (t.escapetime + 30)
		}
	}

	public IsChallengeTime(): boolean {
		let t = egret.getTimer()
		let data = this.mIsChallengeTime
		if (t - data.mTime > 1000) {
			data.mTime = t
			data.mIsChallenge = this._IsChallengeTime()
		}
		return data.mIsChallenge
	}

	public buyFunc(): void {
		let str = "花费|C:0xd27701&T:" + GameGlobal.Config.PublicBossBaseConfig.cost + "元宝|购买|C:0x0fc06&T:" + GameGlobal.Config.PublicBossBaseConfig.income + "次|挑战次数\r"
		str += "剩余|C:0x0fc06&T:" + (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].buychasingtimes - this.purchasecount) + "|次\r"
		let nextCfg = GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv + 1];
		if (nextCfg) {
			str += "|C:0x0fc06&T:vip" + (GameGlobal.actorModel.vipLv + 1) + "|每天可购买|C:0x0fc06&T:" + nextCfg.buychasingtimes + "|次";
		}
		WarnWin.show(str, this.onBuy, this)
	}
	private onBuy(): void {
		if (GameGlobal.Config.VipChallengeTimesConfig[GameGlobal.actorModel.vipLv].buychasingtimes - this.purchasecount <= 0) {
			UserTips.InfoTip("购买次数已达上限")
			return
		}
		if (Checker.Money(MoneyConst.yuanbao, GameGlobal.Config.PublicBossBaseConfig.cost, true)) {
			GameGlobal.BossModel.sendBuyChallege();
		}
	}

	//=================================协议==================
	/**
	* 初始化野外BOSS
	*/
	private _DoBossList(rsp: Sproto.sc_field_boss_base_list_request) {
		for (let data of rsp.bossInfos) {
			let bossInfo: FieldBossInfo = <FieldBossInfo>this.GetBossInfoById(Enum_BOSSTYPE.field_boss, data.id)
			if (bossInfo) {
				bossInfo.hp = data.hp
				bossInfo.status = data.status
				bossInfo.ownerId = data.ownerId
				bossInfo.ownerName = data.ownerName
				bossInfo.ownerHeadId = data.ownerJob * 10 + data.ownerSex
				bossInfo.leftTime = data.time || 0
				bossInfo.ischallenge = data.ischallenge || false
			} else {
				console.error("not boss id => " + data.id)
			}
		}
		// SortTools.sortMap(this.m_FieldBossInfo,'Weight',true)
		GameGlobal.MessageCenter.dispatch(MessageDef.FIELD_BOSS_UPDATE)
	}
	private _UpdateFieldBoss(rsp: Sproto.sc_field_boss_update_one_request) {
		let data = rsp.bossInfo
		let bossInfo: FieldBossInfo = <FieldBossInfo>this.GetBossInfoById(Enum_BOSSTYPE.field_boss, data.id)
		if (bossInfo) {
			bossInfo.hp = data.hp
			bossInfo.status = data.status
			bossInfo.ownerId = data.ownerId
			bossInfo.ownerName = data.ownerName
			bossInfo.ownerHeadId = data.ownerJob * 10 + data.ownerSex
			bossInfo.leftTime = data.time || 0
			bossInfo.ischallenge = data.ischallenge || false
		} else {
			console.error("not boss id => " + data.id)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.FIELD_BOSS_UPDATE)
	}



	private _DoPublicList(rsp: Sproto.sc_public_boss_base_list_request) {
		for (let data of rsp.bossInfos) {
			let bossInfo: PublicBossInfo = <PublicBossInfo>this.GetBossInfoById(Enum_BOSSTYPE.public_boss, data.id)
			if (bossInfo) {
				bossInfo.parser(data)
			} else {
				console.error("not boss id => " + data.id)
			}
		}
		// this.m_PublicBossInfo.sort(BossModel.Sort2)
		// SortTools.sortMap(this.m_PublicBossInfo,'Weight',true)

		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE)
	}

	private _DoUpdatePublicBossOne(rsp: Sproto.sc_public_boss_update_one_request) {
		let bossInfo: PublicBossInfo = <PublicBossInfo>this.GetBossInfoById(Enum_BOSSTYPE.public_boss, rsp.bossInfo.id)
		if (bossInfo) {
			bossInfo.parser(rsp.bossInfo)
		}
		if(GameGlobal.BossModel.getRemindByIndex(rsp.bossInfo.id - 1))
			if(rsp.bossInfo.reborn)
				GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_REBORN,rsp.bossInfo.id,true);
		// SortTools.sortMap(this.m_PublicBossInfo,'Weight',true)
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE)
	}
	private _DoUpdatePublicBossChallenge(rsp: Sproto.sc_public_boss_update_challenge_request) {
		this.pBossChallengenum = rsp.challengenum;
		this.pBossRecovertiem = rsp.recovertiem;
		this.purchasecount = rsp.purchasecount;
		this.reborncount = rsp.reborncount;
		this.bossRemind = rsp.rebornmark;
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE)
	}
	private _DoPublicBossRecord(rsp: Sproto.sc_public_boss_record_attack_request) {
		SortTools.sortMap(rsp.attackinfos, "injure", false)
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RECORD, [rsp.rank, rsp.attackinfos])
	}
	private _DoPublicBossKillRecord(rsp: Sproto.sc_public_boss_record_kill_request) {
		SortTools.sortMap(rsp.killinfos, "killtime", false)
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RECORD_KILL, rsp.killinfos)
	}

	public mPubBossAtkInfo: Sproto.sc_public_boss_update_attack_request

	private _DoPublicBossUpdateAtk(rsp: Sproto.sc_public_boss_update_attack_request) {
		this.mPubBossAtkInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_UPDATE_ATK)
	}

	// 清理全民boss伤害信息
	public ClearPubBossAtkInfo() {
		this.mPubBossAtkInfo = null
	}

	private _DoPublicBossChallengeResult(rsp: Sproto.sc_public_boss_challenge_fail_request) {
		UserTips.ErrorTip("挑战失败，BOSS已经死亡")
	}



	private vipBossBase(rsp: Sproto.sc_vipboss_base_list_request) {
		//刷新vipboss 数据内容 //整体
		for (const item in this.m_VipBossInfo) {
			let pData = this.m_VipBossInfo[item]
			for (const index in rsp.bossInfos) {
				if(pData.id == rsp.bossInfos[index].id)
				{
					pData.updataDataByServer(rsp.bossInfos[index])// 更新数据内容
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.VIP_BOSS_UPDATE)
	}

	private vipBossUpdateOne(rsp: Sproto.sc_vipboss_update_one_request) {
		//刷新vipboss 数据内容 //单个
		for (const item in this.m_VipBossInfo) {
			let pData = this.m_VipBossInfo[item]
			if(pData.id == rsp.bossInfo.id)
			{
				pData.updataDataByServer(rsp.bossInfo)
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.VIP_BOSS_UPDATE)
	}

		



	/**
	* 请求boss列表数据
	*/
	public sendCallFieldBossList(): void {
		this.Rpc(C2sProtocol.cs_field_boss_boss_list)
	}

    /**
     * 请求挑战野外boss
     * 1-10
     * @param fbID  副本ID
     */
	public sendChallenge(id: number): void {
		let req = new Sproto.cs_field_boss_challenge_request()
		req.id = id
		this.Rpc(C2sProtocol.cs_field_boss_challenge, req)
	}

	public sendBuyChallege(): void {
		this.Rpc(C2sProtocol.cs_public_boss_buy_challenge)
	}

	public sendPublicChallenge(id: number): void {
		let req = new Sproto.cs_public_boss_challenge_request()
		req.id = id
		this.Rpc(C2sProtocol.cs_public_boss_challenge, req)
	}
	public sendPublicReBornChallenge(id: number): void {
		let req = new Sproto.cs_public_boss_challenge_reborn_request()
		req.id = id
		this.Rpc(C2sProtocol.cs_public_boss_challenge_reborn, req)
	}

	public sendPublicRecord(id: number): void {
		let req = new Sproto.cs_public_boss_record_attack_request()
		req.id = id
		this.Rpc(C2sProtocol.cs_public_boss_record_attack, req)
	}

	public sendPublicKillRecord(id: number): void {
		let req = new Sproto.cs_public_boss_record_kill_request()
		req.id = id
		this.Rpc(C2sProtocol.cs_public_boss_record_kill, req)
	}

	public sendSaveRemind() {
		let rsp = new Sproto.cs_public_boss_reborn_mark_request
		rsp.rebornmark = this.bossRemind
		this.Rpc(C2sProtocol.cs_public_boss_reborn_mark, rsp)
	};

	//vipboss
		/**
	* 请求vip boss列表数据
	*/
	public sendCallVipBossList(): void {
		this.Rpc(C2sProtocol.cs_vipboss_list)
	}

	//挑战具体关卡
	public sendVipbossChallenge(_id) {
		if(!_id) return ;
		let rsp = new Sproto.cs_vipboss_challenge_request
		rsp.id = _id
		this.Rpc(C2sProtocol.cs_vipboss_challenge, rsp)
	};

	//全民BOSS 红点提示
	public IsPublicBossNotice() {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_45)) {
			return false
		}
		if (this.pBossChallengenum <= 0)
		{
			return false
		}
		
		let list = this.m_PublicBossInfo
		for (let bossData of list)
		{
			if (GameGlobal.actorModel.level >= bossData.level && !bossData.isKill)
			{
				return true
			}
		}

		return false
	}

	//野外BOSS 红点提示
	public IsFieldBossNotice() {
		let list = this.m_FieldBossInfo
		for (let bossData of list) 
		{
			let config = GameGlobal.Config.FieldBossConfig[bossData.id]	
			if (config && config.needbossprops) {
				if (GameGlobal.UserBag.GetCount(config.needbossprops.id) < config.needbossprops.count) {
					continue
				}
			}
			if (GameGlobal.actorModel.level >= bossData.level && bossData.status == FieldBossState.OPEN)
			{
				return true
			}
		}

		return false
	}

	//VIPBOSS 红点提示
	public IsVIPBossNotice() {
		let list = this.m_VipBossInfo
		for (let bossData of list)
		{
			let nVipLv = UserVip.ins().lv
			if ((GameGlobal.actorModel.level >= bossData.levelLimit || nVipLv >= bossData.viplvlimit) 
				&& (bossData.vipCount[nVipLv] || 1) - bossData.daycount > 0 && Checker.Money(bossData.costgold.id, bossData.costgold.count, false))
			{
				return true
			}
		}

		return false
	}


	public mRedPoint: BossModelRedPoint

	public IsRedPointBoss(type: number) {
		return this.mRedPoint.IsRedAct(type)
	}

	public IsRedPoint() {
		this.mRedPoint.Get(BossModelRedPoint.INDEX_ACT)
		// return this.mRedPoint.IsRedPoint()

		// 不包括至尊boss
		return this.mRedPoint.IsRedAct(BossModelRedPoint.PERSONNAL_BOSS) || this.mRedPoint.IsRedAct(BossModelRedPoint.PUBLIC_BOSS) || this.mRedPoint.IsRedAct(BossModelRedPoint.FIELD_BOSS)
	}
}


class BossModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly PERSONNAL_BOSS = 1
		public static readonly PUBLIC_BOSS = 2
		public static readonly FIELD_BOSS = 3
		public static readonly VIP_BOSS = 4
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}

	constructor() {
		super()
	}

	public GetMessageDef(): string[] {
		return [MessageDef.FB_INFO_UPDATE, MessageDef.PUBLIC_BOSS_UPDATE, 
				MessageDef.FIELD_BOSS_UPDATE, MessageDef.VIP_BOSS_UPDATE, MessageDef.VIP_LEVEL_CHANGE]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[BossModelRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == BossModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.ALL_BOSS_NOTICE)
		}
	}
	
	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mRedPointMap) {
			if (this.mRedPointMap[key]) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.mRedPointMap[BossModelRedPoint.PERSONNAL_BOSS] = GameGlobal.UserFb.IsPersonBossNotice()
		this.mRedPointMap[BossModelRedPoint.PUBLIC_BOSS] = GameGlobal.BossModel.IsPublicBossNotice()
		this.mRedPointMap[BossModelRedPoint.FIELD_BOSS] = GameGlobal.BossModel.IsFieldBossNotice()
		this.mRedPointMap[BossModelRedPoint.VIP_BOSS] = GameGlobal.BossModel.IsVIPBossNotice()
	}

	public IsRedAct(type: number) {
		this.Get(BossModelRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}