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
var GodPetAwardIconRule = (function (_super) {
    __extends(GodPetAwardIconRule, _super);
    //神兽降临
    function GodPetAwardIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.firstTap = true;
        _this.updateMessage = [MessageDef.GODPETACTIVE_UPDATE_INFO];
        return _this;
    }
    GodPetAwardIconRule.prototype.checkShowIcon = function () {
        this.setTime(GameGlobal.GodPetActiveModel.GetEndtime());
        return Deblocking.Check(DeblockingType.TYPE_123, true) && GameGlobal.GodPetActiveModel.IsOpenActive();
    };
    GodPetAwardIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.GodPetActiveModel.mRedPoint;
    };
    GodPetAwardIconRule.prototype.tapExecute = function () {
        this.firstTap = false;
        ViewManager.ins().open(GodPetActiveAwardWin);
    };
    return GodPetAwardIconRule;
}(RuleIconBase));
__reflect(GodPetAwardIconRule.prototype, "GodPetAwardIconRule");
//# sourceMappingURL=GodPetAwardIconRule.js.map