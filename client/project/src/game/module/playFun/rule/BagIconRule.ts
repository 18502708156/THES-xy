class BagIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowRedPoint () {
		return  GameGlobal.UserBag.bFullBag() || GameGlobal.UserBag.getIsExitUsedItem()
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_128, true)
	}

	tapExecute  () {
		ViewManager.ins().open(BagWin)
	}
}