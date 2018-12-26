class FirstRechargeIconRule extends RuleIconBase {

	effX = RuleIconBase.POS1_X
	effY = RuleIconBase.POS1_Y

	public btn: eui.Button

	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE]

		this.btn = t;
	}

	checkShowIcon() {
		this.showIcon();
		return Deblocking.Check(DeblockingType.TYPE_131, true) && FirstRechargeIconRule.CheckShow()
	}

	private showIcon() {
		let result = false;
		let config = GameGlobal.Config.FirstRechargeConfig;
		for (let key in config) {
			if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
				result = true;
				break;
			}
		}
		this.btn.icon = result ? 'ui_bm_shouchong' : 'ui_zc_z_chengzhangjijin';
	}

	public static CheckShow(): boolean {
		let config = GameGlobal.Config.FirstRechargeConfig;
		for (let key in config) {
			if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
				return true;
			}
		}

		/*成长基金 */
		let growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11) as ActivityType24Data;
		if (growupData && growupData.isOpenActivity()) {
			return true;
		}
		if (growupData && growupData.canReward()) {
			return true;
		}
		/*投资计划 */
		let investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12) as ActivityType8Data;
		if (investData && investData.isOpenActivity()) {
			return true;
		}
		if (investData && investData.canReward()) {
			return true;
		}
		/*消费有礼 */
		let consumData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13) as ActivityType25Data;
		if (consumData && consumData.isOpenActivity()) {
			return true;
		}
		return false;
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	checkShowRedPoint() {
		return GameGlobal.GrowUpModel.IsRedPoint();
	}

	tapExecute() {
		this.firstTap = false;
		ViewManager.ins().open(GrowUpWin)
	}
}