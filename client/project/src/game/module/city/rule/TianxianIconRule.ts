class TianxianIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowRedPoint () {
		return 0
	}

	tapExecute  () {
		ViewManager.ins().open(TianxianMainPanel)
	}
}