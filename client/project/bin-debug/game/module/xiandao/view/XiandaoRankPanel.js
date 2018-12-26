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
var XiandaoRankPanel = (function (_super) {
    __extends(XiandaoRankPanel, _super);
    function XiandaoRankPanel() {
        var _this = _super.call(this) || this;
        _this.windowTitleIconName = XiandaoRankPanel.NAME;
        _this.skinName = UIHelper.PANEL_NO_TAB;
        return _this;
    }
    XiandaoRankPanel.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(XiandaoRankView),
        ]);
    };
    XiandaoRankPanel.prototype.OnOpen = function () {
        this.mCommonWindowBg.OnAdded(this);
    };
    XiandaoRankPanel.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    XiandaoRankPanel.prototype.UpdateContent = function () {
    };
    XiandaoRankPanel.LAYER_LEVEL = LayerManager.UI_Main;
    XiandaoRankPanel.NAME = "预选赛排行";
    return XiandaoRankPanel;
}(BaseEuiView));
__reflect(XiandaoRankPanel.prototype, "XiandaoRankPanel", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=XiandaoRankPanel.js.map