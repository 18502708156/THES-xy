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
var RankingRule = (function (_super) {
    __extends(RankingRule, _super);
    function RankingRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE];
        return _this;
    }
    RankingRule.prototype.checkShowRedPoint = function () {
        return false; // return GameGlobal.RankingModel.isRedPoint() && GameGlobal.actorModel.level >= GameGlobal.Config.FuncOpenConfig[86].conditionnum;;
    };
    RankingRule.prototype.checkShowIcon = function () {
        return false; // return Deblocking.Check(DeblockingType.TYPE_86, true)
    };
    RankingRule.prototype.tapExecute = function () {
        ViewManager.ins().open(RankingWin);
    };
    return RankingRule;
}(RuleIconBase));
__reflect(RankingRule.prototype, "RankingRule");
//# sourceMappingURL=RankingRule.js.map