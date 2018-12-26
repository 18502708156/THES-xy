class NormalMapRaid extends MapRaid {

	public constructor() {
		super()
	}

	private static REFRESH_TIME: number = 8000

	// 挂机场景退出的时间
	private m_ExitTime: number = 0
	// 进入战斗的检查时间
	private m_CheckTime: number = 1

	private mCreateFlag: number = 0
	private mCreateOther: number = 1500

	private mCreateCount: number = 4

	//师门怪物
	private mMonsterMap: { [key: number]: number } = {}
	private mMonsterPosMap: { [key: number]: number } = {}

	private mRefMonDatas: string[] = []

	public Init() {
		super.Init()

		GameGlobal.MessageCenter.addListener(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.UpdateMonsterInfo, this)
		this.UpdateMonsterInfo()

		this.mCreateFlag = 0
		this.mCreateCount = GameGlobal.UserFb.guanqiaID <= 50 ? 6 : 4

		try {
			let config = GameGlobal.UserFb.config.waveMonsterId
			for (let data of config) {
				let str = ResDataPath.GetMoviePath(AppearanceConfig.GetAppe(data.avatar))
				EntityMovieObject.Ref(str)
				this.mRefMonDatas.push(str)
			}
		} catch (e) {
			console.error(e)
		}
	}

	protected AddToMap(entity: MapEntity) {
		this.GetMapEntityView().AddEntity(entity)
	}

	public GetSceneId(): number {
		return GameGlobal.UserFb.config.sid
	}

	// 下一次进入战斗的时间
	private GetNextTime(): number {
		let interval = 15
		let config = GameGlobal.Config.ScenesConfig[this.GetSceneId()]
		if (config && config.interval) {
			interval = config.interval || 15
		}
		// if ((GameGlobal.UserFb.guanqiaID || 0) <= 30) {
		// 	return NormalMapRaid.REFRESH_TIME
		// }
		return Math.max((this.m_ExitTime + interval) - GameServer.serverTime, 5) * 1000
	}

	public Update(delta: number): void {
		super.Update(delta)
		if (this.m_CheckTime > 0) {
			if ((this.m_CheckTime -= delta) <= 0) {
				this.InnerEnterBattle()
			}
		}
		if (this.mCreateFlag < this.mCreateCount) {
			if (this.mCreateFlag == 0) {
				this.mCreateFlag++
				this.CreateMyRole()
			} else {
				if (this.mCreateOther > 0) {
					if ((this.mCreateOther -= delta) <= 0) {
						this.mCreateFlag++
						this.CreateOtherRole()
						this.mCreateOther = 1500
					}
				}
			}
		}
	}

	public CreateEntity(entityData: EntityData): MapEntity {
		console.log("normal map create entity !!!")
		return null
	}

	public OnEnter() {
		super.OnEnter()
		
		this.m_CheckTime = this.GetNextTime()
	}

	public OnExit() {
		super.OnExit()
		this.m_ExitTime = GameServer.serverTime
	}

	public Clear() {
		super.Clear()
		this.m_ExitTime = 0
		this.mCreateFlag = 0
		this.mCreateOther = 1000

		for (let data of this.mRefMonDatas) {
			EntityMovieObject.Unref(data)
		}
		this.mRefMonDatas = []
	}

	private CreateMyRole(): void {
		let list = []
		let entityRole = NormalBattleRaid.GetMyRole()
		if (entityRole) {
			let sceneConfig = GameGlobal.Config.ScenesConfig[this.GetSceneId()]
			if (sceneConfig) {
				entityRole.x = Const.PosToPixel(sceneConfig.enterX)
				entityRole.y = Const.PosToPixel(sceneConfig.enterY)
			}
			list.push(entityRole)
		} else {
			return
		}
		if (GameGlobal.PetModel.GetShowId()) {
			list.push(this.CreatePet(GameGlobal.PetModel.GetShowId(), entityRole.handle))
		}
		let xianlvId = GameGlobal.XianlvModel.GetXianlvId()
		if (xianlvId) {
			list.push(this.CreateXianlv(xianlvId, entityRole.handle))
		}
		if (GameGlobal.HavingModel.IsDeblocking()) {
			let tiannvId = GameGlobal.HavingModel.mDressId
			if (tiannvId) {
				list.push(this.CreateTiannv(GameGlobal.HavingModel.mDressId, entityRole.handle))
			}
		}
		let tianshen = NormalBattleRaid.GetTianshen()
		if (tianshen) {
			list.push(tianshen)
		}
		this.AddTeam(GameGlobal.actorModel.actorID, list)
	}

	private GetRobotPid(model: UserTemplate, poolList: number[]) {
		let id
		if (poolList && poolList.length >= 2) {
			id = poolList[MathUtils.limitInteger(0, poolList.length - 1)]
		}
		if (id != null) {
			id = Math.min(0 + MathUtils.limitInteger(0, model.mLevel), model.mLevel)
			if (poolList && poolList.indexOf(id) == -1) {
				poolList.push(id)
			}
		}
		return id
	}

	private m_ShowRidePids: number[] = []
	private m_ShowWingPids: number[] = []
	private m_ShowTianxPids: number[] = []
	private m_ShowSwordPids: number[] = []
	private m_ShowPids: number[] = []

	public CreateOtherRole() {
		let list = []
		let role = SubRoles.ins().GetRoleData()
		let job = MathUtils.limitInteger(1, 3)
		let entityRole = new EntityRole
		let aId = MonstersConfig.GetHandle()

		let isMul = this.mCreateCount > 4

		let ridePid = this.GetRobotPid(GameGlobal.UserRide, this.m_ShowRidePids)
		let wingPid = this.GetRobotPid(GameGlobal.UserWing, this.m_ShowWingPids)
		let tianxPid = this.GetRobotPid(GameGlobal.TianxModel, this.m_ShowTianxPids)
		let swordPid = this.GetRobotPid(GameGlobal.SwordModel, this.m_ShowSwordPids)
	
		// 没有坐骑的时候只显示默认
		if (!ridePid) {
			swordPid = 0
			wingPid = 0
		}

		let titlePid
		let ownerList = GameGlobal.UserTitle.getOwnList()
		if (ownerList && ownerList.length) {
			let data = ownerList[MathUtils.limit(0, ownerList.length - 1)]
			if (data) {
				titlePid = data.id
			}
		}
		if (!titlePid) {
			titlePid = 0
		}

		let config = GameGlobal.Config.RobotNameConfig[GameGlobal.actorModel.sex][MathUtils.limitInteger(0, 49)]

		entityRole.parserBase({
			type: EntityType.Role,
			handler: aId,
			monid: 0,
			ownerid: aId,
			attrs: [],
			shows: {
				name: config ? config.name : "",
				shows: [ridePid, wingPid, tianxPid, swordPid, 0, titlePid],
				job: job,
				sex: MathUtils.limitInteger(0, 1),
			},
		} as Sproto.entity_data)
		entityRole.skillsData = []
		list.push(entityRole)

		if (this.m_ShowPids.length >= 3) {
			list.push(this.CreateOtherPet(this.m_ShowPids[MathUtils.limitInteger(0, this.m_ShowPids.length - 1)], aId))
		} else {
			let petId = this.getRamNum(this.petArry())
			if (petId) {
				if (this.m_ShowPids.indexOf(petId) == -1) {
					this.m_ShowPids.push(petId)
				}
				list.push(this.CreateOtherPet(petId, aId))
			}
		}
		
		if (this.mCreateFlag <= 4) {
			let xlData = this.getRamNum(this.xlArry())
			if (xlData) {
				list.push(this.CreateOtherXianlv(xlData, aId))
			}
		}
		this.AddTeam(aId, list)
	}

	private petArry() {
		let Config = GameGlobal.Config.petBiographyConfig
		let list = []
		let datas = GameGlobal.PetModel.mPetList
		for (let data in datas) {
			if (datas[Number(data)].mLevel > 0 && Config[Number(data)].type < 2) {
				list.push(Number(data))
			}
		}
		return list
	}

	private xlArry() {
		let Config = GameGlobal.Config.partnerBiographyConfig
		let list = []
		let datas = GameGlobal.XianlvModel.mXianlvList
		for (let data in datas) {
			if (datas[Number(data)].mLevel > 0 && Config[Number(data)].quality < 5) {
				list.push(Number(data))
			}
		}
		return list
	}

	private getRamNum(list) {
		let arry = list
		return arry[Math.floor(Math.random() * arry.length)]
	}

	private CreateOtherXianlv(xianlvId: number, masterHandle: number): EntityXianlv {
		let entity = new EntityXianlv
		let xwPid = this.GetRobotPid(GameGlobal.XianlvXwModel, null)
		let fzPid = this.GetRobotPid(GameGlobal.XianlvFzModel, null)
		entity.parserBase({
			type: EntityType.Xianlv,
			handler: MonstersConfig.GetHandle(),
			ownerid: masterHandle,
			shows: {
				id: xianlvId,
				shows: [fzPid, xwPid]
			}
		} as Sproto.entity_data)
		return entity
	}

	private CreateOtherPet(petId: number, masterHandle: number): EntityPet {
		let petModel = new EntityPet
		petModel.parserBase({
			type: EntityType.Pet,
			handler: MonstersConfig.GetHandle(),
			ownerid: masterHandle,
			shows: {
				id: petId,
			}
		} as Sproto.entity_data)
		return petModel
	}

	protected CreateTeam(): MoveTeam {
		return new NormalMoveTeam
	}

	public InnerEnterBattle(): void {
		if (GameGlobal.UserFb.CheckAutoPKBoss()) {
			return
		}
		if (!SubRoles.ins().GetRoleData()) {
			return
		}
		GameGlobal.RaidMgr.EnterNormalBattle()
	}

	private CreatePet(petId: number, masterHandle: number): EntityPet {
		let petModel = new EntityPet
		petModel.parserBase({
			type: EntityType.Pet,
			handler: MonstersConfig.GetHandle(),
			ownerid: masterHandle,
			shows: {
				id: petId,
				shows: [GameGlobal.PetTonglModel.mDressId, GameGlobal.PetShouhModel.mDressId]
			}
		} as Sproto.entity_data)
		return petModel
	}

	private CreateXianlv(xianlvId: number, masterHandle: number): EntityXianlv {
		let entity = new EntityXianlv
		entity.parserBase({
			type: EntityType.Xianlv,
			handler: MonstersConfig.GetHandle(),
			ownerid: masterHandle,
			shows: {
				id: xianlvId,
				shows: [GameGlobal.XianlvFzModel.mDressId, GameGlobal.XianlvXwModel.mDressId]
			}
		} as Sproto.entity_data)
		return entity
	}

	private CreateTiannv(tiannvId: number, masterHandle: number): EntityTiannv {
		let entity = new EntityTiannv
		entity.parserBase({
			type: EntityType.Tiannv,
			handler: MonstersConfig.GetHandle(),
			ownerid: masterHandle,
			shows: {
				shows: [tiannvId, GameGlobal.HavingLingqModel.mDressId, GameGlobal.HavingHuanModel.mDressId]
			}
		} as Sproto.entity_data)
		return entity
	}

	private GetOwnEntity(entityType: EntityType): MapEntity {
		let roleHandle = SubRoles.ins().GetRoleData().handle
		let actHandle = GameGlobal.actorModel.actorID
		for (let key in this.mEntityList) {
			let data = this.mEntityList[key]
			let info = data.GetInfo()
			if (info.type == entityType && info.masterHandle) {
				let role = this.mEntityList[info.masterHandle]
				if (role) {
					let handle = role.GetHandle()
					if (handle == roleHandle || handle == actHandle) {
						return data
					}
				}
			}
		}
		return null
	}

	public UpdateRolePet(petId: number) {
		if (!this.IsCreateMy()) {
			return
		}
		let handle = SubRoles.ins().GetRoleData().handle
		let petData: MapEntity = this.GetOwnEntity(EntityType.Pet)
		if (petData) {
			if (petId) {
				petData.GetInfo().configID = petId
				petData.UpdateInfo()
			} else {
				this.RemoveEntity(petData.GetHandle())
			}
		} else {
			if (petId) {
				this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreatePet(petId, handle))
			}
		}
	}

	public UpdateRolePetTongl(id: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Pet)
		if (petData) {
			(petData.GetInfo() as EntityPet).mTlId = UserTemplate.GetAppaId(GameGlobal.PetTonglModel.SkinConfig, id) 
			petData.UpdateInfo()
		}
	}

	public UpdateRolePetShouh(id: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Pet)
		if (petData) {
			(petData.GetInfo() as EntityPet).mShId = UserTemplate.GetAppaId(GameGlobal.PetShouhModel.SkinConfig, id) 
			petData.UpdateInfo()
		}
	}

	public UpdateRoleXianlv(xianlvId: number) {
		let handle = SubRoles.ins().GetRoleData().handle
		let petData: MapEntity = this.GetOwnEntity(EntityType.Xianlv)
		if (petData) {
			if (xianlvId) {
				petData.GetInfo().configID = xianlvId
				petData.UpdateInfo()
			} else {
				this.RemoveEntity(petData.GetHandle())
			}
		} else {
			if (xianlvId) {
				this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreateXianlv(xianlvId, handle))
			}
		}
	}
	
	public UpdateRoleXianlvFz(xwId: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Xianlv)
		if (petData) {
			(petData.GetInfo() as EntityXianlv).mFazId = UserTemplate.GetAppaId(GameGlobal.XianlvFzModel.SkinConfig, xwId) 
			petData.UpdateInfo()
		}
	}

	public UpdateRoleXianlvXw(xwId: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Xianlv)
		if (petData) {
			(petData.GetInfo() as EntityXianlv).mXianwId = UserTemplate.GetAppaId(GameGlobal.XianlvXwModel.SkinConfig, xwId) 
			petData.UpdateInfo()
		}
	}

	public UpdateRoleTiannv() {
		if (!this.IsCreateMy()) {
			return
		}
		let handle = SubRoles.ins().GetRoleData().handle
		let petData: MapEntity = this.GetOwnEntity(EntityType.Tiannv)
		if (petData) {
			// if (shengj) {
			// 	petData.GetInfo().configID = shengj
			// 	petData.UpdateInfo()
			// } else {
			// 	this.RemoveEntityByOwnHandle(GameGlobal.actorModel.actorID, petData.GetHandle())
			// }
			console.log("not imple create UpdateRoleTiannv")
		} else {
			let tiannvId = GameGlobal.HavingModel.mDressId
				if (tiannvId) {
					this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, this.CreateTiannv(GameGlobal.HavingModel.mDressId, handle))
				}
		}
	}

	private IsCreateMy() {
		return this.mEntityList[SubRoles.ins().GetRoleData().handle] != null
	}

	public UpdateRoleTiannvLq(xwId: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Tiannv)
		if (petData) {
			(petData.GetInfo() as EntityTiannv).mLq = UserTemplate.GetAppaId(GameGlobal.HavingLingqModel.SkinConfig, xwId) 
			petData.UpdateInfo()
		}
	}

	public UpdateRoleTiannvHua(xwId: number) {
		let petData: MapEntity = this.GetOwnEntity(EntityType.Tiannv)
		if (petData) {
			(petData.GetInfo() as EntityTiannv).mHua = UserTemplate.GetAppaId(GameGlobal.HavingHuanModel.SkinConfig, xwId) 
			petData.UpdateInfo()
		}
	}
	
	public UpdateRoleTianshen(shengj: number) {
		let handle = SubRoles.ins().GetRoleData().handle
		let petData: MapEntity = this.GetOwnEntity(EntityType.Shenjiang)
		if (petData) {
			if (shengj) {
				petData.GetInfo().configID = shengj
				petData.UpdateInfo()
			} else {
				this.RemoveEntity(petData.GetHandle())
			}
		} else {
			if (shengj) {
				this.AddEntityToTeamByHandle(GameGlobal.actorModel.actorID, NormalBattleRaid.GetTianshen())
			}
		}
	}

	public UpdateMonsterInfo() {
		this._ResetMapEntity()

		let monsterList = GameGlobal.DailyModel.GetMonsterList()
		for (let monsterId of monsterList) {
			this.CreateMyMonster(monsterId)
		}

	}

	public CreateMyMonster(monsterId, pos?) {
		if (!pos) {
			pos = this._GetRandomPos()
		}

		let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(monsterId, Const.PosToPixel(pos.x), Const.PosToPixel(pos.y))
		entity.SetClick(false)
		let handle = entity.GetHandle()
		this.mMonsterMap[handle] = monsterId
		let key = `${pos.x}_${pos.y}`
		this.mMonsterPosMap[key] = handle
	}

	private _GetRandomPos() {
		let pos: egret.Point = new egret.Point

		while (true) {
			let centerX = Math.floor(GameMap.COL / 2)
			let centerY = Math.floor(GameMap.ROW / 2)
			GameMap.GetRandomPos(centerX, centerY, centerX - 2, centerY - 2, pos)
			let key = `${pos.x}_${pos.y}`
			if (!this.mMonsterPosMap[key]) {
				return pos
			}
		}
	}

	public OnEntityClick(handle: number) {
		let monsterId = this.mMonsterMap[handle]
		let taskIndex = GameGlobal.DailyModel.GetTaskIndex(monsterId)

		if (taskIndex == -1) {
			return
		}
		ViewManager.ins().open(DailyFomalhautTaskPanel, taskIndex)
	}

	private _ResetMapEntity() {
		for (let key in this.mMonsterMap) {
			let handle = parseInt(key)
			this.RemoveEntity(handle)
		}

		this.mMonsterMap = {}
		this.mMonsterPosMap = {}
	}
}