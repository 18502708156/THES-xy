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
var PetTonglPanel = (function (_super) {
    __extends(PetTonglPanel, _super);
    function PetTonglPanel() {
        var _this = _super.call(this) || this;
        _this.mHasDress = false;
        _this.mWindowHelpId = 9;
        _this.mModel = GameGlobal.PetTonglModel;
        _this.mModelRedPoint = GameGlobal.PetTonglModel.mRedPoint;
        _this.m_activityJiJieId = ActivityKaiFuJiJieType.pet_soul;
        return _this;
    }
    PetTonglPanel.RedPointCheck = function () {
        return GameGlobal.PetTonglModel.mRedPoint.IsRedPoint();
    };
    PetTonglPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_13);
    };
    PetTonglPanel.NAME = "通灵";
    return PetTonglPanel;
}(RoleTemplatePanel));
__reflect(PetTonglPanel.prototype, "PetTonglPanel");
//# sourceMappingURL=PetTonglPanel.js.map