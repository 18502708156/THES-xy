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
var LingtongYuMainPanel = (function (_super) {
    __extends(LingtongYuMainPanel, _super);
    function LingtongYuMainPanel() {
        var _this = _super.call(this) || this;
        _this.tabIndex = 0;
        _this.skinName = "LingtongYuMainSkin";
        _this.tabEuiView.tabChildren = [
            TabView.CreateTabViewData(LingtongYulPanel),
            TabView.CreateTabViewData(LingtongYuHPanel),
            TabView.CreateTabViewData(LingtongRankPanel),
        ];
        _this.rankTab.dataProvider = new eui.ArrayCollection(["御灵", "御魂", "天赋"]);
        _this.rankTab.validateNow();
        _this._AddChange(_this.rankTab, _this._OnTabChange);
        return _this;
    }
    LingtongYuMainPanel.prototype.GetSelectConfig = function () {
        return this.mContext.mPetList[this.mContext.mSelectIndex];
    };
    LingtongYuMainPanel.prototype.GetSelectId = function () {
        var data = this.GetSelectConfig();
        return data.type;
    };
    LingtongYuMainPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.tabEuiView.selectedIndex = this.tabIndex;
        this.tabEuiView.commitProperties();
        this.UpdateSelectView();
    };
    LingtongYuMainPanel.prototype.UpdateRedPoint = function () {
        if (this.rankTab.$children.length) {
            UIHelper.ShowRedPoint(this.rankTab.getChildAt(0), GameGlobal.LingtongAttrModel.mRedPoint.IsYul(this.GetSelectId()));
            UIHelper.ShowRedPoint(this.rankTab.getChildAt(1), GameGlobal.LingtongAttrModel.mRedPoint.IsYuH(this.GetSelectId()) || GameGlobal.LingtongAttrModel.mRedPoint.IsSuit(this.GetSelectId()));
            UIHelper.ShowRedPoint(this.rankTab.getChildAt(2), GameGlobal.LingtongAttrModel.mRedPoint.IsRank(this.GetSelectId()));
        }
        else {
            this.AddTimer(50, 1, this.UpdateRedPoint);
        }
    };
    LingtongYuMainPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
    };
    LingtongYuMainPanel.prototype._OnTabChange = function () {
        this.tabIndex = this.tabEuiView.selectedIndex = this.rankTab.selectedIndex;
        this.tabEuiView.commitProperties();
        this.UpdateSelectView();
    };
    LingtongYuMainPanel.prototype.UpdateSelectView = function () {
        var view = this.tabEuiView.getElementAt(this.tabEuiView.selectedIndex);
        if (view && view.UpdateSelId) {
            view.UpdateSelId(this.GetSelectId());
        }
        this.UpdateRedPoint();
        this.UpdateModel();
    };
    LingtongYuMainPanel.prototype.UpdateSelect = function () {
        this.UpdateSelectView();
    };
    LingtongYuMainPanel.prototype.UpdateModel = function () {
        LingtongViewHelper.SetRole(this.showPanel0, this.GetSelectId());
    };
    LingtongYuMainPanel.NAME = "御灵";
    return LingtongYuMainPanel;
}(BaseView));
__reflect(LingtongYuMainPanel.prototype, "LingtongYuMainPanel");
//# sourceMappingURL=LingtongYuMainPanel.js.map