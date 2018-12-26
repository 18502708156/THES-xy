class CrossBattleJfWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(CrossBattleJfView),
			TabView.CreateTabViewData(CrossBattleMJfView)
		])
	}

	OnOpen(...args: any[]) {
		this.mCommonWindowBg.OnAdded(this);

	}

	OnClose() {
	}

	private _OnClick(e: egret.TouchEvent) {
		
	}

}