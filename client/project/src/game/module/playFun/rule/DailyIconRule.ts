class DailyIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.DAILY_REDPOINT_NOTICE]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_48, true)
	}

	checkShowRedPoint () {
		return GameGlobal.DailyModel.IsRedPoint()
	}

	tapExecute  () {
		ViewManager.ins().open(DailyMainWin)
	}
}