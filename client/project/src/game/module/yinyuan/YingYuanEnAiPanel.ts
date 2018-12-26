class YingYuanEnAiPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	public commonDialog: CommonDialog;
	public bnt: eui.Button;
	public bnt0: eui.Button;
	public base: ItemBase;
	public shop: eui.Label;
	public shop0: eui.Label;
	public priceicon: PriceIcon; 
	public fun;

	public constructor() {
		super()
		this.skinName = "YingYuanEnAiWupingSkin";

	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "提示"
		this._AddClick(this.bnt, this.OnClick)
		this._AddClick(this.bnt0, this._OnClick)
		this._AddClick(this.shop,this.GoShop)
		this.currentState = param[0]
		if (param[1]) {
			this.base.setItemData(param[1])
			this.shop0.text = this.base.getText() +"*" + this.base.getCount()
		}
		if (param[2]) {
			this.priceicon.setType(param[2].id)
			this.priceicon.setPrice(param[2].count)
		}
		this.fun = param[3]
	}

	public OnClick() {
		this.fun()
	}

	public GoShop() {
		ViewManager.ins().close(this)
	}

	private _OnClick() {
		ViewManager.ins().close(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}