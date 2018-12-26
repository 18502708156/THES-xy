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
var LadderRankWin = (function (_super) {
    __extends(LadderRankWin, _super);
    function LadderRankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    LadderRankWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.title = "王者排名";
        this.mCommonWindowBg.tabBar.visible = false;
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(LadderRankPanel),
        ]);
    };
    LadderRankWin.prototype.OnOpen = function () {
        this.commonWindowBg.OnAdded(this);
    };
    LadderRankWin.LAYER_LEVEL = LayerManager.UI_Main;
    LadderRankWin.NAME = "王者排名";
    return LadderRankWin;
}(BaseEuiView));
__reflect(LadderRankWin.prototype, "LadderRankWin", ["ICommonWindow"]);
var LadderWeekRankWin = (function (_super) {
    __extends(LadderWeekRankWin, _super);
    function LadderWeekRankWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    LadderWeekRankWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.title = "王者上周排名";
        this.mCommonWindowBg.tabBar.visible = false;
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(LadderPreWeekPanel),
        ]);
    };
    LadderWeekRankWin.prototype.OnOpen = function () {
        this.commonWindowBg.OnAdded(this);
    };
    LadderWeekRankWin.LAYER_LEVEL = LayerManager.UI_Main;
    LadderWeekRankWin.NAME = "王者上周排名";
    return LadderWeekRankWin;
}(BaseEuiView));
__reflect(LadderWeekRankWin.prototype, "LadderWeekRankWin");
var LadderWinnerWin = (function (_super) {
    __extends(LadderWinnerWin, _super);
    function LadderWinnerWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    LadderWinnerWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.title = "跨服王者";
        this.mCommonWindowBg.tabBar.visible = false;
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(LadderWinnerPanel),
        ]);
    };
    LadderWinnerWin.prototype.OnOpen = function () {
        this.commonWindowBg.OnAdded(this);
    };
    LadderWinnerWin.LAYER_LEVEL = LayerManager.UI_Main;
    LadderWinnerWin.NAME = "跨服王者";
    return LadderWinnerWin;
}(BaseEuiView));
__reflect(LadderWinnerWin.prototype, "LadderWinnerWin");
//# sourceMappingURL=LadderRankWin.js.map