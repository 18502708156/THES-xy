class GodPetActiveResultPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // GodPetActiveResultSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Component;
    protected titleLabel0: eui.BitmapLabel;
    protected btn1: eui.Button;
    protected btn0: eui.Button;
    protected priceIcon: PriceIcon;
    protected timeLabel: eui.Label;
    protected group: eui.DataGroup;
    /////////////////////////////////////////////////////////////////////////////

	private mTime: number

	public constructor() {
		super()
		this.skinName = "GodPetActiveResultSkin"

		this.group.itemRenderer = ItemBase

		this._AddClick(this.bg, this.CloseSelf)
		this._AddClick(this.btn0, this.CloseSelf)
		this._AddClick(this.btn1, this._OnClick)
	}

	public OnOpen(...param: any[]) {
	}

	public OnResume(...param: any[]) {
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		this.priceIcon.type = cost.id
		this.priceIcon.price = cost.count
		this.btn1.label = `降服1次`

		let awards = GameGlobal.GodPetActiveModel.GetAwards()
		this.group.dataProvider = new eui.ArrayCollection(awards)


		this.mTime = 4
		this.AddTimer(1000, this.mTime, this.UpdateTime)
		this.UpdateTime()
	}

	private _OnClick() {
		let cost = GameGlobal.Config.BeastLotteryConfig.deplete[0]
		if (Checker.Data(cost))
		{
			GameGlobal.GodPetActiveModel.SendLottery()
		}
		this.CloseSelf()
	}

	private UpdateTime() {
		this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭|C:0x019704&T:(${--this.mTime}s)`)
		if (this.mTime < 0) {
			this.CloseSelf()
		}
	}
}