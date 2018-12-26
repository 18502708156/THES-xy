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
var DailyResRetrieveWin = (function (_super) {
    __extends(DailyResRetrieveWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DailyResRetrieveWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    DailyResRetrieveWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(DailyResRetrievePanel),
            TabView.CreateTabViewData(DailyResRetrieveGoldPanel),
        ]);
    };
    DailyResRetrieveWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.mCommonWindowBg.OnAdded(this, index);
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.DAILY_UPDATE_RETREVE_VIEW, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    DailyResRetrieveWin.prototype.UpdateTabBtnRedPoint = function () {
        var flag = GameGlobal.DailyModel.GetRetrieveResListByType(DailyConst.TASK_RETRIEVE_COST_BINDGOD).length > 0;
        flag = flag && !GameGlobal.DailyModel.mViewBindGoldRes;
        this.mCommonWindowBg.ShowTalRedPoint(0, flag);
        flag = GameGlobal.DailyModel.GetRetrieveResListByType(DailyConst.TASK_RETRIEVE_COST_GOD).length > 0;
        flag = flag && !GameGlobal.DailyModel.mViewGoldRes;
        this.mCommonWindowBg.ShowTalRedPoint(1, flag);
    };
    DailyResRetrieveWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    DailyResRetrieveWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DailyResRetrieveWin;
}(BaseEuiView));
__reflect(DailyResRetrieveWin.prototype, "DailyResRetrieveWin");
//# sourceMappingURL=DailyResRetrieveWin.js.map