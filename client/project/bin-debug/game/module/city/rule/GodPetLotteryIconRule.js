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
var GodPetLotteryIconRule = (function (_super) {
    __extends(GodPetLotteryIconRule, _super);
    //降服神兽
    function GodPetLotteryIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.GODPETACTIVE_LOTTERY_NOTICE];
        return _this;
    }
    GodPetLotteryIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_122, true) && GameGlobal.GodPetActiveModel.IsGodPetLotteryOpen();
    };
    GodPetLotteryIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.GodPetActiveModel.CanLottery();
    };
    GodPetLotteryIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(GodPetActiveLotteryWin);
    };
    return GodPetLotteryIconRule;
}(RuleIconBase));
__reflect(GodPetLotteryIconRule.prototype, "GodPetLotteryIconRule");
//# sourceMappingURL=GodPetLotteryIconRule.js.map