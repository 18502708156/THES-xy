class ActivityType7Data extends ActivityBaseData {
    public recharge: number

    update(e: Sproto.activity_type28) { 
		this.record = e.record
        this.recharge = e.recharge
	}

}