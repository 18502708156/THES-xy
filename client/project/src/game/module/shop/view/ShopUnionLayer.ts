class ShopWeiWangLayer extends ShopXianDaoLayer {
	public static  NAME = "威望商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_WEIWANG)
	}
}
class shopBashiLayer extends ShopXianDaoLayer {
	public static  NAME = "81难商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BASHI)
	}

	public setValue()
	{
		this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(9))//81难
	}

	account:eui.Label;
}
class ShopChongWuLayer extends ShopXianDaoLayer {
	public static  NAME = "宠物商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_CHONGWU)
	}
}

class ShopXianlvLayer extends ShopXianDaoLayer {
	public static  NAME = "仙侣商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_XIANLV)
	}
}
class ShopBanghuiLayer extends ShopXianDaoLayer {
	public static  NAME = "帮派福利"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_BANGPAI)
	}
}
class ShopZhangBanLayer extends ShopXianDaoLayer {
	public static  NAME = "装扮商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_ZHUANGBAN)
	}
}
class ShopPiFuLayer extends ShopXianDaoLayer {
	public static  NAME = "皮肤商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_PIFU)
	}
}
class ShopYouQingLayer extends ShopXianDaoLayer {
	public static  NAME = "友情商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_YOUQING)
	}
}
class ShopJingJiLayer extends ShopXianDaoLayer {
	public static  NAME = "竞技福利"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_JINGJI)
	}

	public setValue()
	{
		this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(4))//竞技场排名
	}

}
class ShopQuJingLayer extends ShopXianDaoLayer {
	public static  NAME = "取经商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_QUJING)
	}

	public setValue()
	{
		this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(5))//取经
	}

}
class ShopDaTiLayer extends ShopXianDaoLayer {
	public static  NAME = "科举商店"
	public setData()
	{
		this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_DATI)
	}

	public setValue()
	{
		this.setAccountText(GameGlobal.ShopManage.pShopController.getShopLockByType(6))//答题
	}
}
  