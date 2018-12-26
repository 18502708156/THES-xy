class MapRaidGangBattle extends CommonMapRaid {

	public mIsShowGuild: boolean = true

	public static GANG_BATTLE_TYPE_OUTSIDER = 100004
	public static GANG_BATTLE_TYPE_DRAGON = 100005
	public static GANG_BATTLE_TYPE_TEMPLE = 100006

	private view: any
	private mType: number 
	private mBossMap: {[key:number]: number} = {}

	public constructor(type) {
		super()

		this.mType = type
	}

	public Init() {
		super.Init()
		this.CreateBoss()
		this.CreateDragonGuard()
		GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_UPDATE_KINGINFO, this.SetKingBossHide, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.RemoveDragon, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GANGBATTLE_SHOW_GUARDTIP, this.CreateDragonGuard, this)

		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_TEAM_MAIN_INFO, this.DelayUpdateTeam, this)

		GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos()
	}

	// public TeamInfo() {
	// 	let data: {[key: number]: number[]} = GameGlobal.GangBattleTeamModel.GetAllTeam()
	// 	for (let key in data) {
	// 		let teamId = Number(key)
	// 		let memIds = data[key]
	// 		for (let actorId of memIds) {
	// 			this.UpdateEntityTeam(actorId, teamId)
	// 		}
	// 		this.UpdateTeamEntityList(teamId, memIds)	
	// 	}
	// }

	public OnEnter() {
		super.OnEnter()
		if (!this.view) {
			switch(this.mType)
			{
				case MapRaidGangBattle.GANG_BATTLE_TYPE_OUTSIDER:
					this.view = GBattleOutsiderScieneWin
				break
				case MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON:
					this.view = GBattleDragonScieneWin
				break 
				case MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE:
					this.view = GBattleTempleScieneWin
				break
			}
		}
		GameGlobal.ViewManagerImpl.Open(this.view)

		let panel = this.GetGameMapPanel()
		if (panel) {
			panel.showReturnBtn(false)
		}
		this.UpdateReborn()
	}

	public OnMapClick(localX: number, localY: number): boolean {
		GameGlobal.MessageCenter.dispatch(MessageDef.MOVE_UPDATE_INFO,localX,localY)
		return super.OnMapClick(localX, localY)
	}

	public CreateBoss() {
		if (this.mType == MapRaidGangBattle.GANG_BATTLE_TYPE_OUTSIDER)
		{
			let bossList = GangBattleConst.GetKingList()
			let idx = 1
			for (let bossConf of bossList)
			{
				let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(bossConf.bossid, (bossConf.pos[0]), (bossConf.pos[1]))
				entity.SetClick()

				let handle = entity.GetHandle()
				this.mBossMap[handle] =  bossConf.id
			}

			return
		}

		if (this.mType == MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE)
		{
			return
		}

		if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON))
		{
			return
		}
		
		let pos = GameGlobal.Config.GuildBattleBaseConfig.sboss_bronpos
		let monsterId = GameGlobal.Config.GuildBattleBaseConfig.sbossid
		let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, (pos[0]), (pos[1]))
		entity.SetClick()

		let handle = entity.GetHandle()
		this.mBossMap[handle] =  this.mType
	}

	public Create(entityData: EntityData): MapEntity {
		let entity = super.Create(entityData)
		if (entity) { 
			entity.SetClick();
		}
		return entity
	}

	public OnEntityClick(handle: number) {
		let bossId = this.mBossMap[handle]
		if (bossId)
		{
			if (bossId == MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE)
			{
				ViewManager.ins().open(GBattleDragonGuardWin)
				return
			}

			if (!GameGlobal.GangBattleModel.IsKingAlive(bossId))
			{
				UserTips.ins().showTips("BOSS未复活")
				return
			}
			
			if (bossId == MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON 
				&& GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON))
			{
				UserTips.ins().showTips("BOSS已经死亡")
				return
			}

			GameGlobal.GangBattleModel.SendAttackBoss(bossId)
			return
		}

		let entity = this.mEntityList[handle]
		if (entity.GetInfo().guildID ==  GameGlobal.actorModel.guildID)
		{
			UserTips.ins().showTips("不可攻击同帮会玩家")
			return
		}

		GameGlobal.GangBattleModel.SendAttackPlayer(handle)
	}

	public OnMoveLeval(orderId: number, handle: number, taget_x: number, taget_y: number) {
		let bossId = orderId
		if (GameGlobal.GangBattleModel.IsKingAlive(bossId))
		{
			GameGlobal.GangBattleModel.SendAttackBoss(bossId)	
		}
	}

	public SetKingBossHide() {
		for (let key in this.mBossMap)
		{
			let handle = parseInt(key)
			let bossId = this.mBossMap[handle]
			if (!GameGlobal.GangBattleModel.IsKingAlive(bossId))
			{
				this.RemoveEntity(handle)
				this.mBossMap[handle] = null
				let rebornTime  = GameGlobal.GangBattleModel.GetKingRebornDiffTime(bossId)
				TimerManager.ins().doTimer(rebornTime * 1000, 1, () => {
					let bossConf = GangBattleConst.GetKingConfig(bossId)
					let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(bossConf.bossid, (bossConf.pos[0]), (bossConf.pos[1]))
					entity.SetClick()

					let handle = entity.GetHandle()
					this.mBossMap[handle] =  bossConf.id
				}, this)
			}
		}
		
	}

	private RemoveDragon() {
		for (let key in this.mBossMap)
		{
			if (MapRaidGangBattle.GANG_BATTLE_TYPE_DRAGON == this.mBossMap[key] 
				&& GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON))
			{
				let handle = parseInt(key)
				this.RemoveEntity(handle)
				this.mBossMap[handle] = null

				break
			}
		}
	}

	private CreateDragonGuard() {
		if (this.mType != MapRaidGangBattle.GANG_BATTLE_TYPE_TEMPLE)
		{
			return
		}

		let showEndTime = GameGlobal.GangBattleModel.mGuardShowTime
        if (!showEndTime)
        {
            return
        }

		let durationTime = Math.max(showEndTime - GameServer.serverTime, 0)
		TimerManager.ins().doTimer(durationTime * 1000, 1, () => {
			let pos = GameGlobal.Config.GuildBattleBaseConfig.lboss_bronpos
			let monsterId = GameGlobal.Config.GuildBattleBaseConfig.lbossid
			let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, (pos[0]), (pos[1]))
			entity.SetClick()

			let handle = entity.GetHandle()
			this.mBossMap[handle] =  this.mType
		}, this)
	}

	private UpdateReborn() {
		let time = GameGlobal.GangBattleModel.GetRebornTime()
		if (time > 0) {
			this.ShowRebornView(time)
		} else {
			this.RemoveRebornView()
		}
	}

	/** 复活消耗 */
	protected GetRebornYb(): IRewardData {
		return GameGlobal.Config.GuildBattleBaseConfig.revivecost
	}

	/** 复活方法 */
	protected SendRelive(): void {
		GameGlobal.GangBattleModel.SendClearRebornCD()
	}

	public OnExit() {
		super.OnExit()
		GameGlobal.ViewManagerImpl.Close(this.view)
	}

	public Clear() {
		super.Clear()
		GameGlobal.MessageCenter.removeAll(this)
		TimerManager.ins().removeAll(this)

		GameGlobal.ViewManagerImpl.Destroy(this.view)
		this.view = null
	}

	protected GetTeamModel(): TeamBaseModel {
		return GameGlobal.GangBattleTeamModel
	}
}