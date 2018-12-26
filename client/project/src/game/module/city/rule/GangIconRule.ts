class GangIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.GANG_ALL_NOTICE, MessageDef.GANG_EXIT_NOTICE]

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
	}
	
	checkShowRedPoint () {
		return GameGlobal.GangModel.mRedPoint.IsRedPoint()
	}

	tapExecute  () {
		if (GameGlobal.GangModel.HasGang())
			ViewManager.ins().open(GangMainWin)
		else
			ViewManager.ins().open(GangListWin)
	}
}