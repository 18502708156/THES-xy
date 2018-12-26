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
var DailyMainWin = (function (_super) {
    __extends(DailyMainWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DailyMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "DailyMainSkin";
        return _this;
    }
    DailyMainWin.prototype.childrenCreated = function () {
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(DailyInfoPanel, { skinName: "DailyInfoSkin" }),
            TabView.CreateTabViewData(DailyFomalhautMainPanel, { skinName: "DailyFomalhautMainSkin" }),
            TabView.CreateTabViewData(DailyPeacePanel, { skinName: "DailyPeaceSkin" }),
            TabView.CreateTabViewData(DailyTeamPanel, { skinName: "DailyTeamSkin" }),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
    };
    DailyMainWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_48);
    };
    DailyMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.commonWindowBg.OnAdded(this, index);
        this.observe(MessageDef.DAILY_MEDAL_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_ACTIVE_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_TEAM_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_PEACE_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    DailyMainWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    DailyMainWin.prototype.UpdateTabBtnRedPoint = function () {
        var redPointFlag = GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.MEDAL_UPGRADE)
            || GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.ACTIVE_BOX_REWARD)
            || GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.RES_RETRIEVE)
            || GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.EXP_RETRIEVE);
        this.commonWindowBg.ShowTalRedPoint(0, redPointFlag);
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.FOMALHAUT_NOTICE));
        this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.PEACE_REWARD));
        this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.DailyModel.IsRedPointDaily(DailyModelRedPoint.TEAM_REWARD));
    };
    DailyMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DailyMainWin;
}(BaseEuiView));
__reflect(DailyMainWin.prototype, "DailyMainWin", ["ICommonWindow"]);
//# sourceMappingURL=DailyMainWin.js.map