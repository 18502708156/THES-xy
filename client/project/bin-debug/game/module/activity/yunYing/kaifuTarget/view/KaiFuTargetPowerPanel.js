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
var KaiFuTargetPowerPanel = (function (_super) {
    __extends(KaiFuTargetPowerPanel, _super);
    function KaiFuTargetPowerPanel() {
        var _this = _super.call(this) || this;
        _this.activityType = ActivityKaiFuFuncType.ACT_20_RechargeGroupon;
        _this.skinName = "KaiFuTargetPowerPanelSkin";
        return _this;
    }
    KaiFuTargetPowerPanel.prototype.UpdateContent = function () {
        _super.prototype.UpdateContent.call(this);
        this.value_txt.text = "当前战力：" + CommonUtils.overLength(GameGlobal.actorModel.power);
    };
    return KaiFuTargetPowerPanel;
}(KaiFuTargetBasePanel));
__reflect(KaiFuTargetPowerPanel.prototype, "KaiFuTargetPowerPanel");
//# sourceMappingURL=KaiFuTargetPowerPanel.js.map