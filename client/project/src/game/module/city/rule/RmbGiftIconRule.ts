class RmbGiftIconRule extends RuleIconBase {
	//人民币礼包
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.effX = RuleIconBase.POS1_X
		this.effY = RuleIconBase.POS1_Y
		this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.ACTIVITY_UPDATE]
	}

	checkShowIcon() {
		let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9) as ActivityType19Data;
		if (data) {
			let config = data.GetConfig();
			if (!config[data.reachday]) {
				return false
			}
			this.tar.icon = config[data.reachday].icon;
			if(data.runday < data.reachday) {
				return false;
			}
			if (data.runday == data.reachday && !data.isLastDay()) {
				return true
			}
			if (data.isOpenActivity() && Deblocking.Check(DeblockingType.TYPE_104, true)) {
				return true;
			}
		}
		return false
	}


	checkShowRedPoint() {
		let data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9) as ActivityType19Data
		if (!data)
			return false
			
		return data.canGetRecordByIndex(data.reachday+1)
	}
	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false
		ViewManager.ins().open(RmbGiftPanel)
	}
}
