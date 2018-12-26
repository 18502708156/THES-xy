class ActivityType1Data extends ActivityBaseData {
	
	update(e: Sproto.activity_type01) {
		this.record = e.record

	}

	
	// canGetRecordByIndex(index:number): boolean
	// {
	// 	if (!this.isOpenActivity())
	// 	{
	// 		return false;
	// 	}
	// 	if (this.record[index - 1] != 3)
	// 	{
	// 		return false;
	// 	}	
	// 	return !this.GetRecordByIndex(index);
	// }

}