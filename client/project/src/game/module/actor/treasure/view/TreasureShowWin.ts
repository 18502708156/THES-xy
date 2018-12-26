/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 11:11
 * @meaning: 法宝图鉴主界面
 * 
 **/
class TreasureShowWin extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	uiBg1:eui.Image;
	uiBg2:eui.Image;
	nameIcon:eui.BitmapLabel;
	private commonWindowBg: CommonWindowBg

	tShopData = [];

	initUI() {
		super.initUI()
		this.skinName = "FubenSkin"; //重用了副本界面的ui
		this.commonWindowBg.SetViewStack(this.viewStack)
		this.commonWindowBg.title = "法宝图鉴"

		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(TreasureShowFirPanel),
			TabView.CreateTabViewData(TreasureShowSecPanel),
		 	TabView.CreateTabViewData(TreasureShowThrPanel),
		]
		this.uiBg1.visible = true;
		this.uiBg2.visible = false; 
	}
	
	OnOpen(...param: any[]) {

		var nIndex = param[0] || 0;
		this.viewStack.UpdateTabShowState(this.viewStack.length, false)
		this.commonWindowBg.OnAdded(this,nIndex)
	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}
	
	destoryView() {
		// 不销毁该界面
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		
		switch(openIndex)
		{
			case 0:
			break;
			case 1:
			break;
			case 2:
			break;
			case 3:
			break;
		}
		return true
	}
	
	UpdateContent(): void {}
}
