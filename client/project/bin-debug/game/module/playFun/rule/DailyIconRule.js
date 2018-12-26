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
var DailyIconRule = (function (_super) {
    __extends(DailyIconRule, _super);
    function DailyIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.DAILY_REDPOINT_NOTICE];
        return _this;
    }
    DailyIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_48, true);
    };
    DailyIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.DailyModel.IsRedPoint();
    };
    DailyIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(DailyMainWin);
    };
    return DailyIconRule;
}(RuleIconBase));
__reflect(DailyIconRule.prototype, "DailyIconRule");
//# sourceMappingURL=DailyIconRule.js.map