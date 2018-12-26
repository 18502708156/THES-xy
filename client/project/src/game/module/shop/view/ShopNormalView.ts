/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 常规商店详情
 * 
 **/


class ShopNormalView extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "宝塔商店"


	
	protected account: eui.Label;
	protected goPrice: eui.Label;
	private priceIcon:PriceIcon;
	private listView:eui.List;
	
	private tShopData;//商店数据

    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopTitle"
		this.listView.itemRenderer = ShopRectItem;
	}

	public OnOpen() {

		this.goPrice.visible = false//不需要使用

		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney)
		this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent)//商店购买变化
		

		// this._AddItemClick(this.listView, this.onListViewClick)



		this.setMoney()
		this.UpdateContent()
	}


	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_DAYAN)
	}

	UpdateContent() {
		this.setData();
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tShopData.shop);
		var strAccount = ""
		let strNums = GameGlobal.UserFb.lltModel.layer +""
		if(typeof(this.tShopData.instructions) =="string")
		{
			strAccount =  this.tShopData.instructions.replace("%s",strNums)//这里系统并没有参数,所以后期需要补充
		}

		this.account.text = strAccount



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