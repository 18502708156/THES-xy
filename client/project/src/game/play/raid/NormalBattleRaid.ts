class NormalBattleRaid extends BattleRaid {

	private battleMgr: BattleMgr
	// 测试
	public mIsManual = false

	public static POS_ARR = [8,3,7,9,6,10,2,4,1,5]

	constructor() {
		super()
		this.mMySide = 2
		this.battleMgr = new BattleMgr
	}

	protected ShowBattleLayer() {
		GameMap.GetBattleView().ShowDefault()
	}

	public Init() {
		super.Init()
		this.battleMgr.Init(this)
	}

	public OnEnter(): void {
		super.OnEnter()
		this.m_StartTime = this.m_StartTime >> 1
		this.battleMgr.OnEnter()
	}

	public OnExit(): void {
		super.OnExit()
		this.battleMgr.OnExit()
	}

	protected ClearEntityEffMgr() {
		GameGlobal.EntityEffMgr.Clear(false)
	}

	public Update(d: number): void {
		super.Update(d)
		this.battleMgr.Update(d)
	}

	public UseSkill(list: GameBattleManualData[]) {
		this.battleMgr.UseSkill(list)
	}

	// 一回合结束
	protected TurnFinish() {
		if (this.mIsManual) {
			this.battleMgr.TurnExecuteFinish()
		}
		super.TurnFinish()
	}

	public SetBattleData(): void {
		let list1 = []
		let config = GameGlobal.UserFb.config
		let len = MathUtils.limitInteger(config.minunm, config.maxnum)
		let monIndex = 0
		let monConfig = config.waveMonsterId
		// let indexArray = MathUtils.RandomArr(1, 10, len)
		let indexArray = NormalBattleRaid.POS_ARR

		let rate = GameGlobal.UserFb.guanqiaID > 100 ? 0.5 : 1
		for (let i = 0; i < len; i++) {
			let configData = monConfig[(monIndex++ % monConfig.length)]
			let entityData = MonstersConfig.CreateByData(configData.id, configData, rate)
			list1.push(entityData)
			entityData.posIndex = indexArray[i]
		}
		let list2 = []
		let entityRole = NormalBattleRaid.GetMyRole()
		if (!entityRole) {
			return
		}
		entityRole.posIndex = 8
		list2.push(entityRole)

		let entityPet = NormalBattleRaid.GetMyPet()
		if (entityPet) {
			entityPet.posIndex = 3
			list2.push(entityPet)
		}

		let entityLingtong = NormalBattleRaid.CreateLingtong()
		if (entityLingtong) {
			entityLingtong.posIndex = 2
			list2.push(entityLingtong)
		}

		for (let i = 0; i < 2; i++) {
			let entity = NormalBattleRaid.GetXianlv(i)
			if (entity) {
				entity.posIndex = i == 0 ? 7 : 9
				list2.push(entity)
			}
		}
		let tiannv = this.GetTiannv()
		if (tiannv) {
			tiannv.posIndex = 6
			list2.push(tiannv)	
		}
		let tianshen = NormalBattleRaid.GetTianshen()
		if (tianshen) {
			tianshen.posIndex = 10
			list2.push(tianshen)
		}

		for (let data of list2) {
			data.side = 2
		}

		let list = [list1, list2]
		super.SetBattleData(list)

		this.battleMgr.SetBattleData(list)
	}

	public static GetMyPet(): EntityPet {
		let id = GameGlobal.PetModel.GetShowId()
		if (!id) {
			return
		}
		let petInfo = GameGlobal.PetModel.GetPetInfo(id)
		let entity = new EntityPet
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Pet,
			handler: handle,
			monid: id,
			ownerid: GameGlobal.actorModel.actorID,
			// attrs: NormalBattleRaid.CopyAttr(petInfo.GetAttrs()),
			attrs: CommonUtils.copyDataHandler(SubRoles.ins().GetRoleData().attributeData),
			shows: {
				id: id,
				shows:[GameGlobal.PetTonglModel.mDressId, GameGlobal.PetShouhModel.mDressId]
			}
		} as Sproto.entity_data)
		return entity
	}

	public static CopyAttr(attr: AttributeData[]): number[] {
		let data = []
		for (let val of attr) {
			data[val.type] = val.value
		}
		for (let i = 0; i < AttributeType.atCount; i++) {
			if (!data[i]) {
				data[i] = 0
			}
		}
		data[AttributeType.atHp] = data[AttributeType.atMaxHp]
		return data
	}

	public static GetXianlv(index: number): EntityXianlv {
		let xianlvId = GameGlobal.XianlvModel.mBattleList[index]
		if (!xianlvId) {
			return
		}
		let info = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId)
		let entity = new EntityXianlv
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Xianlv,
			handler: handle,
			monid: xianlvId,
			ownerid: GameGlobal.actorModel.actorID,
			// attrs: NormalBattleRaid.CopyAttr(info.GetAttrs()),
			attrs: CommonUtils.copyDataHandler(SubRoles.ins().GetRoleData().attributeData),
			shows: {
				id: xianlvId,
				shows:[GameGlobal.XianlvFzModel.mDressId, GameGlobal.XianlvXwModel.mDressId]
			}
		} as Sproto.entity_data)
		entity.skillsData = [info.GetSkillId()]
		return entity
	}

	private GetTiannv(): EntityTiannv {
		if (!GameGlobal.HavingModel.IsDeblocking()) {
			return null
		}
		if (!GameGlobal.HavingModel.mLevel) {
			return null
		}
		let entity = new EntityTiannv
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Tiannv,
			handler: handle,
			monid: 0,
			ownerid: GameGlobal.actorModel.actorID,
			attrs: CommonUtils.copyDataHandler(SubRoles.ins().GetRoleData().attributeData),
			shows: {
				shows: [GameGlobal.HavingModel.mDressId, GameGlobal.HavingLingqModel.mDressId, GameGlobal.HavingHuanModel.mDressId]
			}
		} as Sproto.entity_data)
		entity.skillsData = GameGlobal.HavingModel.GetSkillIds()
		return entity
	}

	public static GetTianshen(): EntityTianshen {
		let battleId = GameGlobal.TianShenModel.mBattleID	
		if (!battleId) {
			return null
		}
		let info = GameGlobal.TianShenModel.mTianShenList[battleId]
		if (!info) {
			return null
		}
		let entity = new EntityTianshen
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Shenjiang,
			handler: handle,
			monid: battleId,
			ownerid: GameGlobal.actorModel.actorID,
			// attrs: this.CopyAttr(info.GetAttrs()),
			attrs: CommonUtils.copyDataHandler(SubRoles.ins().GetRoleData().attributeData),
			shows: {
				id: battleId
			}
		} as Sproto.entity_data)
		return entity
	}

	public static CreateLingtong(): EntityLingtong {
		if (!GameGlobal.LingtongAttrModel.IsActive()) {
			return null
		}
		let entity = new EntityLingtong
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Lingtong,
			handler: handle,
			monid: 0,
			ownerid: GameGlobal.actorModel.actorID,
			// attrs: NormalBattleRaid.CopyAttr(GameGlobal.LingtongModel.GetCurAttr()),
			attrs: CommonUtils.copyDataHandler(SubRoles.ins().GetRoleData().attributeData),
			shows: {
				id: GameGlobal.LingtongAttrModel.mSex,
			},
		} as Sproto.entity_data)
		entity.skillsData = CommonUtils.copyDataHandler(GameGlobal.LingtongAttrModel.GetCurSkill())
		return entity
	}

	public static GetMyRole(): EntityRole {
		let role = SubRoles.ins().GetRoleData()
		if (!role) {
			return null
		}
		let entityRole = new EntityRole
		let handle = GameGlobal.actorModel.actorID
		entityRole.parserBase({
			type: EntityType.Role,
			handler: handle,
			monid: 0,
			ownerid: GameGlobal.actorModel.actorID,
			attrs: CommonUtils.copyDataHandler(role.attributeData),
			shows: {
				name: GameGlobal.actorModel.name,
				shows: [GameGlobal.UserRide.mDressId, GameGlobal.UserWing.mDressId, GameGlobal.TianxModel.mDressId, GameGlobal.SwordModel.mDressId, GameGlobal.UserSkin.getWearId(), GameGlobal.UserTitle.getWearId()],
				job: role.job,
				sex: role.sex,
			},
		} as Sproto.entity_data)
		entityRole.skillsData = CommonUtils.copyDataHandler(role.GetCurSkillSortIds())
		
		return entityRole
	}
}