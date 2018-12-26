class TotemsDrawIconRule extends RuleIconBase {
	// public static mIsFirst = true

	public constructor(t) {
		super(t)
		// this.effX = RuleIconBase.POS1_X
		// this.effY = 39
		// this.updateMessage = [MessageDef.LEVEL_CHANGE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_137, true)) {
			return false
		}
		return true
	}

	checkShowRedPoint() {
		// if (TreasureIconRule.mIsFirst) {
		// 	return true
		// }
		return false
	}

	tapExecute() {
		// TreasureIconRule.mIsFirst = false
		//ViewManager.ins().open(TotemsGoodLuckWin);
		ViewManager.ins().open(TotemsGoodLuckMainWin,0);
	}

	// getEffName(e) {
	// 	return this.DefEffe(1)
	// }
}
