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
var ActivityType2Data = (function (_super) {
    __extends(ActivityType2Data, _super);
    function ActivityType2Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType2Data.prototype.update = function (t) {
        this.buyData = [];
        for (var len = t.buyData.length, i = 0; len > i; i++) {
            this.buyData.push(t.buyData[i]);
        }
    };
    ActivityType2Data.prototype.hasReward = function () {
        return !1;
    };
    return ActivityType2Data;
}(ActivityBaseData));
__reflect(ActivityType2Data.prototype, "ActivityType2Data");
//# sourceMappingURL=ActivityType2Data.js.map