class ShopTreasureHuntPnael extends BaseView implements ICommonWindowTitle {

	public static NAME = "寻宝商店"

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


	protected tShopData;//商店数据

    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopTitle"
		this.listView.itemRenderer = ShopRectItem;

		this.account.visible = false
	}

	public OnOpen() {

		this.goPrice.visible = false//不需要使用

		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney)
		this.observe(MessageDef.POWER_CHANGE, this.setMoney)//
		this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent)//商店购买变化
		

		// this._AddItemClick(this.listView, this.onListViewClick)



		this.setMoney()
		this.UpdateContent()


		this.AddLoopTimer(1000, this.Update)
	}

	private Update() {
		for (let item of this.listView.$children) {
			let child = item as ShopRectItem
			if (child.UpdateTime) {
				child.UpdateTime()
			}
		}
	}


	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_TREASURE_HUNT)
	}

	UpdateContent() {
		this.setData();
		let list = []
		let serTime = GameServer.serverTime
		for (let data of this.tShopData.shop) {
			if (data.limittime && serTime >= data.limittime) {
				continue
			}
			list.push(data)
		}
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(list);
	}

	private onListViewClick(e: eui.ItemTapEvent) {
		var pItem = e.item
		if(pItem&&ShopController.ins().enoughBuy(pItem))
		{
			ViewManager.ins().open(BuyWin,pItem)
		}
	}

	public setMoney()
	{
		this.setData()
		if(this.tShopData.moneytype)
		{
			this.priceIcon.setType(this.tShopData.moneytype)  
			this.priceIcon.price = CommonUtils.overLength(ShopController.ins().getBuyItemNums(this.tShopData.moneytype))
		}

	}

}




