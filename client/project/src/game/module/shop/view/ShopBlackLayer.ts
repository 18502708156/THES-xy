/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 15:51
 * @meaning: 黑市商店详情
 * 
 **/


class ShopBlackLayer extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "帮会商店"


   
	
	protected account: eui.Label;
	protected goPrice: eui.Label;
	private priceIcon:PriceIcon;
	private listView:eui.List;

	protected remaintime = 0;//剩余时间 
	protected tShopData;//商店数据

    
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ShopTitle"

		this.listView.itemRenderer = ShopRectItem;


		this.goPrice.visible = false//不需要使用
	}

	public OnOpen() {


		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney)//
		this.observe(MessageDef.POWER_CHANGE, this.setMoney)//
		this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.setMoney)//

		this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent)//商店购买变化
		

		// this._AddItemClick(this.listView, this.onListViewClick)

		TimerManager.ins().doTimer(1000, 0, this.updateTimes, this);

		this.account.text = ""
		this.getLeftTime()
		
		this.updateTimes();


		this.setMoney()
		this.UpdateContent()
	}

	public getLeftTime()
	{
		var myDate = new Date();
		var　nHour = myDate.getHours();       //获取当前小时数(0-23)
		var　nMinutes = myDate.getMinutes();     //获取当前分钟数(0-59)
		var　nSeconds = myDate.getSeconds();     //获取当前秒数(0-59)
		this.remaintime = (23-nHour)*60*60 + (59-nMinutes*60) +  (59-nSeconds)  ;
		
	}




	public setData()
	{

		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BLACK)
	}

	UpdateContent() {
        this.setData();
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tShopData.shop);
		Util.GetClass(this).NAME = this.tShopData.storename

	}


	private updateTimes(): void {
		this.remaintime--;
		if (this.remaintime <= 0) {
			this.account.visible = false;
			TimerManager.ins().remove(this.updateTimes, this);
		}
		this.account.text = DateUtils.getFormatBySecond(this.remaintime) + " 后重置商店"
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
			this.priceIcon.price = CommonUtils.overLength(GameGlobal.actorModel.contrib)

		}
	}

}