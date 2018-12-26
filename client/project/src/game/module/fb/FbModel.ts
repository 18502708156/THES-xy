class FbModel {

	fbID: number;
	/**当天通关次数 */
	useCount: number  = 0;
	/**当天购买次数 */
	vipBuyCount: number  = 0;
	/**总通关次数 */
	totalCount: number = 0
	/**开放等级 */
	levelLimit:number  = 0

	public parser(totalCount,useCount,buyNum) {
		this.useCount = useCount || 0
		this.vipBuyCount = buyNum || 0
		this.totalCount = totalCount  || 0;
	}

	// 挑战次数
	public getCount(): number {
		var config = GlobalConfig.ins().DailyFubenConfig[this.fbID];
		if (GameLogic.ins().actorModel.level < config.levelLimit)
			return 0;
		return GlobalConfig.ins().DailyFubenConfig[this.fbID].freeCount + this.vipBuyCount - this.useCount;

	};

	public GetUseCount() {
		return this.useCount
	}
	get personBossWeight(): number
	{
		if (GameGlobal.actorModel.level < this.levelLimit)
		{
			return this.fbID * 10000
		}	
		if (this.useCount > 0)
		{
			return this.fbID * 1000
		} 
		return this.fbID;
	}

}