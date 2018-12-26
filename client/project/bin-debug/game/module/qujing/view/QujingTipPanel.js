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
var QujingTipPanel = (function (_super) {
    __extends(QujingTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QujingTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "QujingTipSkin";
        _this._AddClick(_this.btnEnter, _this._onClick);
        _this._AddClick(_this.btnCancel, _this._onClick);
        return _this;
    }
    QujingTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "提示";
        var doudleTime = GameGlobal.Config.EscortBaseConfig.doubletime;
        this.labTip.text = doudleTime[0].star + "-" + doudleTime[0].ends + "\u548C" + doudleTime[1].star + "-" + doudleTime[1].ends + "\u5956\u52B1\u7FFB\u500D";
    };
    QujingTipPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    QujingTipPanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.btnEnter:
                ViewManager.ins().open(QujingChooseWin);
                ViewManager.ins().close(this);
                break;
            case this.btnCancel:
                ViewManager.ins().close(this);
                break;
        }
    };
    QujingTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return QujingTipPanel;
}(BaseEuiView));
__reflect(QujingTipPanel.prototype, "QujingTipPanel");
//# sourceMappingURL=QujingTipPanel.js.map