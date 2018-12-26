class TianShenBaoQiInfo {
	/**天神宝器posid */
	public mPos
	/**天神宝器进阶等级 */
	public mLevel = 0
	/**天神宝器进阶次数 */
	public mExpUpNum = 0

	public UpdateInfo(rsp: Sproto.tianshen_spells) {
		this.mLevel = rsp.lv;
		this.mExpUpNum = rsp.upNum;
	}

	/**
	 * 获取宝器对应进阶等级配置
	 */
	public GetLevelConfig(level?) {
		let lv = level != null ? level : this.mLevel;
		let config = GameGlobal.Config.AirMarshalTreasureAttrsConfig[this.mPos][lv - 1]
		return config;
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
			return AttributeData.AttrAddition(config.attrs, [])
		}
		return [];
	}
}