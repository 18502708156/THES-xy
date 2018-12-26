class ActivityType2Data extends ActivityBaseData {

	buyData: number[]

	update(t: Sproto.activity_type02) {
		this.buyData = [];
		for (var len = t.buyData.length, i = 0; len > i; i++) {
			this.buyData.push(t.buyData[i])
		}
	}

	hasReward() {
		return !1
	}

	

}