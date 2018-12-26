/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:11
 * @meaning: 熔炼额外界面
 * 
 **/

class BagMakeEx extends BaseEuiView implements ICommonWindow {

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
					TabView.CreateTabViewData(BagMakeExListPanel)
				]
		this.commonWindowBg.SetViewStack(this.viewStack)

		this.commonWindowBg.tabBar.visible = false;


		if (!LocationProperty.NotCustionServer()) {
			// let customServicePanel = new CustomServicePanel
			// this.commonWindowBg.AddChildStack(customServicePanel)
		}
	}

	OnOpen() {
		this.commonWindowBg.OnAdded(this)
	}

	OnClose() {
        this.commonWindowBg.OnRemoved()
	}

	OnBackClick(clickType: number): number {return 0}
	OnOpenIndex(openIndex: number): boolean { return true}
}