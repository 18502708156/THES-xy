class XiandaoModel extends BaseSystem {

	private m_MyRankData: XiandaoRankData = new XiandaoRankData
	private m_RankList: XiandaoRankData[] = []
	private m_FightRankList: XiandaoRecordData[] = []
	private m_IsOpenFlag: boolean = true
	private m_KnockoutData: XiandaoKnockoutData = new XiandaoKnockoutData
	private m_Gamble: Sproto.qualifyingMgr_gamble_data[] = []
	private m_MapData: Sproto.sc_qualifyingMgr_map_info_res_request = null
	public mType: number = XiandaoState.NOT_STARTED
	public mSign: boolean = false
	public mMyTime: Sproto.cs_qualifyingMgr_timeout_response = null
	public mChampion: number
	
	private m_Rank: number = 0

	private m_PreliminariesStartTime: number = null

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_qualifyingMgr_info_res, this._UpdateInfo)
		this.regNetMsg(S2cProtocol.sc_qualifyingMgr_map_info_res, this._UpdateMapInfo)
		this.regNetMsg(S2cProtocol.sc_qualifyingMgr_war_info, this._DoResultInfo)
	}

	// 进入预选赛
	public EnterPreliminaries(): void {
		if (GameGlobal.XiandaoModel.CanEnter()) {
			if (UserFb.CheckFighting()) {
				GameGlobal.XiandaoModel.SendEnter()
			}
		} else {
			UserTips.InfoTip("预选赛结束")
		}
	}

	// 预选赛开始时间
	public GetPreliminariesStartTime(): number {
		if (this.m_PreliminariesStartTime == null) {
			this.m_PreliminariesStartTime = DateUtils.FormatTimeString(GameGlobal.Config.XianDuMatchBaseConfig.preliminaries[0])
		}
		return Math.floor(this.m_PreliminariesStartTime / 1000)
	}

	// 预选赛开始剩余时间
	public ShowPreliminariesTime(): number {
		if (this.mType == XiandaoState.APPLY_DONE) {
			let time = this.GetPreliminariesStartTime() - GameServer.serverTime
			if (time > 0) {
				return time
			}
		}
		return 0
	}

	// 获取信息
	public SendGetInfo() {
		this.Rpc(C2sProtocol.cs_qualifyingMgr_info)
	}

	public SendGetTime() {
		this.mMyTime = null
		this.Rpc(C2sProtocol.cs_qualifyingMgr_timeout, null, this._DoGetTime, this)
	}

	private _DoGetTime(rsp: Sproto.cs_qualifyingMgr_timeout_response) {
		this.mMyTime = rsp
		if (rsp.timeout != null) {
			rsp.timeout = GameServer.serverTime + rsp.timeout
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE)
	}

	// 报名
	public SendApply() {
		this.Rpc(C2sProtocol.cs_qualifyingMgr_sign_up, null, this._DoApply, this)
	}

	private _DoApply(rsp: Sproto.cs_qualifyingMgr_sign_up_response) {
		if (rsp.ret) {
			this.mSign = true
			UserTips.InfoTip("报名成功")
			GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE)
		} else {
			UserTips.InfoTip("已报名")
		}
	}

	// 海选排行榜
	public SendGetRank() {
		this.Rpc(C2sProtocol.cs_qualifyingMgr_rank, null, this._DoRank, this)
	}

	private _DoRank(rsp: Sproto.cs_qualifyingMgr_rank_response) {
		this.m_RankList = []
		for (let i = 0, list = rsp.rank_data || [], len = list.length; i < len; i++) {
			let data = list[i]
			let item = new XiandaoRankData
			item.rank = i + 1
			item.Parse(data)
			this.m_RankList.push(item)
		}
		this.m_FightRankList = []
		for (let i = 0, list = rsp.fightRecord || [], len = list.length; i < len; i++) {
			let data = list[i]
			let item = new XiandaoRecordData
			item.trunId = i + 1
			item.Parse(data)
			this.m_FightRankList.push(item)
		}
		this.m_MyRankData.rank = rsp.rankNo	
		this.m_MyRankData.score = rsp.point
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE)
	}

	// 下注
	public SendGamble(field: number, no: number, type: number) {
		let req = new Sproto.cs_qualifyingMgr_gamble_request
		req.field = field + 1
		req.no = no + 1
		req.typ = type + 1
		this.Rpc(C2sProtocol.cs_qualifyingMgr_gamble, req, function(rsp: Sproto.cs_qualifyingMgr_gamble_response) {
			if (rsp.ret) {
				UserTips.InfoTip("下注成功")
				if (!this.m_Gamble) {
					this.m_Gamble = []
				}
				let data = new Sproto.qualifyingMgr_gamble_data
				data.field = field + 1
				data.no = no + 1
				data.typ = type + 1
				this.m_Gamble.push(data)
				GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE)
			} else {
				UserTips.InfoTip("下注失败")
			}
		}, this)
	}

	// 观看录像
	public SendVideo(the: number, field: number, round: number) {
		let req = new Sproto.cs_qualifyingMgr_video_request
		req.the = the
		req.field = field
		req.round = round
		this.Rpc(C2sProtocol.cs_qualifyingMgr_video, req)
	}

	public SendEnterKnockout() {
		if (GameMap.fbType == UserFb.FB_TYPE_XIANDAO) {
			UserTips.InfoTip("正在场景中")
			return
		}
		if (UserFb.CheckFighting()) {
			TeamBaseModelMsg.Exit()	
			GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.XianDuMatchBaseConfig.mapid)
		}
	}

	// 进入场景，或者请求信息
	public SendEnter() {
		if (GameMap.fbType == UserFb.FB_TYPE_XIANDAO) {
			UserTips.InfoTip("正在场景中")
			return
		}
		this.SendGetMapInfo()
	}

	public SendGetMapInfo() {
		this.Rpc(C2sProtocol.cs_qualifyingMgr_map_info)
	}

	public ClearGetMapInfo() {
		TimerManager.ins().remove(this.SendGetMapInfo, this)
	}

	private _DoResultInfo(rsp: Sproto.sc_qualifyingMgr_war_info_request) {
		let action = new XiandaoFinishData
		action.isWin = rsp.win
		action.roleData = rsp.roleData
		GameGlobal.RaidMgr.mBattleRaid.SetFinishAction(action)	
	}

	private _UpdateMapInfo(rsp: Sproto.sc_qualifyingMgr_map_info_res_request) {
		if (rsp.ret == 1 && GameMap.fbType != UserFb.FB_TYPE_XIANDAO) {
			if (UserFb.CheckFighting()) {
				TeamBaseModelMsg.Exit()	
				GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.XianDuMatchBaseConfig.mapid)
			}
		}
		this.m_MapData = rsp
		// 剩余时间转时间戳
		if (rsp.timeout != null) {
			TimerManager.ins().doTimer(rsp.timeout * 1000, 1, this.SendGetMapInfo, this)
			rsp.timeout = rsp.timeout + GameServer.serverTime
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_MAP_UPDATE)
	}

	private _UpdateInfo(rsp: Sproto.sc_qualifyingMgr_info_res_request) {
		if (rsp.champion != null) {
			this.mChampion = rsp.champion
		}
		if (rsp.sign != null) {
			this.mSign = rsp.sign
		}
		if (rsp.ret != null) {
			this.m_IsOpenFlag = rsp.ret
		}
		if (rsp.type != null) {
			let preType = this.mType
			this.mType = rsp.type
			// 在海选赛之前，忽略openflag
			if (this.mType < XiandaoState.PRIMARY) {
				this.m_IsOpenFlag = true
			}

			if (preType != this.mType && this.mType == XiandaoState.APPLY_DONE && this.mSign && this.m_IsOpenFlag) {
				// let time = this.ShowPreliminariesTime()
				// if (time > 0) {
					// PlayFunView.GameNotice(MainGameNoticeView.TYPE_XIANDAO, time, MainGameNoticeView.SHOW_TYPE_GOTO)
				// }
					PlayFunView.GameNotice(MainGameNoticeView.TYPE_XIANDAO, 300, MainGameNoticeView.SHOW_TYPE_GOTO)
			} else {
				PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_XIANDAO)
			}
		}
		if (rsp.rank != null) {
			this.m_Rank = rsp.rank
		}
		if (rsp.player_data) {
			let list = this.m_KnockoutData.roleDatas = {}
			this.m_KnockoutData.roleNoList = []
			for (let data of rsp.player_data) {
				let item = new XiandaoKnockoutRoleData 
				item.Parse(data)
				list[item.no] = item
			}
		}

		this._UpdateKnockoutData(0, rsp.knockouttime16)
		if (this.m_KnockoutData.turnDatas[0].length) {
			let list = []
			for (let data of this.m_KnockoutData.turnDatas[0]) {
				list.push(data.noA)
				list.push(data.noB)
			}
			this.m_KnockoutData.roleNoList = list
		}
		this._UpdateKnockoutData(1, rsp.knockouttime8)
		this._UpdateKnockoutData(2, rsp.knockouttime4)
		this._UpdateKnockoutData(3, rsp.knockouttime2)
		if (rsp.gamble) {
			this.m_Gamble = rsp.gamble || []
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE)

		this.SendGetTime()
	}

	private _UpdateKnockoutData(index: number, rsp: Sproto.qualifying_rank_data[]) {
		if (!rsp) {
			return
		}
		let list = this.m_KnockoutData.turnDatas[index] = []
		for (let data of rsp) {
			let item = new XiandaoKnockoutTurn
			item.Parse(data)
			list.push(item)
		}
	}

	// 正在比赛
	public IsGame() {
		let state = this.mType
		return state == XiandaoState._16_FINAL
			|| state == XiandaoState._8_FINAL
			|| state == XiandaoState._4_FINAL
			|| state == XiandaoState._2_FINAL
	}

	// 当前淘汰赛轮数
	public GetKnockoutId(): number {
		if (this.mType < XiandaoState._16_FINAL_DONE) {
			return 0
		}
		if (this.mType < XiandaoState._8_FINAL_DONE) {
			return 1
		}
		if (this.mType < XiandaoState._4_FINAL_DONE) {
			return 2
		}
		if (this.mType < XiandaoState._2_FINAL_DONE) {
			return 3
		}
		return 3
	}

	public GetRoleData(no: number): XiandaoKnockoutRoleData {
		return this.m_KnockoutData.roleDatas[no]
	}

	public GetTurnData(turnId: number, index: number): XiandaoKnockoutTurn {
		let data = this.m_KnockoutData.turnDatas[turnId]
		if (!data) {
			return
		}
		return data[index]
	}

	public GetBetData(index: number): Sproto.qualifyingMgr_gamble_data {
		// let the = [16, 8, 4, 2][turnId]
		for (let data of this.m_Gamble) {
			if (data.field == index + 1) {
				return data
			}
		}
		return null
	}

	// 是否在淘汰赛
	public IsKnockout(): boolean {
		// return this.mType >= XiandaoState._16_FINAL && this.mType < XiandaoState._2_FINAL_DONE
		return this.mType >= XiandaoState.PRIMARY_DONE && this.mType < XiandaoState._2_FINAL_DONE
	}
	
	// 预选赛结果
	public IsShowResult(): boolean {
		return this.mType == XiandaoState.PRIMARY_DONE
	}

	// 是否报名
	public IsApply(): boolean {
		return this.mType == XiandaoState.APPLY
	}

	public IsClose(): boolean {
		return this.mType == XiandaoState.NOT_STARTED || !this.m_IsOpenFlag
	}

	// 能否进入场景
	public CanEnter(): boolean {
		return this.mType == XiandaoState.PRIMARY || this.mType == XiandaoState.APPLY_DONE
	}

	// 上届冠军
	public GetLast(): number {
		return this.mChampion
	}

	// 失败自动退出
	public IsExitGame(): boolean {
		if (this.m_MapData) {
			return this.m_MapData.ret == 3
		}
		return false
	}

	// 活动结束退出
	public IsCloseAct(): boolean {
		if (this.m_MapData) {
			return this.m_MapData.ret == 2
		}
		return false
	}

	// 下一场开始剩余的时间
	public GetNextTime(): number {
		if (this.m_MapData) {
			return Math.max(this.m_MapData.timeout - GameServer.serverTime, 0)
		}
		return 0
	}

	public GetSimpleRankData(): XiandaoRankData[] {
		let list = []
		if (this.m_MapData) {
			let i = 0
			for (let data of this.m_MapData.rank_data || []) {
				let item = new XiandaoRankData
				item.rank = i + 1
				item.Parse(data)
				list.push(item)
				++i
			}
		}
		return list
	}

	public GetSimpleMyRank(): number {
		if (this.m_MapData) {
			return this.m_MapData.rankNo || 0
		}
		return 0
	}

	public GetSimpleMyRankScore(): number {
		if (this.m_MapData) {
			return this.m_MapData.point || 0
		}
		return 0
	}

	public GetRankData(): XiandaoRankData[] {
		return this.m_RankList
	}

	public GetMyRankData(): XiandaoRankData {
		return this.m_MyRankData
	}

	public GetGroupType(): number {
		return this.m_Rank || 1
	}

	public GetGroupTypeStr(): string {
		let type = GameGlobal.XiandaoModel.GetGroupType()
		let range = GameGlobal.Config.XianDuMatchBaseConfig["rank" + type]
		return XiandaoKnockoutView.RANK_TYPE_STR[type] + `（${range[0]}-${range[1]}名）`
	}

	public GetRankRecord(): XiandaoRecordData[] {
		return this.m_FightRankList || []
	}

	public GetKnockoutData(): XiandaoKnockoutData {
		return this.m_KnockoutData
	}

	public mRedPoint = new XiandaoModelRedPoint

}

class XiandaoModelRedPoint extends IRedPoint {

	public static readonly INDEX_APPLY = 0

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[XiandaoModelRedPoint.INDEX_APPLY]: this.GetIndexApply,
		}
	}

	public IsRedPoint() {
		if (!Deblocking.Check(DeblockingType.TYPE_43, true))	{
			return false
		}
		return super.IsRedPoint()
	}

	public GetMessageDef(): string[] {
		return [
			MessageDef.XIANDAO_UPDATE
		]
	}

	protected OnChange(index: number): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.RP_XIANDAO)
	}

	private GetIndexApply(): boolean {
		return GameGlobal.XiandaoModel.mType == XiandaoState.APPLY && !GameGlobal.XiandaoModel.mSign
	}
}