class FuliIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.RP_SIGN_UPDATE,]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_125, true)
	}

	checkShowRedPoint() {
		return GameGlobal.FuliModel.IsRedPoint();
	}

	tapExecute() {
		ViewManager.ins().open(FuliWin)
	}
}
