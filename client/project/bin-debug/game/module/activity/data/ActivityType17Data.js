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
var ActivityType17Data = (function (_super) {
    __extends(ActivityType17Data, _super);
    function ActivityType17Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityType17Data.prototype.update = function (e) {
        this.record = e.record;
        this.target = e.target;
    };
    ActivityType17Data.prototype.hasReward = function () {
        if (!this.isOpenActivity()) {
            return false;
        }
        var arr = this.GetConfig();
        var i;
        var len = arr.length;
        var curDay = GameServer.serverOpenDay;
        for (i = 0; i < len; i++) {
            if (arr[i].day != curDay) {
                continue;
            }
            if (this.canGetRecordByIndex(i + 1)) {
                return true;
            }
        }
        return false;
    };
    ActivityType17Data.prototype.canGetRecordByIndex = function (index) {
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
    return ActivityType17Data;
}(ActivityBaseData));
__reflect(ActivityType17Data.prototype, "ActivityType17Data");
//# sourceMappingURL=ActivityType17Data.js.map