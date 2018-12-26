/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/6 14:21
 * @meaning: 选择提示界面
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
var TipByBox = (function (_super) {
    __extends(TipByBox, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TipByBox() {
        var _this = _super.call(this) || this;
        _this.sure = false;
        _this.skinName = "TipByboxSkin";
        return _this;
    }
    //0列表数据 1控制勾选框的布尔值  2标题
    TipByBox.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.AddClick(this.sureBtn, this.OnSure);
        this.AddClick(this.notBtn, this.CloseSelf);
        this.AddClick(this.checkBox1, this.OnCheckBox);
        this.warnLabel.text = param[0] || "您选择分解的命格中存在高品质命格，是否确认分解？";
        this.bSelect = param[1];
        this.checkBox1.selected = !this.bSelect;
        this.commonDialog.title = param[2] || "提 示"; //标题
        this.lbBoxTip.text = param[3] || "本次登录不再提示"; //标题
        this.callback = param[4];
        // this.updateContent()
    };
    TipByBox.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
        if (this.callback) {
            this.callback(this.sure);
        }
        this.callback = null;
    };
    TipByBox.prototype.OnSure = function () {
        this.sure = true;
        this.CloseSelf();
    };
    TipByBox.prototype.OnCheckBox = function () {
        this.bSelect = !this.checkBox1.selected;
        //暂时无法通用
        GameGlobal.DestinyController.bShowResolveTip = this.bSelect;
    };
    TipByBox.prototype.updateContent = function () {
    };
    TipByBox.LAYER_LEVEL = LayerManager.UI_Popup;
    return TipByBox;
}(BaseEuiView));
__reflect(TipByBox.prototype, "TipByBox");
//# sourceMappingURL=TipByBox.js.map