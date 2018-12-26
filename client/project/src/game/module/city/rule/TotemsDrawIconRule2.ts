/**
 * 图腾_Rule
 */
class TotemsDrawIconRule2 extends RuleIconBase {
	// public static mIsFirst = true

	public constructor(t) {
		super(t)
		// this.effX = RuleIconBase.POS1_X
		// this.effY = 39
		// this.updateMessage = [MessageDef.LEVEL_CHANGE]
	}

	checkShowIcon() {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_143)) {
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
		//ViewManager.ins().open(TotemsGoodLuckWin2);
		ViewManager.ins().open(TotemsGoodLuckMainWin,1);
	}


	// getEffName(e) {
	// 	return this.DefEffe(1)
	// }
}
