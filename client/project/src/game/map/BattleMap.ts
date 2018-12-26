class BattleMap {
	public static mOldFbId: number
	public static mOldFbType: number
	
	public static mFbId: number
	public static mFbType: number
	public static mFbName: string
	public static mFbDesc: string 
	public static mMapId: number

	public static Parse(data: BattleMapData) {
		this.mOldFbId = this.mFbId
		this.mOldFbType = this.mFbType

		this.mFbId = data.mFbId
		this.mFbType = data.mFbType
		this.mFbName = data.mFbName
		this.mFbDesc = data.mFbDesc
		this.mMapId = data.mMapId
	}

	/*
	 *	退出战斗清理数据
	 *	是否从战斗副本退出
	 */
	public static Exit(): boolean {
		this.mOldFbId = this.mFbId
		this.mOldFbType = this.mFbType
		
		this.mFbId = 0
		this.mFbType = 0
		this.mFbName = ""
		this.mFbDesc = ""
		this.mMapId = 0

		return this.mOldFbType ? true : false
	}

    public static IsNoramlLevel(): boolean {
        return this.mFbId == 0
    }

	public static IsCangBaoTu() {
        return this.mFbType == UserFb.FB_TYPE_TREASURE
    }
	
    public static IsGuanQiaBoss(): boolean {
        return this.mFbType == UserFb.FB_TYPE_GUANQIABOSS
    }

    public static IsFieldBoss(): boolean {
        return this.mFbType == UserFb.FB_TYPE_FIELD_BOSS
    }

    public static IsPersonalBoss(): boolean {
        return this.mFbType == UserFb.FB_TYPE_PERSONAL_BOSS
    }

    public static IsPublicBoss(): boolean { 
        return this.mFbType == UserFb.FB_TYPE_PUBLIC_BOSS
    }

}
