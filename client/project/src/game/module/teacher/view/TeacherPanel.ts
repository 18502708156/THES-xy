/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒详情
 * 
 **/

class TeacherPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "师徒"


	tPanelData = [];//界面总体数据数据


	protected pPop1: eui.Component;
	protected checkBox: eui.CheckBox;
	protected bar: eui.ProgressBar;

	protected lbVip: eui.Label;
	protected lbGd: eui.Label;
	protected btnShop: eui.Button;
	protected btnInfo: eui.Button;
	protected tabBar: eui.TabBar;


	protected firstView: TeacherFirstView;
	protected secendView: TeacherSecondView;
	protected thirdView: TeacherThirdView;


	protected group: TabEuiView;




	private selectedIndex = 0;

	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TeacherSkin"
		this.group.tabChildren = [
			TabView.CreateTabViewData(TeacherFirstView),
			TabView.CreateTabViewData(TeacherSecondView),
			TabView.CreateTabViewData(TeacherThirdView),
		]
	}

	public childrenCreated() {
		this.tabBar.dataProvider = new eui.ArrayCollection(["我的师傅", "我的徒弟", "师徒邀请"])
		this.tabBar.itemRenderer = BtnTab1Item
	}

	public OnOpen(...param: any[]) {

		this.observe(MessageDef.TEACHER_TURN, this.onTurn)//师徒跳转
		this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent)//
		this.group.selectedIndex = 0
		this.AddClick(this.btnShop, this.onClick)
		this.AddClick(this.btnInfo, this.onClick)
		this.AddItemClick(this.tabBar, this.onTabTap)
		this.tabBar.selectedIndex = 0;
		this.selectedIndex = 0
		GameGlobal.TeacherManage.getMessage()

	}

	public OnClose() {
		this.group.CloseView()
	}


	private onTurn(_index) {//跳转对应位置
		this.tabBar.selectedIndex = _index
		this.onTabTap()
	}

	public UpdateContent() {
		UIHelper.ListRefresh(this.tabBar)
	}




	private onTabTap() {
		this.group.selectedIndex = this.tabBar.selectedIndex
		this.selectedIndex = this.tabBar.selectedIndex
	}



	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.btnShop:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_WEIWANG])
				break
			case this.btnInfo:
				ViewManager.ins().open(ActivityDescPanel, GlobalConfig.ins().MasterBaseConfig.helpinfo);
				break
		}
	}


}


class BtnTab1Item extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// BtnTab5Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected redPoint: eui.Image;
	protected labelDisplay: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		super.dataChanged();
		if (this.itemIndex == 2 && GameGlobal.TeacherController.teacherInfo.messageData) {
			let length = GameGlobal.TeacherController.teacherInfo.messageData.length
			this.redPoint.visible = length > 0
		}

	}

}