class XuannvBefallIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [MessageDef.UPDATA_VIP_AWARDS]
	}

	checkShowIcon() {
		return XuannvBefallIconRule.CheckShow()
	}

	public static CheckShow() {
		return Deblocking.Check(212, true) && !BitUtil.Has(UserVip.ins().state, GameGlobal.Config.GuideBaseConfig.viplv);
	}

	checkShowRedPoint() {
		return false;
	}

	tapExecute() {
		ViewManager.ins().open(HavingShow);
	}

	public static AutoCheckShow() {
		if (!GameServer.ETNER_GAME_TIME) {
			return false
		}
		if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SHOW_XUANNV)) {
			return false
		}
		if (!XuannvBefallIconRule.CheckShow()) {
			return false
		}
		let rechargeNum = GameGlobal.RechargeModel.rechargeNum
		if (rechargeNum > 0 && rechargeNum < 200 && GameGlobal.RechargeModel.firsttime) {
			if (GameServer.serverTime - GameServer.ETNER_GAME_TIME > 10 * 60 && GameServer.serverTime - GameGlobal.RechargeModel.firsttime > 30 * 60) {
				return true
			}
		}
		return false
	}

	public static AutoShow() {
		if (this.AutoCheckShow()) {
			ViewManager.ins().open(HavingShow);
		}
	}
}

class XuannvBefallIconRule2 extends XuannvBefallIconRule {

	checkShowIcon() {
		if (DiscountRule.CheckShow()) {
			return false
		}
		return super.checkShowIcon()
	}
}