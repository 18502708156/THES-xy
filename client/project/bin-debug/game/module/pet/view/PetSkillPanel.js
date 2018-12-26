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
var PetSkillPanel = (function (_super) {
    __extends(PetSkillPanel, _super);
    function PetSkillPanel() {
        return _super.call(this) || this;
    }
    PetSkillPanel.prototype.childrenCreated = function () {
        this._AddClick(this.goBtn, this._OnClick);
        this._AddClick(this.skillIcon, this._OnClick);
        this._AddClick(this.starGroup, this._OnClick);
        this._AddClick(this.btnInfo, this._OnClick);
        this.skillGroup.itemRenderer = PetSkillItem;
        this._AddItemClick(this.skillGroup, this._OnItemClick);
    };
    PetSkillPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent);
    };
    PetSkillPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.PetModel;
        var selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex];
        if (!model.HasPet(selectConfig.id)) {
            this.group.visible = false;
            return;
        }
        this.group.visible = true;
        this.mPetId = selectConfig.id;
        this.img01.source = PetConst.XUXING_IMG[selectConfig.fiveele];
        var petInfo = model.GetPetInfo(selectConfig.id);
        var list = [];
        // for (let id of selectConfig.buffskill) {
        for (var _i = 0, _a = petInfo.mBuffSkill; _i < _a.length; _i++) {
            var id = _a[_i];
            list.push(id);
        }
        for (var i = list.length - 1; i < PetModel.SKILL_COUNT; i++) {
            list.push(null);
        }
        this.skillGroup.dataProvider = new eui.ArrayCollection(list);
        var xilianStar = petInfo.GetXilianStar();
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = xilianStar > i ? "ui_bm_star022" : "ui_bm_star021";
        }
        PetConst.SetName(this.lbName, petInfo);
        this.powerLabel.text = petInfo.GetPower();
        this.petShowPanel.SetBody(PetConst.GetSkin(this.mPetId));
        var skillId = petInfo.GetSkillId();
        var skillConfig = GameGlobal.Config.EffectsConfig[skillId];
        this.skillDesc.text = PetConst.GetSkillDesc(skillId);
        PetSkillIconItem.SetContent(this.skillIcon, petInfo.GetSkillId(), 0);
    };
    PetSkillPanel.prototype._OnItemClick = function (e) {
        var petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId);
        var index = e.itemIndex;
        var skillId = petInfo.mBuffSkill[index];
        if (!skillId) {
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    PetSkillPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goBtn:
                ViewManager.ins().open(PetXilianPanel, this.mPetId);
                break;
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId());
                break;
            case this.btnInfo:
                this.startInfo();
                break;
            case this.starGroup:
                this.startInfo();
                break;
        }
    };
    PetSkillPanel.prototype.startInfo = function () {
        var petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId);
        var desc = '宠物技能已累计刷新：';
        var count = petInfo.mXilian + "次";
        var c = 0xffffff;
        var config = GameGlobal.Config.petBiographyConfig[petInfo.mPetId];
        if (config) {
            c = ItemBase.GetColorByQuality(config.quality);
        }
        ViewManager.ins().open(PetXilianTipPanel, petInfo.mName, desc, count, c, GameGlobal.Config.petbaseConfig.freshitemid);
    };
    PetSkillPanel.RedPointCheck = function () {
        return GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_SKILL);
    };
    PetSkillPanel.NAME = "技能";
    return PetSkillPanel;
}(BaseView));
__reflect(PetSkillPanel.prototype, "PetSkillPanel", ["ICommonWindowTitle"]);
var PetSkillItem = (function (_super) {
    __extends(PetSkillItem, _super);
    function PetSkillItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    PetSkillItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            this.iconBg.source = "ui_bm_weikaifang";
            this.skillName.text = ""; //显示解锁状态			
        }
        else {
            var skillId = data;
            var quality = PetConst.GetPassSkillQuality(skillId);
            this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
            this.skillName.textColor = ItemBase.GetColorByQuality(quality);
            var skillName = PetConst.GetPassSkillName(skillId);
            this.iconImg.source = PetConst.GetPassSkillIcon(skillId);
            if (quality == 6) {
                this.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName);
            }
            else {
                this.skillName.text = skillName;
                this.skillName.textColor = ItemBase.GetColorByQuality(quality);
            }
        }
    };
    return PetSkillItem;
}(eui.ItemRenderer));
__reflect(PetSkillItem.prototype, "PetSkillItem");
var LinglongSkillItem = (function (_super) {
    __extends(LinglongSkillItem, _super);
    function LinglongSkillItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mIsLock = false;
        return _this;
    }
    LinglongSkillItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            this.iconBg.source = "ui_bm_weikaifang";
            var str = "";
            var config = GameGlobal.Config.BabyBasisConfig.openSkill;
            if (config[this.itemIndex]) {
                str = config[this.itemIndex] + "阶解锁";
            }
            this.skillName.text = str; //显示解锁状态
            this.mIsLock = true;
        }
        else {
            var skillId = data;
            if (GameGlobal.Config.EffectsConfig[skillId]) {
                var quality = PetConst.GetPassSkillQuality(skillId);
                this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
                this.skillName.textColor = ItemBase.GetColorByQuality(quality);
                this.skillName.text = PetConst.GetPassSkillName(skillId);
                this.iconImg.source = PetConst.GetPassSkillIcon(skillId);
                if (this["iconType"]) {
                    this["iconType"].visible = false;
                }
            }
            else {
                if (this["iconType"]) {
                    this["iconType"].visible = true;
                }
                var path = PetConst.GetSkillIcon(skillId);
                this.iconImg.source = PetConst.GetSkillIcon(skillId);
                var quality = PetConst.GetSkillQuality(skillId);
                this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
                this.skillName.text = PetConst.GetSkillName(skillId);
                this.skillName.textColor = ItemBase.GetColorByQuality(quality);
            }
            this.mIsLock = false;
        }
    };
    return LinglongSkillItem;
}(eui.ItemRenderer));
__reflect(LinglongSkillItem.prototype, "LinglongSkillItem");
//# sourceMappingURL=PetSkillPanel.js.map