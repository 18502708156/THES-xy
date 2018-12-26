class ArenaIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ARENA_INFO_DATA, MessageDef.ARENA_BUY_RESULT]

		this.tar["redPoint"] = (this.tar as eui.Button).getChildByName("redPoint")
	}

	checkShowIcon() {
		return true
	}

	checkShowRedPoint () {
		if (!Deblocking.Check(DeblockingType.TYPE_42, true)) {
			return false
		}
		if (GameGlobal.Arena.IsRedPoint()) {
			return true
		}
		if (GameGlobal.Ladder.IsRedPoint()) {
			return true
		}
		return  false
	}

	tapExecute  () {
		ViewManager.ins().open(ArenaWin)
	}
}