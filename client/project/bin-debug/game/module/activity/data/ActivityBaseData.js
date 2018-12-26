var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityBaseData = (function () {
    function ActivityBaseData() {
    }
    ActivityBaseData.prototype.UpdateBase = function (rsp) {
        this.startTime = rsp.startTime;
        this.endTime = rsp.endTime;
        this.openState = rsp.openState;
        this.id = rsp.id;
        this.type = rsp.type;
    };
    ActivityBaseData.prototype.update = function (data) {
    };
    ActivityBaseData.prototype.hasReward = function () {
        if (!this.isOpenActivity()) {
            return false;
        }
        var arr = this.GetConfig();
        var i;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            if (this.canGetRecordByIndex(i + 1)) {
                return true;
            }
        }
        return false;
    };
    // 所以的都已经领取
    ActivityBaseData.prototype.AllGotten = function () {
        // return false
        var data = this.record;
        if (!data) {
            return false;
        }
        var arr = this.GetConfig();
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (data[i] != 4) {
                return false;
            }
        }
        return true;
    };
    ActivityBaseData.prototype.GetRecordByIndex = function (index) {
        if (this.record instanceof Array) {
            return this.record[index - 1] == 4;
        }
        return (this.record & (1 << index)) > 0;
    };
    /**如果是数组，子类一般不需要重写 */
    ActivityBaseData.prototype.canGetRecordByIndex = function (index) {
        if (!this.isOpenActivity()) {
            return false;
        }
        if (this.record instanceof Array) {
            if (this.record[index - 1] != 3) {
                return false;
            }
        }
        else {
            return false;
        }
        return !this.GetRecordByIndex(index);
    };
    ActivityBaseData.prototype.isOpenActivity = function () {
        return this.isOpenTime();
    };
    ActivityBaseData.prototype.init = function () { };
    // static sort(e, t) {
    // 	return e.state == RewardState.CanGet && t.state != RewardState.CanGet ? -1 : e.state != RewardState.CanGet && t.state == RewardState.CanGet ? 1 : e.state == RewardState.Gotten && t.state != RewardState.Gotten ? 1 : e.state != RewardState.Gotten && t.state == RewardState.Gotten ? -1 : e.index < t.index ? -1 : e.index > t.index ? 1 : 0
    // }
    ActivityBaseData.prototype.getRemindTimeString = function () {
        var self = this;
        var startTime = Math.floor(self.startTime - GameServer.serverTime);
        var endTime = Math.max(Math.floor(self.endTime - GameServer.serverTime), 0);
        if (startTime >= 0)
            return "活动未开启";
        if (0 >= endTime)
            return "活动已结束";
        if (endTime * 1000 < DateUtils.MS_PER_DAY) {
            return "\u5012\u8BA1\u65F6\uFF1A|C:" + Color.GetStr(Color.l_green_1) + "&T:" + DateUtils.format_1(endTime * 1000) + "|";
        }
        return "\u5012\u8BA1\u65F6\uFF1A|C:" + Color.GetStr(Color.l_green_1) + "&T:" + ActivityBaseData.GetTimeStr(endTime) + "|";
    };
    ActivityBaseData.GetTimeStr = function (time) {
        var d = Math.floor(time / 86400);
        var h = Math.floor(time % 86400 / 3600);
        var m = Math.floor(time % 3600 / 60);
        return d + "天" + h + "小时" + m + "分";
    };
    /**活动开启显示时间 */
    ActivityBaseData.prototype.isOpenTime = function () {
        if (this.endTime == 0) {
            return true;
        }
        return this.startTime < GameServer.serverTime && (this.endTime + this.delayCloseActivityTime()) > GameServer.serverTime;
    };
    ActivityBaseData.prototype.GetSurplusTimeStr = function () {
        return "\u5269\u4F59\u65F6\u95F4\uFF1A" + this.getRemindTimeString();
    };
    ActivityBaseData.prototype.GetConfig = function () {
        return GameGlobal.Config["ActivityType" + this.type + "Config"][this.id];
    };
    /**客户端延迟消失的秒数 */
    ActivityBaseData.prototype.delayCloseActivityTime = function () {
        var cfg = GameGlobal.Config.ActivityConfig[this.id];
        if (!cfg) {
            return 0;
        }
        if (cfg.closetime) {
            return cfg.closetime * 3600;
        }
        return 0;
    };
    return ActivityBaseData;
}());
__reflect(ActivityBaseData.prototype, "ActivityBaseData", ["IActivityBaseData"]);
//# sourceMappingURL=ActivityBaseData.js.map