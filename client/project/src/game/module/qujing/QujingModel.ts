class QujingModel extends BaseSystem {
	public static REFRESH_TYPE_ITEM = 1
	public static REFRESH_TYPE_QUILK = 2
	public static REFRESH_TYPE_NORMAL = 3

	public static ESCORT_STATE_FREE = 1
	public static ESCORT_STATE_DOING = 2
	public static ESCORT_STATE_DONE = 3

	public static ESCORT_FIGHT_TYPE_ROB = 1
	public static ESCORT_FIGHT_TYPE_REVENGE = 2

	private mEscortBaseInfo: EscortBaseInfo
	private mRecordList: RecordInfo[]
	private mEscortList: EscortInfo[]

	public mEscortFightType: number
	public mRobbedFlag: boolean

	public constructor() {
		super()

		this.mEscortBaseInfo = new EscortBaseInfo

		this.regNetMsg(S2cProtocol.sc_escort_info_update, this._DoInitInfo)
		this.regNetMsg(S2cProtocol.sc_escort_reward_show, this._RecvRewardShow)
		this.regNetMsg(S2cProtocol.sc_escort_record_data, this._RecvRecordList)
		this.regNetMsg(S2cProtocol.sc_escort_record_update, this._RecvUpdateRecord)
	}

	public Init() {
		
	}

	private _DoInitInfo(rsp: Sproto.sc_escort_info_update_request) {
		this.mEscortBaseInfo.UpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_BASEINFO)
	}

	private _RecvRewardShow(rsp: Sproto.sc_escort_reward_show_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_SHOW_REWARD, rsp)
	}

	private _RecvRecordList(rsp: Sproto.sc_escort_record_data_request) {
		this.mRecordList = new Array<RecordInfo>()
		for (let record of rsp.records)
		{
			if (record.type == 2)
			{
				let tempRecordInfo = new RecordInfo
				tempRecordInfo.UpdateInfo(record)
				this.mRecordList.push(tempRecordInfo)
			}
		}
	}

	private _RecvUpdateRecord(rsp: Sproto.sc_escort_record_update_request) {
		if (rsp.record.type != 2)
			return

		let updateFlag = false

		for (let record of this.mRecordList) 
		{
			if (record.mRecordId == rsp.record.recordId)
			{
				record.UpdateInfo(rsp.record)
				updateFlag = true
				break
			}
		}

		if (!updateFlag)
		{
			let tempRecordInfo = new RecordInfo
			tempRecordInfo.UpdateInfo(rsp.record)
			this.mRecordList.push(tempRecordInfo)

			this.RecordRobbedFlag(true)
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_RECORD)
	}

	public SendEnterEscortView() {
		this.Rpc(C2sProtocol.cs_escort_enter, new Sproto.cs_escort_enter_request)
	}

	public SendRefreshQuality(type) {
		let req = new Sproto.cs_escort_refresh_quality_request
		req.type = type

		this.Rpc(C2sProtocol.cs_escort_refresh_quality, req)
	}

	public SendStartEscort() {
		this.Rpc(C2sProtocol.cs_escort_perform, new Sproto.cs_escort_perform_request)
	}

	public SendGainAward() {
		this.Rpc(C2sProtocol.cs_escort_get_reward, new Sproto.cs_escort_get_reward_request)
	}

	public SendQuilkFinish() {
		this.Rpc(C2sProtocol.cs_escort_quick_complete, new Sproto.cs_escort_quick_complete_request)
	}

	public SendRevenge(recordId: number) {
		this.mEscortFightType = QujingModel.ESCORT_FIGHT_TYPE_REVENGE
		let req = new Sproto.cs_escort_avenge_request
		req.recordId = recordId

		this.Rpc(C2sProtocol.cs_escort_avenge, req)
	}

	public SendEscortList() {
		this.Rpc(C2sProtocol.cs_escort_rob_list, new Sproto.cs_escort_rob_list_request, (rsp: Sproto.cs_escort_rob_list_response) => {
			this.mEscortList = new Array<EscortInfo>()
			for (let escortInfo of rsp.escortList)
			{
				let tempEscortInfo = new EscortInfo
				tempEscortInfo.UpdateInfo(escortInfo)
				this.mEscortList.push(tempEscortInfo)
			}

			GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_UPDATE_ESCORTLIST)
		}, this)
	}

	public SendRob(playerId: number) {
		this.mEscortFightType = QujingModel.ESCORT_FIGHT_TYPE_ROB

		let req = new Sproto.cs_escort_rob_perform_request
		req.playerId = playerId

		this.Rpc(C2sProtocol.cs_escort_rob_perform, req)
	}

	public SendGetEscortInfo(playerId: number) {
		let req = new Sproto.cs_escort_catch_info_request
		req.playerId = playerId

		this.Rpc(C2sProtocol.cs_escort_catch_info, req, (rsp: Sproto.cs_escort_catch_info_response) => {
			if (!rsp || !rsp.escortInfo) {
				return
			}
			let tempEscortInfo = this.GetEscortInfo(rsp.escortInfo.playerid)
			tempEscortInfo.UpdateInfo(rsp.escortInfo)

			if (tempEscortInfo.mRobbedCount >= GameGlobal.Config.EscortBaseConfig.robnum) 
			{
				UserTips.ins().showTips("已经被抢光了")
				return
			}
		
			if (rsp.escortInfo.robMark)
			{
				UserTips.ins().showTips("已经拦截过该玩家")
				return
			}

			GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_SHOW_ROBVIEW, rsp.escortInfo.playerid)
		}, this)
	}

	public get baseInfo() {
		return this.mEscortBaseInfo
	}

	public get recordList() {
		return this.mRecordList
	}

	public get escortList() {
		return this.mEscortList
	}

	public GetRecordInfo(recordId) {
		for (let record of this.mRecordList)
		{
			if (record.mRecordId == recordId)
				return record
		}
	}

	public GetEscortInfo(playerId) {
		for (let escortInfo of this.mEscortList) {
			if (escortInfo.mPlayerId == playerId)
				return escortInfo
		}
	}

	public IsDoudleAwardTime() {
		let doubleTime = GameGlobal.Config.EscortBaseConfig.doubletime
		return this._IsBetween(doubleTime[0]) || this._IsBetween(doubleTime[1])
	}

	private _IsBetween(doubleTime) {
		let date = new Date(GameServer.serverTimeMilli)
		let curTime = GameServer.serverTimeMilli

		let strArr = doubleTime.star.split(":")
		let startHour = parseInt(strArr[0])
		let startMinutes = parseInt(strArr[1])
		date.setHours(startHour, startMinutes)
		let startTime = date.getTime()

		strArr = doubleTime.ends.split(":")
		let endHour = parseInt(strArr[0])
		let endMinutes = parseInt(strArr[1])
		date.setHours(endHour, endMinutes)
		let endTime = date.getTime()

		if (endHour >= startHour)
			return curTime >= startTime && curTime <= endTime

		date.setHours(23, 59, 59)
		let startTime1 = startTime
		let endTime1 = date.getTime()

		let startTime2 = date.setHours(0, 0, 0)
		let endTime2 = endTime

		return (curTime >= startTime1 && curTime <= endTime1) || (curTime >= startTime2 && curTime <= endTime2)
	}

	public GetDoubleTimeDesc() {
		let doubleTimeArr = GameGlobal.Config.EscortBaseConfig.doubletime
		let strArr = doubleTimeArr[0].star.split(":")
		let hour1 = parseInt(strArr[0])
		let min1 = parseInt(strArr[1])
		let date1 = new Date(GameServer.serverTimeMilli)
		date1.setHours(hour1, min1)
		let time1 = date1.getTime()

		strArr = doubleTimeArr[1].ends.split(":")
		let hour2 = parseInt(strArr[0])
		let min2 = parseInt(strArr[1])
		let date2 = new Date(GameServer.serverTimeMilli)
		date2.setHours(hour2, min2)
		let time2 = date2.getTime()
		if (GameServer.serverTimeMilli <= time1 && GameServer.serverTimeMilli >= time2)
			return `护送时间：全天 ${doubleTimeArr[0].star}-${doubleTimeArr[0].ends}双倍`

		return `护送时间：全天 ${doubleTimeArr[1].star}-${doubleTimeArr[1].ends}双倍`
	}

	public IsCurQuality(quality) {
		return this.mEscortBaseInfo.mQuality == quality
	}

	public IsMaxQuality() {
		return this.mEscortBaseInfo.mQuality == 5
	}

	public GetConfigByQuality(quality) {
		for (let key in GameGlobal.Config.EscortAwardConfig)
		{
			let config = GameGlobal.Config.EscortAwardConfig[key]
			if (config.quality == quality)
				return config
		}
	}

	public CanRob(playerId: number) {
		if (playerId == GameGlobal.actorModel.actorID) {
			UserTips.ins().showTips("不可拦截自己")
			return false
		}

		if (this.mEscortBaseInfo.mRobCount >= GameGlobal.Config.EscortBaseConfig.robtime) {
			UserTips.ins().showTips("拦截次数已经用完了")
			return false
		}

		return true
	}

	public HasAward() {
		if (!this.mEscortBaseInfo)
			return false

		return this.mEscortBaseInfo.mState == QujingModel.ESCORT_STATE_DONE
	}

	public HasRobbed() {
		return this.mRobbedFlag
	}

	public RecordRobbedFlag(b) {
		this.mRobbedFlag = b
		GameGlobal.MessageCenter.dispatch(MessageDef.QUJING_ROBBEDFLAG_CHANGE)
	}
}
