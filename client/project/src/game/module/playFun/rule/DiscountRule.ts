class DiscountRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.firstTap = true
		// this.effX = RuleIconBase.POS1_X
		// this.effY = RuleIconBase.POS1_Y
		this.effX = this.tar.width >> 1
		this.effY = this.tar.height >> 1
		this.updateMessage = [MessageDef.RECHARGE_UPDATE]
	}
	checkShowRedPoint() {
		return GameGlobal.RechargeModel.choicerechare > 0;
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_129, true) && GameGlobal.RechargeModel.choicerechare >= 0;;
	}

	public static CheckShow(): boolean {
		return GameGlobal.RechargeModel.choicerechare >= 0
	}

	tapExecute() {
		ViewManager.ins().open(RechargeAwardPanel)
	}

	getEffName(redPointNum) {
		return this.DefEffe(redPointNum)
	}

	public static Open() {
		if (GameGlobal.RechargeModel.choicerechare >= 0) {
			ViewManager.ins().open(RechargeAwardPanel)
		} else {
			UserTips.InfoTip("已经购买")
		}
	}
}