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
var GangInfoPanel = (function (_super) {
    __extends(GangInfoPanel, _super);
    function GangInfoPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.iconBindList = [{ "id": 1, "icon": "ui_bh_bt_shouhu" },
            { "id": 2, "icon": "ui_bh_bt_shangdian" },
            { "id": 3, "icon": "ui_bh_bt_ditu" },
            { "id": 4, "icon": "ui_bh_bt_boss" },
            { "id": 5, "icon": "ui_bh_bt_bangzhan" }];
        return _this;
    }
    GangInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnRename, this._OnClick);
        this._AddClick(this.imgRecruit, this._OnClick);
        this._AddClick(this.labRecord, this._OnClick);
        this._AddClick(this.btnMember, this._OnClick);
        this._AddClick(this.btnDonation, this._OnClick);
        this._AddClick(this.btnList, this._OnClick);
        this._AddClick(this.btnApplyList, this._OnClick);
        this._AddItemClick(this.iconList, this.itemClick);
        this._AddClick(this.labModify, this._OnClick);
        this.iconList.itemRenderer = GangButtonItem;
        this.iconList.dataProvider = new eui.ArrayCollection(this.iconBindList);
        GameGlobal.GangModel.SendGetGangBaseInfo();
        GameGlobal.GangModel.SendGetPlayerInfo();
        this.labRecord.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>" + "帮会记录" + "</u></font>");
        this.labModify.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>" + "修改公告" + "</u></font>");
        this.UpdateContent();
    };
    GangInfoPanel.prototype.UpdateContent = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        this.labAbbreviated.text = myGangInfo.mGangName.substr(0, 1);
        this.labGangName.text = myGangInfo.mGangName;
        this.labRoleName.text = myGangInfo.mGangMasterName;
        this.labMemberCount.text = myGangInfo.mMemberCount + "/" + GangConst.GetMaxMemberCount(myGangInfo.mLevel);
        this.labCapital.text = myGangInfo.mCapital + "/" + GangConst.GetMaxCapital(myGangInfo.mLevel);
        this.labGangLevel.text = myGangInfo.mLevel.toString();
        this.labText.text = myGangInfo.mNotice;
    };
    GangInfoPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANG_UPDATE_BASE_INFO, this.UpdateContent);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateRedPoint);
        this.observe(MessageDef.GANG_UPDATE_APPLICANT_LIST, this.UpdateRedPoint);
        this.observe(MessageDef.GANG_UPDATE_CONTRIBUTECOUNT, this.UpdateRedPoint);
        this.observe(MessageDef.GANGBATTLE_OPEN_GATEVIEW, this._DoOpenGBattleView);
        this.observe(MessageDef.GANG_ALL_NOTICE, this._UpdateList);
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this._UpdateList);
        this.observe(MessageDef.GANGBOSS_UPDATE_INFO, this._UpdateList);
        this.observe(MessageDef.ACTIVITY_LIST_INFO, this._UpdateList);
        this.UpdateRedPoint();
    };
    GangInfoPanel.prototype.OnClose = function () {
    };
    GangInfoPanel.prototype._UpdateList = function () {
        UIHelper.ListRefresh(this.iconList);
    };
    GangInfoPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnDonation, GameGlobal.GangModel.HasContributeAward());
        UIHelper.ShowRedPoint(this.btnApplyList, GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.VIEW_APPILICANT));
    };
    GangInfoPanel.prototype.itemClick = function (e) {
        if (e.itemIndex == 0) {
            ViewManager.ins().open(GangProtectorMainWin);
        }
        else if (e.itemIndex == 1) {
            ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BLACK]);
        }
        else if (e.itemIndex == 2) {
            if (!UserFb.CheckFighting())
                return;
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid);
            ViewManager.ins().close(GangMainWin);
        }
        else if (e.itemIndex == 3) {
            ViewManager.ins().open(GangBossPanel);
        }
        else if (e.itemIndex == 4) {
            if (!Deblocking.Check(DeblockingType.TYPE_56))
                return;
            GameGlobal.GangBattleModel.SendEnterBattle();
        }
    };
    GangInfoPanel.prototype._DoOpenGBattleView = function () {
        ViewManager.ins().close(GangMainWin);
    };
    GangInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRename:
                this.HandleRename();
                break;
            case this.imgRecruit:
                this.HandleRecruit();
                break;
            case this.labRecord:
                ViewManager.ins().open(GangRecordListWin);
                break;
            case this.btnMember:
                ViewManager.ins().open(GangMemberListWin);
                break;
            case this.btnDonation:
                ViewManager.ins().open(GangJuanXianListWin);
                break;
            case this.btnList:
                ViewManager.ins().open(GangListWin);
                break;
            case this.btnApplyList:
                this.HandleApplyList();
                break;
            case this.labModify:
                this.HandleModify();
                break;
        }
    };
    GangInfoPanel.prototype.HandleRecruit = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (myGangInfo.mOffice != GangConst.MEMBER_OFFICE)
            GameGlobal.GangModel.SendRecruitMember();
        else
            UserTips.ins().showTips("你没有招收权限");
    };
    GangInfoPanel.prototype.HandleApplyList = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (GangConst.GetAuditingRight(myGangInfo.mOffice))
            ViewManager.ins().open(GangApplyListWin);
        else
            UserTips.ins().showTips("你没有审核权限");
    };
    GangInfoPanel.prototype.HandleModify = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (GangConst.GetModifyNoticeRight(myGangInfo.mOffice))
            ViewManager.ins().open(GangModifyNoticeView);
        else
            UserTips.ins().showTips("你没有修改公告权限");
    };
    GangInfoPanel.prototype.HandleRename = function () {
        var myGangInfo = GameGlobal.GangModel.myGangInfo;
        if (myGangInfo.mOffice != GangConst.MASTER_OFFICE) {
            UserTips.ins().showTips("你没有这个权限");
            return;
        }
        ViewManager.ins().open(GangChangeNameView);
    };
    GangInfoPanel.NAME = "帮会大厅";
    return GangInfoPanel;
}(BaseView));
__reflect(GangInfoPanel.prototype, "GangInfoPanel", ["ICommonWindowTitle"]);
var GangButtonItem = (function (_super) {
    __extends(GangButtonItem, _super);
    function GangButtonItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangButtonItem.prototype.childrenCreated = function () {
    };
    GangButtonItem.prototype.dataChanged = function () {
        this.iconDisplay.source = this.data.icon;
        this.UpdateRedPoint();
    };
    GangButtonItem.prototype.UpdateRedPoint = function () {
        if (this.data.id == 1) {
            this.redPoint.visible = GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GUARD_UPGRADE)
                || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.DAILY_AWARD);
        }
        else if (this.data.id == 2) {
        }
        else if (this.data.id == 3) {
            this.redPoint.visible = GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_MAP_ASSEMBLED)
                || GameGlobal.GangModel.mRedPoint.IsRedAct(GangModelRedPoint.GANG_EXCHANGE);
        }
        else if (this.data.id == 4) {
            this.redPoint.visible = GameGlobal.GangBossModel.IsGangBossAct();
        }
        else if (this.data.id == 5) {
            this.redPoint.visible = GameGlobal.GangModel.IsGangBattleOpen();
        }
    };
    return GangButtonItem;
}(eui.ItemRenderer));
__reflect(GangButtonItem.prototype, "GangButtonItem");
//# sourceMappingURL=GangInfoPanel.js.map