class XianlvBaseInfoPanel extends BaseView implements ICommonWindowTitle {

	protected baseView: XianlvBaseInfoView
    protected group: eui.Group;
    protected petShowPanel: PetShowPanel;

	protected mContext: XianlvMainPanel

	public constructor() {
		super()
	}

    public childrenCreated() {
        this._AddClick(this.baseView.allAttrBtn, this._OnClickBtn)
        this._AddClick(this.baseView.powerLabel, this._OnClickBtn)
        this._AddClick(this.baseView.skillComp, this._OnClickBtn)

        this._AddClick(this.baseView.btnSC, this._OnClickBtn)
    }

    private _OnClickBtn(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.baseView.allAttrBtn:
                ViewManager.ins().open(XianlvAllAttrPanel)
                break;
            case this.baseView.skillComp:
                let xianlvId = this.mContext.mXianlvList[this.mContext.mSelectIndex].id
                let xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId)
                ViewManager.ins().open(XianlvSkillTipPanel, xianlvInfo.GetSkillId(), xianlvInfo.GetSkillId(1), xianlvInfo.mStar)
                break;
            case this.baseView.powerLabel:
                if (this.baseView.currentState == "inactive") {

                } else {
                    let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
                    ViewManager.ins().open(XianlvAttrPanel, selectConfig.id)
                }
                break;
            case this.baseView.btnSC:
                ViewManager.ins().open(XianlvQyPanel)
                break;
            default:
                break;
        }
    }

	public UpdateContent() {
        let model = GameGlobal.XianlvModel
        let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
        let xianlvId = selectConfig.id
        if (!model.HasXianlv(xianlvId)) {
            this.group.visible = false
            return
        }
        let xianlvInfo = model.GetXianlvInfo(xianlvId)
        this.group.visible = true
        this.UpdateInfo(xianlvId)
        XianlvBaseInfoPanel.SetStarGroup(this.baseView.starGroup, xianlvInfo.mStar)
        
        this.baseView.btnZZ.icon = model.HasBattle(xianlvId) ? "ui_bt_xiuxi" : "ui_bt_chuzhan"
        this.baseView.lbLev.text = xianlvInfo.mLevel + "\n阶"
	}

    public static SetStarGroup(group: eui.Group, star: number) {
        for (let i = 0; i < group.numChildren; i++) {
            let item = group.getChildAt(i) as eui.Image
            item.source = i < star ? "ui_bm_star022" : "ui_bm_star021"
        }
    }

	public UpdateInfo(id: number) {
        let model = GameGlobal.XianlvModel
        let xianlvInfo = model.GetXianlvInfo(id)
        this.baseView.petShowPanel.SetBody(xianlvInfo.GetSkin())
        this.baseView.lbPower.text = "仙侣总战力：" + model.GetAllPower()
        this.baseView.lbActive0.text = "已出战：" + model.GetBattleCount() + "/2"
        this.baseView.lbActive.text = "已激活：" + model.GetActiveCount()
        this.baseView.powerLabel.text = xianlvInfo.GetPower(xianlvInfo.mLevel == 0 ? 1 : xianlvInfo.mLevel)

        let star = Math.max(xianlvInfo.mStar, 1)
        this.baseView.starNum.text = star.toString()
        PetSkillIconItem.SetContent(this.baseView.skillComp as any, xianlvInfo.GetSkillId(), 0)
	}
}

interface XianlvBaseInfoView extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // XianlvBaseSkin.exml
    /////////////////////////////////////////////////////////////////////////////
     group: eui.Group;
     lbPower: eui.Label;
     lbActive: eui.Label;
     lbActive0: eui.Label;
     btnSC: eui.Button;
     btnGp: eui.Group;
     btnShow: eui.Button;
     btnZZ: eui.Button;
     skillComp: eui.Component;
     lbLev: eui.Label;
     allAttrBtn: eui.Button;
     powerLabel: PowerLabel;
     starGroup: eui.Group;
     starNum: eui.Label;
     petShowPanel: PetShowPanel;
    /////////////////////////////////////////////////////////////////////////////

}