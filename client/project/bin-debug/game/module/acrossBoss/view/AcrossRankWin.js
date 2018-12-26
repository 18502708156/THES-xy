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
var AcrossRankWin = (function (_super) {
    __extends(AcrossRankWin, _super);
    function AcrossRankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    AcrossRankWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(GBattleDamageRankPanel),
            TabView.CreateTabViewData(GBattleGangRankPanel),
        ]);
    };
    AcrossRankWin.prototype.OnOpen = function () {
        this.mCommonWindowBg.OnAdded(this);
    };
    AcrossRankWin.prototype.OnOpenIndex = function (openIndex) {
        return true;
    };
    // public static NAME = "排行"
    AcrossRankWin.LAYER_LEVEL = LayerManager.UI_Main;
    return AcrossRankWin;
}(BaseEuiView));
__reflect(AcrossRankWin.prototype, "AcrossRankWin");
//# sourceMappingURL=AcrossRankWin.js.map