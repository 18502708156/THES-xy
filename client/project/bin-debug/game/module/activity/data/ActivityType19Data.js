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
var ActivityType19Data = (function (_super) {
    __extends(ActivityType19Data, _super);
    function ActivityType19Data() {
        //人民币礼包
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**达成天数 */
        _this.reachday = 0;
        return _this;
    }
    ActivityType19Data.prototype.update = function (e) {
        this.reachday = e.reachday;
        this.runday = e.runday;
        this.record = e.record;
    };
    ActivityType19Data.prototype.isLastDay = function () {
        var config = this.GetConfig()[this.runday];
        return config == null;
    };
    return ActivityType19Data;
}(ActivityBaseData));
__reflect(ActivityType19Data.prototype, "ActivityType19Data");
//# sourceMappingURL=ActivityType19Data.js.map