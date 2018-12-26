class FormationSkillPanel  extends BaseEuiView implements ICommonWindowTitle {
    public static LAYER_LEVEL = LayerManager.UI_Popup
    
    /////////////////////////////////////////////////////////////////////////////
    // FormationSkillSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected curLabel: eui.Label;
    protected nextLabel: eui.Label;
    protected nextDesc: eui.Label;
    protected curDesc: eui.Label;
    protected upGroup: eui.Group;
    protected needItemView: NeedItemView;
    protected upBtn: eui.Button;
    protected skillName: eui.Label;
    protected skillComp: PetSkillItem;
    protected groupNextDesc: eui.Group;
    protected groupMaxLv: eui.Group;
    protected unActiveImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    private mSkillId: number
    private mFormationId: number

    public constructor() {
        super()
        this.skinName = "FormationSkillSkin"
    }

    public childrenCreated() {
        this._AddClick(this.upBtn, this._OnClick)
    }

    public OnOpen(...param: any[]) {
        this.commonDialog.title = "技能"
        this.commonDialog.OnAdded(this)
        this.observe(MessageDef.FORMATION_UPDATE_SKILL_INFO, this.UpdateContent)

        this.mFormationId = param[0]
        this.UpdateContent()
    }

    public OnClose() {
        this.commonDialog.OnRemoved()
    }

    private _OnClick(e: egret.TouchEvent) {
        let skillCost =  FormationConst.GetSkillUpgradeCost(this.mSkillId)
        if (Checker.CheckItem(skillCost.id, skillCost.count, false))
            GameGlobal.FormationModel.SendUpgradeSkill(this.mFormationId)
    }

    public UpdateContent() {
        this.mSkillId = GameGlobal.FormationModel.GetSkillId(this.mFormationId)
        PetSkillIconItem.SetContent(this.skillComp as any, this.mSkillId, 2)
        let name = PetConst.GetPassSkillName(this.mSkillId)
        let config = GameGlobal.Config.FormationSkillConfig[this.mSkillId]
        if (!config)
            return

        this.skillName.textFlow = TextFlowMaker.generateTextFlow(name + `|C:0x019704&T: Lv.${config.lv}|`)
        this.curDesc.text = PetConst.GetPassSkillDesc(this.mSkillId)

        this.unActiveImg.visible = false
        if (FormationConst.IsMaxSkillLv(this.mSkillId))
        {
            this.groupNextDesc.visible = false
            this.groupMaxLv.visible = true
            this.upGroup.visible = false
            return
        }

        let nextSkillId = FormationConst.GetNextSkillId(this.mSkillId)
        this.nextDesc.text = PetConst.GetPassSkillDesc(nextSkillId)

        if (!GameGlobal.FormationModel.HasFormation(this.mFormationId))
        {
            this.unActiveImg.visible = true
            this.groupMaxLv.visible = false
            this.upGroup.visible = false
            return
        }

        let skillCost =  FormationConst.GetSkillUpgradeCost(this.mSkillId)
        if (!skillCost)
            return

        this.needItemView.SetItemId(skillCost.id, skillCost.count)
    }
}
