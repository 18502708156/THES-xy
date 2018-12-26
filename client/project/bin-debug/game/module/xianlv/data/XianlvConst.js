var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XianlvConst = (function () {
    function XianlvConst() {
    }
    XianlvConst.GetSkin = function (xianlvId) {
        return AppearanceConfig.GetUIPath(xianlvId);
    };
    XianlvConst.SetSkillIcon = function () {
    };
    XianlvConst.GetHeadIcon = function (xianlvId) {
        return GameGlobal.Config.partnerBiographyConfig[xianlvId].icon;
    };
    XianlvConst.GetBaseAttrs = function () {
        if (!this.BASE_ATTR) {
            this.BASE_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.partnerLvproConfig, "attrs", 2);
        }
        return this.BASE_ATTR;
    };
    XianlvConst.GetQyAttrs = function () {
        if (!this.QY_ATTR) {
            this.QY_ATTR = PetConst.GetDefaultAttrs(GameGlobal.Config.partnerFreshSkillConfig, "attrs", 1);
        }
        return this.QY_ATTR;
    };
    XianlvConst.GetSkillDesc = function (xianLvId, lv) {
        var xianLvConfig;
        if (GameGlobal.Config.partnerAttrsConfig[xianLvId]) {
            xianLvConfig = GameGlobal.Config.partnerAttrsConfig[xianLvId][lv - 1];
        }
        else {
            return "";
        }
        if (xianLvConfig) {
            var config = GameGlobal.Config.SkillsConfig[xianLvConfig.skillid];
            if (config) {
                return config[GameGlobal.Config.SkillsConfig_keys.desc];
            }
        }
        return "";
    };
    XianlvConst.GetSkillId = function (xianLvId, lv) {
        var xianLvConfig;
        if (GameGlobal.Config.partnerAttrsConfig[xianLvId]) {
            xianLvConfig = GameGlobal.Config.partnerAttrsConfig[xianLvId][lv - 1];
        }
        else {
            return 0;
        }
        if (xianLvConfig) {
            return xianLvConfig.skillid;
        }
        return 0;
    };
    return XianlvConst;
}());
__reflect(XianlvConst.prototype, "XianlvConst");
//# sourceMappingURL=XianlvConst.js.map