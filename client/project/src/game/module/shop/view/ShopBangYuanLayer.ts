/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 15:51
 * @meaning: 绑元商店详情
 * 
 **/


class ShopBangYuanLayer extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "绑元商店"


	tShopData;//商店数据
	
	protected account: eui.Label;
	protected goPrice: eui.Label;
	private priceIcon:PriceIcon;
	private listView:eui.List;

	

    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopTitle"

		this.listView.itemRenderer = ShopRectItem;

		this.goPrice.visible = false//不需要使用
	}

	public OnOpen() {


		this.observe(MessageDef.GOLD_CHANGE, this.setMoney)//目前只对钱变化进行处理,后续需要添加
		this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent)//商店购买变化
		// this._AddItemClick(this.listView, this.onListViewClick)

		this.setMoney()
		this.UpdateContent()
	}





	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BANGYUAN)
	}

	UpdateContent() {
        this.setData();
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tShopData.shop);

		var strAccount = ""
		if(typeof(this.tShopData.instructions) =="string")
		{
			strAccount =  this.tShopData.instructions.replace("%s","0")//这里系统并没有参数,所以后期需要补充
		}

		this.account.text = strAccount

		Util.GetClass(this).NAME = this.tShopData.storename


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
		if(this.tShopData.moneytype&&this.tShopData.moneytype <10)
		{
			this.priceIcon.setType(this.tShopData.moneytype)  
			switch(this.tShopData.moneytype)
			{
				case 1: this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.gold);break
				case 2: this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.yb);break
				case 3: this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.byb);break
			}
		}
	}

}