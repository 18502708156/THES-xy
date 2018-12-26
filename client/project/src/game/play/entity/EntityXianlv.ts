class EntityXianlv extends EntityData {

    public mFazId: number = 0
    public mXianwId: number = 0

    public constructor() {
        super();
    }

	public parserBase(baseData: Sproto.entity_data) {
		super.parserBase(baseData)
        this.configID = baseData.shows.id
        if (baseData.shows && baseData.shows.shows) {
			this.mFazId = UserTemplate.GetAppaId(GameGlobal.XianlvFzModel.SkinConfig, baseData.shows.shows[RoleShowDataType.XIANLV_FZ])
			this.mXianwId = UserTemplate.GetAppaId(GameGlobal.XianlvXwModel.SkinConfig, baseData.shows.shows[RoleShowDataType.XIANLV_XW])
		}
	}
    
    public GetSkillIDs() {
		return this.skillsData
    }
    
	GetBodyId(): number {
        return this.configID
    }
}