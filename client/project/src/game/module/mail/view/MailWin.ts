class MailWin extends BaseEuiView implements ICommonWindow {

	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	commonWindowBg: CommonWindowBg

	viewStack: TabView;



	initUI() {
		super.initUI()
		this.skinName = "MailSkin"

		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(MailListPanel),
			TabView.CreateTabViewData(CustomServicePanel),
		]
		this.commonWindowBg.SetViewStack(this.viewStack)

		if (!LocationProperty.NotCustionServer()) {
			// let customServicePanel = new CustomServicePanel
			// this.commonWindowBg.AddChildStack(customServicePanel)
		}
	}

	OnOpen() {
		this.commonWindowBg.OnAdded(this)
		this.commonWindowBg.SetTitle("邮件");
		
	}

	OnClose() {
        this.commonWindowBg.OnRemoved()
	}

	OnBackClick(clickType: number): number {return 0}
	OnOpenIndex(openIndex: number): boolean { return true}
}