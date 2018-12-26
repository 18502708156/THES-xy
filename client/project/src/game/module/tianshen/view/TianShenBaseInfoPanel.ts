class TianShenBaseInfoPanel extends BaseView implements ICommonWindowTitle {

    protected baseView: TianShenBaseInfoView;
    protected group: eui.Group;
    protected petShowPanel: PetShowPanel;

    protected mContext: TianShenMainPanel;

    private skillIds: number[];

    protected model: TianShenModel;

    public constructor() {
        super()
        this.model = GameGlobal.TianShenModel;
    }

    public childrenCreated() {
        this._AddClick(this.baseView.powerLabel, this._OnClickBtn)
        this._AddClick(this.baseView.btnYF, this._OnClickBtn)
        this._AddClick(this.baseView.btnSXD, this._OnClickBtn);
        this._AddClick(this.baseView.btnYuanfen, this._OnClickBtn)

        this._AddItemClick(this.baseView.skillList, this._OnItemClick);
    }

    private _OnClickBtn(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.baseView.btnSXD:
                ViewManager.ins().open(TianShenAttrDrugPanel)
                break;
            // case this.baseView.powerLabel:
            //     if (this.baseView.currentState == "inactive") {

            //     } else {
            //         let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex]
            //         ViewManager.ins().open(XianlvAttrPanel, selectConfig.id)
            //     }
            //     break;
            // case this.baseView.btnYF:
            //     ViewManager.ins().open(XianlvQyPanel)
            //     break;
            default:
                break;
        }
    }


    public UpdateContent() {
        let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex]
        let tianShenId = selectConfig.id
        if (!this.model.HasTianShen(tianShenId)) {
            this.group.visible = false;
            return
        }
        this.group.visible = true;
        let tianShenInfo = this.model.mTianShenList[tianShenId];
        this.UpdateInfo(tianShenId);

        this.baseView.btnZZ.icon = this.model.mBattleID == tianShenId ? "ui_bt_xiuxi" : "ui_bt_chuzhan";
        this.baseView.lbLev.text = tianShenInfo.mLevel + "\n阶";
    }

    public UpdateInfo(id: number) {
        let tianshenInfo = this.model.mTianShenList[id];
        this.baseView.petShowPanel.SetBody(tianshenInfo.GetSkin());
        this.baseView.powerLabel.text = tianshenInfo.GetPower(tianshenInfo.mLevel == 0 ? 1 : tianshenInfo.mLevel);
        this.baseView.tname.text = this.mContext.mTianShenList[this.mContext.mSelectIndex].name;
        this.baseView.tname.textColor = ItemBase.GetColorByQuality(this.mContext.mTianShenList[this.mContext.mSelectIndex].quality);

        this.baseView.skillList.itemRenderer = TianShenSkillIcon;
        this.skillIds = [];
        let baseConfig = GameGlobal.Config.AirMarshalBaseConfig;
        this.skillIds.length = 6;
        this.skillIds[0] = baseConfig.skill;
        this.skillIds[1] = baseConfig.hskill;
        let ids = this.model.mTianShenList[id].GetSkillIds();
        for (let i = 0; i < ids.length; i++) {
            this.skillIds[i + 2] = ids[i];
        }
        this.baseView.skillList.dataProvider = new eui.ArrayCollection(this.skillIds);
    }

    private _OnItemClick(e: eui.ItemTapEvent) {
        let index = e.itemIndex
        let skillId = this.skillIds[index]
        if (!skillId) {
            ViewManager.ins().open(HavingSkillTipPanel, 2)
            return
        }
        ViewManager.ins().open(PetSkillTipPanel, index > 2 ? 2 : index, skillId, false)
    }
}

interface TianShenBaseInfoView extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // TianShenBaseSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    group: eui.Group;
    noActivity: eui.Image;
    btnSXD: eui.Button;
    btnYuanfen: eui.Button;
    btnJJDL: eui.Button;
    btnYF: eui.Button;
    btnGp: eui.Group;
    btnZZ: eui.Button;
    lbLev: eui.Label;
    powerLabel: PowerLabel;
    petShowPanel: PetShowPanel;
    tname: eui.Label;
    skillList: eui.List;
    /////////////////////////////////////////////////////////////////////////////

}

class TianShenSkillIcon extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // HavingSkillIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconImg: eui.Image;
    protected iconBg: eui.Image;
    protected useTypeImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    dataChanged() {
        if (!this.data) return;
        let skillId = this.data;
        let quality;
        if (1 < this.itemIndex) {
            this.useTypeImg.source = "ui_tn_bm_bei"
            quality = PetConst.GetPassSkillQuality(skillId);
            this.iconImg.source = PetConst.GetPassSkillIcon(skillId);
        } else {
            // this.useTypeImg.source = 0 == this.itemIndex ? 'ui_bm_zhu' : 'ui_tn_bm_he';
            this.useTypeImg.source = 'ui_bm_zhu';
            quality = PetConst.GetSkillQuality(skillId)
            this.iconImg.source = PetConst.GetSkillIcon(skillId)
        }
        this.iconBg.source = PetConst.QUALITY_SKILL_BG[quality]
    }
}