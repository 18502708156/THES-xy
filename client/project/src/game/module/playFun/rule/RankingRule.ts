class RankingRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.LEVEL_CHANGE]
	}
	checkShowRedPoint() {
		return false// return GameGlobal.RankingModel.isRedPoint() && GameGlobal.actorModel.level >= GameGlobal.Config.FuncOpenConfig[86].conditionnum;;
	}

	checkShowIcon() {
		return false// return Deblocking.Check(DeblockingType.TYPE_86, true)
	}

	tapExecute() {
		ViewManager.ins().open(RankingWin)
	}
}