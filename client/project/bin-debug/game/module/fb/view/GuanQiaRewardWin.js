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
var GuanQiaRewardWin = (function (_super) {
    __extends(GuanQiaRewardWin, _super);
    function GuanQiaRewardWin() {
        return _super.call(this) || this;
    }
    GuanQiaRewardWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CheckRewardSkin";
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(GuanQiaRewardPanel, { skinName: "GuanqiajiangliSkin" })
        ]);
    };
    ;
    GuanQiaRewardWin.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.commonWindowBg.OnAdded(this);
    };
    ;
    GuanQiaRewardWin.prototype.OnClose = function () {
        _super.prototype.OnClose.call(this);
        this.commonWindowBg.OnRemoved();
    };
    ;
    GuanQiaRewardWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    GuanQiaRewardWin.prototype.OnOpenIndex = function (openIndex) {
        return true;
    };
    GuanQiaRewardWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GuanQiaRewardWin;
}(BaseEuiView));
__reflect(GuanQiaRewardWin.prototype, "GuanQiaRewardWin", ["ICommonWindow"]);
//# sourceMappingURL=GuanQiaRewardWin.js.map