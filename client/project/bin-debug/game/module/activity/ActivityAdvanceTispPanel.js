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
var ActivityAdvanceTispPanel = (function (_super) {
    __extends(ActivityAdvanceTispPanel, _super);
    function ActivityAdvanceTispPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_pData = null;
        _this.skinName = "AcitivityAdvanceTips";
        return _this;
    }
    ActivityAdvanceTispPanel.prototype.childrenCreated = function () {
        this.auctionList.itemRenderer = ItemBase;
        this.awardList.itemRenderer = ItemBase;
    };
    ActivityAdvanceTispPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.gainWayTxt, this.showTips);
        this._AddClick(this.btn, this.CloseSelf);
        this._AddClick(this.bg, this.CloseSelf);
        UIHelper.SetLinkStyleLabel(this.gainWayTxt);
        if (!param[0])
            return;
        this.m_pData = param[0];
        this.updateCentent();
    };
    ActivityAdvanceTispPanel.prototype.showTips = function () {
        ActivityDescPanel.Show("     拍卖奖励由前五名帮会获得，排名越前奖励越好，奖励不会发放给个人，而是以帮会为单位进入拍卖行，售出后，收益平均给参与队员\n（0点通过邮寄发送奖励）", "说明");
    };
    ActivityAdvanceTispPanel.prototype.updateCentent = function () {
        this.iocn.source = this.m_pData.iocn;
        this.tips1Txt.text = this.m_pData.tips1Txt;
        this.tips2Txt.text = this.m_pData.tips2Txt;
        this.detailsTxt.text = this.m_pData.detailsTxt;
        this.auctionGroup.visible = false;
        if (this.m_pData.auction) {
            this.auctionList.dataProvider = new eui.ArrayCollection(this.m_pData.auction);
            this.auctionGroup.visible = true;
            this.awardGroup.y = 707;
            this.btn.y = 864;
            this.iconBg.source = "ui_yg_bm_kfboss";
        }
        if (this.m_pData.award) {
            this.awardList.dataProvider = new eui.ArrayCollection(this.m_pData.award);
        }
    };
    ActivityAdvanceTispPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ActivityAdvanceTispPanel;
}(BaseEuiView));
__reflect(ActivityAdvanceTispPanel.prototype, "ActivityAdvanceTispPanel");
//# sourceMappingURL=ActivityAdvanceTispPanel.js.map