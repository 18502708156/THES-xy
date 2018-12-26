class ShopMysteryPanel extends BaseView {

	public static readonly NAME = "神秘商店"
	/////////////////////////////////////////////////////////////////////////////
	// ShopMysterySkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected integralTxt: eui.Label;
	protected priceIcon0: PriceIcon;
	protected priceIcon1: PriceIcon;
	protected limitText: eui.Label;
	protected counterLabel: DurationLabel;
	protected listView: eui.List;
	protected allBuyBtn: eui.Button;
	protected refreshBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopMysterySkin"
	}

	public OnOpen() {
		this.observe(MessageDef.SHOP_MYSTERY_REFRESH, this.UpdateContent)
		this._AddClick(this.allBuyBtn, this.tap)
		this._AddClick(this.refreshBtn, this.tap)
		this.listView.itemRenderer = ShopMysteryItem;

		this.counterLabel.SetColor(Color.l_green_1)
		if (GameGlobal.ShopController.mysteryData) {
			this.counterLabel.SetEndTime(GameGlobal.ShopController.mysteryData.refreshtime, DurationLabel.TIMETEXT_TYPE_HHMMSS)
		}
	}


	UpdateContent() {
		if (!GameGlobal.ShopController.mysteryData) {
			return
		}
		let refreshcount = GameGlobal.ShopController.mysteryData.refreshcount;
		let config = GameGlobal.Config.MysticalShopBaseConfig;
		this.integralTxt.text = `${GameGlobal.ShopController.getBuyItemNums(config.scorecosttype.id)}`;
		this.limitText.text = `(${refreshcount}/${config.refreshmax})`;

		let price = config.costtype[0]
		this.priceIcon0.setType(price.id);
		this.priceIcon0.setPrice(ShopController.ins().getBuyItemNums(MoneyConst.yuanbao));

		let count = 0;
		if (refreshcount >= 1 && refreshcount < 10)
			count = refreshcount + 1;
		else if (refreshcount < 1)
			count = 1
		else
			count = 10
		price = GameGlobal.Config.RefreshPrice[count].refreshprice[0]
		this.priceIcon1.setType(price.id);
		this.priceIcon1.setPrice(price.count);
		this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getMysteryShopData())
	}

	private tap(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.allBuyBtn:
				GameGlobal.ShopManage.sendAllMysteryBuy()
				break
			case this.refreshBtn:
				let config = GameGlobal.Config.MysticalShopBaseConfig;
				let mysteryData = GameGlobal.ShopController.mysteryData;

				if (mysteryData.refreshcount >= config.refreshmax) {
					GameGlobal.UserTips.showTips("刷新次数不足")
					return
				}
				let refreshcount = 0;
				if (mysteryData.refreshcount >= 1 && mysteryData.refreshcount <= 10)
					refreshcount = mysteryData.refreshcount + 1;
				else if (mysteryData.refreshcount < 1)
					refreshcount = 1
				else
					refreshcount = 10
				let price = GameGlobal.Config.RefreshPrice[refreshcount].refreshprice[0]
				if (Checker.Money(price.id, price.count))
					GameGlobal.ShopManage.sendRefreshMysteryShopData()
				break
		}
	}
}

class ShopMysteryItem extends eui.ItemRenderer {

	    /////////////////////////////////////////////////////////////////////////////
    // ShopMysteryItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected name_txt: eui.Label;
    protected priceIcon0: PriceIcon;
    protected priceIcon1: PriceIcon;
    protected itemIcon: ItemBase;
    protected limit_txt: eui.Label;
    protected imgSellOut: eui.Image;
    protected discountImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////




	public constructor() {
		super()
	}
	public childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}
	protected onClick(e: egret.TouchEvent): void {
		if (egret.is(e.target.parent, 'ItemIcon') || this.data.buyCount >= this.data.item.daycount)
			return;
		this.data.item["buyTime"] = this.data.buyCount,
			ViewManager.ins().open(BuyWin, this.data.item, ShopType.mystery)
	}

	dataChanged() {
		let shopConfig = this.data.item;
		let goodsCfg = GameGlobal.Config.ItemConfig[shopConfig.id];

		if (shopConfig.discount) {
			this.discountImg.source = shopConfig.discount
		} else {
			this.discountImg.source = ""
		}

		this.priceIcon0.setType(shopConfig.oriprice.id);
		this.priceIcon0.setPrice(shopConfig.oriprice.count);

		this.priceIcon1.setType(shopConfig.currency.id);
		this.priceIcon1.setPrice(shopConfig.currency.count);

		this.itemIcon.data = shopConfig.id;
		this.itemIcon.isShowName(false)
		this.itemIcon.setCount(this.data.item.count);
		this.name_txt.textColor = ItemBase.QUALITY_COLOR[goodsCfg.quality];
		this.name_txt.text = goodsCfg.name;
		this.limit_txt.text = `限购：${this.data.buyCount}/${shopConfig.daycount}`
		this.imgSellOut.visible = this.data.buyCount >= shopConfig.daycount

	}
}