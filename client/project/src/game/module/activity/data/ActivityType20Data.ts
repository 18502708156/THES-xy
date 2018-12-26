class ActivityType20Data extends ActivityBaseData {

	update(e:Sproto.activity_type20) {
		this.record = e.record;
	}


	// canGetRecordByIndex(index:number): boolean
	// {
	// 	if (!this.isOpenActivity())
	// 	{
	// 		return false;
	// 	}
	// 	let cfgObj = this.GetConfig()[index];
	// 	let power = GameGlobal.actorModel.power;
	// 	if (cfgObj.value > power)
	// 	{
	// 		return false;
	// 	}
		
	// 	return !this.GetRecordByIndex(index);
	// }


}