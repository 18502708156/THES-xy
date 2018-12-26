class DestinyIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [
		]
	}

	checkShowIcon() {
		return Deblocking.IsDeblocking(DeblockingType.TYPE_144)
	}

	checkShowRedPoint() {
		return GameGlobal.DestinyController.mRedPoint.IsRedPoint()
	}

	tapExecute() {
		ViewManager.ins().open(DestinyUpWin, 1)
	}
}