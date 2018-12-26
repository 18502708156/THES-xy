var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivitySumBtnConfig = (function () {
    function ActivitySumBtnConfig() {
    }
    ActivitySumBtnConfig.GetOpenList = function (openType) {
        if (!this.BTN_LIST) {
            var list = this.BTN_LIST = {};
            for (var key in GameGlobal.Config.ActivitySumBtnConfig) {
                var data = GameGlobal.Config.ActivitySumBtnConfig[key];
                if (!list[data.openId]) {
                    list[data.openId] = {};
                }
                list[data.openId][data.id] = data;
            }
        }
        return this.BTN_LIST[openType] || [];
    };
    ActivitySumBtnConfig.BTN_LIST = null;
    return ActivitySumBtnConfig;
}());
__reflect(ActivitySumBtnConfig.prototype, "ActivitySumBtnConfig");
//# sourceMappingURL=ActivitySumBtnConfig.js.map