class InvestmentIconRule extends RuleIconBase {

	private isFirstCharge = false;

	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		if (!Deblocking.Check(DeblockingType.TYPE_107, true))
			return false

		this.isFirstCharge = false;
		let config = GameGlobal.Config.FirstRechargeConfig;
		for (let key in config) {
			if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
				this.isFirstCharge = true;
				break;
			}
		}
		/*投资计划 */
		let investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12) as ActivityType8Data;
		if (investData && investData.isOpenActivity()) {
			if (0 == investData.status) {
				this.setTime(investData.endTime * 1000);
			} else {
				this.setTime(0);
			}
			return true;
		}
		if (investData && investData.canReward()) {
			return true;
		}
		return false;
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	checkShowRedPoint() {
		return false;
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(GrowUpWin, this.isFirstCharge ? 2 : 1)
	}
}