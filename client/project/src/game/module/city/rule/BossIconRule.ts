class BossIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ALL_BOSS_NOTICE]

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
	}

	checkShowIcon() {
		return true
	}

	checkShowRedPoint () {
		if (!Deblocking.Check(DeblockingType.TYPE_44, true)) {
			return false
		}
		return GameGlobal.BossModel.IsRedPoint()
	}

	tapExecute  () {
		ViewManager.ins().open(BossMainPanel)
	}
}