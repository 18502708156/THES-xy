class ActivityType16Data extends ActivityBaseData {

	/**# 登录天数状态 */
	logrecord: number
	
	update(e:Sproto.activity_type16) { 
		this.record = e.record;
		this.logrecord = e.logrecord;
	}

	hasReward(): boolean {
		if (!this.isOpenActivity())
		{
			return false;
		}
		let i:number;
		let len:number = this.logrecord || 0;
		for( i = 1 ; i <= len ;i ++ )
		{
			if (this.canGetRecordByIndex(i) == true)
			{
				return true;
			}	
		}
		return false
	}
	canGetRecordByIndex(index:number): boolean
	{
		if (!this.isOpenActivity())
		{
			return false;
		}
		if (GameServer.serverOpenDay < index)
		{
			return false;
		}	
		return !this.GetRecordByIndex(index);
	}

	
}