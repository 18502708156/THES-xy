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
var ResultBasePanel = (function (_super) {
    __extends(ResultBasePanel, _super);
    function ResultBasePanel() {
        var _this = _super.call(this) || this;
        _this.m_BtnStr = "";
        _this.m_EndTime = 5;
        return _this;
    }
    ResultBasePanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.AddClick(this.closeBtn, this.OnClick);
    };
    ;
    ResultBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.m_EndTime = 5;
        this.updateCloseBtnLabel();
        TimerManager.ins().doTimer(1000, 6, this.updateCloseBtnLabel, this);
    };
    ResultBasePanel.prototype.SetCloseFunc = function (func) {
        this.closeFunc = func;
    };
    ResultBasePanel.prototype.SetBtnLabel = function (text) {
        this.m_BtnStr = text;
    };
    ResultBasePanel.prototype.SetTitleLabel = function (text) {
        if (this.titleLabel) {
            this.titleLabel.text = text;
        }
    };
    ResultBasePanel.prototype.OnClose = function () {
        TimerManager.ins().remove(this.updateCloseBtnLabel, this);
        if (this.closeFunc) {
            this.closeFunc();
            this.closeFunc = null;
        }
    };
    ResultBasePanel.prototype.updateCloseBtnLabel = function () {
        this.m_EndTime--;
        if (this.m_EndTime <= 0)
            ViewManager.ins().close(this);
        this.closeBtn.label = this.m_BtnStr + "(" + this.m_EndTime + "s)";
    };
    ;
    ResultBasePanel.prototype.OnClick = function (e) {
        switch (e.target) {
            case this.closeBtn:
                this.CloseSelf();
                break;
        }
    };
    ResultBasePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ResultBasePanel;
}(BaseEuiView));
__reflect(ResultBasePanel.prototype, "ResultBasePanel");
//# sourceMappingURL=ResultBasePanel.js.map