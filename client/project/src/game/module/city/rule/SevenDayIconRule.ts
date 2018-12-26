class SevenDayIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_ADVANCED_INFO,
							MessageDef.ACTIVITY_UPDATE,
							MessageDef.ACTIVITY_INFO,
							MessageDef.ACTIVITY_DABIAO_UPDATE,
							MessageDef.ACTIVITY_RACE_HISTORY,
							MessageDef.ACTIVITY_IS_GET_AWARDS]
	}
	checkShowIcon() {
		let b = Deblocking.Check(DeblockingType.TYPE_103, true) && GameGlobal.ActivityKaiFuModel.hasActivityQiTian();
		return b
	}

	checkShowRedPoint() 
	{
		return GameGlobal.ActivityKaiFuModel.RedPointQiTian()
	}

	tapExecute() {
		KaiFuActivityWin.Show()
	}
}
