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
var TreasureHuntMainPanel = (function (_super) {
    __extends(TreasureHuntMainPanel, _super);
    function TreasureHuntMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    TreasureHuntMainPanel.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(TreasurePanel),
        ]);
        this.mCommonWindowBg.title = "寻宝";
        this.mCommonWindowBg.tabBar.visible = false;
    };
    TreasureHuntMainPanel.prototype.OnOpen = function () {
        this.mCommonWindowBg.OnAdded(this);
    };
    TreasureHuntMainPanel.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    TreasureHuntMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return TreasureHuntMainPanel;
}(BaseEuiView));
__reflect(TreasureHuntMainPanel.prototype, "TreasureHuntMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=TreasureMainPanel.js.map