class HavingUpLevelPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "玄女"

    /////////////////////////////////////////////////////////////////////////////
    // HavingUpLevelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected btnAttrDrug: eui.Button;
    protected btnSkin: eui.Button;
    protected lbLev: eui.Label;
    protected xingxiang: PetShowPanel;
    protected skillList: eui.List;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected btn_juexing: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected checkBox: eui.CheckBox;
    protected consumeLabel: ConsumeTwoLabel;
    protected lbFull: eui.Label;
    protected help: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    private skillIds: number[];

    private mShowLevel: number = 0

    private mModel: UserTemplate = GameGlobal.HavingModel;
    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

    public constructor() {
        super()
        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this.SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnAuto.label = "停止"
            } else {
                this.btnAuto.label = "自动进阶"
            }
        }, 200)
        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            if (this.mModel) {
                this.mModel.SendBoost(type)
            }
        }, () => {
            let model = this.mModel
            let levelConfig = this.mModel.LvproConfig[model.mLevel]
            if (!levelConfig) {
                return [null]
            }
            let cost = levelConfig.cost
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count]
        }, () => {
            return this.checkBox.selected
        }, () => {
            this.mRoleAutoSendData.Toggle()
        })
    }

    public childrenCreated() {
        this.lbFull.text = this.name + "已满阶"
        this.skillList.itemRenderer = HavingSkillIcon;

        this.btnSkin.visible = false

        this._AddItemClick(this.skillList, this._OnItemClick);
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
        this._AddClick(this.btnAttrDrug, this._OnClick)
        this._AddClick(this.powerLabel, this._OnClick)
        this._AddClick(this.btnSkin, this._OnClick)
        this._AddClick(this.btn_juexing, this._OnClick)
        this._AddClick(this.help, this._click)
    }


    public OnOpen() {
        super.OnOpen()
        this.observe(MessageDef.HAVING_UPDATE, this.UpdateContent)
        this.observe(MessageDef.HAVING_UPDATE_EXP, this._DoUpdateExp)

        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent)
        this.UpdateRedPoint()
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

    public _click() {
        ViewManager.ins().open(ActivityDescPanel, 11, "规则说明");
    }

    private UpdateRedPoint() {
        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN))
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM))
        UIHelper.ShowRedPoint(this.btn_juexing, this.mModel.mRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD))
    }

    private UpdateItemContent() {
        this._UpdateExp()
    }

    private _OnItemClick(e: eui.ItemTapEvent) {
        let index = e.itemIndex
        let skillId = this.skillIds[index]
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 1)
            return
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false)
    }

    private updateSkills() {
        this.skillIds = [];
        let baseConfig = GameGlobal.HavingModel.getBaseConfig();
        this.skillIds.length = 6;
        this.skillIds[0] = baseConfig.skill;
        this.skillIds[1] = baseConfig.hskill;
        for (let i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
            let data = GameGlobal.HavingMagicModel.skillData[i];
            if (data && data.attrData && data.attrData.length == 4) {
                this.skillIds[i + 2] = data.attrData[3].skillNo;
            }
        }
        this.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
    }

    UpdateContent(): void {
        let model = this.mModel
        let nextLevelConfig = this.mModel.LvproConfig[model.mLevel + 1]
        if (!nextLevelConfig) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        this.xingxiang.SetBody(AppearanceConfig.GetUIPath(model.GetAppaId()));
        this.powerLabel.text = model.GetPower()
        this.lbLev.text = model.mLevel + "\n阶";

        this.updateSkills();
        this._UpdateExp();
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this.SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel)
                break
            case this.powerLabel:
                ViewManager.ins().open(HavingAttrPanel, this.mModel, this.name, AppearanceConfig.GetUIPath(this.mModel.GetLevelSkin(this.mShowLevel)))
                break
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel)
                break
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType)
                break
        }
    }

    private _DoUpdateExp() {
        this.mRoleAutoSendData.Continue()
        this._UpdateExp()
    }

    private _UpdateExp() {
        let levelConfig = this.mModel.LvproConfig[this.mModel.mLevel]
        if (!levelConfig) {
            return
        }
        this.bar.maximum = levelConfig.proexp
        this.bar.value = this.mModel.mUpNum * levelConfig.exp

        this.consumeLabel.Set(levelConfig.cost)
    }

    private SendUp() {
        return this.mRoleSendCheckData.SendUp()
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.HavingModel.mRedPoint.IsRedPointWithout(HavingModelRedPoint.INDEX_SKILL_ITEM)
    }
}


class HavingSkillIcon extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // HavingSkillIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconImg: eui.Image;
    protected iconBg: eui.Image;
    protected useTypeImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
    constructor() {
        super();
        this.skinName = "HavingSkillIconSkin"
    }
    dataChanged() {
        if (!this.data) return;
        let skillId = this.data;
        let quality;
        if (1 < this.itemIndex) {
            this.useTypeImg.source = "ui_tn_bm_bei";
            quality = PetConst.GetPassSkillQuality(skillId)
            this.iconImg.source = PetConst.GetPassSkillIcon(skillId)
        } else {
            // this.useTypeImg.source = 0 == this.itemIndex ? 'ui_bm_zhu' : 'ui_tn_bm_he';
            this.useTypeImg.source = 'ui_bm_zhu';
            quality = PetConst.GetSkillQuality(skillId)
            this.iconImg.source = PetConst.GetSkillIcon(skillId)
        }
        this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
    }
}
