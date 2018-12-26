class XianlvInfo {
	public mXianlvId
	public mExp = 0
	public mLevel = 0
	public mStar = 0
	public mPower = 0

	public UpdateInfo(rsp: Sproto.xianlv_info) {
		this.mExp = rsp.exp
		this.mLevel = rsp.level
		this.mStar = rsp.star
	}

	public Active() {
		this.mLevel = 1
		this.mStar = 1
	}

	public GetLevelConfig(level?) {
		let lv = level != null ? level : this.mLevel
		let xianlvConfig = GameGlobal.Config.partnerBiographyConfig[this.mXianlvId]
		let config = GameGlobal.Config.partnerLvproConfig[xianlvConfig.quality][lv - 1]
		return config
	}

	public GetGradeConfig(level?) {
		let lv = level != null ? level : this.mLevel
		let xianlvConfig = GameGlobal.Config.partnerBiographyConfig[this.mXianlvId]
		let config = GameGlobal.Config.partnerGiftConfig[xianlvConfig.quality][lv - 1]
		return config
	}

	public GetPower(level?) {
		let attr = this.GetAttrs(level)
		if (attr) {
			return ItemConfig.CalcAttrScoreValue(attr)
		}
		return 0
	}

	public GetSkin(): string {
		return XianlvConst.GetSkin(this.mXianlvId)
	}

	public GetAttrs(level?): AttributeData[] {
		let config = this.GetGradeConfig(level)
		if (config) {
			return AttributeData.AttrAddition(GameGlobal.Config.partnerBiographyConfig[this.mXianlvId].attrs, config.attrs)
		}
		return []
	}

	public GetSkillId(delta = 0): number {
		let config = GameGlobal.Config.partnerAttrsConfig[this.mXianlvId]
		if (config) {
			let data = config[this.mStar - 1 + delta] || config[0]
			return data.skillid[0]
		}
		return 0
	}

	public GetNextSkillId(): number {
		let config = GameGlobal.Config.partnerAttrsConfig[this.mXianlvId]
		if (config) {
			let data = config[this.mStar] || config[0]
			return data.skillid[0]
		}
		return 0
	}
}