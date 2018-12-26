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
var FirstRechargeIconRule = (function (_super) {
    __extends(FirstRechargeIconRule, _super);
    function FirstRechargeIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.effX = RuleIconBase.POS1_X;
        _this.effY = RuleIconBase.POS1_Y;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.RECHARGE_FIRST_UPDATE, MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE];
        _this.btn = t;
        return _this;
    }
    FirstRechargeIconRule.prototype.checkShowIcon = function () {
        this.showIcon();
        return Deblocking.Check(DeblockingType.TYPE_131, true) && FirstRechargeIconRule.CheckShow();
    };
    FirstRechargeIconRule.prototype.showIcon = function () {
        var result = false;
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                result = true;
                break;
            }
        }
        this.btn.icon = result ? 'ui_bm_shouchong' : 'ui_zc_z_chengzhangjijin';
    };
    FirstRechargeIconRule.CheckShow = function () {
        var config = GameGlobal.Config.FirstRechargeConfig;
        for (var key in config) {
            if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                return true;
            }
        }
        /*成长基金 */
        var growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (growupData && growupData.isOpenActivity()) {
            return true;
        }
        if (growupData && growupData.canReward()) {
            return true;
        }
        /*投资计划 */
        var investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12);
        if (investData && investData.isOpenActivity()) {
            return true;
        }
        if (investData && investData.canReward()) {
            return true;
        }
        /*消费有礼 */
        var consumData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13);
        if (consumData && consumData.isOpenActivity()) {
            return true;
        }
        return false;
    };
    FirstRechargeIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    FirstRechargeIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.GrowUpModel.IsRedPoint();
    };
    FirstRechargeIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(GrowUpWin);
    };
    return FirstRechargeIconRule;
}(RuleIconBase));
__reflect(FirstRechargeIconRule.prototype, "FirstRechargeIconRule");
//# sourceMappingURL=FirstRechargeIconRule.js.map