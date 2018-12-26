class BagWin extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	viewStack: TabView;
	private commonWindowBg: CommonWindowBg

	// private m_ViewChildren

	initUI() {
		super.initUI()
		this.skinName = "BagSkin";
		let list = [
			TabView.CreateTabViewData(BagEquipTypePanel),
			TabView.CreateTabViewData(BagItemTypePanel),
		]
		if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
			list.push(TabView.CreateTabViewData(BagStarTypePanel))
		}
		this.viewStack.tabChildren = list
		this.commonWindowBg.SetViewStack(this.viewStack)
	}
	
	OnOpen(...param: any[]) {
		let openIndex = param[0] || 0

		this.viewStack.UpdateTabShowState(3, false)
		this.commonWindowBg.OnAdded(this, openIndex)

		this.observe(MessageDef.ITEM_OTHER_COUNT_CHANGE, this.UpdateRedPoint)
		this.UpdateRedPoint()
	}

	OnClose() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	}

	
	destoryView() {
		// 不销毁该界面
	}

	UpdateRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.UserBag.getIsExitUsedItem())
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
	
	UpdateContent(): void {}
}

class BagEquipTypePanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "装备"

    /////////////////////////////////////////////////////////////////////////////
    // BagEquipTypeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected itemScroller: eui.Scroller;
    protected itemList: eui.List;
    protected smeltBtn: eui.Button;
    protected addBtn: eui.Button;
    protected itemCount: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "BagEquipTypeSkin"
		this.itemScroller.viewport = this.itemList;
		this.itemList.itemRenderer = BagItemBase;

		this._AddClick(this.smeltBtn, this.onClick)
		this._AddClick(this.addBtn, this.onClick)
	}

	public OnOpen() {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)
		this.observe(MessageDef.BAG_VOL_ADD, this.SetCount)
		this.UpdateContent()
	}

	UpdateContent() {
		this.itemList.dataProvider = new eui.ArrayCollection(UserBag.ins().getBagSortQualityEquips(5, 0, 1));
		if (UserBag.ins().getBagItemNum() / UserBag.ins().getMaxBagRoom() >= 0.8 ) {//|| UserBag.ins().getWingZhuEquip().length >= 10) {
			UIHelper.ShowRedPoint(this.smeltBtn, true)
		} else {
			UIHelper.ShowRedPoint(this.smeltBtn, false)
		}
		this.SetCount();
	}

	SetCount() {
		this.itemCount.text = UserBag.ins().getBagItemNum() + "/" + UserBag.ins().getMaxBagRoom();
	}

	/**点击 */
	onClick(e) {
		switch (e.currentTarget) {
			case this.smeltBtn:
				ViewManager.ins().close(BagWin);
				ViewManager.ins().open(SmeltEquipTotalWin);
				break;
			case this.addBtn:
				var config = GlobalConfig.ins().BagBaseConfig;
				var row = (UserBag.ins().bagNum - config.baseSize) / config.rowSize;
				if (row == CommonUtils.getObjectLength(GlobalConfig.ins().BagExpandConfig)) {
					UserTips.ins().showTips(StringUtils.addColor("格子不能继续扩张", 0xff0000));
				} else {
					ViewManager.ins().open(BagAddItemWarn);
				}
				break;
		}
	}
}

class BagItemTypePanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "道具"

    /////////////////////////////////////////////////////////////////////////////
    // BagItemTypeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected itemGoodsScroller: eui.Scroller;
    protected itemListGoods: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "BagItemTypeSkin"

		this.itemListGoods.itemRenderer = BagItemBase;
		this.itemListGoods.dataProvider = new eui.ArrayCollection()
		this.itemGoodsScroller.viewport = this.itemListGoods;
	}

	public OnOpen() {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)
		this.UpdateContent()
	}

	UpdateContent() {
		(this.itemListGoods.dataProvider as eui.ArrayCollection).replaceAll(UserBag.ins().getBagGoodsBySort());
	}
}

class BagStarTypePanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "命格"

    /////////////////////////////////////////////////////////////////////////////
    // BagItemTypeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected itemGoodsScroller: eui.Scroller;
    protected itemListGoods: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "BagItemTypeSkin"

		this.itemListGoods.itemRenderer = BagItemBase;
		this.itemListGoods.dataProvider = new eui.ArrayCollection()
		this.itemGoodsScroller.viewport = this.itemListGoods;
		
	}

	public OnOpen() {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)
		this.UpdateContent()
	}
	
	/**点击 */
	onClick(e) {
		switch (e.currentTarget) {
			// case this.starSmeltBtn:
			// break
		}
	}
	
	UpdateContent() {
		this.itemListGoods.dataProvider = new eui.ArrayCollection(UserBag.ins().GetBagStarBySort())
	}
}