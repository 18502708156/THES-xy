class FubenIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.FB_REDPOINT_NOTICE]

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
	}

	checkShowIcon() {
		return true
	}

	checkShowRedPoint () {
		if (!Deblocking.Check(DeblockingType.TYPE_35, true)) {
			return false
		}
		return GameGlobal.UserFb.IsRedPoint()
	}

	tapExecute  () {
		ViewManager.ins().open(FbLayer)
	}
}