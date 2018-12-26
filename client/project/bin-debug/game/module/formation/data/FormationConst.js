var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FormationConst = (function () {
    function FormationConst() {
    }
    FormationConst.GetSkin = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return "";
        var pId = config.pid;
        return AppearanceConfig.GetUIPath(pId);
    };
    FormationConst.GetPower = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return 0;
        return ItemConfig.CalcAttrScoreValue(config.attrs);
    };
    FormationConst.HasBuffSkill = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return false;
        return config.buffskill != null;
    };
    FormationConst.GetSkillId = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return 0;
        return config.buffskill;
    };
    FormationConst.GetFormationName = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return "";
        return config.name;
    };
    FormationConst.GetFormationUpgradeMaterial = function (formationId) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return;
        return config.material;
    };
    FormationConst.GetNextSkillId = function (skillId) {
        var config = GameGlobal.Config.FormationSkillConfig[skillId];
        if (!config)
            return 0;
        return config.nextid;
    };
    FormationConst.IsMaxSkillLv = function (skillId) {
        return !this.GetNextSkillId(skillId);
    };
    FormationConst.GetSkillUpgradeCost = function (skillId) {
        var config = GameGlobal.Config.FormationSkillConfig[skillId];
        if (!config)
            return;
        return config.cost;
    };
    FormationConst.GetFormationSoulConfig = function (formationId, soulLv) {
        return GameGlobal.Config.FormationSoulConfig[formationId][soulLv - 1];
    };
    FormationConst.GetFormationLevelConfig = function (formationId, formationLv) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        if (!config)
            return;
        return GameGlobal.Config.FormationLvproConfig[config.quality][formationLv - 1];
    };
    FormationConst.GetFormationBaseAttr = function (formationId, level) {
        var progressConfig = GameGlobal.Config.FormationProgressConfig[formationId][level - 1];
        if (!progressConfig)
            return;
        return progressConfig.attrs;
    };
    FormationConst.GetFormationUpgradeAttr = function (formationId, level, upNum) {
        var config = GameGlobal.Config.FormationListConfig[formationId];
        return this._GetAddAttr(GameGlobal.Config.FormationLvproConfig, config.quality, level, upNum);
    };
    FormationConst.GetFormationSoulAttr = function (formationId, soulLv, upNum) {
        return this._GetAddAttr(GameGlobal.Config.FormationSoulConfig, formationId, soulLv, upNum);
    };
    FormationConst.GetFormationAttr = function (formationId, level, upNum) {
        var baseAttr = this.GetFormationBaseAttr(formationId, level);
        var upgradeAttr = this.GetFormationUpgradeAttr(formationId, level, upNum);
        var getValue = function (props, attrType) {
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var elem = props_1[_i];
                if (elem.type == attrType)
                    return elem.value;
            }
            return 0;
        };
        var initAttrArr = new Array();
        baseAttr.forEach(function (elem) {
            var attrInfo = { type: elem.type, value: elem.value };
            initAttrArr.push(attrInfo);
        });
        initAttrArr.forEach(function (elem) {
            elem.value = elem.value + getValue(upgradeAttr, elem.type);
        });
        return initAttrArr;
    };
    FormationConst._GetAddAttr = function (sheetConfig, mainKey, level, upNum) {
        var config = sheetConfig[mainKey][0];
        var initAttrArr = new Array();
        config.attrs.forEach(function (elem) {
            var attrInfo = { type: elem.type, value: 0 };
            initAttrArr.push(attrInfo);
        });
        var getValue = function (props, attrType) {
            for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
                var elem = props_2[_i];
                if (elem.type == attrType)
                    return elem.value;
            }
            return 0;
        };
        var _loop_1 = function () {
            var tempConf = sheetConfig[mainKey][i - 1];
            var attrs = tempConf.attrs;
            var multiple = (i == level ? upNum : tempConf.proexp / tempConf.exp);
            initAttrArr.forEach(function (elem) {
                elem.value = elem.value + getValue(attrs, elem.type) * multiple;
            });
        };
        for (var i = 1; i <= level; ++i) {
            _loop_1();
        }
        return initAttrArr;
    };
    return FormationConst;
}());
__reflect(FormationConst.prototype, "FormationConst");
//# sourceMappingURL=FormationConst.js.map