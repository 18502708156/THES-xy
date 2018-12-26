class ActivityType3Data extends ActivityBaseData {
	/**充值总数 */
	rechargeCount
	/**达标天数 */
	day



	update(t: Sproto.activity_type03) {
		this.record = t.record
		this.day = t.day
		this.rechargeCount = t.rechargeCount
	}
	

}