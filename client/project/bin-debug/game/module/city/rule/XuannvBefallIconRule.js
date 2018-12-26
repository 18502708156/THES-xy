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
var XuannvBefallIconRule = (function (_super) {
    __extends(XuannvBefallIconRule, _super);
    function XuannvBefallIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.UPDATA_VIP_AWARDS];
        return _this;
    }
    XuannvBefallIconRule.prototype.checkShowIcon = function () {
        return XuannvBefallIconRule.CheckShow();
    };
    XuannvBefallIconRule.CheckShow = function () {
        return Deblocking.Check(212, true) && !BitUtil.Has(UserVip.ins().state, GameGlobal.Config.GuideBaseConfig.viplv);
    };
    XuannvBefallIconRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    XuannvBefallIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(HavingShow);
    };
    XuannvBefallIconRule.AutoCheckShow = function () {
        if (!GameServer.ETNER_GAME_TIME) {
            return false;
        }
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SHOW_XUANNV)) {
            return false;
        }
        if (!XuannvBefallIconRule.CheckShow()) {
            return false;
        }
        var rechargeNum = GameGlobal.RechargeModel.rechargeNum;
        if (rechargeNum > 0 && rechargeNum < 200 && GameGlobal.RechargeModel.firsttime) {
            if (GameServer.serverTime - GameServer.ETNER_GAME_TIME > 10 * 60 && GameServer.serverTime - GameGlobal.RechargeModel.firsttime > 30 * 60) {
                return true;
            }
        }
        return false;
    };
    XuannvBefallIconRule.AutoShow = function () {
        if (this.AutoCheckShow()) {
            ViewManager.ins().open(HavingShow);
        }
    };
    return XuannvBefallIconRule;
}(RuleIconBase));
__reflect(XuannvBefallIconRule.prototype, "XuannvBefallIconRule");
var XuannvBefallIconRule2 = (function (_super) {
    __extends(XuannvBefallIconRule2, _super);
    function XuannvBefallIconRule2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XuannvBefallIconRule2.prototype.checkShowIcon = function () {
        if (DiscountRule.CheckShow()) {
            return false;
        }
        return _super.prototype.checkShowIcon.call(this);
    };
    return XuannvBefallIconRule2;
}(XuannvBefallIconRule));
__reflect(XuannvBefallIconRule2.prototype, "XuannvBefallIconRule2");
//# sourceMappingURL=XuannvBefallIconRule.js.map