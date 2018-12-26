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
var PetGodQualityPanel = (function (_super) {
    __extends(PetGodQualityPanel, _super);
    function PetGodQualityPanel() {
        return _super.call(this) || this;
    }
    PetGodQualityPanel.prototype.childrenCreated = function () {
        this._AddClick(this.skillIcon, this._OnClick);
        this._AddClick(this.getwayLabel, this._OnClick);
        this.skillGroup.itemRenderer = PetSkillItem;
        this._AddItemClick(this.skillGroup, this._OnItemClick);
        this._AddItemClick(this.petList, this._OnItemClick);
        this.getwayLabel.label.stroke = 0;
        this.getwayLabel.textColor = Color.l_green_1;
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.petList, this.leftBtn, this.rightBtn, 112);
        var petListData = [];
        var config = CommonUtils.GetArray(GameGlobal.Config.petBiographyConfig, "id");
        for (var key in config)
            if (config[key].picshow == 1) {
                config[key]["gray"] = true;
                petListData.push(config[key]);
            }
        SortTools.sortMap(petListData, "id");
        this.petList.itemRenderer = GodPetHeadItem;
        this.petList.dataProvider = new eui.ArrayCollection(petListData);
        this.petList.selectedIndex = 0;
        this.mListLRBtnCtrl.OnRefresh();
    };
    PetGodQualityPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.PetModel;
        var selectConfig = this.petList.selectedItem;
        var HandBookConfig = GameGlobal.Config.HandBookConfig;
        for (var key in HandBookConfig) {
            if (HandBookConfig[key].id == this.petList.selectedItem.pictype) {
                this.getwayLabel.text = HandBookConfig[key].name;
            }
        }
        this.mPetId = selectConfig.id;
        this.img01.source = PetConst.XUXING_IMG[selectConfig.fiveele];
        var skills = [];
        for (var key in selectConfig.buffskill) {
            skills.push(selectConfig.buffskill[key].id);
        }
        this.skillGroup.dataProvider = new eui.ArrayCollection(skills);
        var petInfo = new PetInfo();
        petInfo.mPetId = selectConfig.id;
        petInfo.mName = selectConfig.name;
        PetConst.SetName(this.lbName, petInfo);
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(selectConfig.attrs);
        this.petShowPanel.SetBody(PetConst.GetSkin(this.mPetId));
        this.skillDesc.text = PetConst.GetSkillDesc(selectConfig.skill[0]);
        PetSkillIconItem.SetContent(this.skillIcon, selectConfig.skill[0], 0); //主动技能
        this.attr0Txt.text = AttributeData.getAttStr(selectConfig.attrs, 0, 0, ":", false, "#ffffff", "            ");
    };
    PetGodQualityPanel.prototype._OnItemClick = function (e) {
        if (e.target == this.petList)
            this.UpdateContent();
        else {
            var skillId = this.skillGroup.selectedItem;
            if (!skillId) {
                return;
            }
            ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
        }
    };
    PetGodQualityPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId());
                break;
            case this.getwayLabel:
                var config = GameGlobal.Config.HandBookConfig;
                for (var key in config) {
                    if (config[key].id == this.petList.selectedItem.pictype) {
                        var info = void 0;
                        if (config[key].hasOwnProperty("gainWay"))
                            info = config[key].gainWay[0];
                        if (!info) {
                            GameGlobal.UserTips.showTips(config[key].name);
                            return;
                        }
                        ViewManager.ins().Guide(info[1][0], info[1][1]);
                        ViewManager.ins().close(PetInfoPanel);
                    }
                }
                break;
        }
    };
    PetGodQualityPanel.NAME = "神宠";
    return PetGodQualityPanel;
}(BaseView));
__reflect(PetGodQualityPanel.prototype, "PetGodQualityPanel", ["ICommonWindowTitle"]);
var GodPetHeadItem = (function (_super) {
    __extends(GodPetHeadItem, _super);
    function GodPetHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ///////////////////////////////////////////////////////////////////////////// 
    GodPetHeadItem.prototype.childrenCreated = function () {
    };
    GodPetHeadItem.prototype.dataChanged = function () {
        this.lbName.text = this.data.name;
        this.lbName.textColor = ItemBase.GetColorByQuality(this.data.quality);
        this.item.SetQuality(this.data.quality);
        this.item.setItemImg(PetConst.GetHeadIcon(this.data.id));
        this.lbLev.visible = false;
        this.imgShen.visible = GameGlobal.Config.petBiographyConfig[this.data.id].picshow;
    };
    return GodPetHeadItem;
}(eui.ItemRenderer));
__reflect(GodPetHeadItem.prototype, "GodPetHeadItem");
//# sourceMappingURL=PetGodQualityPanel.js.map