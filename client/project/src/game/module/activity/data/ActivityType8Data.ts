class ActivityType8Data extends ActivityBaseData {

	//投资计划 -- 达到条件系统直接下发 - 所以不需要做红点

	/**0 没投资 1已投资了*/
	public status: number = 0;
	/** 已经返利的天数*/
	public day: number = 0

	update(t: Sproto.activity_type08) {
		if (t) {
			this.status = t.status;
			this.day = t.day;
		}
	}

	/**活动结束后。是否还剩余有可领取目标没完成 */
	public canReward(): boolean {
		if (this.status == 1) {
			let arr = this.GetConfig();
			let len = arr.length;
			if (this.day <= len) {
				return true;
			}
		}
		return false;
	}
}