var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FbModel = (function () {
    function FbModel() {
        /**当天通关次数 */
        this.useCount = 0;
        /**当天购买次数 */
        this.vipBuyCount = 0;
        /**总通关次数 */
        this.totalCount = 0;
        /**开放等级 */
        this.levelLimit = 0;
    }
    FbModel.prototype.parser = function (totalCount, useCount, buyNum) {
        this.useCount = useCount || 0;
        this.vipBuyCount = buyNum || 0;
        this.totalCount = totalCount || 0;
    };
    // 挑战次数
    FbModel.prototype.getCount = function () {
        var config = GlobalConfig.ins().DailyFubenConfig[this.fbID];
        if (GameLogic.ins().actorModel.level < config.levelLimit)
            return 0;
        return GlobalConfig.ins().DailyFubenConfig[this.fbID].freeCount + this.vipBuyCount - this.useCount;
    };
    ;
    FbModel.prototype.GetUseCount = function () {
        return this.useCount;
    };
    Object.defineProperty(FbModel.prototype, "personBossWeight", {
        get: function () {
            if (GameGlobal.actorModel.level < this.levelLimit) {
                return this.fbID * 10000;
            }
            if (this.useCount > 0) {
                return this.fbID * 1000;
            }
            return this.fbID;
        },
        enumerable: true,
        configurable: true
    });
    return FbModel;
}());
__reflect(FbModel.prototype, "FbModel");
//# sourceMappingURL=FbModel.js.map