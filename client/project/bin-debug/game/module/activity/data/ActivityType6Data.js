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
var ActivityType6Data = (function (_super) {
    __extends(ActivityType6Data, _super);
    function ActivityType6Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType6Data.prototype.update = function (e) {
        this.reachindex = e.reachindex;
        this.value = e.value;
        this.drawrecord = e.drawrecord;
        this.drawtime = e.drawtime;
    };
    return ActivityType6Data;
}(ActivityBaseData));
__reflect(ActivityType6Data.prototype, "ActivityType6Data");
//# sourceMappingURL=ActivityType6Data.js.map