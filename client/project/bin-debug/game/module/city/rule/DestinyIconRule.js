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
var DestinyIconRule = (function (_super) {
    __extends(DestinyIconRule, _super);
    function DestinyIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    DestinyIconRule.prototype.checkShowIcon = function () {
        return Deblocking.IsDeblocking(DeblockingType.TYPE_144);
    };
    DestinyIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.DestinyController.mRedPoint.IsRedPoint();
    };
    DestinyIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(DestinyUpWin, 1);
    };
    return DestinyIconRule;
}(RuleIconBase));
__reflect(DestinyIconRule.prototype, "DestinyIconRule");
//# sourceMappingURL=DestinyIconRule.js.map