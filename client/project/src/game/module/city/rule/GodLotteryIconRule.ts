class GodLotteryIconRule extends RuleIconBase {
	//天神降临
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_117, true)
	}

	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		ViewManager.ins().open(GodLotteryWin)
	}
}
