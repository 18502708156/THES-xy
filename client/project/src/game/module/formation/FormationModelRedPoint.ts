
class FormationModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0
	public static readonly INDEX_LEVEL = 1
	public static readonly INDEX_SOUL = 2
	public static readonly INDEX_SKILL = 3
	public static readonly INDEX_DRUG = 4

	private mActiveMap: {[key: number]: boolean} = {}
	private mLevelMap: {[key: number]: boolean} = {}
	private mSoulMap: {[key: number]: boolean} = {}
	private mSkillMap: {[key: number]: boolean} = {}
	private mDrug: boolean
	private mModel: FormationModel

	constructor(model: FormationModel) {
		super()
		this.mModel = model
	}
	
	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[FormationModelRedPoint.INDEX_ACT]: this.GetIndexAct,
			[FormationModelRedPoint.INDEX_LEVEL]: this.GetIndexLevel,
			[FormationModelRedPoint.INDEX_SOUL]: this.GetIndexSoul,
			[FormationModelRedPoint.INDEX_SKILL]: this.GetIndexSkill,
			[FormationModelRedPoint.INDEX_DRUG]: this.GetIndexDrug,
		}
	}

	public GetMessageDef(): string[] {
		return [MessageDef.FORMATION_ACTIVE, MessageDef.FORMATION_UPDATE_INFO,
				MessageDef.FORMATION_UPDATE_EXP, MessageDef.FORMATION_UPDATE_SOUL_EXP,
				MessageDef.FORMATION_USE_DRUG, MessageDef.FORMATION_UPDATE_SKILL_INFO]
	}

	public OnChange(index: number): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_ALL_NOTICE)
	}

	private GetIndexLevel(): boolean {
		this.mLevelMap = {}
		for (let key in GameGlobal.Config.FormationListConfig)
		{
			let formationId = parseInt(key)
			if (this.mModel.IsMaxLv(formationId))
				continue

			if (this.mModel.HasFormation(formationId) && this.mModel.CanFormationUpgrade(formationId))
				this.mLevelMap[formationId] = true
		}

		for (let key in this.mLevelMap)
			return true

		return false
	}

	private GetIndexSoul(): boolean {
		this.mSoulMap = {}
		for (let key in GameGlobal.Config.FormationListConfig)
		{
			let formationId = parseInt(key)
			if (this.mModel.IsMaxSoulLv(formationId))
				continue

			if (this.mModel.HasFormation(formationId) && this.mModel.CanFormationSoulUpgrade(formationId))
				this.mSoulMap[formationId] = true
		}

		for (let key in this.mSoulMap)
			return true

		return false
	}

	private GetIndexSkill(): boolean {
		this.mSkillMap = {}
		for (let key in GameGlobal.Config.FormationListConfig)
		{
			let formationId = parseInt(key)
			if (!FormationConst.HasBuffSkill(formationId))
				continue

			let skillId = FormationConst.GetSkillId(formationId)
			if (FormationConst.IsMaxSkillLv(skillId))
				continue

			if (this.mModel.HasFormation(formationId) && this.mModel.CanSkillUpgrade(skillId))
				this.mSkillMap[formationId] = true
		}

		for (let key in this.mSkillMap)
			return true

		return false
	}

	private GetIndexDrug(): boolean {
		let drugId = GameGlobal.Config.FormationBaseConfig.attreitemid
		this.mDrug =  GameGlobal.UserBag.GetCount(drugId) > 0
		return this.mDrug
	}

	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mActiveMap) {
			return true
		}

		return false
	}

	private DoActive() {
		this.mActiveMap = {}
		for (let key in GameGlobal.Config.FormationListConfig)
		{
			let formationId = parseInt(key)
			if (this.mModel.HasFormation(formationId))
				continue

			let config = GameGlobal.Config.FormationListConfig[formationId]
			if (GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count)
				this.mActiveMap[formationId] = true
		}
	}

	public IsRedAct(formationId: number) {
		this.Get(FormationModelRedPoint.INDEX_ACT)
		return this.mActiveMap[formationId] == true
	}

	public IsRedLevel(formationId: number) {
		this.Get(FormationModelRedPoint.INDEX_LEVEL)
		return this.mLevelMap[formationId] == true
	}

	public IsRedSoul(formationId: number) {
		this.Get(FormationModelRedPoint.INDEX_SOUL)
		return this.mSoulMap[formationId] == true
	}

	public IsRedSkill(formationId: number) {
		this.Get(FormationModelRedPoint.INDEX_SKILL)
		return this.mSkillMap[formationId] == true
	}

	public IsRedDrug(formationId: number) {
		this.Get(FormationModelRedPoint.INDEX_DRUG)
		return this.mDrug
	}
}