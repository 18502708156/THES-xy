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
var GrowUpWin = (function (_super) {
    __extends(GrowUpWin, _super);
    function GrowUpWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    GrowUpWin.GetViews = function () {
        var views = [];
        var num = GameGlobal.RechargeModel.rechargeNum;
        /*首充 */
        if (0 == num) {
            views.push(FirstChargePanel);
        }
        else {
            var config = GameGlobal.Config.FirstRechargeConfig;
            var isFirst = false;
            for (var key in config) {
                if (!GameGlobal.RechargeModel.GetFirstRewardState(config[key].id)) {
                    isFirst = true;
                    break;
                }
            }
            if (isFirst)
                views.push(FirstChargePanel);
        }
        /*成长基金 */
        var growupData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (growupData && growupData.isOpenActivity()) {
            views.push(GrowUpPanel);
        }
        else if (growupData && growupData.canReward()) {
            views.push(GrowUpPanel);
        }
        /*投资计划 */
        var investData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12);
        if (investData && investData.isOpenActivity()) {
            views.push(InvestmentPlanPanel);
        }
        else if (investData && investData.canReward()) {
            views.push(InvestmentPlanPanel);
        }
        /*消费有礼 */
        // let consumData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13) as ActivityType25Data;
        // if (consumData && consumData.isOpenActivity()) {
        // 	views.push(ConsumptionPanel);
        // }
        return views;
    };
    GrowUpWin.prototype.childrenCreated = function () {
        var views = GrowUpWin.GetViews();
        this.views = [];
        for (var _i = 0, views_1 = views; _i < views_1.length; _i++) {
            var data = views_1[_i];
            this.views.push(TabView.CreateTabViewData(data));
        }
        this.commonWindowBg.SetTabView(this.views);
    };
    GrowUpWin.prototype.OnOpenIndex = function (selectedIndex) {
        switch (selectedIndex) {
            case 1:
                if (Deblocking.Check(DeblockingType.TYPE_106, true)) {
                    return true;
                }
                break;
            case 2:
                if (Deblocking.Check(DeblockingType.TYPE_107, true)) {
                    return true;
                }
                break;
            case 3:
                if (Deblocking.Check(DeblockingType.TYPE_108, true)) {
                    return true;
                }
                break;
        }
        return true;
    };
    GrowUpWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.commonWindowBg.OnAdded(this, nIndex);
        this.observe(MessageDef.RECHARGE_FIRST_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    GrowUpWin.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(0);
        this.commonWindowBg.CheckTalRedPoint(1);
        this.commonWindowBg.CheckTalRedPoint(2);
        this.commonWindowBg.CheckTalRedPoint(3);
    };
    GrowUpWin.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    GrowUpWin.openCheck = function () {
        var view = GrowUpWin.GetViews();
        if (!view || !view.length) {
            UserTips.InfoTip("已经首充");
            return false;
        }
        return true;
    };
    GrowUpWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GrowUpWin;
}(BaseEuiView));
__reflect(GrowUpWin.prototype, "GrowUpWin");
//# sourceMappingURL=GrowUpWin.js.map