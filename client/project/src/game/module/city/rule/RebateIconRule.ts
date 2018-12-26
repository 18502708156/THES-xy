class RebateIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}

	private id:number
	checkShowIcon() {
		let dataList = []

		let ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig
		for (let Config in ActivitySumBtnConfig) {
			if (ActivitySumBtnConfig[Number(Config)].openId == 5) {
				dataList.push(Number(Config))
				let BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(Number(Config))
				if (BaseModel) {
					if (BaseModel.openState) {
						this.id = Number(Config)
					}
				}
			}
		}

		let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.id);
		let b = Deblocking.Check(DeblockingType.TYPE_132, true) && activityData && activityData.isOpenActivity()
		if (b) {
			this.setTime(activityData.endTime * 1000);
		} else {
			this.setTime(0);
		}
		return b;
	}

	checkShowRedPoint() {
		return RechargeRebatePanel.CheckRedPoint(this.id);
	}

	tapExecute() {
		ViewManager.ins().open(RechargeRebateMainPanel);
	}
}