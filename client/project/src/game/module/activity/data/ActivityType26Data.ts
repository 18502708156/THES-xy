class ActivityType26Data extends ActivityBaseData {
	
	buynums: number[] 

	update(e: Sproto.activity_type26) {
		this.buynums = e.buynums || [];
	 }

	hasReward() {
		return !1
	}


}