var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PetConst = (function () {
    function PetConst() {
    }
    PetConst.GetSkillIcon = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.SkillsConfig_keys.icon];
        }
        return "";
    };
    PetConst.GetSkillDesc = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.SkillsConfig_keys.desc];
        }
        return "";
    };
    PetConst.GetSkillName = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.SkillsConfig_keys.skinName];
        }
        return "";
    };
    PetConst.GetSkillQuality = function (skillId) {
        var config = GameGlobal.Config.SkillsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.SkillsConfig_keys.quality];
        }
        return 1;
    };
    PetConst.GetPassSkillIcon = function (skillId) {
        var config = GameGlobal.Config.EffectsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.EffectsConfig_keys.icon];
        }
        return "";
    };
    PetConst.GetPassSkillQuality = function (skillId) {
        var config = GameGlobal.Config.EffectsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.EffectsConfig_keys.quality];
        }
        return 1;
    };
    PetConst.GetPassSkillDesc = function (skillId) {
        var config = GameGlobal.Config.EffectsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.EffectsConfig_keys.desc];
        }
        return "";
    };
    PetConst.GetPassSkillName = function (skillId) {
        var config = GameGlobal.Config.EffectsConfig[skillId];
        if (config) {
            return config[GameGlobal.Config.EffectsConfig_keys.skinName];
        }
        return "";
    };
    PetConst.GetSkin = function (petId) {
        return AppearanceConfig.GetUIPath(petId);
    };
    PetConst.GetPower = function (petId) {
        return ItemConfig.CalcAttrScoreValue(GameGlobal.Config.petBiographyConfig[petId].attrs);
    };
    PetConst.GetHeadIcon = function (petId) {
        return this.GetHeadPath(GameGlobal.Config.petBiographyConfig[petId].icon);
    };
    PetConst.GetHeadPath = function (headIcon) {
        return "resource/assets/image/head/pet/" + headIcon + ".png";
    };
    PetConst.SetName = function (comp, petInfo) {
        var config = GameGlobal.Config.petBiographyConfig[petInfo.mPetId];
        if (!config) {
            return;
        }
        comp.rarityImg.source = PetConst.RARITY_IMG[config.rarity];
        comp.nameLabel.text = petInfo.mName;
        comp.nameLabel.textColor = ItemBase.GetColorByQuality(config.quality);
    };
    PetConst.SetNameById = function (comp, petId) {
        var config = GameGlobal.Config.petBiographyConfig[petId];
        comp.rarityImg.source = PetConst.RARITY_IMG[config.rarity];
        comp.nameLabel.text = config.name;
        comp.nameLabel.textColor = ItemBase.GetColorByQuality(config.quality);
    };
    PetConst.GetDefaultAttrs = function (configData, attrsKey, valueDeep) {
        if (!configData) {
            return [];
        }
        var get = function (config, deep) {
            for (var k in config) {
                var d = deep - 1;
                var data = config[k];
                if (d == 0) {
                    var list = CommonUtils.copyDataHandler(data[attrsKey]);
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var data_1 = list_1[_i];
                        data_1.value = 0;
                    }
                    return list;
                }
                else {
                    return get(data, d);
                }
            }
        };
        return get(configData, valueDeep);
    };
    PetConst.GetZizhiBaseAttrs = function () {
        if (!this.ZIZH_BASE_ATTR) {
            this.ZIZH_BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petGiftproConfig, "attrs", 2);
        }
        return this.ZIZH_BASE_ATTR;
    };
    PetConst.GetFeisBaseAttrs = function () {
        if (!this.FEIS_BASE_ATTR) {
            this.FEIS_BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petFlyproConfig, "attrs", 2);
        }
        return this.FEIS_BASE_ATTR;
    };
    PetConst.GetBaseAttrs = function () {
        if (!this.BASE_ATTR) {
            this.BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.petLvproConfig, "attrs", 2);
        }
        return this.BASE_ATTR;
    };
    PetConst.XUXING_IMG = (_a = {},
        _a[1] = "ui_bm_jin",
        _a[2] = "ui_bm_mu",
        _a[3] = "ui_bm_shui",
        _a[4] = "ui_bm_huo",
        _a[5] = "ui_bm_tu",
        _a);
    PetConst.RARITY_IMG = (_b = {},
        _b[1] = "ui_cw_bm_r",
        _b[2] = "ui_cw_bm_sr",
        _b[3] = "ui_cw_bm_ssr",
        _b[4] = "ui_cw_bm_sssr",
        _b[5] = "ui_cw_bm_ssssr",
        _b);
    PetConst.QUALITY_SKILL_BG = (_c = {},
        _c[0] = "ui_cw_bm_lv",
        _c[1] = "ui_cw_bm_lv",
        _c[2] = "ui_cw_bm_lan",
        _c[3] = "ui_cw_bm_zi",
        _c[4] = "ui_cw_bm_cheng",
        _c[5] = "ui_cw_bm_hong",
        _c[6] = "ui_cw_bm_qicai",
        _c);
    return PetConst;
}());
__reflect(PetConst.prototype, "PetConst");
var _a, _b, _c;
//# sourceMappingURL=PetConst.js.map