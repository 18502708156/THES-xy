class FightPetFBIconRule extends RuleIconBase {

	public static mIsFirst = true

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE]
		
	}
	checkShowIcon() {

		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
		if(activityData == null){
			return false;
		}
		if (activityData.AllGotten()) {
			return false
		}
		let actid =  activityData.id

		let btnConfig = GameGlobal.Config.ActivitySumBtnConfig
		if(btnConfig[actid] && btnConfig[actid].icon)
		{
			this.iconDisplay.source =  btnConfig[actid].icon + "_zc";
		}
		//let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(2);
		let b = Deblocking.Check(DeblockingType.TYPE_98, true) && activityData && activityData.isOpenActivity()
		if (b)
		{
			this.setTime(activityData.endTime * 1000);
		} else {
			this.setTime(0);
		}
		return b;
	}

	checkShowRedPoint() 
	{
		let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
		if(actData == null){
			return false;
		}
		if (actData && actData.hasReward())
		{
			return true
		}
		if (FightPetFBIconRule.mIsFirst) {
			return true
		}
		return false
	}

	tapExecute() {
		FightPetFBIconRule.mIsFirst = false
		FightPetFBIconRule.Open()
	}

	public static Open() {
		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_22_OrangePetTarget);
		if(activityData == null){
			return;
		}
		KaiFuActivityWin.Show(activityData.id)//传如了一个战宠副本id 打开要选中战宠icon
	}
	
}