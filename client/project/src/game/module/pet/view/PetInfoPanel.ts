class PetInfoPanel extends BaseEuiView implements ICommonWindowTitle {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // PetInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected group: eui.Group;
    protected attr0Txt: eui.Label;
    protected gGetWay: eui.Group;
    protected getwayLabel: GetwayLabel;
    protected skillGroup: eui.List;
    protected skillIcon: eui.Component;
    protected img: eui.Image;
    protected label0: eui.Label;
    protected skillDesc: eui.Label;
    protected powerLabel: PowerLabel;
    protected lbName: eui.Component;
    protected petShowPanel: PetShowPanel;
    protected godImg: eui.Image
    /////////////////////////////////////////////////////////////////////////////

    protected petinfo: any;
    private mPetId: number

    private bShowGetWay = false; //是否显示获得途径 false为显示获得途径 true 为不显示获得途径

    public constructor() {
        super()
        this.skinName = "PetInfoSkin";
    }

    public childrenCreated() {
        this._AddClick(this.skillIcon, this._OnClick)
        this._AddClick(this.getwayLabel, this._OnClick)
        this.skillGroup.itemRenderer = PetSkillItem
        this._AddItemClick(this.skillGroup, this._OnItemClick)
        this.commonDialog.title = "详细属性"
        this.getwayLabel.label.stroke = 0;
		this.getwayLabel.textColor = Color.l_green_1;
    }
    public OnOpen(...args: any[]) {
        this.commonDialog.OnAdded(this);
        if (args == null || args.length == 0)
            return
        this.petinfo = args[0];
        this.UpdateContent();

        let config = GameGlobal.Config.HandBookConfig;
        for (let key in config) {
            if (config[key].id == this.petinfo.pictype) {
                this.getwayLabel.text = config[key].name;
            }
        }
        if (args[1]) {
            this.gGetWay.visible = false
        }
    }
    public UpdateContent() {
        let model = GameGlobal.PetModel
        let selectConfig = this.petinfo;

        this.mPetId = selectConfig.id

        this.img.source = PetConst.XUXING_IMG[selectConfig.fiveele]

        let skills = []
        for (let key in selectConfig.buffskill) {
            skills.push(selectConfig.buffskill[key].id)
        }
        this.skillGroup.dataProvider = new eui.ArrayCollection(skills);
        let petInfo = new PetInfo();
        petInfo.mPetId = selectConfig.id;
        petInfo.mName = selectConfig.name;

        PetConst.SetName(this.lbName as PetNameComp, petInfo)
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(selectConfig.attrs);

        this.petShowPanel.SetBody(PetConst.GetSkin(this.mPetId))

        this.skillDesc.text = PetConst.GetSkillDesc(selectConfig.skill[0])
        PetSkillIconItem.SetContent(this.skillIcon as any, selectConfig.skill[0], 0)//主动技能

        this.attr0Txt.text = AttributeData.getAttStr(selectConfig.attrs, 0, 0, ":", false, "#ffffff", "            ");
        this.godImg.visible = GameGlobal.Config.petBiographyConfig[this.mPetId].picshow;
    
    }

    private _OnItemClick(e: eui.ItemTapEvent) {
        let skillId = this.skillGroup.selectedItem
        if (!skillId) {
            return
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(this.mPetId).GetSkillId())
                break
            case this.getwayLabel:
                let config = GameGlobal.Config.HandBookConfig;
                for (let key in config) {
                    if (config[key].id == this.petinfo.pictype) {
                        let info;
                        if (config[key].hasOwnProperty("gainWay"))
                            info = config[key].gainWay[0]
                        if (!info) {
                            GameGlobal.UserTips.showTips(config[key].name);
                            return
                        }
                        ViewManager.ins().Guide(info[1][0], info[1][1]);
                        ViewManager.ins().close(PetInfoPanel);
                    }
                }
                break
        }
    }
}