class GuanQiaRewardWin extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	private commonWindowBg: CommonWindowBg

	initUI() {
		super.initUI()
		this.skinName = "CheckRewardSkin";
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(GuanQiaRewardPanel, {skinName: "GuanqiajiangliSkin"})
		])
	};
	OnOpen() {
		super.OnOpen()
		this.commonWindowBg.OnAdded(this)
	};
	OnClose() {
		super.OnClose()
		this.commonWindowBg.OnRemoved()
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}
