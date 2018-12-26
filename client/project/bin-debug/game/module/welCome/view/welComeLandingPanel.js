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
/**
 * 欢迎登陆_
 */
var WelComeLandingPanel = (function (_super) {
    __extends(WelComeLandingPanel, _super);
    function WelComeLandingPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._resources = ["ui_xsyd_bg", "xinshouyindao_json"];
        return _this;
    }
    WelComeLandingPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "welComeLandingSkin";
        this._AddClick(this.gotoImg, this._onclick);
        this._AddClick(this.com, this._onclick);
    };
    WelComeLandingPanel.prototype.OnOpen = function () {
        // let tab=GameGlobal.Config.GuideBaseConfig;
        // this.item0.setItemData(tab.givepet);
        // this.item1.setItemData(tab.givebyuan);
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        GameGlobal.GuideUtil.Finish(this, this.gotoImg);
    };
    WelComeLandingPanel.prototype._onclick = function (e) {
        // this.CloseSelf()
        this.Play();
    };
    WelComeLandingPanel.prototype.Play = function () {
        this.touchEnabled = false;
        this.touchChildren = false;
        egret.setTimeout(this.CloseSelf, this, 350);
        var item = new GoldFlyEff();
        item.mGap = 50;
        item.mCount = 16;
        item.mMax = 16;
        item.mSource = "ui_bm_qianb3";
        var pos = egret.$TempPoint;
        DisplayUtils.GetGlobalPos(this.effGroup, pos);
        var targetPos = new egret.Point;
        targetPos.x = 561;
        targetPos.y = 0;
        var view = ViewManager.ins().getView(MainTopPanel);
        if (view) {
            DisplayUtils.GetGlobalPos(view.byb, targetPos);
        }
        item.Play(new egret.Rectangle(pos.x, pos.y, this.effGroup.width, this.effGroup.height), targetPos.x, targetPos.y);
    };
    WelComeLandingPanel.prototype.OnClose = function () {
        GameLogic.SendWelcome();
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MAIN_TASK);
    };
    WelComeLandingPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return WelComeLandingPanel;
}(BaseEuiView));
__reflect(WelComeLandingPanel.prototype, "WelComeLandingPanel");
//# sourceMappingURL=welComeLandingPanel.js.map