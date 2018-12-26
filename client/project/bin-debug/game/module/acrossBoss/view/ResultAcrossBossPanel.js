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
var ResultAcrossBossPanel = (function (_super) {
    __extends(ResultAcrossBossPanel, _super);
    function ResultAcrossBossPanel() {
        var _this = _super.call(this) || this;
        _this.m_BtnStr = "确定";
        _this.m_EndTime = 5;
        _this.bFist = true;
        _this.skinName = "ResultBossWinSkin";
        return _this;
    }
    ResultAcrossBossPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.AddClick(this.closeBtn, this.OnClick);
        this.listBoos.itemRenderer = ItemBase;
    };
    ;
    ResultAcrossBossPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.m_EndTime = 5;
        this.reWard = param[0];
        this.listBoos.dataProvider = new eui.ArrayCollection(this.reWard);
        // this.updateCloseBtnLabel();
        this.AddTimer(1000, 6, this.updateCloseBtnLabel);
    };
    ResultAcrossBossPanel.prototype.SetCloseFunc = function (func) {
        this.closeFunc = func;
    };
    ResultAcrossBossPanel.prototype.SetBtnLabel = function (text) {
        this.m_BtnStr = text;
    };
    ResultAcrossBossPanel.prototype.SetTitleLabel = function (text) {
        this.titleLabel.text = text;
    };
    ResultAcrossBossPanel.prototype.OnClose = function () {
        TimerManager.ins().remove(this.updateCloseBtnLabel, this);
        if (this.closeFunc) {
            this.closeFunc();
            this.closeFunc = null;
        }
    };
    ResultAcrossBossPanel.prototype.updateCloseBtnLabel = function () {
        // if(this.bFist)
        // {
        // 	this.bFist = false
        // 	this.listBoos.dataProvider = new eui.ArrayCollection(this.reWard);
        // }
        this.m_EndTime--;
        if (this.m_EndTime <= 0)
            ViewManager.ins().close(this);
        this.closeBtn.label = this.m_BtnStr + "(" + this.m_EndTime + "s)";
    };
    ;
    ResultAcrossBossPanel.prototype.OnClick = function (e) {
        switch (e.target) {
            case this.closeBtn:
                this.CloseSelf();
                break;
        }
    };
    ResultAcrossBossPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ResultAcrossBossPanel;
}(BaseEuiView));
__reflect(ResultAcrossBossPanel.prototype, "ResultAcrossBossPanel");
//# sourceMappingURL=ResultAcrossBossPanel.js.map