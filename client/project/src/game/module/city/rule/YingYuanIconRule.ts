class YingYuanIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.HOUSE_UPDATE_INFO]
	}
	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_39, true) || Deblocking.Check(DeblockingType.TYPE_41, true)
	}
	checkShowRedPoint () {
		return GameGlobal.YingYuanModel.CanUpgrade()
	}

	tapExecute () {
		ViewManager.ins().open(YingYuanWin)
	}
}
