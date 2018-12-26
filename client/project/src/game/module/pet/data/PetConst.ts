class PetConst {

	public static XUXING_IMG = {
		[1]: "ui_bm_jin",
		[2]: "ui_bm_mu",
		[3]: "ui_bm_shui",
		[4]: "ui_bm_huo",
		[5]: "ui_bm_tu",
	}

	public static RARITY_IMG = {
		[1]: "ui_cw_bm_r",
		[2]: "ui_cw_bm_sr",
		[3]: "ui_cw_bm_ssr",
		[4]: "ui_cw_bm_sssr",
		[5]: "ui_cw_bm_ssssr",
	}

	public static QUALITY_SKILL_BG = {
		[0]: "ui_cw_bm_lv",
		[1]: "ui_cw_bm_lv",
		[2]: "ui_cw_bm_lan",
		[3]: "ui_cw_bm_zi",
		[4]: "ui_cw_bm_cheng",
		[5]: "ui_cw_bm_hong",
		[6]: "ui_cw_bm_qicai",
	}

	public static GetSkillIcon(skillId: number): string {
		let config = GameGlobal.Config.SkillsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.SkillsConfig_keys.icon]
		}
		return ""
	}

	public static GetSkillDesc(skillId: number): string {
		let config = GameGlobal.Config.SkillsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.SkillsConfig_keys.desc]
		}
		return ""
	}

	public static GetSkillName(skillId: number): string {
		let config = GameGlobal.Config.SkillsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.SkillsConfig_keys.skinName]
		}
		return ""
	}

	public static GetSkillQuality(skillId: number): number {
		let config = GameGlobal.Config.SkillsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.SkillsConfig_keys.quality]
		}
		return 1
	}

	public static GetPassSkillIcon(skillId: number): string {
		let config = GameGlobal.Config.EffectsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.EffectsConfig_keys.icon]
		}
		return ""
	}

	public static GetPassSkillQuality(skillId: number): number {
		let config = GameGlobal.Config.EffectsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.EffectsConfig_keys.quality]
		}
		return 1
	}

	public static GetPassSkillDesc(skillId: number): string {
		let config = GameGlobal.Config.EffectsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.EffectsConfig_keys.desc]
		}
		return ""
	}

	public static GetPassSkillName(skillId: number): string {
		let config = GameGlobal.Config.EffectsConfig[skillId]
		if (config) {
			return config[GameGlobal.Config.EffectsConfig_keys.skinName]
		}
		return ""
	}

	public static GetSkin(petId: number): string {
		return AppearanceConfig.GetUIPath(petId)
	}

	public static GetPower(petId: number): number {
		return ItemConfig.CalcAttrScoreValue(GameGlobal.Config.petBiographyConfig[petId].attrs)
	}

	public static GetHeadIcon(petId: number): string {
		return this.GetHeadPath(GameGlobal.Config.petBiographyConfig[petId].icon)
	}

	public static GetHeadPath(headIcon: string): string {
		return "resource/assets/image/head/pet/" + headIcon + ".png"
	}

	public static SetName(comp: PetNameComp, petInfo: PetInfo) {
		let config = GameGlobal.Config.petBiographyConfig[petInfo.mPetId]
		if (!config) {
			return
		}
		comp.rarityImg.source = PetConst.RARITY_IMG[config.rarity]
		comp.nameLabel.text = petInfo.mName
		comp.nameLabel.textColor = ItemBase.GetColorByQuality(config.quality)
	}

	public static SetNameById(comp: PetNameComp, petId: number) {
		let config = GameGlobal.Config.petBiographyConfig[petId]
		comp.rarityImg.source = PetConst.RARITY_IMG[config.rarity]
		comp.nameLabel.text = config.name
		comp.nameLabel.textColor = ItemBase.GetColorByQuality(config.quality)
	}

	public static GetDefaultAttrs(configData, attrsKey: string, valueDeep: number) {
		if (!configData) {
			return []
		}
		let get = function(config, deep) {
			for (let k in config) {
				let d = deep - 1
				let data = config[k]
				if (d == 0) {
					let list = CommonUtils.copyDataHandler(data[attrsKey])
					for (let data of list) {
						data.value = 0
					}
					return list
				} else {
					return get(data, d)
				}
			}
		}
		return get(configData, valueDeep)
	}

	private static ZIZH_BASE_ATTR

	public static GetZizhiBaseAttrs() {
		if (!this.ZIZH_BASE_ATTR) {
			this.ZIZH_BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petGiftproConfig, "attrs", 2)
		}
		return this.ZIZH_BASE_ATTR
	}

	private static FEIS_BASE_ATTR

	public static GetFeisBaseAttrs() {
		if (!this.FEIS_BASE_ATTR) {
			this.FEIS_BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petFlyproConfig, "attrs", 2)
		}
		return this.FEIS_BASE_ATTR
	}

	private static BASE_ATTR

	public static GetBaseAttrs() {
		if (!this.BASE_ATTR) {
			this.BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petLvproConfig, "attrs", 2)
		}
		return this.BASE_ATTR
	}
}

interface PetNameComp extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // PetNameSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    rarityImg: eui.Image;
    nameLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
}

