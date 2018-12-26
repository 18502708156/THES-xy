class CatchPetRaid extends BattleRaid {
	
	// 不显示血条
	protected mNotShowBlood: boolean = true

	constructor() {
		super()
	}

	public list1 = []
	public list2 = []

	public FinishBattle() {
		GameGlobal.RaidMgr.EnterCurMapRaid()
	}

	public SetBattleData(): void {
		let list1 = []
		let CatchPet = this.GetCatchPet(GameGlobal.CatchPetModel.monsterid);
		if (CatchPet) {
			CatchPet.posIndex = 8
			list1.push(CatchPet)
		}

		let list2 = []
		let entityRole = CatchPetRaid.GetMyRole()
		entityRole.posIndex = 8
		list2.push(entityRole)

		let entityPet = NormalBattleRaid.GetMyPet()
		if (entityPet) {
			entityPet.posIndex = 3
			list2.push(entityPet)
		}

		for (let i = 0; i < 2; i++) {
			let entity = NormalBattleRaid.GetXianlv(i)
			if (entity) {
				entity.posIndex = i == 0 ? 7 : 9
				list2.push(entity)
			}
		}

		for (let data of list2) {
			data.side = 2
		}

		let list = [list1, list2]
		this.list1 = list1;
		this.list2 = list2;
		super.SetBattleData(list)
	}

	private GetCatchPet(PetId): EntityPet {
		let id = PetId
		if (!id) {
			return
		}
		let petInfo = GameGlobal.PetModel.GetPetInfo(PetId)
		let entity = new EntityPet
		let handle = MonstersConfig.GetHandle()
		entity.parserBase({
			type: EntityType.Pet,
			handler: handle,
			monid: id,
			ownerid: GameGlobal.actorModel.actorID,
			attrs: NormalBattleRaid.CopyAttr(petInfo.GetAttrs()),
			shows: {
				id: id
			}
		} as Sproto.entity_data)
		return entity
	}

	public static GetMyRole(): EntityRole {
		let entityRole = NormalBattleRaid.GetMyRole()
		if (entityRole) {
			entityRole.skillsData = [99001]  //个人技能ID 
		}
		return entityRole
	}

	public CreatSkill() {
		let view = ViewManager.ins().getView(GameCatchPanel) as GameCatchPanel
		if (view) {
			view.Catch()
		}
		if (!this.list1[0] || !this.list2[0]) {
			return []
		}
		let entityData = this.list2[0]
		let petData = this.list1[0]
		let ids = entityData.GetSkillIDs()[0]
		if (!ids) {
			return []
		}
		let skill = new CatchPetSUnitSkill(ids, entityData.handle)
		skill.Init()
		return [skill.Use([petData.handle])]
	}

	protected OpenBattlePanel(): BaseEuiView {
		return ViewManager.ins().open(GameCatchPanel)
	}
}