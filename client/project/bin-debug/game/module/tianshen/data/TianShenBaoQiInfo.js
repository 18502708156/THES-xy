var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TianShenBaoQiInfo = (function () {
    function TianShenBaoQiInfo() {
        /**天神宝器进阶等级 */
        this.mLevel = 0;
        /**天神宝器进阶次数 */
        this.mExpUpNum = 0;
    }
    TianShenBaoQiInfo.prototype.UpdateInfo = function (rsp) {
        this.mLevel = rsp.lv;
        this.mExpUpNum = rsp.upNum;
    };
    /**
     * 获取宝器对应进阶等级配置
     */
    TianShenBaoQiInfo.prototype.GetLevelConfig = function (level) {
        var lv = level != null ? level : this.mLevel;
        var config = GameGlobal.Config.AirMarshalTreasureAttrsConfig[this.mPos][lv - 1];
        return config;
    };
    TianShenBaoQiInfo.prototype.GetPower = function (level) {
        var attr = this.GetAttrs(level);
        if (attr) {
            return ItemConfig.CalcAttrScoreValue(attr);
        }
        return 0;
    };
    TianShenBaoQiInfo.prototype.GetAttrs = function (level) {
        var config = this.GetLevelConfig(level);
        if (config) {
            return AttributeData.AttrAddition(config.attrs, []);
        }
        return [];
    };
    return TianShenBaoQiInfo;
}());
__reflect(TianShenBaoQiInfo.prototype, "TianShenBaoQiInfo");
//# sourceMappingURL=TianShenBaoQiInfo.js.map