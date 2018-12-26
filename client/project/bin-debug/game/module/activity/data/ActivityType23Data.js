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
var ActivityType23Data = (function (_super) {
    __extends(ActivityType23Data, _super);
    function ActivityType23Data() {
        //直升一阶
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**活动开启天数 */
        _this.runday = 1;
        return _this;
    }
    ActivityType23Data.prototype.update = function (e) {
        this.record = e.record;
        this.runday = e.runday;
    };
    ActivityType23Data.prototype.hasReward = function () {
        if (!this.isOpenActivity()) {
            return false;
        }
        var arr = this.GetConfig();
        // let rechare = GameGlobal.RechargeModel.todayRechargeNum;
        if (this.record == 3) {
            return true;
        }
        return false;
    };
    ActivityType23Data.prototype.GetRecordByIndex = function (index) {
        if (this.record == 4) {
            return true;
        }
        return false;
    };
    return ActivityType23Data;
}(ActivityBaseData));
__reflect(ActivityType23Data.prototype, "ActivityType23Data");
//# sourceMappingURL=ActivityType23Data.js.map