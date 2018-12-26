class GodPetActiveModel extends BaseSystem {

	private mEndTime: number
	private mAwardId: number
	private mCash: number = 0
	private mReward: number = 0
	private mAwardList: Sproto.holy_pet_msg[]
	private mRecordMap: {[key: number]: boolean} = {}
	private mSDay: number
	private mEDay: number
	private mCurDay: number

	public mRedPoint: boolean

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_holy_pet_info, this._DoInitInfo)
	}

	public Init() {

	}

	private _DoInitInfo(rsp: Sproto.sc_holy_pet_info_request) {
		this.mCash = rsp.cash || this.mCash
		this.mReward = rsp.reward || this.mReward
		this.mSDay = rsp.sTime
		this.mEDay = rsp.eTime
		this.mCurDay = rsp.day

		this._CaculTime()
		this.mRedPoint = this._CheckRedPoint()
		GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_INFO)
	}

	public SendGainAward(targetId) {
		let req = new Sproto.cs_holy_pet_get_reward_request
		req.no = targetId

		this.Rpc(C2sProtocol.cs_holy_pet_get_reward, req)
	}

	public SendLottery() {
		let req = new Sproto.cs_holy_pet_luck_draw_request
		this.Rpc(C2sProtocol.cs_holy_pet_luck_draw, req, (rsp: Sproto.cs_holy_pet_luck_draw_response) => {
			if (!rsp.ret)
				return

			this.mAwardList = rsp.data
			this.mAwardId = rsp.no
			this.UpdateRecordMap(rsp.luckLog)
			GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_LOTTERY_NOTICE)
			GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO)
			GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_LOTTERY)
		}, this)
	}

	public SendGetAwardInfo() {
		let req = new Sproto.cs_holy_pet_get_info_request
		this.Rpc(C2sProtocol.cs_holy_pet_get_info, req, (rsp: Sproto.cs_holy_pet_get_info_response) => {
			this.mAwardList = rsp.data
			this.UpdateRecordMap(rsp.luckLog)
			GameGlobal.MessageCenter.dispatch(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO)
		}, this)
	}

	public IsTargetDone(targetId) {
		let config = GameGlobal.Config.BeastAwardConfig[targetId]
		if (!config)
			return false

		return config.money <= this.mCash
	}

	public GetAwardIdx() {
		let idx = 1
		for (let award of GameGlobal.Config.BeastLotteryConfig.showitem)
		{
			if (award.id == this.mAwardId)
				return idx
				
			idx++
		}
		
		return -1
	}

	public UpdateRecordMap(records) {
		this.mRecordMap = {}
		for (let record of records) {
			this.mRecordMap[record] = true
		}
	}

	public HasGain(itemId) {
		return this.mRecordMap[itemId] == true
	}

	public HasRewardGained(targetId) {
		return (this.mReward & Math.pow(2, targetId)) > 0
	}
	
	public GetCashCount() {
		return this.mCash
	}

	public GetAwardList() {
		return this.mAwardList.reverse()
	}

	public GetAwards() {
		return [{type:1, count:1, id:this.mAwardId}]
	}

	public IsOpenActive() {
		return this.mCurDay >= this.mSDay && this.mCurDay <= this.mEDay
	}

	public GetEndtime() {
		return this.mEndTime
	}

	private _CaculTime() {
		let date: Date = new Date(GameServer.serverTimeMilli)
		date.setHours(0, 0, 0)
		this.mEndTime = date.getTime() + (this.mEDay - this.mCurDay+1) * (3600*24*1000) - 6000
	}

	private _CheckRedPoint() {
		for (let key in GameGlobal.Config.BeastAwardConfig)
		{
			let config = GameGlobal.Config.BeastAwardConfig[key]
			if (config && this.IsTargetDone(config.id) && !this.HasRewardGained(config.id))
				return true
		}

		return false
	}

	public CanLottery() {
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		return Checker.Data(cost, false)
	}

	public IsGodPetLotteryOpen() {
		return GameServer.serverOpenDay >= GameGlobal.Config.BeastLotteryConfig.Days
	}
}
