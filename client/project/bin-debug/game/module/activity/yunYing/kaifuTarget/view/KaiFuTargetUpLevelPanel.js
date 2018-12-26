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
var KaiFuTargetUpLevelPanel = (function (_super) {
    __extends(KaiFuTargetUpLevelPanel, _super);
    function KaiFuTargetUpLevelPanel() {
        var _this = _super.call(this) || this;
        _this.activityType = ActivityKaiFuFuncType.ACT_1_Upgrade;
        _this.skinName = "KaiFuTargetUpLevelPanelSkin";
        return _this;
    }
    KaiFuTargetUpLevelPanel.prototype.UpdateContent = function () {
        _super.prototype.UpdateContent.call(this);
        this.value_txt.text = "当前等级：" + GameGlobal.actorModel.level;
    };
    return KaiFuTargetUpLevelPanel;
}(KaiFuTargetBasePanel));
__reflect(KaiFuTargetUpLevelPanel.prototype, "KaiFuTargetUpLevelPanel");
//# sourceMappingURL=KaiFuTargetUpLevelPanel.js.map