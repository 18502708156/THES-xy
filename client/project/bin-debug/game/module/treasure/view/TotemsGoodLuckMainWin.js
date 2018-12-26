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
/**
 * 转盘分页_神装/図腾
 */
var TotemsGoodLuckMainWin = (function (_super) {
    __extends(TotemsGoodLuckMainWin, _super);
    function TotemsGoodLuckMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    TotemsGoodLuckMainWin.Open = function (type) {
        ViewManager.ins().open(ActivityRewardShowWin, 0, type);
    };
    TotemsGoodLuckMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        var list = [];
        if (Deblocking.Check(DeblockingType.TYPE_137, true)) {
            list.push(TabView.CreateTabViewData(TotemsGoodLuckWin));
        }
        else {
            if (index == 1)
                index = 0;
        }
        //if (Deblocking.Check(DeblockingType.TYPE_143, true))
        {
            list.push(TabView.CreateTabViewData(TotemsGoodLuckWin2));
        }
        this.mCommonWindowBg.SetTabView(list);
        this.mCommonWindowBg.OnAdded(this, index);
    };
    TotemsGoodLuckMainWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    TotemsGoodLuckMainWin.prototype.GetAwardList = function (idx) {
        if (idx == 0)
            return ActivityRewardShowConst.GetAwardListByActivityType(this.mType);
        if (idx == 1)
            return ActivityRewardShowConst.GetRankAwardListByActivityType(this.mType);
        if (idx == 2)
            return ActivityRewardShowConst.GetDragonRankAwardListByActivityType(this.mType);
    };
    TotemsGoodLuckMainWin.prototype.GetImgSource = function () {
        return ActivityRewardShowConst.GetImageSourceByActivityType(this.mType);
    };
    TotemsGoodLuckMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return TotemsGoodLuckMainWin;
}(BaseEuiView));
__reflect(TotemsGoodLuckMainWin.prototype, "TotemsGoodLuckMainWin");
//# sourceMappingURL=TotemsGoodLuckMainWin.js.map