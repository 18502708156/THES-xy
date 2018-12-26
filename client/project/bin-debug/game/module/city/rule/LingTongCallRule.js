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
var LingTongCallRule = (function (_super) {
    __extends(LingTongCallRule, _super);
    function LingTongCallRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    LingTongCallRule.prototype.checkShowIcon = function () {
        return Deblocking.IsDeblocking(DeblockingType.TYPE_116);
    };
    LingTongCallRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    LingTongCallRule.prototype.tapExecute = function () {
        ViewManager.ins().open(ElfCallPanel);
    };
    return LingTongCallRule;
}(RuleIconBase));
__reflect(LingTongCallRule.prototype, "LingTongCallRule");
//# sourceMappingURL=LingTongCallRule.js.map