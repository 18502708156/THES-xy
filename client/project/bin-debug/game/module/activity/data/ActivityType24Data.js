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
var ActivityType24Data = (function (_super) {
    __extends(ActivityType24Data, _super);
    function ActivityType24Data() {
        //成长基金 --活动开没开启不重要。重要是有没投资了
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**0 没投资 1已投资了*/
        _this.status = 0;
        /** value 为已领取了的id*/
        _this.reward = [];
        return _this;
    }
    ActivityType24Data.prototype.update = function (e) {
        if (e) {
            this.status = e.status;
            this.reward = e.reward;
        }
    };
    ActivityType24Data.prototype.hasReward = function () {
        if (this.status == 0) {
            return false;
        }
        var arr = this.GetConfig();
        var lv = GameGlobal.actorModel.level;
        var i;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            if (lv >= arr[i].level && this.reward.indexOf(arr[i].index) == -1) {
                return true;
            }
        }
        return false;
    };
    /**活动结束后。是否还剩余有可领取目标没完成 */
    ActivityType24Data.prototype.canReward = function () {
        if (this.status == 1) {
            var arr = this.GetConfig();
            var i = void 0;
            var len = arr.length;
            for (i = 0; i < len; i++) {
                if (this.reward.indexOf(arr[i].index) == -1) {
                    return true;
                }
            }
        }
        return false;
    };
    return ActivityType24Data;
}(ActivityBaseData));
__reflect(ActivityType24Data.prototype, "ActivityType24Data");
//# sourceMappingURL=ActivityType24Data.js.map