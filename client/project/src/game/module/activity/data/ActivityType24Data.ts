class ActivityType24Data extends ActivityBaseData {

	//成长基金 --活动开没开启不重要。重要是有没投资了

	/**0 没投资 1已投资了*/
	public status: number = 0;
	/** value 为已领取了的id*/
	public reward: number[] = [];

	update(e: Sproto.activity_type24) {
		if (e) {
			this.status = e.status;
			this.reward = e.reward;
		}
	}

	public hasReward(): boolean {
		if (this.status == 0) {
			return false;
		}
		let arr = this.GetConfig();
		let lv = GameGlobal.actorModel.level;
		let i;
		let len = arr.length;
		for (i = 0; i < len; i++) {
			if (lv >= arr[i].level && this.reward.indexOf(arr[i].index) == -1) {
				return true;
			}
		}
		return false;
	}

	/**活动结束后。是否还剩余有可领取目标没完成 */
	public canReward(): boolean {
		if (this.status == 1) {
			let arr = this.GetConfig();
			let i;
			let len = arr.length;
			for (i = 0; i < len; i++) {
				if (this.reward.indexOf(arr[i].index) == -1) {
					return true;
				}
			}
		}
		return false;
	}
}