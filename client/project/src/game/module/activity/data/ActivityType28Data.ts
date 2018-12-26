class ActivityType28Data extends ActivityBaseData {
    public runday: number
    public recharge: number

    update(e: Sproto.activity_type28) { 
		this.record = e.record
		this.runday = e.runday
        this.recharge = e.recharge
	}
}