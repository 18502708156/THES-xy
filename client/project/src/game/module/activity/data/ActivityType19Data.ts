class ActivityType19Data extends ActivityBaseData {

	//人民币礼包

	/**达成天数 */
	reachday: number = 0
	/**活动开启天数 */
	runday

	update(e:Sproto.activity_type19) { 
		this.reachday = e.reachday
		this.runday = e.runday;
		this.record = e.record
	}

	public isLastDay() {
		let config = this.GetConfig()[this.runday]
		return config == null
	}

}