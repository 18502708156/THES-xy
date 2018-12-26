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
var ActivityType18Data = (function (_super) {
    __extends(ActivityType18Data, _super);
    function ActivityType18Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType18Data.prototype.update = function (e) {
        this.record = e.record;
        this.dayrecharge = e.dayrecharge;
    };
    ActivityType18Data.prototype.canGetRecordByIndex = function (index) {
        if (!this.isOpenActivity()) {
            return false;
        }
        var cfgObj = this.GetConfig()[index - 1];
        var day = cfgObj.day;
        if (GameServer.serverOpenDay < day) {
            return false;
        }
        return _super.prototype.canGetRecordByIndex.call(this, index);
    };
    return ActivityType18Data;
}(ActivityBaseData));
__reflect(ActivityType18Data.prototype, "ActivityType18Data");
//# sourceMappingURL=ActivityType18Data.js.map