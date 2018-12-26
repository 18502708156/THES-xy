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
var MailIconRule = (function (_super) {
    __extends(MailIconRule, _super);
    function MailIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.MAIL_DATA_CHANGE, MessageDef.MAIL_GET_ITEM];
        return _this;
    }
    MailIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_134, true);
    };
    MailIconRule.prototype.checkShowRedPoint = function () {
        return MailIconRule.CheckShowRedPoint() ? 1 : 0;
    };
    MailIconRule.CheckShowRedPoint = function () {
        return MailModel.ins().mailData ? MailModel.ins().getUnreadMail() : false;
    };
    MailIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(MailWin);
    };
    return MailIconRule;
}(RuleIconBase));
__reflect(MailIconRule.prototype, "MailIconRule");
//# sourceMappingURL=MailIconRule.js.map