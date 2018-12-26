class EntityLingtong extends EntityData {
    public constructor() {
        super();
    }

	public mSex: number

	public parserBase(baseData: Sproto.entity_data) {
		super.parserBase(baseData)
		this.configID = this.mSex = baseData.shows.id
	}
    
    public GetSkillIDs() {
		return this.skillsData
    }
        
	GetBodyId(): number {
        if (this.mSex) {
            let config = GameGlobal.Config.BabySkinConfig[1]
            if (config) {
                return config.pid
            }
        }
        return 0 
    }

    public GetName(): string {
		let config = GameGlobal.Config.BabyActivationConfig[this.mSex]
		if (config) {
			return config.name
		}
		return ""
    }
    
	public GetBodyResPath() {
		return AppearanceConfig.GetAppe(this.GetBodyId(), 1, this.mSex - 1)
	}
}