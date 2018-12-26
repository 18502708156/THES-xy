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
 * 红包打开介面
 */
var BriberyOpenPanel = (function (_super) {
    __extends(BriberyOpenPanel, _super);
    function BriberyOpenPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "briberyOpenSkin";
        //this._AddClick(this.com,this.CloseSelf);
        _this._AddClick(_this, _this.CloseSelf);
        _this._AddClick(_this.closeImg, _this.CloseSelf);
        _this._AddClick(_this.okBtn, _this._onclick);
        _this._AddClick(_this.com, _this._onclick);
        return _this;
    }
    BriberyOpenPanel.prototype.childrenCreated = function () {
        // this.observe(MessageDef.FULI_GET_RECEIVEBRIBERY, this.showItem);
    };
    BriberyOpenPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var msg = param[0];
        this.showItem(msg);
    };
    BriberyOpenPanel.prototype.showItem = function (msg) {
        if (msg.ret == true) {
            this.priceIcon.type = 3;
            this.priceIcon.setColor(0xFFD700);
            this.priceIcon.price = msg.bybNum;
        }
    };
    BriberyOpenPanel.prototype._onclick = function (e) {
        switch (e.currentTarget) {
            case this.okBtn:
                ViewManager.ins().close(BriberyOpenPanel);
                break;
            case this.com:
                ViewManager.ins().close(BriberyOpenPanel);
                break;
        }
    };
    BriberyOpenPanel.prototype.OnClose = function () {
    };
    BriberyOpenPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BriberyOpenPanel;
}(BaseEuiView));
__reflect(BriberyOpenPanel.prototype, "BriberyOpenPanel");
//# sourceMappingURL=BriberyOpenPanel.js.map