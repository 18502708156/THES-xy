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
var JingCaiIconRule = (function (_super) {
    __extends(JingCaiIconRule, _super);
    function JingCaiIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_UPDATE];
        return _this;
    }
    JingCaiIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.ActivityKaiFuModel.jingCaiIconRedPoin();
    };
    JingCaiIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_133, true))
            return false;
        if (GameGlobal.ActivityKaiFuModel.jingCai_huoDong().length != 0) {
            return true;
        }
        return false;
    };
    JingCaiIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(JingCaiActivityWin);
    };
    return JingCaiIconRule;
}(RuleIconBase));
__reflect(JingCaiIconRule.prototype, "JingCaiIconRule");
//# sourceMappingURL=JingCaiIconRule.js.map