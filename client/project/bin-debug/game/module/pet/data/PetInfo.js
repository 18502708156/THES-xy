var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PetInfo = (function () {
    function PetInfo() {
        this.mZizhiExp = 0;
        this.mZizhiLevel = 0;
        this.mFeisLevel = 0;
        this.mPower = 0;
        this.mBuffSkill = [];
        this.mXilian = 0;
        this.mXilianSkill = [];
    }
    PetInfo.prototype.UpdateInfo = function (info) {
        this.mExp = info.exp;
        this.mLevel = info.level;
        this.mName = info.name || GameGlobal.Config.petBiographyConfig[this.mPetId].name;
        this.mBuffSkill = info.buffs || [];
        this.mZizhiExp = info.giftexp;
        this.mZizhiLevel = info.giftlv;
        this.mXilian = info.xilian;
        this.mXilianSkill = info.xilianSkills || [];
    };
    PetInfo.prototype.Active = function () {
        this.mLevel = 1;
        this.mZizhiLevel = 1;
        var config = GameGlobal.Config.petBiographyConfig[this.mPetId];
        var skill = config.buffskill;
        this.mName = config.name;
        this.mBuffSkill = [];
        for (var _i = 0, skill_1 = skill; _i < skill_1.length; _i++) {
            var data = skill_1[_i];
            this.mBuffSkill.push(data.id);
        }
    };
    PetInfo.prototype.GetXilianStar = function () {
        var config = GameGlobal.Config.petbaseConfig.polishStar;
        var star = config.length;
        var xilian = this.mXilian;
        for (var i = 0; i < config.length; i++) {
            var val = config[i];
            if (xilian <= val) {
                star = i + 1;
                break;
            }
        }
        return star;
    };
    PetInfo.prototype.GetSkin = function () {
        return PetConst.GetSkin(this.mPetId);
    };
    PetInfo.prototype.GetSkillPower = function () {
        var power = 0;
        var skillId = GameGlobal.Config.petBiographyConfig[this.mPetId].skill[0];
        if (GameGlobal.Config.SkillsConfig[skillId]) {
            power += GameGlobal.Config.SkillsConfig[skillId][GameGlobal.Config.SkillsConfig_keys.skillpower] || 0;
        }
        var config = GameGlobal.Config.EffectsConfig;
        for (var _i = 0, _a = this.mBuffSkill; _i < _a.length; _i++) {
            var id = _a[_i];
            if (config[id]) {
                power += config[id][GameGlobal.Config.EffectsConfig_keys.skillpower] || 0;
            }
        }
        return power;
    };
    PetInfo.prototype.GetPower = function () {
        var power = 0;
        power += ItemConfig.CalcAttrScoreValue(this.GetShowAttrs());
        power += ItemConfig.CalcAttrScoreValue(this.GetShowZizhiAttrs());
        power += ItemConfig.CalcAttrScoreValue(this.GetShowFeisAttrs());
        return power;
    };
    PetInfo.prototype.GetZizhiPower = function () {
        // let config = GameGlobal.Config.petGiftproConfig[this.mPetId][this.mZizhiLevel - 1]
        // if (config) {
        // 	return ItemConfig.CalcAttrScoreValue(config.attrs)
        // }
        // return 0
        var attr = this.GetZizhiAttrs();
        if (attr) {
            return ItemConfig.CalcAttrScoreValue(attr);
        }
        return 0;
    };
    PetInfo.prototype.GetAttrs = function () {
        var config = this.GetLevelConfig();
        if (config) {
            return AttributeData.AttrAddition(GameGlobal.Config.petBiographyConfig[this.mPetId].attrs, config.attrs);
        }
        return [];
    };
    PetInfo.prototype.GetShowAttrs = function () {
        var attrs = this.GetAttrs();
        if (attrs) {
            return attrs;
        }
        return PetConst.GetBaseAttrs();
    };
    PetInfo.prototype.GetZizhiAttrs = function () {
        var config = GameGlobal.Config.petGiftproConfig[this.mPetId][0];
        var initAttrArr = new Array();
        config.attrs.forEach(function (elem) {
            var attrInfo = { type: elem.type, value: 0 };
            initAttrArr.push(attrInfo);
        });
        var getValue = function (props, attrType) {
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var elem = props_1[_i];
                if (elem.type == attrType)
                    return elem.value;
            }
            return 0;
        };
        var level = this.mZizhiLevel;
        var zizhiExp = this.mZizhiExp;
        var _loop_1 = function () {
            var giftProConf = GameGlobal.Config.petGiftproConfig[this_1.mPetId][i - 1];
            var attrs = giftProConf.attrs;
            var multiple = (i == level ? zizhiExp : giftProConf.proexp / giftProConf.exp);
            initAttrArr.forEach(function (elem) {
                elem.value = elem.value + getValue(attrs, elem.type) * multiple;
            });
        };
        var this_1 = this;
        for (var i = 1; i <= level; ++i) {
            _loop_1();
        }
        return initAttrArr;
    };
    PetInfo.prototype.GetShowZizhiAttrs = function () {
        var attrs = this.GetZizhiAttrs();
        if (attrs) {
            return attrs;
        }
        return PetConst.GetZizhiBaseAttrs();
    };
    PetInfo.prototype.GetShowFeisAttrs = function () {
        var attrs = this.GetFeisAttrs();
        if (attrs) {
            return attrs;
        }
        return PetConst.GetFeisBaseAttrs();
    };
    PetInfo.prototype.GetFeisAttrs = function () {
        var config = GameGlobal.Config.petFlyproConfig[this.mPetId];
        if (config) {
            if (config[this.mFeisLevel - 1]) {
                return config[this.mFeisLevel - 1].attrs;
            }
        }
    };
    PetInfo.prototype.GetLevelConfig = function () {
        var rarity = GameGlobal.Config.petBiographyConfig[this.mPetId].rarity;
        return GameGlobal.Config.petLvproConfig[rarity][this.mLevel - 1];
    };
    PetInfo.prototype.GetSkillId = function () {
        var config = GameGlobal.Config.petBiographyConfig[this.mPetId];
        if (config) {
            return config.skill[0];
        }
        return 0;
    };
    return PetInfo;
}());
__reflect(PetInfo.prototype, "PetInfo");
//# sourceMappingURL=PetInfo.js.map