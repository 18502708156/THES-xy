class TreasureHuntMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main
	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(TreasurePanel),
		])
		this.mCommonWindowBg.title = "寻宝"
		this.mCommonWindowBg.tabBar.visible = false
	}

	public OnOpen() {
		this.mCommonWindowBg.OnAdded(this)
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}
}