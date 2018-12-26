class ActivityAdvancedInfo {

	public dayChargeValue: number = 0;
	public chargerReward: Array<number> = [];
	private m_shopDatas:{ [key: number]: number } = {}
	public advancedReward_datas: { [key: number]: Array<number> } = {}

	// public endTime: number;
	
	public constructor() {
		
	}
	public GetChargeReward(index: number): boolean {
		// return (this.chargerReward & (1 << index)) > 0
		return this.chargerReward.indexOf(index) != -1
	}
	public GetAdvancedReward(type:number,id: number): boolean {
		let record = this.advancedReward_datas[type] || []
		return record.indexOf(id) != -1
	}
	// public updateEndTime(): void
	// {
	// 	let date: Date = new Date(GameServer.serverTimeMilli);
	// 	date.setHours(23);
	// 	date.setMinutes(59);
	// 	date.setSeconds(59);
	// 	this.endTime = date.getTime() //+ DateUtils.MS_PER_DAY;
	// }
	public getBuyNum(id): number
	{
		return this.m_shopDatas[id] || 0
	}
	public prase(data: Sproto.sc_advanced_info_request)
	{
		this.chargerReward = data.chargerReward
		this.dayChargeValue = data.dayCharger
		this.m_shopDatas = {};
		if (data.shop)
		{
			
			let i:number;
			let len:number = data.shop.length;
			for( i = 0 ; i < len ;i ++ )
			{
				this.m_shopDatas[data.shop[i].id] = data.shop[i].num
			}
		}	
		this.advancedReward_datas = {};
		if (data.advancedReward)
		{
			
			let i:number;
			let len:number = data.advancedReward.length;
			for( i = 0 ; i < len ;i ++ )
			{
				this.advancedReward_datas[data.advancedReward[i].typ] = data.advancedReward[i].reward
			}
		}
	}
	public updateShop(data: Sproto.advanced_shop[])
	{
		if (data)
		{		
			let i:number;
			let len:number = data.length;
			for( i = 0 ; i < len ;i ++ )
			{
				this.m_shopDatas[data[i].id] = data[i].num
			}
		}
	}
	public updateAdvancedReward(data: Sproto.advanced_data[])
	{
		if (data)
		{
			let i:number;
			let len:number = data.length;
			for( i = 0 ; i < len ;i ++ )
			{
				this.advancedReward_datas[data[i].typ] = data[i].reward
			}
		}
	}
}