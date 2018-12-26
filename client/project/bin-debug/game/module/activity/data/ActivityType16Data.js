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
var ActivityType16Data = (function (_super) {
    __extends(ActivityType16Data, _super);
    function ActivityType16Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType16Data.prototype.update = function (e) {
        this.record = e.record;
        this.logrecord = e.logrecord;
    };
    ActivityType16Data.prototype.hasReward = function () {
        if (!this.isOpenActivity()) {
            return false;
        }
        var i;
        var len = this.logrecord || 0;
        for (i = 1; i <= len; i++) {
            if (this.canGetRecordByIndex(i) == true) {
                return true;
            }
        }
        return false;
    };
    ActivityType16Data.prototype.canGetRecordByIndex = function (index) {
        if (!this.isOpenActivity()) {
            return false;
        }
        if (GameServer.serverOpenDay < index) {
            return false;
        }
        return !this.GetRecordByIndex(index);
    };
    return ActivityType16Data;
}(ActivityBaseData));
__reflect(ActivityType16Data.prototype, "ActivityType16Data");
//# sourceMappingURL=ActivityType16Data.js.map