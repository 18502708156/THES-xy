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
var HavingHuanPanel = (function (_super) {
    __extends(HavingHuanPanel, _super);
    function HavingHuanPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.HavingHuanModel;
        _this.mModelRedPoint = GameGlobal.HavingHuanModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.tiannv_flower;
        return _this;
    }
    HavingHuanPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btnSkin.visible = false;
    };
    HavingHuanPanel.RedPointCheck = function () {
        return GameGlobal.HavingHuanModel.mRedPoint.IsRedPoint();
    };
    HavingHuanPanel.NAME = "花辇";
    return HavingHuanPanel;
}(RoleRidePanel));
__reflect(HavingHuanPanel.prototype, "HavingHuanPanel");
//# sourceMappingURL=HavingHuanPanel.js.map