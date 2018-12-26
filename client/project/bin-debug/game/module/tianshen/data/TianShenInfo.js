var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TianShenInfo = (function () {
    function TianShenInfo() {
        /**天神进阶等级 */
        this.mLevel = 0;
        /**天神进阶次数 */
        this.mExpUpNum = 0;
        /**天神突破等级 */
        this.mBreachLv = 0;
    }
    TianShenInfo.prototype.UpdateInfo = function (rsp) {
        this.mTianShenId = rsp.no;
        this.mLevel = rsp.lv;
        this.mExpUpNum = rsp.upNum;
        this.mBreachLv = rsp.promotion;
    };
    TianShenInfo.prototype.Active = function (rsp) {
        this.mTianShenId = rsp.no;
        this.mLevel = rsp.lv;
        this.mExpUpNum = rsp.upNum;
        this.mBreachLv = rsp.promotion;
    };
    /**
     *突破等级所得天赋技能
     */
    TianShenInfo.prototype.GetSkillIds = function () {
        var config = GameGlobal.Config.AirMarshalBreachConfig[this.mTianShenId][this.mBreachLv];
        if (config.skillid)
            return config.skillid;
        return [];
    };
    /**
     * 获取天神对应进阶等级配置
     */
    TianShenInfo.prototype.GetLevelConfig = function (level) {
        var lv = level != null ? level : this.mLevel;
        var tianShenConfig = GameGlobal.Config.AirMarshalListConfig[this.mTianShenId];
        var config = GameGlobal.Config.AirMarshalLvproConfig[tianShenConfig.quality][lv - 1];
        return config;
    };
    TianShenInfo.prototype.GetSkin = function () {
        return AppearanceConfig.GetUIPath(this.mTianShenId);
    };
    TianShenInfo.prototype.GetPower = function (level) {
        var attr = this.GetAttrs(level);
        if (attr) {
            return ItemConfig.CalcAttrScoreValue(attr);
        }
        return 0;
    };
    TianShenInfo.prototype.GetAttrs = function (level) {
        var config = this.GetLevelConfig(level);
        if (config) {
            return AttributeData.AttrAddition(GameGlobal.Config.AirMarshalListConfig[this.mTianShenId].attrs, config.attrs);
        }
        return [];
    };
    return TianShenInfo;
}());
__reflect(TianShenInfo.prototype, "TianShenInfo");
//# sourceMappingURL=TianShenInfo.js.map