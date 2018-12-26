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
var GangProtectorMainWin = (function (_super) {
    __extends(GangProtectorMainWin, _super);
    function GangProtectorMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangProtectorMainSkin";
        _this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, _this.UpdateTabBtnRedPoint);
        return _this;
    }
    GangProtectorMainWin.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(GangDefendPanel, { skinName: "GangDefendPanelSkin", mContext: this }),
            TabView.CreateTabViewData(GangProtectorAwardPanel, { skinName: "GangProtectorAwardListSkin", mContext: this }),
        ]);
    };
    GangProtectorMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = 0;
        if (args && args.length > 0) {
            index = args[0];
        }
        this.commonWindowBg.OnAdded(this, index);
        this.UpdateTabBtnRedPoint();
    };
    GangProtectorMainWin.openCheck = function () {
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
    GangProtectorMainWin.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE));
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD));
    };
    GangProtectorMainWin.prototype.OnClose = function () {
    };
    GangProtectorMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    /////////////////////////////////////////////////////////////////////////////
    GangProtectorMainWin.GANG_PROTECTOR_PANEL = 0;
    GangProtectorMainWin.GANG_AWARD_PANEL = 1;
    return GangProtectorMainWin;
}(BaseEuiView));
__reflect(GangProtectorMainWin.prototype, "GangProtectorMainWin", ["ICommonWindow"]);
//# sourceMappingURL=GangProtectorMainWin.js.map