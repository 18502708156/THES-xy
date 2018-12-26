class TotemsIconRule extends RuleIconBase {
	// public static mIsFirst = true

	public constructor(t) {
		super(t)
		// this.effX = RuleIconBase.POS1_X
		// this.effY = 39
		// this.updateMessage = [MessageDef.LEVEL_CHANGE]
		this.updateMessage = [MessageDef.TOTEMS_REDPOINT_NOTICE,MessageDef.TOTEMS_UPDATEACTIVATION];
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_119, true)) {
			return false
		}
		return true
	}

	checkShowRedPoint() 
	{
		if (GameGlobal.TotemsModel.mRedPoint.showRedPoint()) { //GameGlobal.TotemsModel.mRedPoint.showRedPoint()
			return true
		}
		return false
	}

	tapExecute() {
		// TotemsIconRule.mIsFirst = false
		ViewManager.ins().open(TotemsMainWin);
	}

	// getEffName(e) {
	// 	return this.DefEffe(1)
	// }
}
