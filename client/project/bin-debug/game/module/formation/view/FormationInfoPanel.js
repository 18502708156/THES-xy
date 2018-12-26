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
var FormationInfoPanel = (function (_super) {
    __extends(FormationInfoPanel, _super);
    function FormationInfoPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FormationInfoSkin";
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this._SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnCulture.label = "停止";
            }
            else {
                _this.btnCulture.label = "自动升级";
            }
        });
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            GameGlobal.FormationModel.SendUpgradeFormation(_this.mFormationId, type);
        }, function () {
            var formationInfo = GameGlobal.FormationModel.GetFormationInfo(_this.mFormationId);
            var config = FormationConst.GetFormationLevelConfig(_this.mFormationId, formationInfo.mLevel);
            if (config) {
                var cost = config.cost;
                return [cost[0].id, cost[0].count, cost[1].id, cost[1].count];
            }
            return [null];
        }, function () {
            return _this.checkBox.selected;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        _this._AddClick(_this.btnSC, _this._OnClick);
        _this._AddClick(_this.btnFS, _this._OnClick);
        _this._AddClick(_this.btnUse, _this._OnClick);
        _this._AddClick(_this.btnAdd, _this._OnClick);
        _this._AddClick(_this.btnCulture, _this._OnClick);
        _this._AddClick(_this.skillComp, _this._OnClick);
        _this._AddClick(_this.powerLabel, _this._OnClick);
        _this._AddClick(_this.btnActive, _this._OnClick);
        _this._AddClick(_this.showAllAttr, _this._OnClick);
        return _this;
    }
    FormationInfoPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FORMATION_UPDATE_INFO, this.UpdateInfo);
        this.observe(MessageDef.FORMATION_UPDATE_EXP, this.UpdateExpInfo);
    };
    FormationInfoPanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    FormationInfoPanel.prototype.UpdateContent = function (id) {
        this.mFormationId = id;
        var model = GameGlobal.FormationModel;
        var config = GameGlobal.Config.FormationListConfig[id];
        this.SetSkillInfo();
        this.showAllAttr.visible = model.GetAllPower() > 0;
        UIHelper.SetLabelText(this.lbPower, "阵型总战力：", model.GetAllPower() + "");
        this.petShowPanel.SetBody(FormationConst.GetSkin(id));
        this.groupUnGain.visible = !model.HasFormation(id);
        this.groupUplv.visible = model.HasFormation(id);
        this.groupLv.visible = model.HasFormation(id);
        this.btnFS.visible = model.HasFormation(id);
        this.imgUsed.source = "ui_zx_bm_shiyongzhong";
        this.imgUsed.visible = model.IsUsed(id);
        this.btnUse.visible = model.HasFormation(id) && !model.IsUsed(id);
        UIHelper.ShowRedPoint(this.btnSC, GameGlobal.FormationModel.mRedPoint.IsRedDrug(this.mFormationId));
        UIHelper.ShowRedPoint(this.btnFS, GameGlobal.FormationModel.mRedPoint.IsRedSoul(this.mFormationId));
        UIHelper.ShowRedPoint(this.btnActive, GameGlobal.FormationModel.mRedPoint.IsRedAct(this.mFormationId));
        UIHelper.ShowRedPoint(this.skillComp, GameGlobal.FormationModel.mRedPoint.IsRedSkill(this.mFormationId));
        if (!model.HasFormation(id)) {
            this.SetActiveInfo(id);
            return;
        }
        this.UpdateExp();
    };
    FormationInfoPanel.prototype.UpdateInfo = function () {
        this.UpdateContent(this.mFormationId);
    };
    FormationInfoPanel.prototype.UpdateExpInfo = function () {
        if (GameGlobal.FormationModel.IsMaxLv(this.mFormationId)) {
            this.mRoleAutoSendData.Stop();
        }
        else {
            this.mRoleAutoSendData.Continue();
        }
        this.UpdateExp();
    };
    FormationInfoPanel.prototype.UpdateExp = function () {
        var model = GameGlobal.FormationModel;
        var id = this.mFormationId;
        this.powerLabel.text = model.GetPower(id);
        var formationInfo = model.GetFormationInfo(id);
        this.lbLev.text = formationInfo.mLevel + "级";
        this.groupDuration.visible = !model.IsMaxLv(id);
        this.groupMaxLv.visible = model.IsMaxLv(id);
        if (model.IsMaxLv(id))
            return;
        var config = FormationConst.GetFormationLevelConfig(id, formationInfo.mLevel);
        this.bar.maximum = config.proexp;
        this.bar.value = formationInfo.mUpNum * config.exp;
        this.consumeLabel.Set(config.cost);
    };
    FormationInfoPanel.prototype.SetActiveInfo = function (id) {
        var material = FormationConst.GetFormationUpgradeMaterial(id);
        if (!material)
            return;
        this.needItemView.SetItemId(material.id, material.count);
        var canActive = GameGlobal.UserBag.GetCount(material.id) >= material.count;
        this.btnActive.visible = canActive;
        if (this.getwayLabel.visible = !canActive) {
            this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<font>获取：</font><a href=\"event:\"><font color='#019704'><u>" + "宠物商店" + "</u></font></a>");
        }
    };
    FormationInfoPanel.prototype.SetSkillInfo = function () {
        this.groupSkill.visible = FormationConst.HasBuffSkill(this.mFormationId);
        if (!FormationConst.HasBuffSkill(this.mFormationId))
            return;
        PetSkillIconItem.SetContent(this.skillComp, GameGlobal.FormationModel.GetSkillId(this.mFormationId), 2);
    };
    FormationInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnSC:
                ViewManager.ins().open(FormationDrugPanel, GameGlobal.FormationModel);
                break;
            case this.btnFS:
                ViewManager.ins().open(FormationSoulPanel, this.mFormationId);
                break;
            case this.btnAdd:
                this._SendUp();
                break;
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.powerLabel:
                ViewManager.ins().open(FormationDetailPanel, this.mFormationId);
                break;
            case this.skillComp:
                ViewManager.ins().open(FormationSkillPanel, this.mFormationId);
                break;
            case this.btnActive:
                GameGlobal.FormationModel.SendActiveFormation(this.mFormationId);
                break;
            case this.btnUse:
                GameGlobal.FormationModel.SendUseFormation(this.mFormationId);
                break;
            case this.showAllAttr:
                ViewManager.ins().open(FormationAllAttrPanel);
                break;
        }
    };
    FormationInfoPanel.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    return FormationInfoPanel;
}(BaseView));
__reflect(FormationInfoPanel.prototype, "FormationInfoPanel");
//# sourceMappingURL=FormationInfoPanel.js.map