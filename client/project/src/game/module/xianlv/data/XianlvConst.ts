class XianlvConst {
	public static GetSkin(xianlvId: number): string {
		return AppearanceConfig.GetUIPath(xianlvId)
	}

	public static SetSkillIcon(): void {
		
	}

	public static GetHeadIcon(xianlvId: number): string {
		return GameGlobal.Config.partnerBiographyConfig[xianlvId].icon
	}

	private static BASE_ATTR

	public static GetBaseAttrs() {
		if (!this.BASE_ATTR) {
			this.BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.partnerLvproConfig, "attrs", 2)
		}
		return this.BASE_ATTR
	}

	private static QY_ATTR

	public static GetQyAttrs() {
		if (!this.QY_ATTR) {
			this.QY_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.partnerFreshSkillConfig, "attrs", 1)
		}
		return this.QY_ATTR
	}

	public static GetSkillDesc(xianLvId: number,lv:number): string 
	{
		let xianLvConfig;
		if(GameGlobal.Config.partnerAttrsConfig[xianLvId])
		{
			xianLvConfig = GameGlobal.Config.partnerAttrsConfig[xianLvId][lv - 1];
		}else{
			return "";
		}
		if(xianLvConfig)
		{
			let config = GameGlobal.Config.SkillsConfig[xianLvConfig.skillid]
			if (config) {
				return config[GameGlobal.Config.SkillsConfig_keys.desc]
			}
		}
		return ""
	}

	public static GetSkillId(xianLvId: number,lv:number): number 
	{
		let xianLvConfig;
		if(GameGlobal.Config.partnerAttrsConfig[xianLvId])
		{
			xianLvConfig = GameGlobal.Config.partnerAttrsConfig[xianLvId][lv - 1];
		}else{
			return 0;
		}
		if(xianLvConfig)
		{
			return xianLvConfig.skillid;
		}
		return 0
	}

}