class TreasureResultPanel extends BaseEuiView {
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
	// private mTime: number

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
		let data = param[0] as Sproto.sc_luck_ret_request
		this.data = data
		let config = GameGlobal.Config.LuckConfig[data.index][0]
		this.priceIcon.type = config.cost.id
		this.priceIcon.price = config.cost.count
		this.btn1.label = "购买" + config.count+ "个"
		this.group.dataProvider = new eui.ArrayCollection(data.rewards)

		for (let item of data.rewards) {
			UserBag.ShowItemTips(item.id, item.count)
		}

		// this.mTime = 4
		// this.AddTimer(1000, this.mTime, this.UpdateTime)
		this.UpdateTime()
	}

	private _OnClick() {
		let config = GameGlobal.Config.LuckConfig[this.data.index][0]
		if (Checker.Money(config.cost.id, config.cost.count)) {
			GameGlobal.TreasureHuntModel.SendTreasure(this.data.type, this.data.index)
		}
	}

	private UpdateTime() {
		this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭`)
		// this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭|C:0x019704&T:(${--this.mTime}s)`)
		// if (this.mTime < 0) {
		// 	this.CloseSelf()
		// }
	}
}