class OpenDayGifModel extends BaseSystem {

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_welfare_login_gift_info, this.LoginGift)
	}

	public tolDay: number = 0
	public receivemark: number

	public LoginGift(rsp: Sproto.sc_welfare_login_gift_info_request) {
		this.tolDay = rsp.totalLoginday
		this.receivemark = rsp.receivemark
		GameGlobal.MessageCenter.dispatch(MessageDef.LOGINDAYGIF)
	}

	public getLoginReward(index: number) {
		let day = new Sproto.cs_welfare_get_loginreward_request
		day.indexDay = index
		this.Rpc(C2sProtocol.cs_welfare_get_loginreward, day)
	}

	public OpenDayPointRed() {
		let Config = GameGlobal.Config.LoginRewardConfig
		let ConfigData = []
		for (let data in Config) {
			if (Number(data) <= OpenDayGifModel.ins().tolDay && !BitUtil.Has(OpenDayGifModel.ins().receivemark, Number(data) - 1)) {
				return true
			}
		}
		return false
	}

	public OpenDayIcon() {
		let Config = GameGlobal.Config.LoginRewardConfig
		let ConfigData = []
		for (let data in Config) {
			if (!BitUtil.Has(OpenDayGifModel.ins().receivemark, Number(data) - 1)) {
				return true
			}
		}
		return false
	}

	private mConfigLen = null

	public GetShowDayImg(): string {
		if (!this.mConfigLen) {
			this.mConfigLen = CommonUtils.getObjectLength(GameGlobal.Config.LoginRewardConfig)
		}
		let mark = this.receivemark
		let Config = GameGlobal.Config.LoginRewardConfig
		let btnIcon = ""
		for (let i = 1; i <= this.mConfigLen; i++) {
			let data = Config[i]
			if (!BitUtil.Has(mark, i - 1)) {
				return data.btnicon
			}
		}
		return ""
	}
}


