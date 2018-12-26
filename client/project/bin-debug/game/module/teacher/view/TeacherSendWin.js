/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/5 18:21
 * @meaning: 传功界面
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
var TeacherSendWin = (function (_super) {
    __extends(TeacherSendWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TeacherSendWin() {
        var _this = _super.call(this) || this;
        _this.m_EndTime = 400;
        _this.nType = 0; //0师傅,1学生
        _this.skinName = "TeacherSendSkin";
        return _this;
    }
    TeacherSendWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.tLayerData = param[0]; //
        this.nType = param[1]; //
        this.updateContent();
        this.AddTimer(10, 510, this.updateCloseBtnLabel);
        this.commonDialog.showReturnBtn(false); //隐藏返回按钮
        if (this.tLayerData.tShows)
            this.roleShowPanelL.SetShowImage(this.tLayerData.tShows);
        if (this.tLayerData.sShows)
            this.roleShowPanelR.SetShowImage(this.tLayerData.sShows);
    };
    TeacherSendWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
        TimerManager.ins().remove(this.updateCloseBtnLabel, this);
    };
    TeacherSendWin.prototype.updateCloseBtnLabel = function () {
        this.m_EndTime--;
        var value = 100 - (this.m_EndTime / 400 * 100);
        this.bar.value = value;
        if (this.m_EndTime <= 0) {
            this.nType ? GameGlobal.TeacherManage.teachExp(this.tLayerData.no) : GameGlobal.TeacherManage.getExp(this.tLayerData.no);
            ViewManager.ins().close(this);
        }
    };
    ;
    TeacherSendWin.prototype.close = function () {
        ViewManager.ins().close(AnswerLayer);
        ViewManager.ins().close(this);
    };
    TeacherSendWin.prototype.updateContent = function () {
    };
    //
    TeacherSendWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return TeacherSendWin;
}(BaseEuiView));
__reflect(TeacherSendWin.prototype, "TeacherSendWin");
//# sourceMappingURL=TeacherSendWin.js.map