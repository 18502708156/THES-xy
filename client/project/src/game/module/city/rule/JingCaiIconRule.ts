class JingCaiIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_UPDATE]
	}
	checkShowRedPoint() {
		return GameGlobal.ActivityKaiFuModel.jingCaiIconRedPoin()
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_133, true))
			return false

		if (GameGlobal.ActivityKaiFuModel.jingCai_huoDong().length != 0) {   //里面没有活动不显示该图标
			return true;
		}
		return false
	}

	tapExecute() {
		ViewManager.ins().open(JingCaiActivityWin)
	} 
}