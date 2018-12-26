class RechargeFeedbackIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_141, true))
			return false

		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29) as ActivityType7Data;
		if (!activityData || !activityData.isOpenActivity() || activityData.AllGotten())
			return false

		this.setTime(activityData.endTime * 1000)
		return true
	}

	checkShowRedPoint() {
		let activityData: ActivityType7Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29) as ActivityType7Data;
		if (activityData && activityData.hasReward())
			return true
		
		return false
	}

	tapExecute() {
		ViewManager.ins().open(RechargeFeedbackWin)
	}
}
