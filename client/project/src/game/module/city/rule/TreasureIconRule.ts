class TreasureIconRule extends RuleIconBase {
	public static mIsFirst = true

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.LUCK_RECORD]
	}

	checkShowIcon() {
		if (Deblocking.Check(DeblockingType.TYPE_111, true)) {
			return true;
		}
		return false
	}

	checkShowRedPoint() {
		if (TreasureIconRule.mIsFirst || GameGlobal.TreasureHuntModel.IsFree()) {
			return true
		}
		return false
	}

	tapExecute() {
		TreasureIconRule.mIsFirst = false
		ViewManager.ins().open(TreasureHuntMainPanel);
	}

	getEffName(e) {
		return this.DefEffe(1)
	}
}
