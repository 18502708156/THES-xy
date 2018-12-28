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
var PetInfoPanel = (function (_super) {
    __extends(PetInfoPanel, _super);
    function PetInfoPanel() {
        var _this = _super.call(this) || this;
        _this.bShowGetWay = false; //是否显示获得途径 false为显示获得途径 true 为不显示获得途径
        _this.skinName = "PetInfoSkin";
        return _this;
    }
    PetInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.skillIcon, this._OnClick);
        this._AddClick(this.getwayLabel, this._OnClick);
        this.skillGroup.itemRenderer = PetSkillItem;
        this._AddItemClick(this.skillGroup, this._OnItemClick);
        this.commonDialog.title = "详细属性";
        this.getwayLabel.label.stroke = 0;
        this.getwayLabel.textColor = Color.l_green_1;
    };
    PetInfoPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        if (args == null || args.length == 0)
            return;
        this.petinfo = args[0];
        this.UpdateContent();
        var config = GameGlobal.Config.HandBookConfig;
        for (var key in config) {
            if (config[key].id == this.petinfo.pictype) {
                this.getwayLabel.text = config[key].name;
            }
        }
        if (args[1]) {
            this.gGetWay.visible = false;
        }
    };
    PetInfoPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.PetModel;
        var selectConfig = this.petinfo;
        this.mPetId = selectConfig.id;
        this.img.source = PetConst.XUXING_IMG[selectConfig.fiveele];
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
        this.godImg.visible = GameGlobal.Config.petBiographyConfig[this.mPetId].picshow;
    };
    PetInfoPanel.prototype._OnItemClick = function (e) {
        var skillId = this.skillGroup.selectedItem;
        if (!skillId) {
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    PetInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId());
                break;
            case this.getwayLabel:
                var config = GameGlobal.Config.HandBookConfig;
                for (var key in config) {
                    if (config[key].id == this.petinfo.pictype) {
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
    PetInfoPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetInfoPanel;
}(BaseEuiView));
__reflect(PetInfoPanel.prototype, "PetInfoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=PetInfoPanel.js.map