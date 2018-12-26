/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/12 18:51
 * @meaning: 技能设置主界面
 * 
 **/
class RoleSkilSetLayer extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	private commonWindowBg: CommonWindowBg

	tShopData = [];

	// private m_ViewChildren

	initUI() {
		super.initUI()
		this.skinName = "RoleSkillSetSkin";

		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(RoleSkilSetPanel),
		]
		this.commonWindowBg.SetViewStack(this.viewStack)

	}
	
	OnOpen(...param: any[]) {

		// this.tShopData = param[0] || [];//商店列表


		this.viewStack.UpdateTabShowState(this.viewStack.length, false)
		this.commonWindowBg.OnAdded(this)

		this.commonWindowBg.tabBar.visible = false;


	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}
	
	// destoryView() {
	// 	// 不销毁该界面
	// }

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		
		return true
	}
	
	UpdateContent(): void {}
}
