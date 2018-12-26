class DailyChargeGiftIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_140, true))
			return false
			
		let activityData: ActivityType28Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(28) as ActivityType28Data;
		if (!activityData || !activityData.isOpenActivity() || activityData.AllGotten())
			return false
			
		let index = activityData.runday
		let config = activityData.GetConfig()[index-1]
		this.tar.icon = config.icon

		return true
	}

	checkShowRedPoint() {
		let activityData: ActivityType28Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(28) as ActivityType28Data;
		if (activityData && activityData.hasReward())
			return true
		
		return false
	}

	tapExecute() {
		ViewManager.ins().open(DailyChargeGiftWin)
	}
}
