class MysteryRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.firstTap = true
		this.effX = this.tar.width >> 1
		this.effY = this.tar.height >> 1
		this.updateMessage = [MessageDef.LEVEL_CHANGE]
	}
	checkShowRedPoint() {
		return false;
	}

	checkShowIcon() {
		 return Deblocking.Check(DeblockingType.TYPE_138, true);
	}

	tapExecute() {
		ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_MYSTERY, ShopController.EN_SHOP_INTEGRAL])
	}
}