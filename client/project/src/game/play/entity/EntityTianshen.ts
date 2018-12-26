class EntityTianshen  extends EntityData {
    public constructor() {
        super();
    }

	public parserBase(baseData: Sproto.entity_data) {
		super.parserBase(baseData)
        this.configID = baseData.shows.id
	}
    
    // public getSkillIDs() {
	// 	return this.skillsData
    // }
        
	GetBodyId(): number {
        return this.configID
    }

    public GetName(): string {
        let config = GameGlobal.Config.AirMarshalListConfig[this.configID]
        if (config) {
            return config.name || ""
        }
        return ""
    }
}