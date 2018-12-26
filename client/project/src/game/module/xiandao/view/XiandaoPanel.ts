class XiandaoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "仙道会"
    /////////////////////////////////////////////////////////////////////////////
    // XiandaoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: TabEuiView;
    protected shopBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private m_BaseView: BaseView

	private m_ApplyView: XiandaoApplyView
	private m_RankView: XiandaoRankView
	private m_KnockoutView: XiandaoKnockoutView
	
	public constructor() {
		super()
		this.skinName = "XiandaoSkin"
		this.group.tabChildren = [
			TabView.CreateTabViewData(XiandaoRankView),
			TabView.CreateTabViewData(XiandaoKnockoutView),
			TabView.CreateTabViewData(XiandaoApplyView),
		]
	}

	childrenCreated() {
		this._AddClick(this.shopBtn, this._OnClick)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.shopBtn:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANDU])
			break
		}
	}

	public UpdateContent() {
		let view = this.UpdateView()
	}

	public OnOpen() {
		this.group.selectedIndex = -1
	}

	public OnClose() {
		this.group.CloseView()
	}

	private UpdateView() {
		let model = GameGlobal.XiandaoModel	
		let view
		// if (model.IsShowResult()) {
		// 	this.group.selectedIndex = 0
		// } else {
			if (model.IsKnockout()) {
				this.group.selectedIndex = 1
			} else {
				this.group.selectedIndex = 2
			}
		// }
	}
	
    public static RedPointCheck(): boolean {
        return GameGlobal.XiandaoModel.mRedPoint.IsRedPoint()
    }
}