class ActivityType25Data extends ActivityBaseData {

	//消费有礼

	/**消费金额 */
	public money: number = 0;
	/**已领取了那些奖励，位运算 */
	public reward = 0;

	update(e: Sproto.activity_type25) {
		if (e) {
			this.money = e.RechargeNum;
			this.reward = e.reward;
		}
	}

	public hasReward(): boolean {
		if (!this.isOpenActivity()) {
			return false;
		}
		if(this.money == 0) {
			return false;
		}
		let arr = this.GetConfig();
		let i: number;
		let len: number = arr.length;
		for (i = 0; i < len; i++) {
			if (this.money >= arr[i].cost && !BitUtil.Has(this.reward, arr[i].index)) {
				return true;
			}
		}
		return false;
	}
}