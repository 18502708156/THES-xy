var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GainItemConfig = (function () {
    function GainItemConfig() {
    }
    GainItemConfig.GetGainName = function (itemId) {
        var config = GameGlobal.Config.GainItemConfig[itemId];
        if (!config) {
            return "";
        }
        if (!config.gainWay) {
            return "";
        }
        if (config.gainWay[0]) {
            return config.gainWay[0][0] || "";
        }
        return "";
    };
    GainItemConfig.Guide = function (itemId, index) {
        if (index === void 0) { index = 0; }
        var config = GameGlobal.Config.GainItemConfig[itemId];
        if (!config) {
            return false;
        }
        if (!config.gainWay) {
            return false;
        }
        if (config.gainWay[index]) {
            GameGlobal.ViewManager.Guide(config.gainWay[index][1][0]);
            return true;
        }
        return false;
    };
    return GainItemConfig;
}());
__reflect(GainItemConfig.prototype, "GainItemConfig");
//# sourceMappingURL=GainItemConfig.js.map