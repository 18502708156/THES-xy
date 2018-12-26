class EntityPet extends EntityData {
    public constructor() {
        super();
    }

	public mTlId: number = 0
	public mShId: number = 0

	public parserBase(baseData: Sproto.entity_data) {
		super.parserBase(baseData)
        this.configID = baseData.shows.id
		if (baseData.shows && baseData.shows.shows) {
			this.mTlId = UserTemplate.GetAppaId(GameGlobal.PetTonglModel.SkinConfig, baseData.shows.shows[RoleShowDataType.PET_TL])
			this.mShId = UserTemplate.GetAppaId(GameGlobal.PetShouhModel.SkinConfig, baseData.shows.shows[RoleShowDataType.PET_SH])
		}
	}
    
    public GetSkillIDs() {
		let config = GameGlobal.Config.petBiographyConfig[this.configID]
		if (config) {
			return config.skill
		}
		return super.GetSkillIDs()
    }
        
	GetBodyId(): number {
        return this.configID
    }

    public GetName(): string {
        return this.entityName || ""
    }
}