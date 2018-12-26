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
var FriendRule = (function (_super) {
    __extends(FriendRule, _super);
    function FriendRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.FRIEND_RED_POINT_CHANGE, MessageDef.LEVEL_CHANGE];
        return _this;
    }
    FriendRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.FriendModel.checkRedPoint();
    };
    FriendRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_89, true);
    };
    FriendRule.prototype.tapExecute = function () {
        ViewManager.ins().open(FriendMainPanel);
    };
    return FriendRule;
}(RuleIconBase));
__reflect(FriendRule.prototype, "FriendRule");
//# sourceMappingURL=FriendRule.js.map