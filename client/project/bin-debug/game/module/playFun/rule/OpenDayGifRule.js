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
var OpenDayGifRule = (function (_super) {
    __extends(OpenDayGifRule, _super);
    function OpenDayGifRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.LOGINDAYGIF];
        return _this;
    }
    OpenDayGifRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.OpenDayGifModel.OpenDayPointRed();
    };
    OpenDayGifRule.prototype.checkShowIcon = function () {
        var show = GameGlobal.OpenDayGifModel.OpenDayIcon();
        if (show) {
            this.tar.icon = GameGlobal.OpenDayGifModel.GetShowDayImg();
        }
        return Deblocking.Check(DeblockingType.TYPE_130, true) && show;
    };
    OpenDayGifRule.prototype.tapExecute = function () {
        ViewManager.ins().open(OpenDayGifWin);
    };
    OpenDayGifRule.Open = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_130)) {
            return;
        }
        if (!GameGlobal.OpenDayGifModel.OpenDayIcon()) {
            UserTips.InfoTip("�����");
            return;
        }
        ViewManager.ins().open(OpenDayGifWin);
    };
    return OpenDayGifRule;
}(RuleIconBase));
__reflect(OpenDayGifRule.prototype, "OpenDayGifRule");
//# sourceMappingURL=OpenDayGifRule.js.map