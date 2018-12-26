class EntityRole extends EntityData {

    mBodyId: number
    mRideId: number
    mWingId: number
    mTianxianId: number
    mSwordId: number
    mTitle: number
    /**角色所有正在使用的皮肤集合  */
    skinDic: {[type: number]: number[]} = {};

    constructor() {
        super()
    }

    public parserBase(baseData: Sproto.entity_data) {
        super.parserBase(baseData)
        let show = baseData.shows.shows
        if(!show){
            return
        }
        this.mBodyId = show[RoleShowDataType.ROLE_SKIN] || 0
        this.mRideId = show[RoleShowDataType.ROLE_RIDE] || 0
        this.mWingId = show[RoleShowDataType.ROLE_WING] || 0
        this.mTianxianId = show[RoleShowDataType.ROLE_TIANXIAN] || 0
        this.mSwordId = show[RoleShowDataType.ROLE_SWORD] || 0
        this.mTitle = show[RoleShowDataType.ROLE_TITLE] || 0

        this.job = baseData.shows.job
        this.sex = baseData.shows.sex
    }
    
    /**
     * 角色使用的皮肤集合
     */
    public UpdateTemplateData(templateType: number, dressId: number, dressList: number[]) {
        switch (templateType) {
            case UserTemplate.TYPE_RIDE:
                this.mRideId = dressId;
                break;
            case UserTemplate.TYPE_WING:
                this.mWingId = dressId;
                break;
            case UserTemplate.TYPE_TIANX:
                this.mTianxianId = dressId;
                break;
            case UserTemplate.TYPE_SHENGB:
                this.mSwordId = dressId;
                break;
            default:
                // 其它的不需要更新
                return
        }
        this.skinDic[templateType] = dressList;

        GameGlobal.RaidMgr.UpdateRole()
    }

    public MergeData(data: EntityRole): EntityRole {
        this.type = data.type
        this.masterHandle = data.masterHandle;
        this.handle = data.handle;
        this.serverId = data.serverId
        this.guildName = data.guildName
        this.guildID = data.guildID
        if (data.x) {
            this.x = data.x;
        }
        if (data.y) {
            this.y = data.y;
        }
        return this
    }

    public GetSkillIDs() {
        return this.skillsData
    };

    public GetName(): string {
        return this.entityName
    }

    GetTitle(): number { 
        return this.mTitle || 0
    }

    GetWeaponId(): number {
        return RoleShowData.GetSwordAppId(this.mSwordId, this.job, this.sex)
    }

    GetWingId(): number {
        return RoleShowData.GetWingAppId(this.mWingId)
    }

    GetRideId(): number {
        return RoleShowData.GetRideAppId(this.mRideId)
    }

    GetBodyId(): number {
        return RoleShowData.GetBodyAppId(this.mBodyId, this.job, this.sex)
    }
    
	public GetBodyResPath() {
		return AppearanceConfig.GetAppe(this.GetBodyId(), this.job, this.sex)
	}

    public GetWeapontResPath() {
        return 
    }
}
