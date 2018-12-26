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
var HavingUpLevelPanel = (function (_super) {
    __extends(HavingUpLevelPanel, _super);
    function HavingUpLevelPanel() {
        var _this = _super.call(this) || this;
        _this.mShowLevel = 0;
        _this.mModel = GameGlobal.HavingModel;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this.SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnAuto.label = "停止";
            }
            else {
                _this.btnAuto.label = "自动进阶";
            }
        }, 200);
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            if (_this.mModel) {
                _this.mModel.SendBoost(type);
            }
        }, function () {
            var model = _this.mModel;
            var levelConfig = _this.mModel.LvproConfig[model.mLevel];
            if (!levelConfig) {
                return [null];
            }
            var cost = levelConfig.cost;
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count];
        }, function () {
            return _this.checkBox.selected;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        return _this;
    }
    HavingUpLevelPanel.prototype.childrenCreated = function () {
        this.lbFull.text = this.name + "已满阶";
        this.skillList.itemRenderer = HavingSkillIcon;
        this.btnSkin.visible = false;
        this._AddItemClick(this.skillList, this._OnItemClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
        this._AddClick(this.btnAttrDrug, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
        this._AddClick(this.btnSkin, this._OnClick);
        this._AddClick(this.btn_juexing, this._OnClick);
        this._AddClick(this.help, this._click);
    };
    HavingUpLevelPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.observe(MessageDef.HAVING_UPDATE, this.UpdateContent);
        this.observe(MessageDef.HAVING_UPDATE_EXP, this._DoUpdateExp);
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent);
        this.UpdateRedPoint();
    };
    HavingUpLevelPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    HavingUpLevelPanel.prototype._click = function () {
        ViewManager.ins().open(ActivityDescPanel, 11, "规则说明");
    };
    HavingUpLevelPanel.prototype.UpdateRedPoint = function () {
        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN));
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM));
        UIHelper.ShowRedPoint(this.btn_juexing, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD));
    };
    HavingUpLevelPanel.prototype.UpdateItemContent = function () {
        this._UpdateExp();
    };
    HavingUpLevelPanel.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        var skillId = this.skillIds[index];
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 1);
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false);
    };
    HavingUpLevelPanel.prototype.updateSkills = function () {
        this.skillIds = [];
        var baseConfig = GameGlobal.HavingModel.getBaseConfig();
        this.skillIds.length = 6;
        this.skillIds[0] = baseConfig.skill;
        this.skillIds[1] = baseConfig.hskill;
        for (var i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
            var data = GameGlobal.HavingMagicModel.skillData[i];
            if (data && data.attrData && data.attrData.length == 4) {
                this.skillIds[i + 2] = data.attrData[3].skillNo;
            }
        }
        this.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
    };
    HavingUpLevelPanel.prototype.UpdateContent = function () {
        var model = this.mModel;
        var nextLevelConfig = this.mModel.LvproConfig[model.mLevel + 1];
        if (!nextLevelConfig) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        this.xingxiang.SetBody(AppearanceConfig.GetUIPath(model.GetAppaId()));
        this.powerLabel.text = model.GetPower();
        this.lbLev.text = model.mLevel + "\n阶";
        this.updateSkills();
        this._UpdateExp();
    };
    HavingUpLevelPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this.SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel);
                break;
            case this.powerLabel:
                ViewManager.ins().open(HavingAttrPanel, this.mModel, this.name, AppearanceConfig.GetUIPath(this.mModel.GetLevelSkin(this.mShowLevel)));
                break;
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel);
                break;
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType);
                break;
        }
    };
    HavingUpLevelPanel.prototype._DoUpdateExp = function () {
        this.mRoleAutoSendData.Continue();
        this._UpdateExp();
    };
    HavingUpLevelPanel.prototype._UpdateExp = function () {
        var levelConfig = this.mModel.LvproConfig[this.mModel.mLevel];
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = this.mModel.mUpNum * levelConfig.exp;
        this.consumeLabel.Set(levelConfig.cost);
    };
    HavingUpLevelPanel.prototype.SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    HavingUpLevelPanel.RedPointCheck = function () {
        return GameGlobal.HavingModel.mRedPoint.IsRedPointWithout(HavingModelRedPoint.INDEX_SKILL_ITEM);
    };
    HavingUpLevelPanel.NAME = "玄女";
    return HavingUpLevelPanel;
}(BaseView));
__reflect(HavingUpLevelPanel.prototype, "HavingUpLevelPanel", ["ICommonWindowTitle"]);
var HavingSkillIcon = (function (_super) {
    __extends(HavingSkillIcon, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HavingSkillIcon() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingSkillIconSkin";
        return _this;
    }
    HavingSkillIcon.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var skillId = this.data;
        var quality;
        if (1 < this.itemIndex) {
            this.useTypeImg.source = "ui_tn_bm_bei";
            quality = PetConst.GetPassSkillQuality(skillId);
            this.iconImg.source = PetConst.GetPassSkillIcon(skillId);
        }
        else {
            // this.useTypeImg.source = 0 == this.itemIndex ? 'ui_bm_zhu' : 'ui_tn_bm_he';
            this.useTypeImg.source = 'ui_bm_zhu';
            quality = PetConst.GetSkillQuality(skillId);
            this.iconImg.source = PetConst.GetSkillIcon(skillId);
        }
        this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
    };
    return HavingSkillIcon;
}(eui.ItemRenderer));
__reflect(HavingSkillIcon.prototype, "HavingSkillIcon");
//# sourceMappingURL=HavingUpLevelPanel.js.map