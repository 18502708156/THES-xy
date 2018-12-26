class SmeltEquipTotalWin extends BaseEuiView implements ICommonWindow {
	public static EQUIP:number = 0
	public static RONG_LU:number = 1
	public static HERO:number = 2
	public static PET = 3 

	public constructor() {
		super()
	}

	commonWindowBg: CommonWindowBg
	viewStack: TabView;

	initUI() {
		super.initUI()
		this.skinName = "SmeltMainViewSkin";

		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(SmeltEquipNormalPanel, {skinName: "SmeltMainSkin"}),
			// TabView.CreateTabViewData(SmeltEquipRongluPanel),
		]
		this.commonWindowBg.SetViewStack(this.viewStack)
		// this.tab.dataProvider = this.viewStack;
	};
	// public static OnOpen(index)
	// {
	// 	if(index == SmeltEquipTotalWin.HERO)
	// 	{
	// 		if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
	// 		{
	// 			Deblocking.Check(DeblockingType.TYPE_12)
	// 			return 
	// 		}
	// 	}
	// 	if(index == SmeltEquipTotalWin.PET)
	// 	{
	// 		if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
	// 		{
	// 			index --;
	// 		}
	// 	}
	// 	ViewManager.ins().open(SmeltEquipTotalWin,index)
	// }
	public static getSubViewByIndex(index)
	{
		// if(index == SmeltEquipTotalWin.HERO)
		// {
		// 	if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
		// 	{
		// 		Deblocking.Check(DeblockingType.TYPE_12)
		// 		return null
		// 	}
		// }
		// if(index == SmeltEquipTotalWin.PET)
		// {
		// 	if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
		// 	{
		// 		index --;
		// 	}
		// }
		return ViewManager.ins().getView(SmeltEquipTotalWin).getSubViewByIndex(index)
	}
	OnOpen(...param: any[]) {
		
		let selectIndex = param[0] || 0;
		
		this.commonWindowBg.SetViewStack(this["viewStack"])
		this.commonWindowBg.OnAdded(this,selectIndex)

		this.itemUpdate();
	};
	OnClose() {
		this.commonWindowBg.OnRemoved()
	};
	itemUpdate() {
		// this.commonWindowBg.ShowTalRedPoint(SmeltEquipTotalWin.RONG_LU, UserBag.ins().getWingZhuEquip().length >= 10)
		
		// if (UserBag.ins().getWingZhuEquip().length >= 10) {
		// 	this.redPoint.visible = true;
		// }
		// else {
		// 	this.redPoint.visible = false;
		// }
	};
    /**
     * 点击标签页按钮
     */
	// onTabTouch(e) {
		// this.viewStack.getElementAt(this.lastSelect)['close']();
		// this.lastSelect = this.viewStack.selectedIndex;
		// this.viewStack.getElementAt(this.lastSelect)['open']();
	// };
	// onTap(e) {
	// 	switch (e.currentTarget) {
	// 		case this.closeBtn:
	// 		case this.closeBtn0:
	// 			ViewManager.ins().close(this);
	// 			break;
	// 	}
	// };

	OnBackClick(clickType: number): number {return 0}
	OnOpenIndex(openIndex: number): boolean { return true}
}

SmeltEquipTotalWin.LAYER_LEVEL =  LayerManager.UI_Main;