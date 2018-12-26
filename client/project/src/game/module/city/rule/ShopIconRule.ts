class ShopIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_66, true)
	}

	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		// ViewManager.ins().open(ShopLayer, 
		// [ShopController.EN_SHOP_YUANBAO,ShopController.EN_SHOP_BANGYUAN,ShopController.EN_SHOP_CHONGWU,ShopController.EN_SHOP_XIANLV])
		ViewManager.ins().open(ShopCommonPanel);
	}
}