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
var MailWin = (function (_super) {
    __extends(MailWin, _super);
    function MailWin() {
        return _super.call(this) || this;
    }
    MailWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MailSkin";
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(MailListPanel),
            TabView.CreateTabViewData(CustomServicePanel),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        if (!LocationProperty.NotCustionServer()) {
            // let customServicePanel = new CustomServicePanel
            // this.commonWindowBg.AddChildStack(customServicePanel)
        }
    };
    MailWin.prototype.OnOpen = function () {
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("邮件");
    };
    MailWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    MailWin.prototype.OnBackClick = function (clickType) { return 0; };
    MailWin.prototype.OnOpenIndex = function (openIndex) { return true; };
    MailWin.LAYER_LEVEL = LayerManager.UI_Main;
    return MailWin;
}(BaseEuiView));
__reflect(MailWin.prototype, "MailWin", ["ICommonWindow"]);
//# sourceMappingURL=MailWin.js.map