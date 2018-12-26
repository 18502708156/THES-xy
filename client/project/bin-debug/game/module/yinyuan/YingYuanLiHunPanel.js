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
var YingYuanLiHunPanel = (function (_super) {
    __extends(YingYuanLiHunPanel, _super);
    function YingYuanLiHunPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "YingYuanXiuShuSkin";
        return _this;
    }
    YingYuanLiHunPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "一纸休书";
        this._AddClick(this.bnt, this._OnClick);
        this.updateContent();
    };
    YingYuanLiHunPanel.prototype.updateContent = function () {
        var Config = GameGlobal.Config.MarryBaseConfig.frequency;
        this.DayTimes.text = "今日还可结婚：" + (Config - GameGlobal.YingYuanModel.marryInfo.today) + "/" + Config;
    };
    YingYuanLiHunPanel.prototype._OnClick = function () {
        GameGlobal.YingYuanModel.marryDivorce();
        ViewManager.ins().close(this);
    };
    YingYuanLiHunPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanLiHunPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanLiHunPanel;
}(BaseEuiView));
__reflect(YingYuanLiHunPanel.prototype, "YingYuanLiHunPanel", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanLiHunPanel.js.map