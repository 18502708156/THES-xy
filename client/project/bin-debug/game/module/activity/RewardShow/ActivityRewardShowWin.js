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
var ActivityRewardShowWin = (function (_super) {
    __extends(ActivityRewardShowWin, _super);
    function ActivityRewardShowWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    ActivityRewardShowWin.Open = function (type) {
        ViewManager.ins().open(ActivityRewardShowWin, 0, type);
    };
    ActivityRewardShowWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.mType = args[1];
        var list = [
            TabView.CreateTabViewData(ActivityRewardPanel, { mContext: this }),
            TabView.CreateTabViewData(ActivityRankRewardPanel, { mContext: this }),
        ];
        if (this.mType == ActivityModel.TYPE_GANG_BATTLE) {
            list.push(TabView.CreateTabViewData(ActivityDragonRankPanel, { mContext: this }));
        }
        this.mCommonWindowBg.SetTabView(list);
        this.mCommonWindowBg.OnAdded(this, index);
    };
    ActivityRewardShowWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    ActivityRewardShowWin.prototype.GetAwardList = function (idx) {
        if (idx == 0)
            return ActivityRewardShowConst.GetAwardListByActivityType(this.mType);
        if (idx == 1)
            return ActivityRewardShowConst.GetRankAwardListByActivityType(this.mType);
        if (idx == 2)
            return ActivityRewardShowConst.GetDragonRankAwardListByActivityType(this.mType);
    };
    ActivityRewardShowWin.prototype.GetImgSource = function () {
        return ActivityRewardShowConst.GetImageSourceByActivityType(this.mType);
    };
    ActivityRewardShowWin.NAME = "奖励预览";
    ActivityRewardShowWin.LAYER_LEVEL = LayerManager.UI_Main;
    return ActivityRewardShowWin;
}(BaseEuiView));
__reflect(ActivityRewardShowWin.prototype, "ActivityRewardShowWin");
//# sourceMappingURL=ActivityRewardShowWin.js.map