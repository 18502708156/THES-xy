class ArenaionSpIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowIcon() {
		// return Deblocking.Check(DeblockingType.TYPE_78, true)
		return false;
	}

	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_ARENA, ShopController.EN_SHOP_JINGJI, ShopController.EN_SHOP_QUJING, ShopController.EN_SHOP_DATI])
	}
}