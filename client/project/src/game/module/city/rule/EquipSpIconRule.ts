class EquipSpIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ITEM_COUNT_CHANGE]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_70, true)
	}

	checkShowRedPoint () {
		return GameGlobal.UserBag.HasOrangeEquip()
	}

	tapExecute  () {
		ViewManager.ins().open(ShopLayer, 
		[ShopController.EN_SHOP_EQUIP])
	}
}