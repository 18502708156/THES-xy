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
var KaiFuTargetReChargePanel = (function (_super) {
    __extends(KaiFuTargetReChargePanel, _super);
    function KaiFuTargetReChargePanel() {
        var _this = _super.call(this) || this;
        _this.activityType = ActivityKaiFuFuncType.ACT_3_RechargeContinue;
        _this.skinName = "KaiFuTargetReChargePanelSkin";
        return _this;
    }
    KaiFuTargetReChargePanel.prototype._OnClick = function (e) {
        RechargeWin.Open();
    };
    return KaiFuTargetReChargePanel;
}(KaiFuTargetBasePanel));
__reflect(KaiFuTargetReChargePanel.prototype, "KaiFuTargetReChargePanel");
//# sourceMappingURL=KaiFuTargetReChargePanel.js.map