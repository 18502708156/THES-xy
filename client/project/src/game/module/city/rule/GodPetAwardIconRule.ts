class GodPetAwardIconRule extends RuleIconBase {
	//神兽降临
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [MessageDef.GODPETACTIVE_UPDATE_INFO]
	}

	checkShowIcon() {
		this.setTime(GameGlobal.GodPetActiveModel.GetEndtime())
		return Deblocking.Check(DeblockingType.TYPE_123, true) && GameGlobal.GodPetActiveModel.IsOpenActive()
	}

	checkShowRedPoint() {
		return GameGlobal.GodPetActiveModel.mRedPoint
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(GodPetActiveAwardWin)
	}
}
