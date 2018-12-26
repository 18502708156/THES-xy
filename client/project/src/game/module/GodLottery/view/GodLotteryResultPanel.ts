class GodLotteryResultPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // TreasureResultSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Component;
    protected titleLabel0: eui.BitmapLabel;
    protected btn1: eui.Button;
    protected btn0: eui.Button;
    protected priceIcon: PriceIcon;
    protected timeLabel: eui.Label;
    protected group: eui.DataGroup;
    /////////////////////////////////////////////////////////////////////////////

	private data: Sproto.sc_luck_ret_request
	private mTime: number

	public constructor() {
		super()
		this.skinName = "TreasureResultSkin"

		this.group.itemRenderer = ItemBase

		this._AddClick(this.bg, this.CloseSelf)
		this._AddClick(this.btn0, this.CloseSelf)
		this._AddClick(this.btn1, this._OnClick)
	}

	public OnOpen(...param: any[]) {
	}

	public OnResume(...param: any[]) {
		let lotteryType = GameGlobal.GodLotteryModel.lotteryType
		let cost = GodLotteryConst.GetCost(lotteryType)
		this.priceIcon.type = cost.id
		this.priceIcon.price = cost.count
		this.btn1.label = lotteryType == GodLotteryConst.TYPE_GOLD_ONE ? "唤神一次" : "唤神十次"

		let awards = GameGlobal.GodLotteryModel.getAwardList()
		this.group.dataProvider = new eui.ArrayCollection(awards)

		this.mTime = 4
		TimerManager.ins().doTimer(1000, this.mTime, this.UpdateTime, this)
		this.UpdateTime()
	}

	private _OnClick() {
		let lotteryType = GameGlobal.GodLotteryModel.lotteryType
		let cost = GodLotteryConst.GetCost(lotteryType)
		Checker.Currency(cost, true, null, () => {
			GameGlobal.GodLotteryModel.SendLottery(lotteryType)
		})
	}

	private UpdateTime() {
		this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭|C:0x019704&T:(${--this.mTime}s)`)
		if (this.mTime < 0) {
			this.CloseSelf()
		}
	}
}