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
var RoleRidePanel = (function (_super) {
    __extends(RoleRidePanel, _super);
    function RoleRidePanel() {
        var _this = _super.call(this) || this;
        _this.mWindowHelpId = 1;
        _this.mHasDress = true;
        _this.mModel = GameGlobal.UserRide;
        _this.mModelRedPoint = GameGlobal.UserRide.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.ride;
        return _this;
    }
    // 引导对象
    RoleRidePanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.btnCulture,
            _a[2] = this.btnAuto,
            _a;
        var _a;
    };
    RoleRidePanel.RedPointCheck = function () {
        return GameGlobal.UserRide.mRedPoint.IsRedPoint();
    };
    RoleRidePanel.NAME = "坐骑";
    return RoleRidePanel;
}(RoleTemplatePanel));
__reflect(RoleRidePanel.prototype, "RoleRidePanel");
//# sourceMappingURL=RoleRidePanel.js.map