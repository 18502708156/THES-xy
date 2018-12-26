class GBattleRankWin extends BaseEuiView {

	public static NAME = "排行"
    public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(GBattleDamageRankPanel),
			TabView.CreateTabViewData(GBattleGangRankPanel),
			TabView.CreateTabViewData(GBattleHKRankPanel),
			TabView.CreateTabViewData(GBattleScoreRankPanel),
		])	
	}

	public OnOpen(...param: any[]) {
		var nIndex = param[0] || 0;
		this.mCommonWindowBg.OnAdded(this,nIndex)
	}
}