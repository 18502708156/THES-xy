class ActivityType23Data extends ActivityBaseData {

	//直升一阶

	/**活动开启天数 */
	runday = 1

	update(e: Sproto.activity_type23) {
		this.record = e.record;
		this.runday = e.runday
	}

	public hasReward(): boolean {
		if (!this.isOpenActivity()) {
			return false;
		}
		let arr = this.GetConfig();
		// let rechare = GameGlobal.RechargeModel.todayRechargeNum;
		if (this.record == 3) {
			return true;
		}
		return false;
	}
	public GetRecordByIndex(index?): boolean
	{
		if (this.record == 4)
		{
			return true;
		}	
		return false;
	}
}