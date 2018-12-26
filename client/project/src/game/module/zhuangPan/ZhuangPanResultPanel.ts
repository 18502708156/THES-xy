class ZhuangPanResultPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // TreasureResultSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Component;
    protected titleLabel0: eui.BitmapLabel;
    protected btn0: eui.Button;
    protected timeLabel: eui.Label;
    protected group: eui.DataGroup;
    /////////////////////////////////////////////////////////////////////////////

	private data: Sproto.sc_activity_luckwheel_ret_request
	private mTime: number

	public constructor() {
		super()
		this.skinName = "zhuangPanResultSkin"

		this.group.itemRenderer = ItemBase

		this._AddClick(this.bg, this.CloseSelf)
		this._AddClick(this.btn0, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
	}

	public OnResume(...param: any[]) {
		let data = param[0] as Sproto.sc_activity_luckwheel_ret_request
		this.data = data
		this.group.dataProvider = new eui.ArrayCollection(data.rewards)

		for (let item of data.rewards) {
			UserBag.ShowItemTips(item.id, item.count)
		}

		this.mTime = 4
		this.AddTimer(1000, this.mTime, this.UpdateTime)
		this.UpdateTime()
	}

	private UpdateTime() {
		this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭|C:0x019704&T:(${--this.mTime}s)`)
		if (this.mTime < 0) {
			this.CloseSelf()
		}
	}
}