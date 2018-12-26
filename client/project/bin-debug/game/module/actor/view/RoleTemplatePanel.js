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
var RoleTemplatePanel = (function (_super) {
    __extends(RoleTemplatePanel, _super);
    function RoleTemplatePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mHasDress = false;
        _this.mShowLevel = 0;
        _this.m_SkillIconList = [];
        _this.mEquipItems = [];
        _this.mSkillItems = [];
        _this.mPlayEff = {};
        _this.skinName = "RoleTemplateSkin";
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
        _this.title1Label.text = _this.name + "技能";
        _this.title2Label.text = _this.name + "装备";
        _this.lbFull.text = _this.name + "已满阶";
        return _this;
    }
    RoleTemplatePanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnPrev, this._OnClick);
        this._AddClick(this.btnNext, this._OnClick);
        this._AddClick(this.btnHuanHua, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
        this._AddClick(this.btnAttrDrug, this._OnClick);
        this._AddClick(this.btnUpLevel, this._OnClick);
        this._AddClick(this.powerLabel, this._OnClick);
        this._AddClick(this.btnSkin, this._OnClick);
        this._AddClick(this.onekeyEquip, this._OnClick);
        this._AddClick(this.btn_juexing, this._OnClick);
        // this.typeImg.source = RewardData.GetCurrencyMiniRes(this.mModel.uplvitemid)
        for (var i = 0; i < 4; i++) {
            var item = this["skill" + i];
            if (item) {
                item.touchEnabled = true;
                item.touchChildren = false;
                this.mSkillItems[i] = item;
                item.name = i + "";
                this._AddClick(item, this._OnSkillClick);
            }
        }
        for (var i = 0; i < 4; i++) {
            var item = this["equip" + i];
            if (item) {
                item.touchEnabled = true;
                item.touchChildren = false;
                this.mEquipItems[i] = item;
                item.name = i + "";
                this._AddClick(item, this._OnEquipClick);
            }
        }
        this.btnSkin.visible = this.mHasDress;
        this.SetEquipIconList(this.mModel.mEquipIcon);
        //直升一阶显示状态
        this.btnUpLevel.visible = this.mModel.IsShowShootUpDrugID();
        var skillId = this.mModel.BaseConfig.skilllist;
        var skillConfig = this.mModel.SkillConfig;
        var skillIcon = [];
        for (var _i = 0, skillId_1 = skillId; _i < skillId_1.length; _i++) {
            var id = skillId_1[_i];
            skillIcon.push(skillConfig[id][0].skillitem);
        }
        this.SetSkillIconList(skillIcon);
    };
    RoleTemplatePanel.prototype.SetSkillIconList = function (iconList) {
        this.m_SkillIconList = iconList;
        for (var i = 0; i < iconList.length; i++) {
            var item = this.mSkillItems[i];
            if (item) {
                item.item.setItemImg(iconList[i]);
                var isOpen = this.mModel.IsOpen(i);
                item.item.setItemImgGray(isOpen ? false : true);
                var curSkillLv = this.mModel.mSkills[i];
                item.item.setCount(curSkillLv > 0 ? curSkillLv.toString() : "");
            }
        }
    };
    RoleTemplatePanel.prototype.SetEquipIconList = function (iconList) {
        for (var i = 0; i < iconList.length; i++) {
            var item = this.mEquipItems[i];
            if (item) {
                item.item.setItemImg(ResDataPath.GetItemFullPath(iconList[i]));
                item.item.setCount("");
                var configID = this.mModel.mEquip[i].configID;
                var rec = GameGlobal.Config.ItemConfig[configID];
                var quality = rec ? rec.quality : 0;
                item.item.setItemBg(ResDataPath.GetItemQualityName(quality));
            }
        }
    };
    RoleTemplatePanel.prototype.OnOpen = function () {
        this.mShowLevel = this.mModel.mLevel;
        this.UpdateModel(Math.max(this.mShowLevel, 1));
        this.UpdateContent();
        this.UpdateRedPoint();
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp);
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent);
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        // this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//背包变化更新
        ActivityKaiFuModel.setJiJieOpenViewData(this.m_activityJiJieId);
        this.jijie_link.visible = GameGlobal.ActivityKaiFuModel.GetAdvancedTypeArr().indexOf(this.m_activityJiJieId) != -1;
        if (this.jijie_link.visible) {
            this.jijie_link.text = "进阶狂欢";
            this.AddClick(this.jijie_link, this.openActivityJiJieView);
            this.updateJiJieBtnPng();
        }
    };
    RoleTemplatePanel.prototype.updateJiJieBtnPng = function () {
        UIHelper.ShowRedPoint(this.jijie_link, GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(this.m_activityJiJieId));
    };
    RoleTemplatePanel.prototype.openActivityJiJieView = function () {
        KaiFuActivityWin.Show(ActivityKaiFuFuncType.ACT_99990_JiJie, false);
    };
    RoleTemplatePanel.prototype.OnClose = function () {
        this.mRoleAutoSendData.Stop();
    };
    RoleTemplatePanel.prototype._OnClick = function (e) {
        var _this = this;
        switch (e.currentTarget) {
            case this.btnPrev:
                this.UpdateModel(this.mShowLevel - 1);
                break;
            case this.btnNext:
                this.UpdateModel(this.mShowLevel + 1);
                break;
            case this.btnHuanHua:
                this.mModel.SendDress(this.mModel.BaseConfig.pictureid[this.mShowLevel - 1]);
                break;
            case this.btnCulture:
                this.SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel);
                break;
            case this.btnUpLevel://直升一阶
                if (UserBag.CheckEnough(this.mModel.GetShootUpDrugID(), 1)) {
                    WarnWin.show('6阶或以下使用直升丹可以直升1阶，6阶以上使用可以获得200进阶值，建议6阶时使用', function () {
                        _this.mModel.SendShootUpDrug(_this.mModel.GetShootUpDrugID());
                    }, this, null, null, 'normal', { btnName: '使用' });
                }
                break;
            case this.powerLabel:
                ViewManager.ins().open(RoleTemplateAttrPanel, this.mModel, this.name, this.mModel.GetLevelSkin(this.mShowLevel));
                break;
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel);
                break;
            case this.onekeyEquip:
                for (var i = 0; i < UserRide.EQUIP_COUNT; i++) {
                    var handle = this.mModelRedPoint.IsRedEquip(i);
                    if (handle) {
                        this.mModel.SendEquip(handle);
                    }
                }
                break;
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType);
                break;
        }
    };
    RoleTemplatePanel.prototype.SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    RoleTemplatePanel.prototype._OnSkillClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        ViewManager.ins().open(RoleTemplateSkillPanel, this.mModel, index, this.m_SkillIconList);
    };
    RoleTemplatePanel.prototype._OnEquipClick = function (e) {
        var index = parseInt(e.currentTarget.name);
        var baseData = this.mModel.mEquip[index];
        if (!baseData.configID)
            return;
        ViewManager.ins().open(EquipDetailedWin, baseData.configID, baseData, true);
    };
    RoleTemplatePanel.prototype.UpdateExp = function (upLevel) {
        if (upLevel) {
            this.UpdateModel(this.mShowLevel + 1);
            this.mRoleAutoSendData.Stop();
            ViewManager.ins().open(GainNewImagePanel, this.mModel);
        }
        else {
            this.mRoleAutoSendData.Continue();
        }
    };
    RoleTemplatePanel.prototype.UpdateContent = function () {
        var model = this.mModel;
        this.powerLabel.text = model.GetDescPower();
        for (var i = 0; i < this.mSkillItems.length; i++) {
            var item = this.mSkillItems[i];
            var isOpen = this.mModel.IsOpen(i);
            item.item.setItemImgGray(isOpen ? false : true);
            var curSkillLv = this.mModel.mSkills[i];
            if (isOpen) {
                item.item.setCount(curSkillLv > 0 ? curSkillLv.toString() : "");
            }
            else {
                item.item.count.text = this.mModel.GetOpenLevel(i) + "阶开启";
            }
        }
        for (var i = 0; i < this.mEquipItems.length; i++) {
            if (model.mEquip[i].configID) {
                var oldId = this.mEquipItems[i].item.data;
                var newId = this.mEquipItems[i].item.data = model.mEquip[i];
                if (newId && oldId != newId && this.mPlayEff[i]) {
                    UIHelper.PlayUpEff(this.mEquipItems[i], 0.8);
                }
            }
            this.mPlayEff[i] = true;
        }
        if (!model.mLevel) {
            this.currentState = "none";
            return;
        }
        if (this.mModel.mLevel >= this.mModel.mMaxLevel) {
            this.currentState = "full";
        }
        else {
            this.currentState = "normal";
        }
        this.UpdateModel(this.mShowLevel);
        var levelConfig = this.mModel.LvproConfig[model.mLevel];
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = model.mUpNum * levelConfig.exp;
        this.UpdateItemContent();
    };
    RoleTemplatePanel.prototype.UpdateItemContent = function () {
        var levelConfig = this.mModel.LvproConfig[this.mModel.mLevel];
        if (!levelConfig) {
            return;
        }
        this.consumeLabel.Set(levelConfig.cost);
    };
    RoleTemplatePanel.prototype.UpdateRedPoint = function () {
        var hasEquip = false;
        for (var i = 0; i < UserRide.EQUIP_COUNT; i++) {
            var item = this.mEquipItems[i];
            var state = this.mModelRedPoint.IsRedEquip(i) ? true : false;
            item.item.IsShowRedPoint(state);
            if (state) {
                hasEquip = state;
            }
        }
        this.onekeyEquip.visible = hasEquip;
        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN));
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM));
        for (var i = 0; i < this.mSkillItems.length; i++) {
            var item = this.mSkillItems[i];
            item.item.IsShowRedPoint(this.mModelRedPoint.IsRedSkill(i));
        }
        UIHelper.ShowRedPoint(this.btn_juexing, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD));
        UIHelper.ShowRedPoint(this.btnAuto, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK));
        UIHelper.ShowRedPoint(this.btnCulture, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK));
        if (this.btnUpLevel.visible) {
            UIHelper.ShowRedPoint(this.btnUpLevel, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_UP_LEVEL_ITEM));
        }
    };
    RoleTemplatePanel.prototype.UpdateModel = function (level) {
        var model = this.mModel;
        this.mShowLevel = level;
        this.btnPrev.enabled = level > 1;
        this.btnNext.enabled = level < this.mModel.mLevel + 1 && level < model.mMaxLevel;
        this.btnNextIcon.visible = level >= this.mModel.mLevel;
        this.imgHuanHua.visible = false;
        this.btnHuanHua.visible = false;
        this.addPowerGroup.visible = false;
        var proConfig = this.mModel.ProgressConfig[level];
        if (proConfig && proConfig.name) {
            this.lbName.text = proConfig.name;
            this.nameBg.visible = true;
        }
        else {
            this.lbName.text = "";
            this.nameBg.visible = false;
        }
        this.lbLev.text = level + "\n阶";
        var dressId = model.BaseConfig.pictureid[level - 1];
        this.SetMainShow(dressId);
        this.SetExtraShow(dressId);
        if (dressId == model.mDressId) {
            this.imgHuanHua.visible = true;
        }
        else if (level <= model.mLevel) {
            this.btnHuanHua.visible = true;
        }
        else {
            this.addPowerGroup.visible = true;
            this.lbAlert.textFlow = TextFlowMaker.generateTextFlow("\u53EF\u63D0\u5347\u6218\u529B|C:0x63ff57&T:" + model.GetNextAddPower(level) + "|");
        }
    };
    RoleTemplatePanel.prototype.SetMainShow = function (dressId) {
        var model = this.mModel;
        if (!model.SkinConfig[dressId]) {
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(model.SkinConfig[dressId].pid);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW) {
            var xianlvModel = GameGlobal.XianlvModel;
            var battledXianlvId = xianlvModel.getBattledXianlv();
            if (battledXianlvId != 0) {
                var xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId);
                this.showPanel.SetBody(xianlvInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ) {
            var havingModel = GameGlobal.HavingModel;
            this.showPanel.SetBodyId(havingModel.GetAppaId());
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            var petModel = GameGlobal.PetModel;
            var battledPetId = petModel.GetShowId();
            if (battledPetId != 0) {
                var petInfo = petModel.GetPetInfo(battledPetId);
                this.showPanel.SetBody(petInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_WING) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTianx(null);
            this.roleShowPanel.SetTitle(null);
            this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid));
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTitle(null);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_SHENGB) {
            var role = SubRoles.ins().GetRoleData();
            this.roleShowPanel.SetAll(role);
            this.roleShowPanel.SetTianx(null);
            this.roleShowPanel.SetTitle(null);
            this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid, role.job, role.sex, false, true));
            return;
        }
        this.showPanel.SetBodyId(model.SkinConfig[dressId].pid);
    };
    RoleTemplatePanel.prototype.SetExtraShow = function (dressId) {
        var model = this.mModel;
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_FZ) {
            var xianlvModel = GameGlobal.XianlvModel;
            var battledXianlvId = xianlvModel.getBattledXianlv();
            if (battledXianlvId != 0) {
                var xianlvInfo = xianlvModel.GetXianlvInfo(battledXianlvId);
                this.extraPanel.SetBody(xianlvInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_XIANLV_XW || model.mTemplateType == UserTemplate.TYPE_HAVING_LINGQ) {
            var sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid);
            this.imgXianw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_TONGL) {
            var petModel = GameGlobal.PetModel;
            var battledPetId = petModel.GetShowId();
            if (battledPetId != 0) {
                var petInfo = petModel.GetPetInfo(battledPetId);
                this.extraPanel.SetBody(petInfo.GetSkin());
            }
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_PET_SHOUH) {
            var sourcePath = AppearanceConfig.GetUIAppe(model.SkinConfig[dressId].pid);
            var mc = void 0;
            if (this.petSoul.numChildren > 0) {
                mc = this.petSoul.getChildAt(0);
            }
            else {
                mc = new MovieClip();
                this.petSoul.addChild(mc);
            }
            mc.loadUrl(ResDataPath.GetMoviePath(sourcePath), true);
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_TIANX) {
            this.roleShowPanel.SetTianx(AppearanceConfig.GetUIPath(model.SkinConfig[dressId].pid));
            return;
        }
        if (model.mTemplateType == UserTemplate.TYPE_HAVING_HUAN) {
            var model_1 = GameGlobal.HavingModel;
            this.extraPanel.SetBody(AppearanceConfig.GetUIPath(model_1.SkinConfig[model_1.mDressId].pid));
            return;
        }
    };
    return RoleTemplatePanel;
}(BaseView));
__reflect(RoleTemplatePanel.prototype, "RoleTemplatePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=RoleTemplatePanel.js.map