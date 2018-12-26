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
var RoleTemplateSkillPanel = (function (_super) {
    __extends(RoleTemplateSkillPanel, _super);
    // private mItemName = ""
    function RoleTemplateSkillPanel() {
        var _this = _super.call(this) || this;
        _this.mSelectIndex = 0;
        _this.skinName = "RoleRideSkillSkin";
        return _this;
    }
    RoleTemplateSkillPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = RoleTemplateSkillItem;
        this.itemList.validateNow();
        this._AddItemClick(this.itemList, this._OnItemClick);
        this._AddClick(this.upBtn, this._OnClick);
    };
    RoleTemplateSkillPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.title = "技能";
        this.mModel = param[0];
        var skillIndex = param[1];
        var iconList = param[2];
        this.mSelectIndex = skillIndex;
        for (var i = 0; i < 4; i++) {
            var item = this.itemList.getChildAt(i);
            item.item.imgIcon.source = iconList[i];
        }
        this.commonDialog.OnAdded(this);
        this.UpdateContent();
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
    };
    RoleTemplateSkillPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    RoleTemplateSkillPanel.prototype._OnClick = function (e) {
        var model = this.mModel;
        var skillLevel = model.mSkills[this.mSelectIndex];
        var skillConfig = model.SkillConfig[model.mRideSkills[this.mSelectIndex]];
        var curConfig = skillConfig[skillLevel - 1];
        if (Checker.Data(curConfig.cost)) {
            this.mModel.SendUpSkill(this.mSelectIndex);
            var item = this.itemList.getChildAt(this.mSelectIndex);
            item.showEff();
        }
    };
    RoleTemplateSkillPanel.prototype._OnItemClick = function (e) {
        this.mSelectIndex = e.itemIndex;
        this.UpdateContent();
    };
    RoleTemplateSkillPanel.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.itemList);
        for (var i = 0; i < 4; i++) {
            var item = this.itemList.getChildAt(i);
            item.item.imgIcon.filters = this.mModel.IsOpen(i) ? null : Color.GetFilter();
            item.selectImg.visible = i == this.mSelectIndex;
        }
        var model = this.mModel;
        var isOpen = model.IsOpen(this.mSelectIndex);
        this.noneImg.visible = !isOpen;
        var skillLevel = model.mSkills[this.mSelectIndex];
        var skillConfig = model.SkillConfig[model.mRideSkills[this.mSelectIndex]];
        var nextConfig = skillConfig[skillLevel];
        if (skillLevel > 0)
            this.skillName.text = skillConfig[0].skillname + " 等级 " + skillLevel.toString();
        else
            this.skillName.text = skillConfig[0].skillname;
        if (isOpen) {
            var curConfig = skillConfig[skillLevel - 1];
            this.curAttrLabel.textFlow = AttributeData.GetAttrTabString(curConfig.attrpower);
            if (nextConfig) {
                this.needItemView.SetItemId(curConfig.cost.id, curConfig.cost.count);
                this.upGroup.visible = true;
                this.nextAttrLabel.textFlow = AttributeData.GetAttrTabString(nextConfig.attrpower);
            }
            else {
                this.upGroup.visible = false;
                this.nextAttrLabel.text = "已满级";
            }
            this.curLabel.text = "当前效果";
            this.nextLabel.text = "下级效果";
            this.nextAttrLabel.textColor = Color.GrayAttr;
        }
        else {
            this.upGroup.visible = false;
            this.curLabel.text = "下级效果";
            this.nextLabel.text = "激活条件";
            this.curAttrLabel.textFlow = AttributeData.GetAttrTabString(nextConfig.attrpower);
            this.nextAttrLabel.text = this.getKindName() + "达到" + model.GetOpenLevel(this.mSelectIndex) + "阶";
            this.nextAttrLabel.textColor = Color.Red;
        }
    };
    RoleTemplateSkillPanel.prototype.getKindName = function () {
        var templateType = this.mModel.mTemplateType;
        var kindName = "";
        switch (templateType) {
            case UserTemplate.TYPE_XIANLV_FZ:
                kindName = "法阵";
                break;
            case UserTemplate.TYPE_XIANLV_XW:
                kindName = "仙位";
                break;
            case UserTemplate.TYPE_PET_TONGL:
                kindName = "通灵";
                break;
            case UserTemplate.TYPE_PET_SHOUH:
                kindName = "兽魂";
                break;
            case UserTemplate.TYPE_RIDE:
                kindName = "坐骑";
                break;
            case UserTemplate.TYPE_WING:
                kindName = "翅膀";
                break;
        }
        return kindName;
    };
    RoleTemplateSkillPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RoleTemplateSkillPanel;
}(BaseEuiView));
__reflect(RoleTemplateSkillPanel.prototype, "RoleTemplateSkillPanel", ["ICommonWindowTitle"]);
var RoleTemplateSkillItem = (function (_super) {
    __extends(RoleTemplateSkillItem, _super);
    function RoleTemplateSkillItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleTemplateSkillItem.prototype.dataChanged = function () {
        var panel = Util.GetParentByType(this, RoleTemplateSkillPanel);
        if (!panel) {
            return;
        }
        var _model = panel.mModel;
        if (!_model) {
            return;
        }
        var openLevel = _model.GetOpenLevel(this.itemIndex);
        if (_model.mLevel >= openLevel) {
            this.lvLabel.text = "Lv." + _model.mSkills[this.itemIndex];
            this.lvLabel.textColor = Color.l_green_1;
        }
        else {
            this.lvLabel.text = openLevel + "阶激活";
            this.lvLabel.textColor = 0x38983d;
        }
    };
    RoleTemplateSkillItem.prototype.showEff = function () {
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("ui_eff_skillf_001"), true, 1);
        eff.x = this.selectImg.width >> 1;
        eff.y = this.selectImg.height >> 1;
        this.addChild(eff);
    };
    return RoleTemplateSkillItem;
}(eui.ItemRenderer));
__reflect(RoleTemplateSkillItem.prototype, "RoleTemplateSkillItem");
//# sourceMappingURL=RoleTemplateSkillPanel.js.map