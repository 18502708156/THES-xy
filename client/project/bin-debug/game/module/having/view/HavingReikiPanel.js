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
var HavingReikiPanel = (function (_super) {
    __extends(HavingReikiPanel, _super);
    function HavingReikiPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.HavingLingqModel;
        _this.mModelRedPoint = GameGlobal.HavingLingqModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.tiannv_nimbus;
        return _this;
    }
    HavingReikiPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btnSkin.visible = false;
    };
    HavingReikiPanel.RedPointCheck = function () {
        return GameGlobal.HavingLingqModel.mRedPoint.IsRedPoint();
    };
    HavingReikiPanel.NAME = "灵气";
    return HavingReikiPanel;
}(RoleRidePanel));
__reflect(HavingReikiPanel.prototype, "HavingReikiPanel");
//# sourceMappingURL=HavingReikiPanel.js.map