class AcrossRankWin extends BaseEuiView {

	// public static NAME = "排行"
    public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(GBattleDamageRankPanel),
			TabView.CreateTabViewData(GBattleGangRankPanel),
		])	
	}

	public OnOpen() {
		this.mCommonWindowBg.OnAdded(this)
	}

	OnOpenIndex?(openIndex: number): boolean {
		
		return true
	}
}