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
var TianxPanel = (function (_super) {
    __extends(TianxPanel, _super);
    function TianxPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.TianxModel;
        _this.mModelRedPoint = GameGlobal.TianxModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.fairy;
        return _this;
    }
    TianxPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_27);
    };
    TianxPanel.RedPointCheck = function () {
        return GameGlobal.TianxModel.mRedPoint.IsRedPoint();
    };
    TianxPanel.NAME = "守护";
    return TianxPanel;
}(RoleRidePanel));
__reflect(TianxPanel.prototype, "TianxPanel");
//# sourceMappingURL=TianxPanel.js.map