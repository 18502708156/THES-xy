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
var YingYuanZjmPanel = (function (_super) {
    __extends(YingYuanZjmPanel, _super);
    function YingYuanZjmPanel() {
        var _this = _super.call(this) || this;
        _this.m_EndTime = 5;
        _this.skinName = "YingYuanZjmSkin";
        return _this;
    }
    YingYuanZjmPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.updateContent();
        this.m_EndTime = 5;
        this.AddClick(this.closeBtn, this._OnClick);
        this.AddTimer(1000, 6, this.updateCloseBtnLabel);
    };
    YingYuanZjmPanel.prototype.updateContent = function () {
        var dataRole = GameGlobal.YingYuanModel.partner;
        this.face["face"].source = ResDataPath.GetHeadImgName(dataRole.job, dataRole.sex);
    };
    YingYuanZjmPanel.prototype.updateCloseBtnLabel = function () {
        this.m_EndTime--;
        if (this.m_EndTime <= 0)
            ViewManager.ins().close(this);
        this.closeBtn.label = "确定(" + this.m_EndTime + "s)";
    };
    ;
    YingYuanZjmPanel.prototype._OnClick = function (e) {
        ViewManager.ins().close(this);
    };
    YingYuanZjmPanel.prototype.OnClose = function () {
    };
    YingYuanZjmPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanZjmPanel;
}(BaseEuiView));
__reflect(YingYuanZjmPanel.prototype, "YingYuanZjmPanel", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanZjmPanel.js.map