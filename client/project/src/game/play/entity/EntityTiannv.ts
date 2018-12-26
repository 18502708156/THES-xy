class EntityTiannv extends EntityData {
    public constructor() {
        super();
    }

	public mBodyId: number
    public mLq: number
    public mHua: number

	public parserBase(baseData: Sproto.entity_data) {
		super.parserBase(baseData)
         if(!baseData.shows.shows){
            return
        }
		this.mBodyId = baseData.shows.shows[0]
        if (baseData.shows && baseData.shows.shows) {
			this.mLq = UserTemplate.GetAppaId(GameGlobal.HavingLingqModel.SkinConfig, baseData.shows.shows[RoleShowDataType.TIANNV_LQ])
			this.mHua = UserTemplate.GetAppaId(GameGlobal.HavingHuanModel.SkinConfig, baseData.shows.shows[RoleShowDataType.TIANNV_HUA])
		}
	}
    
    public GetSkillIDs() {
		return this.skillsData
    }
        
	GetBodyId(): number {
        if (this.mBodyId) {
            let config = GameGlobal.Config.FemaleDevaSkinConfig[this.mBodyId]
            if (config) {
                return config.pid
            }
        }
        return 0 
    }

    public GetName(): string {
        return GameGlobal.Config.FemaleDevaBaseConfig.name || ""
    }
}