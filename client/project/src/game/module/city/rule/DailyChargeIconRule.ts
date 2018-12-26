class DailyChargeIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.RECHARGE_DAILY_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE, MessageDef.RECHARGE_UPDATE]
		this.firstTap = true;
	}
	checkShowIcon() {
		let b = Deblocking.Check(DeblockingType.TYPE_126, true) && DailyChargeIconRule.showIcon();
		if (!b)
		{
			if (ViewManager.ins().isShow(DailyFirstChargeWin)) {
				ViewManager.ins().close(DailyFirstChargeWin);
			}
		}	
		return b
	}
	public static showIcon(): boolean
	{
		if (GameGlobal.RechargeModel.choicerechare >= 0) //每日首充跟首充互斥。领完首充奖励后才会出现
			return false

		let day = GameGlobal.RechargeModel.dailyId;
		let config = GameGlobal.Config.DailyrechargeConfig[day];
		if (config) {
			let index = 0;
			let reward = GameGlobal.RechargeModel.dailyReward;
			for (let id in config) {
				if (!BitUtil.Has(reward, index)) {
					return true;
				}
				index ++;
			}
		}
		return false;
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	checkShowRedPoint() {
		let day = GameGlobal.RechargeModel.dailyId;
		let config = GameGlobal.Config.DailyrechargeConfig[day];
		if (config) {
			let index = 0;
			let recharge = GameGlobal.RechargeModel.dailyRechare;
			let reward = GameGlobal.RechargeModel.dailyReward;
			for (let id in config) {
				if (recharge >= config[id].recharge && !BitUtil.Has(reward, index)) {
					return true;
				}
				index ++;
			}
		}
		return false
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(DailyFirstChargeWin)
	}
}
