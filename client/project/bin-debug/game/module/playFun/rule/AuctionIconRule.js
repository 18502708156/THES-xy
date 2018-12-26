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
var AuctionIconRule = (function (_super) {
    __extends(AuctionIconRule, _super);
    function AuctionIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.AUCTION_REDPOINT_UPDATE];
        return _this;
    }
    AuctionIconRule.prototype.checkShowIcon = function () {
        if (Deblocking.Check(DeblockingType.TYPE_112, true)) {
            return true;
        }
        return false;
    };
    AuctionIconRule.prototype.checkShowRedPoint = function () {
        var view = ViewManager.ins().getView(AuctionMainPanel);
        if (view) {
            GameGlobal.AuctionModel.isRedPoint = false;
        }
        return GameGlobal.AuctionModel.isRedPoint;
    };
    AuctionIconRule.prototype.tapExecute = function () {
        GameGlobal.AuctionModel.isRedPoint = false;
        ViewManager.ins().open(AuctionMainPanel);
    };
    return AuctionIconRule;
}(RuleIconBase));
__reflect(AuctionIconRule.prototype, "AuctionIconRule");
//# sourceMappingURL=AuctionIconRule.js.map