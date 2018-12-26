class ActivityType17Data extends ActivityBaseData {
	
	target: number[]
	
	update(e:Sproto.activity_type17) { 
		this.record = e.record;
		this.target = e.target
	}

	public hasReward():boolean
	{
		if (!this.isOpenActivity())
		{
			return false;
		}
		let arr = this.GetConfig();
		let i:number;
		let len:number = arr.length;
		let curDay = GameServer.serverOpenDay
		for( i = 0 ; i < len ;i ++ )
		{
			if (arr[i].day != curDay) {
				continue
			}
			if (this.canGetRecordByIndex(i + 1))
			{
				return true;
			}	
		}
		return false;
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