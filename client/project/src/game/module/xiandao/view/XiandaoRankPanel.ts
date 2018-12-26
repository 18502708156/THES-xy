class XiandaoRankPanel extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

    public static LAYER_LEVEL = LayerManager.UI_Main
	public static NAME = "预选赛排行"

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL_NO_TAB
	}


	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(XiandaoRankView),
		])	
	}

	public OnOpen() {
		this.mCommonWindowBg.OnAdded(this)
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}
	
	windowTitleIconName?: string = XiandaoRankPanel.NAME

	UpdateContent(): void {

	}
}