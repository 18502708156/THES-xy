class ActivityType21Data extends ActivityBaseData {
	
	people: number
	rechargeNum:number

	update(e:Sproto.activity_type21) { 
		this.record = e.record;
		this.people = e.people;
		this.rechargeNum = e.rechargeNum;
	}


	// canGetRecordByIndex(index:number): boolean
	// {
	// 	if (!this.isOpenActivity())
	// 	{
	// 		return false;
	// 	}
	// 	let cfgObj = this.GetConfig()[index];
		
	// 	if (cfgObj.type > this.people)
	// 	{
	// 		return false;
	// 	}
	// 	if (cfgObj.value > GameGlobal.RechargeModel.totalRechargeNum)
	// 	{
	// 		return false;
	// 	}
			
	// 	return !this.GetRecordByIndex(index);
	// }
	

}