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
var ShootUpIconRule = (function (_super) {
    __extends(ShootUpIconRule, _super);
    //直升一阶
    function ShootUpIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    ShootUpIconRule.prototype.checkShowIcon = function () {
        var b = ShootUpIconRule.CheckShow();
        if (b) {
            this.setTime(GameServer.dayEndTime);
        }
        else {
            this.setTime(0);
        }
        return b;
    };
    ShootUpIconRule.CheckShow = function () {
        var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(10);
        if (!data) {
            return;
        }
        var config = data.GetConfig()[data.runday - 1];
        if (!config) {
            return false;
        }
        if (data && data.isOpenActivity() && !data.GetRecordByIndex()) {
            if (Deblocking.Check(DeblockingType.TYPE_105, true)) {
                return true;
            }
        }
        return false;
    };
    ShootUpIconRule.prototype.checkShowRedPoint = function () {
        var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(10);
        if (data && data.isOpenActivity()) {
            return data.hasReward();
        }
        return false;
    };
    ShootUpIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    ShootUpIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(ShootUpPanel);
    };
    ShootUpIconRule.Open = function () {
        if (!ShootUpIconRule.CheckShow()) {
            UserTips.InfoTip("活动已经关闭");
            return;
        }
        ViewManager.ins().open(ShootUpPanel);
    };
    return ShootUpIconRule;
}(RuleIconBase));
__reflect(ShootUpIconRule.prototype, "ShootUpIconRule");
//# sourceMappingURL=ShootUpIconRule.js.map