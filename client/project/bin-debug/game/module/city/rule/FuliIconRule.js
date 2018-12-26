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
var FuliIconRule = (function (_super) {
    __extends(FuliIconRule, _super);
    function FuliIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.RP_SIGN_UPDATE,];
        return _this;
    }
    FuliIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_125, true);
    };
    FuliIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.FuliModel.IsRedPoint();
    };
    FuliIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(FuliWin);
    };
    return FuliIconRule;
}(RuleIconBase));
__reflect(FuliIconRule.prototype, "FuliIconRule");
//# sourceMappingURL=FuliIconRule.js.map