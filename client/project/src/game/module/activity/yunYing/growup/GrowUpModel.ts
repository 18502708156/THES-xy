class GrowUpModel extends BaseSystem {

	public IsRedPoint() {
		if (this.checkFirstChargeRedPoint()) {
			return true;
		}
		if (this.checkGrowUpRedPoint()) {
			return true;
		}
		if (this.checkInvestmentRedPoint()) {
			return true;
		}
		// if (this.checkConsumptionRedPoint()) {
		// 	return true;
		// }
		return false;
	}

	public checkFirstChargeRedPoint() {
		let num = GameGlobal.RechargeModel.rechargeNum;
		if (0 == num) {
			return false;
		}
		let config = GameGlobal.Config.FirstRechargeConfig;
		for (let key in config) {
			if (num >= config[key].recharge && !GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
				return true;
			}
		}
		return false;
	}
	public checkInvestmentRedPoint() {

		return false;
	}
	public checkGrowUpRedPoint() {
		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if(_activityData) {
			return _activityData.hasReward();
		}
		return false;
	}
	public checkConsumptionRedPoint() {
		let _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13) as ActivityType25Data;
		if(_activityData) {
			return _activityData.hasReward();
		}
		return false;
	}

	public constructor() {
		super();

	}
}

