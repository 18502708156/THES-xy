var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityConfig = (function () {
    function ActivityConfig() {
    }
    ActivityConfig.GetActTypeById = function (actId) {
        var config = GameGlobal.Config.ActivityConfig[actId];
        if (config) {
            return config.activityType;
        }
        return 0;
    };
    return ActivityConfig;
}());
__reflect(ActivityConfig.prototype, "ActivityConfig");
//# sourceMappingURL=ActivityConfig.js.map