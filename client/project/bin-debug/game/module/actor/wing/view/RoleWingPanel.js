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
var RoleWingPanel = (function (_super) {
    __extends(RoleWingPanel, _super);
    function RoleWingPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.UserWing;
        _this.mModelRedPoint = GameGlobal.UserWing.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.wing;
        return _this;
    }
    RoleWingPanel.RedPointCheck = function () {
        return GameGlobal.UserWing.mRedPoint.IsRedPoint();
    };
    RoleWingPanel.NAME = "翅膀";
    return RoleWingPanel;
}(RoleRidePanel));
__reflect(RoleWingPanel.prototype, "RoleWingPanel");
//# sourceMappingURL=RoleWingPanel.js.map