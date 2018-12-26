class TianShenInfo {
	/**天神ID */
	public mTianShenId
	/**天神进阶等级 */
	public mLevel = 0
	/**天神进阶次数 */
	public mExpUpNum = 0
	/**天神突破等级 */
	public mBreachLv = 0

	public UpdateInfo(rsp: Sproto.tianshen_data) {
		this.mTianShenId = rsp.no;
		this.mLevel = rsp.lv;
		this.mExpUpNum = rsp.upNum;
		this.mBreachLv = rsp.promotion;
	}

	public Active(rsp: Sproto.cs_tianshen_activation_response) {
		this.mTianShenId = rsp.no;
		this.mLevel = rsp.lv;
		this.mExpUpNum = rsp.upNum;
		this.mBreachLv = rsp.promotion;
	}

	/**
	 *突破等级所得天赋技能
	 */
	public GetSkillIds() {
		let config = GameGlobal.Config.AirMarshalBreachConfig[this.mTianShenId][this.mBreachLv];
		if(config.skillid) return config.skillid;
		return [];
	}

	/**
	 * 获取天神对应进阶等级配置
	 */
	public GetLevelConfig(level?) {
		let lv = level != null ? level : this.mLevel
		let tianShenConfig = GameGlobal.Config.AirMarshalListConfig[this.mTianShenId]
		let config = GameGlobal.Config.AirMarshalLvproConfig[tianShenConfig.quality][lv - 1]
		return config;
	}


	public GetSkin(): string {
		return AppearanceConfig.GetUIPath(this.mTianShenId);
	}

	public GetPower(level?) {
		let attr = this.GetAttrs(level)
		if (attr) {
			return ItemConfig.CalcAttrScoreValue(attr)
		}
		return 0
	}

	public GetAttrs(level?): AttributeData[] {
		let config = this.GetLevelConfig(level)
		if (config) {
			return AttributeData.AttrAddition(GameGlobal.Config.AirMarshalListConfig[this.mTianShenId].attrs, config.attrs)
		}
		return [];
	}
}