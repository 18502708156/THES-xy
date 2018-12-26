class IBossInfo
{
	public id: number;
	public level: number
	public status: number

	public GetConfig(): any { }

}	
class FieldBossInfo implements  IBossInfo{
	id: number;
	hp: number;
	level: number

	ownerId: number = 0
    ownerName: string
    ownerHeadId: number
    ownerGuildName: string
	leftTime: number
	ischallenge:boolean

	// 精英boss
	public status: number = 3 // 1 已开放 2 逃跑 3 已击杀  4 已关闭


	get isDie() {
        return this.status == FieldBossState.DEAD
	}

    public IsClose(): boolean {
        return this.status == FieldBossState.CLOSE
    }

	public GetConfig():any {
		return GameGlobal.Config.FieldBossConfig[this.id];
	}

	public GetState(): FieldBossState {
		if (GameGlobal.BossModel.IsChallengeTime()) {
			if (this.status == FieldBossState.DEAD) {
				return FieldBossState.DEAD
			}
			return FieldBossState.OPEN
		}
		return FieldBossState.CLOSE
	}

	public parser(data: Sproto.field_boss_info) {
		if (this.id != data.id)
		{
			return
		}	
		this.hp = data.hp
		this.status = data.status
		this.ownerId = data.ownerId
		this.ownerName = data.ownerName
		this.ownerHeadId = parseInt(data.ownerJob + "" + data.ownerSex)
		// this.ownerSex = data.ownerSex
		// this.ownerJob = data.ownerJob
		this.leftTime = data.time
	}
	get Weight(): number
	{
		if (GameGlobal.actorModel.level < this.level)
		{
			return this.id * 10000
		}	
		if (this.status == FieldBossState.DEAD)
		{
			return this.id * 1000
		} 
		return this.id;
	}
}

enum FieldBossState {
    OPEN = 1,
    RUN = 2,
    DEAD = 3,
	CLOSE = 4,
}