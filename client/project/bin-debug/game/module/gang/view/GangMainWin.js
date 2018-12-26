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
var GangMainWin = (function (_super) {
    __extends(GangMainWin, _super);
    function GangMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMainSkin";
        _this.observe(MessageDef.GANG_EXIT_NOTICE, _this.HandleExit);
        _this.observe(MessageDef.GANG_UPDATE_PANTAOINFO, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANG_SKILL_UP, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANG_SKILL_LEARN_UP, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GUILD_CONTRIB_UPDATE, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.ITEM_COUNT_CHANGE, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANG_UPDATE_FBCOUNT, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.GANGBOSS_UPDATE_INFO, _this.UpdateTabBtnRedPoint);
        _this.observe(MessageDef.ACTIVITY_LIST_INFO, _this.UpdateTabBtnRedPoint);
        return _this;
    }
    GangMainWin.prototype.childrenCreated = function () {
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(GangInfoPanel, { skinName: "GangInfoSkin" }),
            TabView.CreateTabViewData(GangFuBenPanel),
            TabView.CreateTabViewData(GangSkillListView, { skinName: "GangSkillListSkin" }),
            TabView.CreateTabViewData(GangPantaoYuanPanel, { skinName: "GangPangTaoHuiSkin" })
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
    };
    GangMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.commonWindowBg.OnAdded(this, index);
        this.UpdateTabBtnRedPoint();
    };
    GangMainWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (!GameGlobal.GangModel.HasGang()) {
            UserTips.ins().showTips("您还没有帮会，请先加入帮会");
            return false;
        }
        return Deblocking.Check(DeblockingType.TYPE_50);
    };
    GangMainWin.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.VIEW_APPILICANT)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.CONTRIBUTE)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_MAP_ASSEMBLED)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_EXCHANGE)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_BATTLE)
            || GameGlobal.GangBossModel.IsGangBossAct()
            || GameGlobal.GangModel.IsGangBattleOpen());
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_FUBEN));
        this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.SKILL_UPGRADE));
        this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.EAT_PEACH)
            || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.PEACH_AWARD));
    };
    GangMainWin.prototype.OnClose = function () {
        MainBottomPanel.CloseNav(this);
    };
    GangMainWin.prototype.HandleExit = function () {
        ViewManager.ins().close(this);
    };
    GangMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    /////////////////////////////////////////////////////////////////////////////
    GangMainWin.GANG_INFO_PANEL = 0;
    GangMainWin.GANG_FUBEN_PANEL = 1;
    GangMainWin.GANG_SKILL_PANEL = 2;
    GangMainWin.GANG_PANTAOHUI_PANEL = 3;
    return GangMainWin;
}(BaseEuiView));
__reflect(GangMainWin.prototype, "GangMainWin", ["ICommonWindow"]);
//# sourceMappingURL=GangMainWin.js.map