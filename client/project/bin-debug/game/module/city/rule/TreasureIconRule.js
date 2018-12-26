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
var TreasureIconRule = (function (_super) {
    __extends(TreasureIconRule, _super);
    function TreasureIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.LUCK_RECORD];
        return _this;
    }
    TreasureIconRule.prototype.checkShowIcon = function () {
        if (Deblocking.Check(DeblockingType.TYPE_111, true)) {
            return true;
        }
        return false;
    };
    TreasureIconRule.prototype.checkShowRedPoint = function () {
        if (TreasureIconRule.mIsFirst || GameGlobal.TreasureHuntModel.IsFree()) {
            return true;
        }
        return false;
    };
    TreasureIconRule.prototype.tapExecute = function () {
        TreasureIconRule.mIsFirst = false;
        ViewManager.ins().open(TreasureHuntMainPanel);
    };
    TreasureIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(1);
    };
    TreasureIconRule.mIsFirst = true;
    return TreasureIconRule;
}(RuleIconBase));
__reflect(TreasureIconRule.prototype, "TreasureIconRule");
//# sourceMappingURL=TreasureIconRule.js.map