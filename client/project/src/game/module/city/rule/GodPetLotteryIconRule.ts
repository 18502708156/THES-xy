class GodPetLotteryIconRule extends RuleIconBase {
	//降服神兽
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.GODPETACTIVE_LOTTERY_NOTICE]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_122, true) && GameGlobal.GodPetActiveModel.IsGodPetLotteryOpen()
	}

	checkShowRedPoint() {
		return GameGlobal.GodPetActiveModel.CanLottery()
	}

	tapExecute() {
		ViewManager.ins().open(GodPetActiveLotteryWin)
	}
}
