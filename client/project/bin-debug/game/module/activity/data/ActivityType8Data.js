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
var ActivityType8Data = (function (_super) {
    __extends(ActivityType8Data, _super);
    function ActivityType8Data() {
        //投资计划 -- 达到条件系统直接下发 - 所以不需要做红点
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**0 没投资 1已投资了*/
        _this.status = 0;
        /** 已经返利的天数*/
        _this.day = 0;
        return _this;
    }
    ActivityType8Data.prototype.update = function (t) {
        if (t) {
            this.status = t.status;
            this.day = t.day;
        }
    };
    /**活动结束后。是否还剩余有可领取目标没完成 */
    ActivityType8Data.prototype.canReward = function () {
        if (this.status == 1) {
            var arr = this.GetConfig();
            var len = arr.length;
            if (this.day <= len) {
                return true;
            }
        }
        return false;
    };
    return ActivityType8Data;
}(ActivityBaseData));
__reflect(ActivityType8Data.prototype, "ActivityType8Data");
//# sourceMappingURL=ActivityType8Data.js.map