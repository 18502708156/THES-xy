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
var CrossMainPanel = (function (_super) {
    __extends(CrossMainPanel, _super);
    // private guildWarView: CrossGuildWarPanel;
    function CrossMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    CrossMainPanel.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(CrossTeamPanel),
            TabView.CreateTabViewData(AcrossBossPanel),
            TabView.CreateTabViewData(TsumKoPanel),
        ]);
    };
    CrossMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this, param[0] || 0, param[1]);
        this.observe(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.TSUMKO_INFO, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.TSUMKO_UPDATE_LIST, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    CrossMainPanel.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.CheckTalRedPoint(2);
    };
    CrossMainPanel.prototype.OnOpenIndex = function (openIndex) {
        var openId = -1;
        if (openIndex == 1) {
            return Deblocking.Check(DeblockingType.TYPE_64);
        }
        else if (openIndex == 2) {
            return Deblocking.Check(DeblockingType.TYPE_114);
        }
        return true;
    };
    CrossMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (param[0] == 2) {
            return Deblocking.Check(DeblockingType.TYPE_114);
        }
        return Deblocking.Check(DeblockingType.TYPE_63);
    };
    CrossMainPanel.NAME = "跨服";
    CrossMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return CrossMainPanel;
}(BaseEuiView));
__reflect(CrossMainPanel.prototype, "CrossMainPanel");
//# sourceMappingURL=CrossMainPanel.js.map