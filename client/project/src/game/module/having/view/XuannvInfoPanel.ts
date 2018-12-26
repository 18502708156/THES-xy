class XuannvInfoPanel extends BaseEuiView implements ICommonWindowTitle {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // HavingInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected group: eui.Group;
    protected attr0Txt: eui.Label;
    protected skillIcon: eui.Component;
    protected skillDesc: eui.Label;
    protected powerLabel: PowerLabel;
    protected petShowPanel: PetShowPanel;
    protected name_label: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    protected info: any;
    private xianlvId: number

    public constructor() {
        super()
        this.skinName = "XianLvInfoSkin";
    }

    public childrenCreated() {
        this._AddClick(this.skillIcon, this._OnClick)
        this.commonDialog.title = "详细属性"
    }
    public OnOpen(...args: any[]) {
        this.commonDialog.OnAdded(this);
        if (args.length == 0)
            return
        this.info = args[0];
        this.UpdateContent();
    }

    public UpdateContent() {
        let selectConfig = this.info;
        this.xianlvId = selectConfig.id

        let petInfo = new PetInfo();
        petInfo.mPetId = selectConfig.id;
        petInfo.mName = selectConfig.name;

        this.name_label.textColor = ItemBase.GetColorByQuality(selectConfig.quality)
        this.name_label.text = selectConfig.name;
        //PetConst.SetName(this.lbName as PetNameComp, petInfo)
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(selectConfig.attrs);

        this.petShowPanel.SetBody(PetConst.GetSkin(selectConfig.id))

        this.skillDesc.text = XianlvConst.GetSkillDesc(selectConfig.id, 1);
        PetSkillIconItem.SetContent(this.skillIcon as any, XianlvConst.GetSkillId(selectConfig.id, 1), 0)//主动技能

        this.attr0Txt.text = AttributeData.getAttStr(selectConfig.attrs, 0, 0, ":", false, "#ffffff", "            ");
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.skillIcon:
                let xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(this.xianlvId)
                let skillId = XianlvConst.GetSkillId(this.xianlvId, 1);
                let nextSkillId = XianlvConst.GetSkillId(this.xianlvId, 2);
                ViewManager.ins().open(XianlvSkillTipPanel, skillId, nextSkillId, 1)
                break
        }
    }
}