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
 * 福利_搖錢樹-vip弹窗
 */
var FuliGoldTreeVipPanel = (function (_super) {
    __extends(FuliGoldTreeVipPanel, _super);
    function FuliGoldTreeVipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliGoldTreeVIPCountSkin";
        return _this;
    }
    FuliGoldTreeVipPanel.prototype.childrenCreated = function () {
        this._AddClick(this.okBtn, this._OnClick);
        this._AddClick(this.goBtn, this._OnClick);
    };
    FuliGoldTreeVipPanel.prototype.OnOpen = function (str) {
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "提 示";
        this.describeLabel.textFlow = (new egret.HtmlTextParser).parser(str);
    };
    FuliGoldTreeVipPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.okBtn:
                ViewManager.ins().close(FuliGoldTreeVipPanel);
                break;
            case this.goBtn:
                ViewManager.ins().close(FuliGoldTreeVipPanel);
                ViewManager.ins().open(RechargeWin);
                break;
        }
    };
    FuliGoldTreeVipPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    //skinName
    //FuliGoldTreeVIPCountSkin.exml
    FuliGoldTreeVipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FuliGoldTreeVipPanel;
}(BaseEuiView));
__reflect(FuliGoldTreeVipPanel.prototype, "FuliGoldTreeVipPanel");
//# sourceMappingURL=FuliGoldTreeVipPanel.js.map