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
var YingYuanEnAiPanel = (function (_super) {
    __extends(YingYuanEnAiPanel, _super);
    function YingYuanEnAiPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "YingYuanEnAiWupingSkin";
        return _this;
    }
    YingYuanEnAiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "提示";
        this._AddClick(this.bnt, this.OnClick);
        this._AddClick(this.bnt0, this._OnClick);
        this._AddClick(this.shop, this.GoShop);
        this.currentState = param[0];
        if (param[1]) {
            this.base.setItemData(param[1]);
            this.shop0.text = this.base.getText() + "*" + this.base.getCount();
        }
        if (param[2]) {
            this.priceicon.setType(param[2].id);
            this.priceicon.setPrice(param[2].count);
        }
        this.fun = param[3];
    };
    YingYuanEnAiPanel.prototype.OnClick = function () {
        this.fun();
    };
    YingYuanEnAiPanel.prototype.GoShop = function () {
        ViewManager.ins().close(this);
    };
    YingYuanEnAiPanel.prototype._OnClick = function () {
        ViewManager.ins().close(this);
    };
    YingYuanEnAiPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanEnAiPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanEnAiPanel;
}(BaseEuiView));
__reflect(YingYuanEnAiPanel.prototype, "YingYuanEnAiPanel", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanEnAiPanel.js.map