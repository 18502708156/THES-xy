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
var SwordPanel = (function (_super) {
    __extends(SwordPanel, _super);
    function SwordPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.SwordModel;
        _this.mModelRedPoint = GameGlobal.SwordModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.weapon;
        return _this;
    }
    SwordPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_28);
    };
    SwordPanel.RedPointCheck = function () {
        return GameGlobal.SwordModel.mRedPoint.IsRedPoint();
    };
    SwordPanel.NAME = "神兵";
    return SwordPanel;
}(RoleRidePanel));
__reflect(SwordPanel.prototype, "SwordPanel");
//# sourceMappingURL=SwordPanel.js.map