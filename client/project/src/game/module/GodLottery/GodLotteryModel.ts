class GodLotteryModel extends BaseSystem {

	private mLotteryCount: number = 0
	private mLotteryType: number
	private mAwardList: Sproto.luck_tianshen_rewards[]

	public constructor() {
		super()
		
		this.RegNetMsgs(S2cProtocol.sc_luck_info, this._DoInitInfo)
	}

	public Init() {

	}

	private _DoInitInfo(rsp: Sproto.sc_luck_info_request) {
		this.mLotteryCount = rsp.tenNum || 0
		GameGlobal.MessageCenter.dispatch(MessageDef.GODLOTTERY_UPDATE_INFO)
	}

	public SendLottery(type) {
		this.mLotteryType = type

		let req = new Sproto.cs_luck_tianshen_request
		req.typ = type

		this.Rpc(C2sProtocol.cs_luck_tianshen, req, (rsp: Sproto.cs_luck_tianshen_response) => {
			if (!rsp.ret)
				return
			
			this.mAwardList = rsp.rewards
			this.mLotteryCount = rsp.tenNum || this.mLotteryCount
			if (ViewManager.ins().isShow(GodLotteryResultPanel))
				ViewManager.ins().open(GodLotteryResultPanel)	
			else 
				GameGlobal.MessageCenter.dispatch(MessageDef.GODLOTTERY_UPDATE_LOTTERY)
		}, this)
	}

	public getAwardList() {
		let awards = []
		for (let reward of this.mAwardList)
		{
			awards.push({type:1, id:reward.id, count:reward.num})
		}

		return awards
	}
	
	public get lotteryCount() {
		return this.mLotteryCount
	}

	public get lotteryType() {
		return this.mLotteryType
	}
}
