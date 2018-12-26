class LadderRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	checkShowRedPoint() {
		return false
	}

	checkShowIcon() {
		return true
	}

	tapExecute() {
		// ViewManager.ins().open(LadderWin)
	}
}