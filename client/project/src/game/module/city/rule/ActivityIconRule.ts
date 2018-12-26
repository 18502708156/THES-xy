class ActivityIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
	}
	checkShowIcon() {
		return true
	}
	checkShowRedPoint () {
		return false
	}

	tapExecute  () {
		ViewManager.ins().open(ActivityWin)
	}
}