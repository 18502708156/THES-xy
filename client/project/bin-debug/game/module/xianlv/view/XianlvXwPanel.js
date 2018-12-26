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
var XianlvXwPanel = (function (_super) {
    __extends(XianlvXwPanel, _super);
    function XianlvXwPanel() {
        var _this = _super.call(this) || this;
        _this.mWindowHelpId = 7;
        _this.mHasDress = false;
        _this.mModel = GameGlobal.XianlvXwModel;
        _this.mModelRedPoint = GameGlobal.XianlvXwModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.xianlv_circle;
        return _this;
    }
    XianlvXwPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        // this.SetEquipIconList(RoleRidePanel.EQUIP_ICON)
        this._AddClick(this.help, this._click);
    };
    XianlvXwPanel.RedPointCheck = function () {
        return GameGlobal.XianlvXwModel.mRedPoint.IsRedPoint();
    };
    XianlvXwPanel.prototype._click = function () {
        ViewManager.ins().open(ActivityDescPanel, 7, "规则说明");
    };
    XianlvXwPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_18);
    };
    XianlvXwPanel.NAME = "仙位";
    return XianlvXwPanel;
}(RoleTemplatePanel));
__reflect(XianlvXwPanel.prototype, "XianlvXwPanel");
//# sourceMappingURL=XianlvXwPanel.js.map