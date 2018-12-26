class GrowUpIconRule extends RuleIconBase {

	private isFirstCharge = false;

	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_106, true))
			return false

		this.isFirstCharge = false;
		let config = GameGlobal.Config.FirstRechargeConfig;
		for (let key in config) {
			if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
				this.isFirstCharge = true;
				break;
			}
		}
		/*成长基金 */
		let growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if (growupData && growupData.isOpenActivity()) {
			if (0 == growupData.status) {
				this.setTime(growupData.endTime * 1000);
			} else {
				this.setTime(0);
			}
			return true;
		}
		if (growupData && growupData.canReward()) {
			return true;
		}
		return false;
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	checkShowRedPoint() {
		return GameGlobal.GrowUpModel.checkGrowUpRedPoint();
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(GrowUpWin, this.isFirstCharge ? 1 : 0)
	}
}