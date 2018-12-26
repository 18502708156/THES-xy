class EntityData implements IBattleModel {

	public static default_skill_ids = [14001]

	public skillsData: number[] = [];
	public attributeData: number[] = [];

	protected _lv: number;
	public configID: number;
	
	public entityName: string;
	public serverId: number
	public guildName: string

	public sex: number = 0
    public job: number = 1;
	public type: EntityType;
	public handle: number;
	public masterHandle: number = 0
	public posIndex: number = 0
	public side: number = 0
	public x: number = 0
	public y: number = 0
	public dir: number;
	public scale: number = 1

	team: Team;

    guildID: number;

	public constructor() {
	}

	// 是否在战场下面
	public IsSide() {
		return this.side == 2
	}

	public parserBase(baseData: Sproto.entity_data) {
		this.serverId = 0
		this.scale = AppearanceConfig.GetScale(baseData.monid)
		this.type = baseData.type
		this.handle = baseData.handler
		this.configID = baseData.monid
		this.attributeData = baseData.attrs || []
		this.masterHandle = baseData.ownerid
		this.skillsData = baseData.skills || []
		if (baseData.shows) {
			let shows = baseData.shows
			this.entityName = shows.name
			this.serverId = shows.serverid || 0
			this.guildName = shows.guildname || ""
			this.guildID = shows.guildid || 0
		} else {
			this.entityName = ""
		}
	}

	public parserAtt(attrs: number[]) {
        this.attributeData = attrs
	}

	public getAtt(attType: AttributeType): number {
		return this.attributeData[attType] || 0;
	}

	public GetAttr(attType: AttributeType): number {
		return this.attributeData[attType] || 0;
	}

	public setAtt(attType: AttributeType, value: number): void {
		if (attType == AttributeType.atHp) {
			if (value < 0) {
				value = 0
			}
		}
		this.attributeData[attType] = value;
	}

	public GetName() {
		let config = GlobalConfig.ins().MonstersConfig[this.configID]
		if (config && config[GameGlobal.Config.MonstersConfig_keys.warname]) {
			return config[GameGlobal.Config.MonstersConfig_keys.name]
		}
		// 不显示名称
		return ""
	}

	// public get lv() {
	// 	let config = GlobalConfig.ins().MonstersConfig[this.configID]
	// 	if (config) {
	// 		return config[GameGlobal.Config.MonstersConfig_keys.level]
	// 	}
	// 	let data = UserFb.MonDict[this.configID]
	// 	if (data) {
	// 		return data.level
	// 	}
	// 	return 1
	// }

	public setPos(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public GetHeadImgName(): string {
		return ""
	}

	public GetHeadImgName2(): string {
		return ""
	}

    public GetSkillIDs() {
		if (this.skillsData && this.skillsData.length) {
			return this.skillsData
		}
        return EntityData.default_skill_ids
    }

	GetTitle(): number {return null}

	GetWeaponId(): number {return null}
	GetWingId(): number {return null}
	GetRideId(): number {return null}
	GetBodyId(): number {
		let config = GlobalConfig.ins().MonstersConfig[this.configID]
		if (config) {
			return config[GameGlobal.Config.MonstersConfig_keys.avatar] || 0
		}
		let data = UserFb.MonDict[this.configID]
		if (data) {
			return Number(data.avatar)
		}
		let chapterData = GameGlobal.RaidModel.mChapterData
		if (chapterData && chapterData.mondata) {
			let data = chapterData.mondata[this.configID]
			if (data) {
				return data.avatar || 0
			}
		}
		return 0
	}

	public GetBodyResPath() {
		return AppearanceConfig.GetAppe(this.GetBodyId())
	}

	public HasPlot(): string {
		let config = GlobalConfig.ins().MonstersConfig[this.configID]
		if (config) {
			return config[GameGlobal.Config.MonstersConfig_keys.talk]
		}
		let data = UserFb.MonDict[this.configID]
		if (data) {
			return data.talk
		}
		return null
	}
}