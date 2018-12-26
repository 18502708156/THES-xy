class ActivityType18Data extends ActivityBaseData {
	
	/*今日充值*/
	dayrecharge: number

	update(e: Sproto.activity_type18) {
		this.record = e.record
		this.dayrecharge = e.dayrecharge
	}
	canGetRecordByIndex(index:number): boolean
	{
		if (!this.isOpenActivity())
		{
			return false;
		}
		let cfgObj = this.GetConfig()[index - 1];
		let day = cfgObj.day
		if (GameServer.serverOpenDay < day) {
			return false;
		}
		return super.canGetRecordByIndex(index);
	}


}