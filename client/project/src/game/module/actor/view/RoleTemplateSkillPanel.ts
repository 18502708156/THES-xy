class RoleTemplateSkillPanel extends BaseEuiView implements ICommonWindowTitle {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // RoleRideSkillSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected itemList: eui.List;
    protected noneImg: eui.Image;
    protected skillName: eui.Label;
    protected curLabel: eui.Label;
    protected curAttrLabel: eui.Label;
    protected nextLabel: eui.Label;
    protected nextAttrLabel: eui.Label;
    protected upGroup: eui.Group;
    protected upBtn: eui.Button;
    protected needItemView: NeedItemView;
    /////////////////////////////////////////////////////////////////////////////

    public mModel: UserTemplate
    private mSelectIndex = 0
    // private mItemName = ""

    public constructor() {
        super()
        this.skinName = "RoleRideSkillSkin"
    }

    public childrenCreated() {
        this.itemList.itemRenderer = RoleTemplateSkillItem
        this.itemList.validateNow()
        this._AddItemClick(this.itemList, this._OnItemClick)
        this._AddClick(this.upBtn, this._OnClick)
    }

    public OnOpen(...param: any[]) {
        this.commonDialog.title = "技能"
        this.mModel = param[0]
        let skillIndex = param[1]
        let iconList = param[2]
        this.mSelectIndex = skillIndex
        for (let i = 0; i < 4; i++) {
            let item = this.itemList.getChildAt(i) as RoleTemplateSkillItem
            (item.item as any).imgIcon.source = iconList[i]
        }
        this.commonDialog.OnAdded(this)
        this.UpdateContent()
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
    }

    public OnClose() {
        this.commonDialog.OnRemoved()
    }

    private _OnClick(e: egret.TouchEvent) {
        let model = this.mModel
        let skillLevel = model.mSkills[this.mSelectIndex]
        let skillConfig = model.SkillConfig[model.mRideSkills[this.mSelectIndex]]
        let curConfig = skillConfig[skillLevel - 1]
        if (Checker.Data(curConfig.cost)) {
            this.mModel.SendUpSkill(this.mSelectIndex)

            let item = this.itemList.getChildAt(this.mSelectIndex) as RoleTemplateSkillItem
            item.showEff();
        }
    }

    private _OnItemClick(e: eui.ItemTapEvent) {
        this.mSelectIndex = e.itemIndex
        this.UpdateContent()
    }

    UpdateContent(): void {
        UIHelper.ListRefresh(this.itemList)
        for (let i = 0; i < 4; i++) {
            let item = this.itemList.getChildAt(i) as RoleTemplateSkillItem
            (item.item as any).imgIcon.filters = this.mModel.IsOpen(i) ? null : Color.GetFilter()
            item.selectImg.visible = i == this.mSelectIndex
        }

        let model = this.mModel
        let isOpen = model.IsOpen(this.mSelectIndex)
        this.noneImg.visible = !isOpen
        let skillLevel = model.mSkills[this.mSelectIndex]
        let skillConfig = model.SkillConfig[model.mRideSkills[this.mSelectIndex]]
        let nextConfig = skillConfig[skillLevel]
        if (skillLevel > 0)
            this.skillName.text = skillConfig[0].skillname + " 等级 " + skillLevel.toString()
        else
            this.skillName.text = skillConfig[0].skillname
        if (isOpen) {
            let curConfig = skillConfig[skillLevel - 1]
            this.curAttrLabel.textFlow = AttributeData.GetAttrTabString(curConfig.attrpower)
            if (nextConfig) {
                this.needItemView.SetItemId(curConfig.cost.id, curConfig.cost.count)
                this.upGroup.visible = true
                this.nextAttrLabel.textFlow = AttributeData.GetAttrTabString(nextConfig.attrpower)
            } else {
                this.upGroup.visible = false
                this.nextAttrLabel.text = "已满级"
            }
            this.curLabel.text = "当前效果"
            this.nextLabel.text = "下级效果"
            this.nextAttrLabel.textColor = Color.GrayAttr
        } else {
            this.upGroup.visible = false
            this.curLabel.text = "下级效果"
            this.nextLabel.text = "激活条件"
            this.curAttrLabel.textFlow = AttributeData.GetAttrTabString(nextConfig.attrpower)
            this.nextAttrLabel.text = this.getKindName() + "达到" + model.GetOpenLevel(this.mSelectIndex) + "阶"
            this.nextAttrLabel.textColor = Color.Red
        }
    }

    private getKindName() {
        let templateType = this.mModel.mTemplateType
        let kindName = ""
        switch (templateType) {
            case UserTemplate.TYPE_XIANLV_FZ:
                kindName = "法阵"
                break
            case UserTemplate.TYPE_XIANLV_XW:
                kindName = "仙位"
                break
            case UserTemplate.TYPE_PET_TONGL:
                kindName = "通灵"
                break
            case UserTemplate.TYPE_PET_SHOUH:
                kindName = "兽魂"
                break
            case UserTemplate.TYPE_RIDE:
                kindName = "坐骑"
                break
            case UserTemplate.TYPE_WING:
                kindName = "翅膀"
                break
        }

        return kindName
    }
}

class RoleTemplateSkillItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // RideItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    public item: eui.Component;
    public selectImg: eui.Image;
    public lvLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    dataChanged() {

        let panel = Util.GetParentByType(this, RoleTemplateSkillPanel) as RoleTemplateSkillPanel
        if (!panel) {
            return
        }
        let _model = panel.mModel
        if (!_model) {
            return
        }
        let openLevel = _model.GetOpenLevel(this.itemIndex)
        if (_model.mLevel >= openLevel) {
            this.lvLabel.text = "Lv." + _model.mSkills[this.itemIndex]
            this.lvLabel.textColor = Color.l_green_1
        } else {
            this.lvLabel.text = openLevel + "阶激活"
            this.lvLabel.textColor = 0x38983d
        }
    }

    showEff() {
        let eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("ui_eff_skillf_001"), true, 1);
        eff.x = this.selectImg.width >> 1;
        eff.y = this.selectImg.height >> 1;
        this.addChild(eff);
    }

}