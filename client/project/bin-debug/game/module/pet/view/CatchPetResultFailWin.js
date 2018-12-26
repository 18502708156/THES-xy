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
var CatchPetResultFailWin = (function (_super) {
    __extends(CatchPetResultFailWin, _super);
    function CatchPetResultFailWin() {
        var _this = _super.call(this) || this;
        _this.m_BtnStr = "";
        _this.m_EndTime = 5;
        _this.skinName = "CatchPetResultFailSkin";
        return _this;
    }
    CatchPetResultFailWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.AddClick(this.closeBtn, this.OnClick);
    };
    ;
    CatchPetResultFailWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("退出");
        this.SetCloseFunc(param[1]);
        _super.prototype.OnOpen.call(this);
        this.m_EndTime = 5;
        this.updateCloseBtnLabel();
        this.AddTimer(1000, 6, this.updateCloseBtnLabel);
    };
    CatchPetResultFailWin.prototype.SetCloseFunc = function (func) {
        this.closeFunc = func;
    };
    CatchPetResultFailWin.prototype.SetBtnLabel = function (text) {
        this.m_BtnStr = text;
    };
    CatchPetResultFailWin.prototype.OnClose = function () {
        TimerManager.ins().remove(this.updateCloseBtnLabel, this);
        if (this.closeFunc) {
            this.closeFunc();
            this.closeFunc = null;
        }
    };
    CatchPetResultFailWin.prototype.updateCloseBtnLabel = function () {
        this.m_EndTime--;
        if (this.m_EndTime <= 0)
            ViewManager.ins().close(this);
        this.closeBtn.label = this.m_BtnStr + "(" + this.m_EndTime + "s)";
    };
    ;
    CatchPetResultFailWin.prototype.OnClick = function (e) {
        switch (e.target) {
            case this.closeBtn:
                this.CloseSelf();
                break;
        }
    };
    CatchPetResultFailWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return CatchPetResultFailWin;
}(BaseEuiView));
__reflect(CatchPetResultFailWin.prototype, "CatchPetResultFailWin");
//# sourceMappingURL=CatchPetResultFailWin.js.map