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
var LingtongUpLevelPanel = (function (_super) {
    __extends(LingtongUpLevelPanel, _super);
    function LingtongUpLevelPanel() {
        var _this = _super.call(this) || this;
        _this.mModel = GameGlobal.LingtongModel;
        _this.mModelRedPoint = GameGlobal.LingtongModel.mRedPoint;
        _this.skinName = "LingtongUpLevelSkin";
        _this.tabEuiView.tabChildren = [
            TabView.CreateTabViewData(LingtongUpLevelItem),
            TabView.CreateTabViewData(LingtongSkillPanel),
            TabView.CreateTabViewData(LingtongInactiveView),
        ];
        _this.rankTab.useVirtualLayout = false;
        _this.rankTab.dataProvider = new eui.ArrayCollection(["属性", "被动技能"]);
        _this.rankTab.validateNow();
        _this._AddChange(_this.rankTab, _this._OnTabChange);
        _this._AddClick(_this.skillComp, _this._OnClick);
        _this.rankTab.selectedIndex = 0;
        return _this;
    }
    LingtongUpLevelPanel.prototype.GetSelectConfig = function () {
        return this.mContext.mPetList[this.mContext.mSelectIndex];
    };
    LingtongUpLevelPanel.prototype.GetSelectId = function () {
        var data = this.GetSelectConfig();
        return data.type;
    };
    // private mRoleAutoSendData: RoleAutoSendData
    // private mRoleSendCheckData: RoleSendCheckData
    // public static RedPointCheck(): boolean {
    //     return GameGlobal.UserRide.mRedPoint.IsRedPoint()
    // }
    // 1、激活 2、未激活
    LingtongUpLevelPanel.prototype.UpdateShowState = function (active) {
        this.btnAttrDrug.visible = GameGlobal.LingtongPetModel.HasActive();
        this.btnRename.visible = active;
        this.btnZZ.visible = active;
        this.btnShow.visible = active;
        this.powerLabel.SetCheckAttrVisible(active);
    };
    LingtongUpLevelPanel.prototype._OnTabChange = function () {
        if (this.rankTab.selectedIndex == 0) {
            if (!GameGlobal.LingtongPetModel.IsActive(this.GetSelectId())) {
                this.tabEuiView.selectedIndex = 2;
            }
            else {
                this.tabEuiView.selectedIndex = 0;
            }
            this.tabEuiView.commitProperties();
        }
        else {
            this.tabEuiView.selectedIndex = 1;
        }
        this.UpdateSelectView();
    };
    LingtongUpLevelPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnAttrDrug, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
        this._AddClick(this.btnRename, this._OnClick);
        this._AddClick(this.btnZZ, this._OnClick);
        this._AddClick(this.btnShow, this._OnClick);
    };
    LingtongUpLevelPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_ACTIVE, this.UpdateAct);
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateModel);
        this.observe(MessageDef.LINGTONG_BATTLE, this.UpdateBattle);
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this.UpdateInfo);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this.UpdatePower);
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.UpdateRedPoint();
        if (GameGlobal.LingtongPetModel.IsActive(this.GetSelectId())) {
            this.tabEuiView.selectedIndex = 0;
            this.UpdateShowState(true);
        }
        else {
            this.tabEuiView.selectedIndex = 2;
            this.UpdateShowState(false);
        }
        this.tabEuiView.commitProperties();
        this.UpdateSelectView();
        this.UpdateModel();
        this.UpdateLvLabel();
        this.UpdateBattle();
    };
    LingtongUpLevelPanel.prototype.UpdateAct = function () {
        this.UpdateSelect();
    };
    LingtongUpLevelPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
    };
    LingtongUpLevelPanel.prototype.UpdateLvLabel = function () {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId());
        if (!info || !info.mLevel) {
            this.levelLabel.text = "未激活";
        }
        else {
            this.levelLabel.text = info.mLevel + "\n阶";
        }
    };
    LingtongUpLevelPanel.prototype.UpdatePower = function () {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId());
        if (!info || !info.mLevel) {
            this.powerLabel.text = LingtongInfo.GetBasePower(this.GetSelectId());
        }
        else {
            this.powerLabel.text = info.GetDescPower();
        }
    };
    LingtongUpLevelPanel.prototype.UpdateSelect = function () {
        if (!GameGlobal.LingtongPetModel.IsActive(this.GetSelectId())) {
            this.rankTab.selectedIndex = 0;
            this.tabEuiView.selectedIndex = 2;
            this.tabEuiView.commitProperties();
            this.UpdateShowState(false);
        }
        else {
            if (this.tabEuiView.selectedIndex != this.rankTab.selectedIndex) {
                this.tabEuiView.selectedIndex = this.rankTab.selectedIndex;
            }
            this.UpdateShowState(true);
        }
        PetSkillIconItem.SetContent(this.skillComp, this.GetLingtSkillId(), 0);
        this.UpdateLvLabel();
        this.UpdateSelectView();
        this.UpdateModel();
        this.UpdateBattle();
        this.UpdateRedPoint();
    };
    LingtongUpLevelPanel.prototype.UpdateBattle = function () {
        this.btnZZ.icon = GameGlobal.LingtongPetModel.HasBattle(this.GetSelectId()) ? "ui_bt_xiuxi" : "ui_bt_chuzhan";
    };
    LingtongUpLevelPanel.prototype.UpdateSelectView = function () {
        var view = this.tabEuiView.getElementAt(this.tabEuiView.selectedIndex);
        if (view && view.UpdateSelId) {
            view.UpdateSelId(this.GetSelectId());
        }
        this.UpdatePower();
    };
    LingtongUpLevelPanel.prototype.GetInactiveView = function () {
        return this.tabEuiView.getElementAt(2);
    };
    LingtongUpLevelPanel.prototype.GetUpLevelView = function () {
        return this.tabEuiView.getElementAt(0);
    };
    LingtongUpLevelPanel.prototype.GetSkillView = function () {
        return this.tabEuiView.getElementAt(1);
    };
    LingtongUpLevelPanel.prototype.GetLingtSkillId = function () {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId());
        if (info) {
            return GameGlobal.LingtongAttrModel.GetSkillId(this.GetSelectId(), info.mGiftLevel);
        }
        return GameGlobal.LingtongAttrModel.GetSkillId(this.GetSelectId(), 1);
    };
    LingtongUpLevelPanel.prototype._OnClick = function (e) {
        var _this = this;
        switch (e.currentTarget) {
            case this.skillComp:
                ViewManager.ins().open(PetSkillTipPanel, 0, this.GetLingtSkillId(), 1);
                break;
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel);
                break;
            case this.powerLabel:
                if (GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId())) {
                    ViewManager.ins().open(LingTongRoleTemplateAttrPanel, this.mModel, "灵童", this.GetSelectId());
                }
                break;
            case this.btnRename:
                var info = GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId());
                ViewManager.ins().open(PetChangeNamePanel, "灵童改名", MessageDef.LINGTONG_UPDATE_INFO, info.mName, function (name) {
                    GameGlobal.LingtongAttrModel.SendRename(_this.GetSelectId(), name);
                }, this);
                break;
            case this.btnZZ:
                if (GameGlobal.LingtongPetModel.HasBattle(this.GetSelectId())) {
                    GameGlobal.LingtongPetModel.SendUnBattle(this.GetSelectId());
                }
                else {
                    ViewManager.ins().open(LingtongBattlePanel, this.GetSelectId());
                }
                break;
            case this.btnShow:
                GameGlobal.LingtongPetModel.SetShowId(this.GetSelectId());
                break;
        }
    };
    LingtongUpLevelPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM));
        UIHelper.ShowRedPoint(this.btnZZ, !GameGlobal.LingtongPetModel.HasBattle(this.GetSelectId()) && GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_BATTLE));
        if (this.rankTab.$children.length) {
            UIHelper.ShowRedPoint(this.rankTab.getChildAt(0), GameGlobal.LingtongAttrModel.mRedPoint.IsLevel(this.GetSelectId()));
            UIHelper.ShowRedPoint(this.rankTab.getChildAt(1), GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL));
        }
        else {
            this.AddTimer(50, 1, this.UpdateRedPoint);
        }
    };
    LingtongUpLevelPanel.prototype.UpdateInfo = function () {
        this.UpdateLvLabel();
    };
    LingtongUpLevelPanel.prototype.UpdateModel = function () {
        var selectId = this.GetSelectId();
        LingtongViewHelper.SetRole(this.showPanel, selectId);
        var info = GameGlobal.LingtongPetModel.GetInfo(this.GetSelectId());
        if (info) {
            this.lbName.text = info.mName;
        }
        else {
            this.lbName.text = LingtongConst.GetName(selectId);
        }
    };
    LingtongUpLevelPanel.RedPointCheck = function () {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_ACTIVE) || GameGlobal.LingtongModel.mRedPoint.IsRedPoint();
    };
    LingtongUpLevelPanel.NAME = "升阶";
    return LingtongUpLevelPanel;
}(BaseView));
__reflect(LingtongUpLevelPanel.prototype, "LingtongUpLevelPanel");
var LingtongUpLevelItem = (function (_super) {
    __extends(LingtongUpLevelItem, _super);
    function LingtongUpLevelItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongUpLevelItemSkin";
        return _this;
    }
    LingtongUpLevelItem.prototype.childrenCreated = function () {
        this._AddClick(this.btnCulture, this._OnClick);
    };
    LingtongUpLevelItem.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this.UpdateInfo);
        this.observe(GameGlobal.LingtongModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    LingtongUpLevelItem.prototype.UpdateRedPoint = function () {
        // UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.LingtongAttrModel.mRedPoint.IsLevel(this.mSelId))
    };
    LingtongUpLevelItem.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this.SendUp();
                break;
        }
    };
    LingtongUpLevelItem.prototype.UpdateBar = function () {
        var levelConfig = GameGlobal.LingtongModel.LvproConfig[this.mLingtongInfo.mLevel];
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = this.mLingtongInfo.mUpNum * levelConfig.exp;
    };
    LingtongUpLevelItem.prototype.UpdateItemContent = function () {
        var levelConfig = GameGlobal.LingtongModel.LvproConfig[this.mLingtongInfo.mLevel];
        if (!levelConfig) {
            return;
        }
        var cost = levelConfig.cost[0];
        this.consumeLabel.SetItem(cost.id, cost.count, GameGlobal.UserBag.GetCount(cost.id));
    };
    LingtongUpLevelItem.prototype.SendUp = function () {
        var levelConfig = GameGlobal.LingtongModel.LvproConfig[this.mLingtongInfo.mLevel];
        if (!levelConfig) {
            return;
        }
        var cost = levelConfig.cost[0];
        if (!Checker.Data(cost, false)) {
            UserWarn.ins().setBuyGoodsWarn(cost.id, cost.count);
            return;
        }
        GameGlobal.LingtongPetModel.SendAddExp(this.mLingtongInfo.mId, 0);
    };
    LingtongUpLevelItem.prototype.UpdateSelId = function (selId) {
        this.mSelId = selId;
        this.mLingtongInfo = GameGlobal.LingtongPetModel.GetInfo(selId);
        this.UpdateContent();
    };
    LingtongUpLevelItem.prototype.UpdateInfo = function () {
        this.mLingtongInfo = GameGlobal.LingtongPetModel.GetInfo(this.mSelId);
        this.UpdateContent();
    };
    LingtongUpLevelItem.prototype.UpdateContent = function () {
        if (!this.mLingtongInfo) {
            return;
        }
        var config = GameGlobal.Config.BabyProgressConfig[this.mSelId];
        var configData = config[this.mLingtongInfo.mLevel - 1];
        LingtongUpLevelItem.SetAttr(configData.attrpower, configData.specialattr, this.attr1);
        var nextConfigData = config[this.mLingtongInfo.mLevel];
        if (nextConfigData) {
            this.nextGroup.visible = true;
            LingtongUpLevelItem.SetAttr(nextConfigData.attrpower, nextConfigData.specialattr, this.attr2);
            var actConfig = GameGlobal.Config.BabyLvproConfig[this.mLingtongInfo.mLevel].cost[0];
            this.consumeLabel.SetItem(actConfig.id, actConfig.count, GameGlobal.UserBag.GetCount(actConfig.id));
        }
        else {
            this.nextGroup.visible = false;
        }
        this.curGroup.x = this.nextGroup.visible ? 41 : 194;
        this.infoGroup.visible = this.nextGroup.visible;
        this.fullLabel.visible = !this.nextGroup.visible;
        this.UpdateBar();
    };
    LingtongUpLevelItem.SetAttr = function (vals, val, group) {
        for (var i = 0; i < 3; i++) {
            var label = group.getChildAt(i);
            var att = vals[i];
            if (att) {
                label.text = AttributeData.getAttStrByType(att, 0, "+", false, "#ffffff");
            }
        }
        if (val && val.length) {
            var type = val[0].type;
            var value = val[0].value;
            if (type >= AttributeType.atDamageEnhancePerc) {
                value = value * 100;
            }
            var attr = { type: type, value: value };
            group.getChildAt(3).text = AttributeData.getAttStrByType(attr, 0, "+", false, "#ffffff");
        }
        else {
            group.getChildAt(3).text = "";
        }
    };
    return LingtongUpLevelItem;
}(BaseView));
__reflect(LingtongUpLevelItem.prototype, "LingtongUpLevelItem");
//# sourceMappingURL=LingtongUpLevelPanel.js.map