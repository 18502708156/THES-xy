class FashionSpIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	
	checkShowIcon() {
		// return Deblocking.Check(DeblockingType.TYPE_74, true)
		return false;
	}

	checkShowRedPoint () {
		return false
	}

	tapExecute  () {
		ViewManager.ins().open(ShopLayer,
		 [ShopController.EN_SHOP_ZHUANGBAN,ShopController.EN_SHOP_PIFU,ShopController.EN_SHOP_YOUQING,ShopController.EN_SHOP_WEIWANG])
	}
}