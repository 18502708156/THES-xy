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
var BossIconRule = (function (_super) {
    __extends(BossIconRule, _super);
    function BossIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ALL_BOSS_NOTICE];
        _this.tar["redPoint"] = _this.tar.getChildByName("redPoint");
        return _this;
    }
    BossIconRule.prototype.checkShowIcon = function () {
        return true;
    };
    BossIconRule.prototype.checkShowRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_44, true)) {
            return false;
        }
        return GameGlobal.BossModel.IsRedPoint();
    };
    BossIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(BossMainPanel);
    };
    return BossIconRule;
}(RuleIconBase));
__reflect(BossIconRule.prototype, "BossIconRule");
//# sourceMappingURL=BossIconRule.js.map