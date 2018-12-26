
class PetModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0
	public static readonly INDEX_LEVEL = 1
	public static readonly INDEX_SKILL = 2
	public static readonly INDEX_BATTLE = 3
	public static readonly INDEX_ZIZHI = 4

	private m_ActiveList: {[key: number]: boolean} = {}
	private m_LevelList: {[key: number]: boolean} = {}
	private m_ZizhiList: {[key: number]: boolean} = {}
	private m_Model: PetModel

	constructor(model: PetModel) {
		super()
		this.m_Model = model
	}
	
	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[PetModelRedPoint.INDEX_ACT]: this.GetIndexAct,
			[PetModelRedPoint.INDEX_LEVEL]: this.GetIndexLevel,
			[PetModelRedPoint.INDEX_SKILL]: this.GetIndexSkill,
			[PetModelRedPoint.INDEX_BATTLE]: this.GetIndexBattle,
			[PetModelRedPoint.INDEX_ZIZHI]: this.GetIndexZizhi,
		}
	}

	public GetMessageDef(): string[] {
		return [MessageDef.BAG_PET_ACT_ITEM, MessageDef.PET_ACTIVE, MessageDef.PET_INIT_INFO,
			MessageDef.BAG_PET_LEVEL_ITEM,
			MessageDef.BAG_PET_SKILL_ITEM,
			MessageDef.PET_BATTLE,
		]
	}

	public OnChange(index: number): void {
		if (index == PetModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_PET_ACT_ITEM)
		} else {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_PET)
		}
	}

	private GetIndexLevel(): boolean {
		this.m_LevelList = {}
		let list = this.m_Model.mPetList
		for (let k in list) {
			let petInfo = list[k]
			if (petInfo.mLevel > 0 && petInfo.mLevel < this.m_Model.MAX_LEVEL) {
				let config = petInfo.GetLevelConfig()
				let upnum = Math.floor(config.proexp / config.exp)
				upnum = upnum - petInfo.mExp
				let enough = true
				for (let data of config.cost) {
					if (!Checker.Data({type: data.type, id: data.id, count: data.count * upnum}, false)) {
						enough = false	
						break
					}
				}
				if (enough) {
					this.m_LevelList[petInfo.mPetId] = true
				}
			}
		}
		for (let k in this.m_LevelList) {
			return true
		}
		return false
	}

	private GetIndexZizhi(): boolean {
		this.m_ZizhiList = {}
		let list = this.m_Model.mPetList
		for (let k in list) {
			let petInfo = list[k]
			if (petInfo.mLevel > 0 && petInfo.mZizhiLevel < this.m_Model.MAX_ZIZHI_LEVEL) {
				let config = GameGlobal.Config.petGiftproConfig[petInfo.mPetId][(petInfo.mZizhiLevel || 1) - 1]
				// let upnum = Math.floor(config.proexp / config.exp)
				// upnum = upnum - petInfo.mZizhiExp
				let upnum = 1
				let enough = true
				for (let data of config.cost) {
					if (!Checker.Data({type: data.type, id: data.id, count: data.count * upnum}, false)) {
						enough = false	
						break
					}
				}
				if (enough) {
					this.m_ZizhiList[petInfo.mPetId] = true
				}
			}
		}
		for (let k in this.m_ZizhiList) {
			return true
		}
		return false
	}

	private GetIndexBattle(): boolean {
		let emptyCount = 0
		for (let data of this.m_Model.mBattleList) {
			if (!data) {
				emptyCount++
			}
		}
		if (!emptyCount) {
			return false
		}
		let list = this.m_Model.mPetList
		for (let k in list) {
			let xianlvInfo = list[k]
			if (xianlvInfo.mLevel > 0 && !this.m_Model.HasBattle(xianlvInfo.mPetId)) {
				return true
			}
		}
		return false
	}

	private GetIndexSkill(): boolean {
		for (let data of GameGlobal.Config.petbaseConfig.freshitemid) {
			if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
				return true
			}
		}
		return false
	}

	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.m_ActiveList) {
			if (key) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.m_ActiveList = {}
		let config = GameGlobal.Config.petBiographyConfig
		for (let k in config) {
			if (this.m_Model.HasPet(parseInt(k))) {
				continue
			}
			let data = config[k].material
			if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
				this.m_ActiveList[k] = true
			}
		}
	}

	public IsRedAct(petId: number) {
		this.Get(PetModelRedPoint.INDEX_ACT)
		return this.m_ActiveList[petId]
	}

	public IsRedZizhi(petId: number) {
		return this.m_ZizhiList[petId] ? true : false
	}

	public IsRedLevel(petId: number) {
		return this.m_LevelList[petId] ? true : false
	}
}