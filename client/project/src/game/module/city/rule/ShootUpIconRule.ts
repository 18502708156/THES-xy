class ShootUpIconRule extends RuleIconBase {
	//直升一阶
	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [MessageDef.LEVEL_CHANGE,MessageDef.ACTIVITY_INFO,MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		let b = ShootUpIconRule.CheckShow();
		if (b)
		{
			this.setTime(GameServer.dayEndTime);
		} else {
			this.setTime(0);
		}
			
		return b
	}
	

	public static CheckShow(): boolean {
		let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(10) as ActivityType23Data;
		if (!data) {
			return
		}
		let config = data.GetConfig()[data.runday - 1];
		if (!config) {
			return false
		}
		if (data && data.isOpenActivity() && !data.GetRecordByIndex()) {
			if (Deblocking.Check(DeblockingType.TYPE_105, true)) {
				return true;
			}
		}
		return false
	}

	checkShowRedPoint() {
		let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(10) as ActivityType23Data;
		if (data && data.isOpenActivity()) {
			return data.hasReward();
		}
		return false
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(ShootUpPanel)
	}

	public static Open() {
		if (!ShootUpIconRule.CheckShow()) {
			UserTips.InfoTip("活动已经关闭")
			return
		}
		ViewManager.ins().open(ShootUpPanel)
	}
}
