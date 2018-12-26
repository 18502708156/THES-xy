class ActivityType22Data extends ActivityBaseData {
	
	gid

	update(e: Sproto.activity_type22) { 
		this.record = e.record;
		this.gid = e.gid
	}
}