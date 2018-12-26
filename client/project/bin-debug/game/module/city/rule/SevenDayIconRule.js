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
var SevenDayIconRule = (function (_super) {
    __extends(SevenDayIconRule, _super);
    function SevenDayIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_ADVANCED_INFO,
            MessageDef.ACTIVITY_UPDATE,
            MessageDef.ACTIVITY_INFO,
            MessageDef.ACTIVITY_DABIAO_UPDATE,
            MessageDef.ACTIVITY_RACE_HISTORY,
            MessageDef.ACTIVITY_IS_GET_AWARDS];
        return _this;
    }
    SevenDayIconRule.prototype.checkShowIcon = function () {
        var b = Deblocking.Check(DeblockingType.TYPE_103, true) && GameGlobal.ActivityKaiFuModel.hasActivityQiTian();
        return b;
    };
    SevenDayIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.ActivityKaiFuModel.RedPointQiTian();
    };
    SevenDayIconRule.prototype.tapExecute = function () {
        KaiFuActivityWin.Show();
    };
    return SevenDayIconRule;
}(RuleIconBase));
__reflect(SevenDayIconRule.prototype, "SevenDayIconRule");
//# sourceMappingURL=SevenDayIconRule.js.map