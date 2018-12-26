/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:11
 * @meaning: 熔炼额外界面
 *
 **/
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
var BagMakeEx = (function (_super) {
    __extends(BagMakeEx, _super);
    function BagMakeEx() {
        return _super.call(this) || this;
    }
    BagMakeEx.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MailSkin";
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(BagMakeExListPanel)
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.commonWindowBg.tabBar.visible = false;
        if (!LocationProperty.NotCustionServer()) {
            // let customServicePanel = new CustomServicePanel
            // this.commonWindowBg.AddChildStack(customServicePanel)
        }
    };
    BagMakeEx.prototype.OnOpen = function () {
        this.commonWindowBg.OnAdded(this);
    };
    BagMakeEx.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    BagMakeEx.prototype.OnBackClick = function (clickType) { return 0; };
    BagMakeEx.prototype.OnOpenIndex = function (openIndex) { return true; };
    BagMakeEx.LAYER_LEVEL = LayerManager.UI_Main;
    return BagMakeEx;
}(BaseEuiView));
__reflect(BagMakeEx.prototype, "BagMakeEx", ["ICommonWindow"]);
//# sourceMappingURL=BagMakeEx.js.map