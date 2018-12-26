var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GodLotteryConst = (function () {
    function GodLotteryConst() {
    }
    GodLotteryConst.GetCost = function (type) {
        var configList = GameGlobal.Config.TianShenLuckConfig[type];
        for (var key in configList) {
            var config = configList[key];
            return config.cost[0];
        }
    };
    GodLotteryConst.GetNextSpecailAward = function (curNum) {
        var specialAwardList = GameGlobal.Config.TianShenLuckBaseConfig.speciallyitem;
        for (var key in specialAwardList) {
            var num = parseInt(key);
            if (curNum < num)
                return [num, specialAwardList[key]];
        }
        return [null, null];
    };
    GodLotteryConst.TYPE_BINDGOLD_TEN = 1;
    GodLotteryConst.TYPE_GOLD_TEN = 3;
    GodLotteryConst.TYPE_GOLD_ONE = 2;
    return GodLotteryConst;
}());
__reflect(GodLotteryConst.prototype, "GodLotteryConst");
//# sourceMappingURL=GodLotteryConst.js.map