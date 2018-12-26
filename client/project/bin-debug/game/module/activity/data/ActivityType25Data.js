var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ActivityType25Data = (function (_super) {
    __extends(ActivityType25Data, _super);
    function ActivityType25Data() {
        //消费有礼
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**消费金额 */
        _this.money = 0;
        /**已领取了那些奖励，位运算 */
        _this.reward = 0;
        return _this;
    }
    ActivityType25Data.prototype.update = function (e) {
        if (e) {
            this.money = e.RechargeNum;
            this.reward = e.reward;
        }
    };
    ActivityType25Data.prototype.hasReward = function () {
        if (!this.isOpenActivity()) {
            return false;
        }
        if (this.money == 0) {
            return false;
        }
        var arr = this.GetConfig();
        var i;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            if (this.money >= arr[i].cost && !BitUtil.Has(this.reward, arr[i].index)) {
                return true;
            }
        }
        return false;
    };
    return ActivityType25Data;
}(ActivityBaseData));
__reflect(ActivityType25Data.prototype, "ActivityType25Data");
//# sourceMappingURL=ActivityType25Data.js.map