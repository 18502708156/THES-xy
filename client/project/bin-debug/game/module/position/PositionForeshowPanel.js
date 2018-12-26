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
var PositionForeshowPanel = (function (_super) {
    __extends(PositionForeshowPanel, _super);
    function PositionForeshowPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_nSex = 1;
        _this.m_gBtnTitel = [];
        _this.m_gSkill = [];
        _this.skinName = "PositionForeshowSkin";
        return _this;
    }
    PositionForeshowPanel.prototype.childrenCreated = function () {
        this.btnList.itemRenderer = PositionItem;
        this.awardList.itemRenderer = ItemBase;
    };
    PositionForeshowPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.boyCheckBox.selected = true;
        this.girlCheckBox.selected = false;
        this.commonDlg.OnAdded(this);
        this.commonDlg.dialogCloseBtn.visible = false;
        this._AddClick(this.gotoBtn, this.tap);
        this._AddItemClick(this.skillList, this.skiilIconClick);
        this._AddItemClick(this.btnList, this.itemClick);
        this.AddChange(this.boyCheckBox, this.checkBox);
        this.AddChange(this.girlCheckBox, this.checkBox);
        this.observe(MessageDef.POSITION_STATE_CHANGE, this.itemClick);
        this.observe(MessageDef.POSITION_AWARD_CHANGE, this.getAward);
        this.btnList.dataProvider = new eui.ArrayCollection(this.m_gBtnTitel);
        this.btnList.selectedIndex = 0;
        var config = GameGlobal.Config.StationConfig;
        var position_info = GameGlobal.PositionForeshowModel.position_info;
        for (var key in config) {
            if (GameGlobal.actorModel.level >= config[key].showlv && position_info.data[config[key].skinid - 1].typ != 3)
                this.m_gBtnTitel.push({ name: config[key].statname, id: config[key].skinid - 1 });
        }
        this.updateCentent();
        this.itemClick();
    };
    PositionForeshowPanel.prototype.updateCentent = function () {
        var config = GameGlobal.Config.StationConfig[this.btnList.selectedItem.id + 1];
        this.awardList.dataProvider = new eui.ArrayCollection(config.rewards);
        this.nameTxt.text = config.name;
        this.girlCheckBox.visible = this.btnList.selectedIndex == 3;
        this.boyCheckBox.visible = this.btnList.selectedIndex == 3;
        if (this.btnList.selectedItem.id != 3) {
            var roledate = new RoleShowData();
            roledate.clothID = config.pid;
            this.roleShowpanel.SetAll(roledate);
        }
        else {
            // LingtongViewHelper.SetRole(this.roleShowpanel, this.m_nSex)
        }
        this.tipsImg.source = config.itemid;
        this.skillList.dataProvider = new eui.ArrayCollection(this.m_gSkill);
        if (config.attrpower) {
            this.counterGroup.visible = true;
            this.counterLabel.SetColor(Color.Red);
            this.counterLabel.SetEndTime(GameGlobal.PositionForeshowModel.position_info.creatTime + config.attrpower, DurationLabel.TIMETEXT_TYPE_HHMMSS);
        }
        else
            this.counterGroup.visible = false;
        this.getAward();
    };
    PositionForeshowPanel.prototype.checkBox = function (e) {
        if (e.currentTarget == this.boyCheckBox) {
            this.girlCheckBox.selected = false;
        }
        else {
            this.boyCheckBox.selected = false;
        }
        switch (e.currentTarget) {
            case this.boyCheckBox:
                this.m_nSex = 1;
                break;
            case this.girlCheckBox:
                this.m_nSex = 2;
                break;
            default:
                break;
        }
        this.updateCentent();
    };
    PositionForeshowPanel.prototype.tap = function (e) {
        var id = this.btnList.selectedItem.id;
        var state = GameGlobal.PositionForeshowModel.position_info.data[id].typ;
        if (state == 1) {
            GameGlobal.PositionForeshowModel.sendGetAward(id + 1);
        }
        else if (state == 0) {
            switch (id) {
                case 0:
                    break;
                case 1:
                    ViewManager.ins().open(GrowUpWin, 0);
                    this.CloseSelf();
                    break;
                case 2:
                    if (LocationProperty.IsOtherRecharge()) {
                        RechargeWin.Open();
                    }
                    else {
                        GameGlobal.RechargeModel.sendRecharge(6);
                    }
                    break;
                case 3:
                    if (Deblocking.Check(DeblockingType.TYPE_116)) {
                        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YUANBAO]);
                        this.CloseSelf();
                    }
                    break;
                case 4:
                    if (Deblocking.Check(DeblockingType.TYPE_28)) {
                        ViewManager.ins().open(GodLotteryWin);
                        this.CloseSelf();
                    }
                    else
                        GameGlobal.UserTips.showTips("敬请期待");
                    break;
                default:
                    break;
            }
        }
    };
    PositionForeshowPanel.prototype.itemClick = function () {
        var config = GameGlobal.Config.StationConfig[this.btnList.selectedIndex + 1];
        this.gotoBtn.label = config.btn;
        if (GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ == 1)
            this.gotoBtn.label = "领取";
        if (GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ == 3)
            this.gotoBtn.label = "已领取";
        this.titleLabel.text = this.btnList.selectedItem.name;
        this.skillsDispose();
        this.updateCentent();
    };
    PositionForeshowPanel.prototype.skillsDispose = function () {
        var config = GameGlobal.Config.StationConfig[this.btnList.selectedIndex + 1];
        this.m_gSkill = [];
        this.skillList.itemRenderer = PetSkillIconItem;
        switch (this.btnList.selectedIndex) {
            case 0:
                var xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(config.pid);
                this.m_gSkill.push(xianlvInfo.GetSkillId());
                break;
            case 1:
                xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(config.pid);
                this.m_gSkill.push(xianlvInfo.GetSkillId());
                break;
            case 2:
                this.skillList.itemRenderer = HavingSkillIcon;
                var baseConfig = GameGlobal.HavingModel.getBaseConfig();
                this.m_gSkill.length = 6;
                this.m_gSkill[0] = baseConfig.skill;
                this.m_gSkill[1] = baseConfig.hskill;
                for (var i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
                    var data = GameGlobal.HavingMagicModel.skillData[i];
                    if (data && data.attrData && data.attrData.length == 4) {
                        this.m_gSkill[i + 2] = data.attrData[3].skillNo;
                    }
                }
                break;
            case 3:
                this.m_gSkill.push(GameGlobal.Config.BabyActivationConfig[this.m_nSex].skill[0]);
                break;
            case 4:
                this.skillList.itemRenderer = HavingSkillIcon;
                baseConfig = GameGlobal.Config.AirMarshalBaseConfig;
                this.m_gSkill.length = 6;
                this.m_gSkill[0] = baseConfig.skill;
                this.m_gSkill[1] = baseConfig.hskill;
                var ids = GameGlobal.TianShenModel.mTianShenList[config.pid].GetSkillIds();
                for (var i = 0; i < ids.length; i++) {
                    this.m_gSkill[i + 2] = ids[i];
                }
                break;
        }
    };
    PositionForeshowPanel.prototype.skiilIconClick = function () {
        var index = this.skillList.selectedIndex;
        var skillId = this.skillList.selectedItem;
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 1);
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false);
    };
    PositionForeshowPanel.prototype.getAward = function () {
        var touchEnabled = true;
        var state = GameGlobal.PositionForeshowModel.position_info.data[this.btnList.selectedItem.id].typ;
        if (state == 3) {
            touchEnabled = false;
            this.gotoBtn.label = "已领取";
        }
        if (state == 2)
            touchEnabled = false;
        this.gotoBtn.touchEnabled = touchEnabled;
        this.gotoBtn.filters = touchEnabled ? null : Color.GetFilter();
    };
    PositionForeshowPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PositionForeshowPanel;
}(BaseEuiView));
__reflect(PositionForeshowPanel.prototype, "PositionForeshowPanel");
var PositionItem = (function (_super) {
    __extends(PositionItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PositionItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "BtnTab0Skin";
        return _this;
    }
    PositionItem.prototype.dataChanged = function () {
        this.labelDisplay.text = this.data.name;
    };
    return PositionItem;
}(eui.ItemRenderer));
__reflect(PositionItem.prototype, "PositionItem");
//# sourceMappingURL=PositionForeshowPanel.js.map