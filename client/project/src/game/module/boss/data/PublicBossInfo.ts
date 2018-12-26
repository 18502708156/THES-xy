class PublicBossInfo extends IBossInfo{
	id: number;
	hp: number;
	level: number
	/**争夺人数 */
	fightnum: number = 0;

	// leftTime: number

	/**已经复活次数*/	
	replyTimes: number = 0;
	public isKill: number
	/**复活时间 */
	reborntime:number


	public parser(data: Sproto.public_boss_info) {
		if (this.id != data.id)
		{
			return
		}	
		this.hp = data.hp
		this.isKill = data.iskill ? 1 : 0
		this.status = FieldBossState.OPEN
		this.reborntime = data.reborntime
		this.fightnum = data.fightnum;
	}
	
	public GetConfig():any {
		return GameGlobal.Config.PublicBossConfig[this.id];
	}


	get isDie() {
        return this.isKill == 1
	}
	// isOpen(): number
	// {
	// 	return GameGlobal.actorModel.level >= this.level?1:0
	// }
	get Weight(): number
	{
		if (GameGlobal.actorModel.level < this.level)
		{
			return this.id * 100000
		}	
		if (this.isKill)
		{
			return this.id * 10000
		} 
		return 1000 - this.id;
	}

    // public IsClose(): boolean {
    //     return this.status == 2
    // }
}