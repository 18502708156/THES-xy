var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FuliData = (function () {
    function FuliData() {
        /**累计登录天数 */
        this.accDay = 1;
        /**下个累计天数 */
        this.nextGiftDay = 1;
        /**每天签到奖励id */
        this.dailyId = 1;
        /**每天奖励领取标记 位运算& 1为 领取 0 为未领取s */
        this.rewardMark = 1;
        /**等级奖励领取标记 位运算& 1为 领取 0 为未领取s */
        this.lvMark = 1;
    }
    FuliData.prototype.IsMonth = function () {
        return this.month ? true : false;
    };
    return FuliData;
}());
__reflect(FuliData.prototype, "FuliData");
//# sourceMappingURL=FuliData.js.map