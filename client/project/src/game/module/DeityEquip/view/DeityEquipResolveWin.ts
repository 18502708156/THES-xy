class DeityEquipResolveWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// ShopResolveSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected listView: eui.List;
	protected priceIcon: PriceIcon;
	protected gainWayLabel0: eui.Label
	protected gainWayLabel1: eui.Label
	protected gainWayLabel2: eui.Label
	protected labTip: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

		this.skinName = "ShopResolveSkin"
		this.listView.itemRenderer = ShopResolveItem;
		this.gainWayLabel0.visible = false
		this.gainWayLabel1.visible = false
		this.gainWayLabel2.visible = false
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.title = "神装分解"

		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateContent)

		this.labTip.text = "分解神装百分百返还神装碎片"
		this.priceIcon.setType(MoneyConst.DEITYEQUIP_PIECE);
		this.updateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	private updateContent() {
		this.priceIcon.setPrice(CommonUtils.overLength(ShopController.ins().getBuyItemNums(MoneyConst.DEITYEQUIP_PIECE)))
		var itemList = UserBag.ins().getBagEquipByLevelSort(ITEM_QUALITY.RED_QUALITY);
		//只分解比自己装备要低的
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(itemList);
	}
}
