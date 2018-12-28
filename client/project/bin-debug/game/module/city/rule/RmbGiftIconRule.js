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
var RmbGiftIconRule = (function (_super) {
    __extends(RmbGiftIconRule, _super);
    //人民币礼包
    function RmbGiftIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        _this.effX = RuleIconBase.POS1_X;
        _this.effY = RuleIconBase.POS1_Y;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    RmbGiftIconRule.prototype.checkShowIcon = function () {
        var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9);
        if (data) {
            var config = data.GetConfig();
            if (!config[data.reachday]) {
                return false;
            }
            this.tar.icon = config[data.reachday].icon;
            if (data.runday < data.reachday) {
                return false;
            }
            if (data.runday == data.reachday && !data.isLastDay()) {
                return true;
            }
            if (data.isOpenActivity() && Deblocking.Check(DeblockingType.TYPE_104, true)) {
                return true;
            }
        }
        return false;
    };
    RmbGiftIconRule.prototype.checkShowRedPoint = function () {
        var data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(9);
        if (!data)
            return false;
        return data.canGetRecordByIndex(data.reachday + 1);
    };
    RmbGiftIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    RmbGiftIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(RmbGiftPanel);
    };
    return RmbGiftIconRule;
}(RuleIconBase));
__reflect(RmbGiftIconRule.prototype, "RmbGiftIconRule");
//# sourceMappingURL=RmbGiftIconRule.js.map