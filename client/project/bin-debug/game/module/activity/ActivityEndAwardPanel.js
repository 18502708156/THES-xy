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
var ActivityEndAwardPanel = (function (_super) {
    __extends(ActivityEndAwardPanel, _super);
    function ActivityEndAwardPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "AcivityEndAwardSkin";
        _this.awardList.itemRenderer = ItemBase;
        _this.auctionList.itemRenderer = ItemBase;
        return _this;
    }
    ActivityEndAwardPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.notClickMask = true;
        if (param[0]) {
            this.m_pData = param[0];
            this.commonDialog.title = this.m_pData.paneltitle;
            this.updateCentent();
        }
        this._AddClick(this.closeBtn, this.tap);
    };
    ActivityEndAwardPanel.prototype.tap = function () {
        this.CloseSelf();
    };
    ActivityEndAwardPanel.prototype.updateCentent = function () {
        this.rankTxt.text = this.m_pData.rankTxt;
        this.cloudNineGroup.visible = false;
        if (this.m_pData.shows) {
            this.cloudNineNameTxt.text = this.m_pData.shows.name + ("  S." + this.m_pData.shows.serverid);
            var roleShowData = new RoleShowData();
            roleShowData.sex = this.m_pData.shows.sex;
            roleShowData.job = this.m_pData.shows.job;
            roleShowData.shows = this.m_pData.shows.shows;
            this.roleShowPanel.SetAll(roleShowData);
            this.cloudNineGroup.visible = true;
        }
        this.icon1.visible = false;
        if (this.m_pData.icon1) {
            var icon1 = this.icon1;
            icon1.icon.source = this.m_pData.icon1.iconSrc;
            icon1.iconbg.source = this.m_pData.icon1.iconBgSrc;
            icon1.titleNameTxt.text = this.m_pData.icon1.titleName;
            icon1.nameTxt.text = this.m_pData.icon1.name;
            if (this.m_pData.icon1.banghuiTxt)
                icon1.banghuiTxt.text = this.m_pData.icon1.banghuiTxt;
            this.icon1.visible = true;
            if (this.m_pData.icon2)
                this.icon1.x = 113;
        }
        this.icon2.visible = false;
        if (this.m_pData.icon2) {
            var icon2 = this.icon2;
            icon2.icon.source = this.m_pData.icon2.iconSrc;
            icon2.iconbg.source = this.m_pData.icon2.iconBgSrc;
            icon2.titleNameTxt.text = this.m_pData.icon2.titleName;
            icon2.nameTxt.text = this.m_pData.icon2.name;
            this.icon2.visible = true;
        }
        this.auctionGroup.visible = false;
        if (this.m_pData.auction) {
            this.auctionList.dataProvider = new eui.ArrayCollection(this.m_pData.auction);
            this.auctionGroup.visible = true;
        }
        else {
            this.awardGroup.y = 670;
            this.whiteBglength.visible = false;
            this.rankBg.visible = this.rankTxt.text != '';
        }
        this.awardGroup.visible = false;
        if (this.m_pData.award) {
            this.awardGroup.visible = true;
            this.awardList.dataProvider = new eui.ArrayCollection(this.m_pData.award);
        }
    };
    ActivityEndAwardPanel.prototype.OnClose = function () {
        GameGlobal.CommonRaidModel.MapLeave();
    };
    ActivityEndAwardPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ActivityEndAwardPanel;
}(BaseEuiView));
__reflect(ActivityEndAwardPanel.prototype, "ActivityEndAwardPanel");
var activityEndAwardData = (function () {
    function activityEndAwardData() {
    }
    return activityEndAwardData;
}());
__reflect(activityEndAwardData.prototype, "activityEndAwardData");
//# sourceMappingURL=ActivityEndAwardPanel.js.map