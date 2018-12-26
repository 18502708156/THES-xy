var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XianlvInfo = (function () {
    function XianlvInfo() {
        this.mExp = 0;
        this.mLevel = 0;
        this.mStar = 0;
        this.mPower = 0;
    }
    XianlvInfo.prototype.UpdateInfo = function (rsp) {
        this.mExp = rsp.exp;
        this.mLevel = rsp.level;
        this.mStar = rsp.star;
    };
    XianlvInfo.prototype.Active = function () {
        this.mLevel = 1;
        this.mStar = 1;
    };
    XianlvInfo.prototype.GetLevelConfig = function (level) {
        var lv = level != null ? level : this.mLevel;
        var xianlvConfig = GameGlobal.Config.partnerBiographyConfig[this.mXianlvId];
        var config = GameGlobal.Config.partnerLvproConfig[xianlvConfig.quality][lv - 1];
        return config;
    };
    XianlvInfo.prototype.GetGradeConfig = function (level) {
        var lv = level != null ? level : this.mLevel;
        var xianlvConfig = GameGlobal.Config.partnerBiographyConfig[this.mXianlvId];
        var config = GameGlobal.Config.partnerGiftConfig[xianlvConfig.quality][lv - 1];
        return config;
    };
    XianlvInfo.prototype.GetPower = function (level) {
        var attr = this.GetAttrs(level);
        if (attr) {
            return ItemConfig.CalcAttrScoreValue(attr);
        }
        return 0;
    };
    XianlvInfo.prototype.GetSkin = function () {
        return XianlvConst.GetSkin(this.mXianlvId);
    };
    XianlvInfo.prototype.GetAttrs = function (level) {
        var config = this.GetGradeConfig(level);
        if (config) {
            return AttributeData.AttrAddition(GameGlobal.Config.partnerBiographyConfig[this.mXianlvId].attrs, config.attrs);
        }
        return [];
    };
    XianlvInfo.prototype.GetSkillId = function (delta) {
        if (delta === void 0) { delta = 0; }
        var config = GameGlobal.Config.partnerAttrsConfig[this.mXianlvId];
        if (config) {
            var data = config[this.mStar - 1 + delta] || config[0];
            return data.skillid[0];
        }
        return 0;
    };
    XianlvInfo.prototype.GetNextSkillId = function () {
        var config = GameGlobal.Config.partnerAttrsConfig[this.mXianlvId];
        if (config) {
            var data = config[this.mStar] || config[0];
            return data.skillid[0];
        }
        return 0;
    };
    return XianlvInfo;
}());
__reflect(XianlvInfo.prototype, "XianlvInfo");
//# sourceMappingURL=XianlvInfo.js.map