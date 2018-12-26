var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityRewardShowConst = (function () {
    function ActivityRewardShowConst() {
    }
    ActivityRewardShowConst._GetAwardList = function (type) {
        var config = GameGlobal.Config.ActivityPreviewConfig[type];
        if (!config || !config.tablename || !config.showrewards_1)
            return [];
        var list = [];
        var table = GameGlobal.Config[config.tablename];
        for (var key in config.showrewards_1) {
            var idx = parseInt(key);
            var keyStr = config.showrewards_1[key];
            var data = {
                name: config.des_1[idx],
                showitem: table[keyStr]
            };
            list.push(data);
        }
        return list;
    };
    ActivityRewardShowConst._GetRankAwardList = function (type) {
        var config = GameGlobal.Config.ActivityPreviewConfig[type];
        if (!config || !config.rankname)
            return [];
        var list = [];
        var table = GameGlobal.Config[config.rankname] || [];
        for (var key in table) {
            list.push(table[key]);
        }
        return list;
    };
    ActivityRewardShowConst._GetDragonRankAwardList = function (type) {
        var config = GameGlobal.Config.ActivityPreviewConfig[type];
        if (!config || !config.rankname_2)
            return [];
        var list = [];
        var table = GameGlobal.Config[config.rankname_2] || [];
        for (var key in table) {
            list.push(table[key]);
        }
        return list;
    };
    ActivityRewardShowConst.GetAwardListByActivityType = function (type) {
        var curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type];
        if (curType == null)
            return [];
        return this._GetAwardList(curType);
    };
    ActivityRewardShowConst.GetRankAwardListByActivityType = function (type) {
        var curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type];
        if (curType == null)
            return [];
        return this._GetRankAwardList(curType);
    };
    ActivityRewardShowConst.GetDragonRankAwardListByActivityType = function (type) {
        var curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type];
        if (curType == null)
            return [];
        return this._GetDragonRankAwardList(curType);
    };
    ActivityRewardShowConst.GetImageSourceByActivityType = function (type) {
        var curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type];
        if (curType == null)
            return "";
        var config = GameGlobal.Config.ActivityPreviewConfig[curType];
        if (!config || !config.icon)
            return "";
        return config.icon;
    };
    // 活动大厅的ID转换成活动预告表的ID
    ActivityRewardShowConst.ACTIVITY_TYPE_EXCHANGETO_MAP = (_a = {},
        _a[3] = 1,
        _a[5] = 2,
        _a[6] = 3,
        _a[101] = 5,
        _a);
    return ActivityRewardShowConst;
}());
__reflect(ActivityRewardShowConst.prototype, "ActivityRewardShowConst");
var _a;
//# sourceMappingURL=ActivityRewardShowConst.js.map