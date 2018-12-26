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
var ActivityType27Data = (function (_super) {
    __extends(ActivityType27Data, _super);
    function ActivityType27Data() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**# 充值次数 */
        _this.cloutArr = [];
        _this.redPoint = true;
        return _this;
    }
    ActivityType27Data.prototype.update = function (req) {
        this.cloutArr = req.data;
    };
    ActivityType27Data.prototype.isRedPoint = function () {
        return this.redPoint;
    };
    return ActivityType27Data;
}(ActivityBaseData));
__reflect(ActivityType27Data.prototype, "ActivityType27Data");
//# sourceMappingURL=ActivityType27Data.js.map