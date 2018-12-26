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
var XiandaoPanel = (function (_super) {
    __extends(XiandaoPanel, _super);
    function XiandaoPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoSkin";
        _this.group.tabChildren = [
            TabView.CreateTabViewData(XiandaoRankView),
            TabView.CreateTabViewData(XiandaoKnockoutView),
            TabView.CreateTabViewData(XiandaoApplyView),
        ];
        return _this;
    }
    XiandaoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.shopBtn, this._OnClick);
    };
    XiandaoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_XIANDU]);
                break;
        }
    };
    XiandaoPanel.prototype.UpdateContent = function () {
        var view = this.UpdateView();
    };
    XiandaoPanel.prototype.OnOpen = function () {
        this.group.selectedIndex = -1;
    };
    XiandaoPanel.prototype.OnClose = function () {
        this.group.CloseView();
    };
    XiandaoPanel.prototype.UpdateView = function () {
        var model = GameGlobal.XiandaoModel;
        var view;
        // if (model.IsShowResult()) {
        // 	this.group.selectedIndex = 0
        // } else {
        if (model.IsKnockout()) {
            this.group.selectedIndex = 1;
        }
        else {
            this.group.selectedIndex = 2;
        }
        // }
    };
    XiandaoPanel.RedPointCheck = function () {
        return GameGlobal.XiandaoModel.mRedPoint.IsRedPoint();
    };
    XiandaoPanel.NAME = "仙道会";
    return XiandaoPanel;
}(BaseView));
__reflect(XiandaoPanel.prototype, "XiandaoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=XiandaoPanel.js.map