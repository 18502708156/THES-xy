class ShopIntegralPnael extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "积分商店"
	/////////////////////////////////////////////////////////////////////////////
	// ShopTitle.exml
	/////////////////////////////////////////////////////////////////////////////
	protected account: eui.Label;
	protected priceGoup: eui.Group;
	protected priceIcon: PriceIcon;
	protected goPrice: eui.Label;
	protected bgbg: eui.Image;
	protected listView: eui.List;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopTitle"
		this.listView.itemRenderer = IntegralItem;
		this.priceGoup.visible = false//不需要使用
	}

	public OnOpen() {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)
		this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_INTEGRAL).shop)
		this.UpdateContent();
	}


	UpdateContent() {
		let config = GameGlobal.Config.MysticalShopBaseConfig;
		this.account.text = `我的积分：${GameGlobal.ShopController.getBuyItemNums(config.scorecosttype.id)}`
	}
}

class IntegralItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// ShopIntegralItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected imgXiyou: eui.Image;
	protected nameLabel: eui.Label;
	protected imgSellOut: eui.Image;
	protected itemIcon: ItemBase;
	protected needIntegralTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		// 皮肤名称
		this.skinName = "ShopIntegralItemSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}
	public childrenCreated() {

	}
	public onClick(e) {
		if (egret.is(e.target.parent, 'ItemIcon')) return;
		if (this.data) {
			ViewManager.ins().open(BuyWin, this.data)
		}
	}
	public dataChanged(): void {
		let itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];

		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality]
		this.nameLabel.text = itemConfig.name;
		this.needIntegralTxt.text = `积分：${this.data.currency.count}`
		this.itemIcon.data = itemConfig;
		this.itemIcon.setnameTxtVisible(false);

	}
}