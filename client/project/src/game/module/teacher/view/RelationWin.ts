class RelationWin extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main
	viewStack: TabView;

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(TeacherPanel),
			// TabView.CreateTabViewData(GBattleGangRankPanel),
			// TabView.CreateTabViewData(GBattleHKRankPanel)
		])	
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.mCommonWindowBg.OnAdded(this,nIndex)
	}
}