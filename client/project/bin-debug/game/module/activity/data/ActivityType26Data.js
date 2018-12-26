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
var ActivityType26Data = (function (_super) {
    __extends(ActivityType26Data, _super);
    function ActivityType26Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType26Data.prototype.update = function (e) {
        this.buynums = e.buynums || [];
    };
    ActivityType26Data.prototype.hasReward = function () {
        return !1;
    };
    return ActivityType26Data;
}(ActivityBaseData));
__reflect(ActivityType26Data.prototype, "ActivityType26Data");
//# sourceMappingURL=ActivityType26Data.js.map