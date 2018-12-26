class ShopCommonPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// ShopCommonSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected tipsTxt: eui.Label;
	protected goPrice: eui.Label;
	protected priceIcon: PriceIcon;
	protected bgbg: eui.Image;
	protected listView: eui.List;
	protected listTitle: eui.List;
	protected commonWindowBg: CommonWindowBg
	protected counterLabel: DurationLabel;
	/////////////////////////////////////////////////////////////////////////////
	private m_nCurIndex = 0;
	public constructor() {
		super();
		this.skinName = "ShopCommonSkin";
		this.listTitle.itemRenderer = ShopCommonTitle;
		let config = GameGlobal.Config.StoreList;
		let titleData = CommonUtils.GetArray(config, "id");
		for (let i = 0; i < titleData.length;) {
			if (!Deblocking.IsDeblocking(titleData[i].openid))
				titleData.splice(i, 1)
			else
				i++;
		}

		this.listTitle.dataProvider = new eui.ArrayCollection(titleData);
		this.listTitle.selectedIndex = 0;

		this.listView.itemRenderer = ShopCommonItem;
		this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(0).shop)
		this.commonWindowBg.SetTitle("商店")
	}

	public OnOpen() {
		this.counterLabel.SetColor("0x6E330B")
		this.counterLabel.SetTextFormat("{0}后刷新商店");
		this.counterLabel.SetTextSize(26)
		let date = new Date(GameServer.serverTime * 1000);
		date.setHours(24, 0, 0, 0)
		this.counterLabel.SetEndTime(date.getTime() / 1000, DurationLabel.TIMETEXT_TYPE_HHMMSS)
		this.commonWindowBg.OnAdded(this);
		this.AddClick(this.goPrice, this.tap)
		this.AddItemClick(this.listTitle, this.itemClick)
		this.observe(MessageDef.GOLD_CHANGE, this.UpdateContent)
		this.UpdateContent();
	}

	UpdateContent() {
		let tipsStr = this.listTitle.selectedItem.instructions;
		if (tipsStr)
			tipsStr = tipsStr.replace("%s", ShopController.ins().getCurTipsNum(this.listTitle.selectedItem.kind));
		this.tipsTxt.text = tipsStr;
		this.priceIcon.setType(this.listTitle.selectedItem.moneytype)
		this.priceIcon.setPrice(ShopController.ins().getBuyItemNums(this.listTitle.selectedItem.moneytype));
		this.listView.dataProvider = new eui.ArrayCollection(ShopController.ins().getShopDataByIndex(this.listTitle.selectedItem.kind).shop);
		this.counterLabel.visible = this.listTitle.selectedItem.kind == ShopController.EN_SHOP_BANGPAI;

		this.goPrice.text = this.listTitle.selectedItem.gaindes;
		UIHelper.SetLinkStyleLabel(this.goPrice);
	}
	private itemClick() {
		if (this.m_nCurIndex != this.listTitle.selectedIndex) {
			this.UpdateContent();
			(this.listView.parent as eui.Scroller).stopAnimation();
		}
		this.m_nCurIndex = this.listTitle.selectedIndex;
	}

	private tap() {
		if (this.listTitle.selectedItem.moneytype)
			UserWarn.ins().BuyGoodsWarn(this.listTitle.selectedItem.moneytype)
	}
}

class ShopCommonItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// ShopCommonItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected priceIcon: PriceIcon;
	protected lbInfo: eui.Label;
	protected buy: eui.Button;
	protected nameLabel: eui.Label;
	protected imgSellOut: eui.Image;
	protected itemIcon: ItemBase;
	protected imgXiyou: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		// 皮肤名称
		this.skinName = "ShopCommonItemSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}

	public onClick(e) {
		if (egret.is(e.target.parent, 'ItemIcon')) return;
		if (this.data && ShopController.ins().enoughBuy(this.data)) {
			ViewManager.ins().open(BuyWin, this.data)
		}
	}

	public dataChanged(): void {
		//更新内容
		var bBuyAll = false;
		this.lbInfo.text = ""

		//icon
		var itemConfig;
		if (this.data.id) {
			itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
			this.nameLabel.text = itemConfig.name;
			this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
			this.itemIcon.setDataByConfig(itemConfig);
			this.itemIcon.isShowName(false)
			if (this.data.count) {
				this.itemIcon.setCount(this.data.count + "")
			}
		}
		//稀有图片
		this.imgXiyou.visible = this.data.make === 1;

		this.priceIcon.setType(this.data.currency.id)
		this.priceIcon.setPrice(this.data.currency.count)

		//限购
		if (this.data.daycount) {
			if (this.data.daycount > 0) {

				if (this.data.buyTime && this.data.buyTime > 0 && this.data.daycount && this.data.buyTime === this.data.daycount) {
					bBuyAll = true
				}
				else {
					this.lbInfo.textColor = Color.l_green_1
					this.lbInfo.text = "(限购" + this.data.buyTime + "/" + this.data.daycount + ")"
				}
			}
		}

		//限制条件
		if (!ShopController.ins().enoughBuy(this.data, 3)) {
			this.lbInfo.text = ShopController.ins().enoughBuy(this.data, 2) + "";
			this.lbInfo.textColor = Color.RedColor
		}

		this.imgSellOut.visible = bBuyAll
		this.buy.visible = !bBuyAll
	}
}
class ShopCommonTitle extends eui.ItemRenderer {


	imgBg: eui.Image;
	lbNe: eui.Label;


	public constructor() {
		super();
		// 皮肤名称
		this.skinName = "ShopEquipTitleSkin";
	}

	public dataChanged(): void {
		this.lbNe.text = this.data.storename
	}


}