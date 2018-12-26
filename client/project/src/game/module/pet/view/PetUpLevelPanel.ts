class PetUpLevelPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "升级"

    windowTitleIconName = "宠物"
    /////////////////////////////////////////////////////////////////////////////
    // PetUpLevelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected lbName: eui.Component;
    protected btnRename: eui.Button;
    protected lbPower: eui.Label;
    protected lbActive: eui.Label;
    protected btnSC: eui.Button;
    protected btnYuanfen: eui.Button;
    protected btnGp: eui.Group;
    protected btnFeis: eui.Button;
    protected btnZizhi: eui.Button;
    protected btnShow: eui.Button;
    protected btnZZ: eui.Button;
    protected btnAdd: eui.Button;
    protected btnCulture: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected consumeLabel: ConsumeTwoLabel;
    protected checkBox: eui.CheckBox;
    protected lbLev: eui.Label;
    protected wuxingImg: eui.Image;
    protected powerLabel: PowerLabel;
    protected showAllAttr: eui.Button
    public petShowPanel: PetShowPanel
    protected skillComp: eui.Component
    protected imgShen: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    public mContext: PetMainPanel
    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

    // 引导对象
    public GetGuideTarget() {
        return {
            [1]: this.btnAdd,
            [2]: this.btnCulture,
        }
    }

    public constructor() {
        super()

        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this._SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnCulture.label = "停止"
            } else {
                this.btnCulture.label = "自动升级"
            }
        })

        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            let petInfo = this.GetPetInfo()
            if (petInfo) {
                GameGlobal.PetModel.SendUpLevel(petInfo.mPetId, type)
            }
        }, () => {
            let petInfo = this.GetPetInfo()
            if (petInfo) {
                let config = petInfo.GetLevelConfig()
                if (config) {
                    let cost = config.cost
                    return [cost[0].id, cost[0].count, cost[1].id, cost[1].count]
                }
            }
            return [null]
        }, () => {
            return this.checkBox.selected
        }, () => {
            this.mRoleAutoSendData.Toggle()
        })
    }

    public childrenCreated() {
        this._AddClick(this.btnFeis, this._OnClick)
        this._AddClick(this.btnZizhi, this._OnClick)
        this._AddClick(this.btnShow, this._OnClick)
        this._AddClick(this.btnZZ, this._OnClick)
        this._AddClick(this.powerLabel, this._OnClick)
        this._AddClick(this.btnAdd, this._OnClick)
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.showAllAttr, this._OnClick)
        this._AddClick(this.btnRename, this._OnClick)
        this._AddClick(this.skillComp, this._OnClick)
        this._AddClick(this.btnSC, this._OnClick)
        this._AddClick(this.btnYuanfen, this._OnClick)
    }

    private UpdateRedPoint() {
        let model = GameGlobal.PetModel
        let selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex]
        let petId = selectConfig.id
        UIHelper.ShowRedPoint(this.btnZizhi, GameGlobal.PetModel.mRedPoint.IsRedZizhi(petId))
        UIHelper.ShowRedPoint(this.btnZZ, !GameGlobal.PetModel.HasBattle(petId) && GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_BATTLE))

        // UIHelper.ShowRedPoint(this.btnAdd, GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_LEVEL))
        // UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_LEVEL))

        UIHelper.ShowRedPoint(this.btnAdd, GameGlobal.PetModel.mRedPoint.IsRedLevel(petId))
        UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.PetModel.mRedPoint.IsRedLevel(petId))
    }

    public UpdateContent() {
        let model = GameGlobal.PetModel
        let selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex]
        let petId = selectConfig.id
        this.imgShen.visible = selectConfig.type == 2
        if (!model.HasPet(petId)) {
            this.group.visible = false
            return
        }
        this.group.visible = true
        let petInfo = model.GetPetInfo(petId)
        PetConst.SetName(this.lbName as PetNameComp, petInfo)
        this.group.visible = true
        this.wuxingImg.source = PetConst.XUXING_IMG[selectConfig.fiveele]
        let level = model.GetLevel(petId)
        this.lbLev.text = level + "\n级"
        UIHelper.SetLabelText(this.lbPower, "宠物总战力：", model.GetAllPower() + "")
        UIHelper.SetLabelText(this.lbActive, "已激活：", model.GetActiveCount() + "")
        if (level >= model.MAX_LEVEL) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
            let config = GameGlobal.Config.petLvproConfig[selectConfig.rarity][level - 1]
            let costData = config.cost
        }
        this.btnZZ.icon = model.HasBattle(petId) ? "ui_bt_xiuxi" : "ui_bt_chuzhan"
        this._UpdateExp()
        this.powerLabel.text = petInfo.GetPower()

        this.petShowPanel.SetBody(petInfo.GetSkin())
        PetSkillIconItem.SetContent(this.skillComp as any, petInfo.GetSkillId(), 0)
        this.UpdateRedPoint()
        this.UpdateYuanfenRedPoint()
    }

    public OnOpen() {
        this.observe(MessageDef.RP_PET, this.UpdateRedPoint)
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent)
        this.observe(MessageDef.PET_UPATE_EXP, this._DoUpdateExp)
        this.observe(MessageDef.BAG_PET_LEVEL_ITEM, this._UpdateExp)
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint)
        this.btnSC.visible = GameGlobal.actorModel.level > GameGlobal.Config.petbaseConfig.openlv;
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

    public UpdateYuanfenRedPoint() {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null))
    }

    private _OnClick(e: egret.TouchEvent) {
        let selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex]
        let petId = selectConfig.id
        switch (e.currentTarget) {
            case this.btnFeis:
                break
            case this.btnZizhi:
                ViewManager.ins().open(PetZizhiPanel, selectConfig.id)
                break
            case this.btnShow:
                GameGlobal.PetModel.SetShowId(selectConfig.id)
                break
            case this.btnZZ:
                if (GameGlobal.PetModel.HasBattle(petId)) {
                    GameGlobal.PetModel.SendUnBattle(petId)
                } else {
                    ViewManager.ins().open(PetBattlePanel, petId)
                }
                break
            case this.btnRename:
                ViewManager.ins().open(PetChangeNamePanel, "宠物改名", MessageDef.PET_UPATE_INFO, GameGlobal.PetModel.GetPetInfo(petId).mName, (name) => {
                    GameGlobal.PetModel.SendRename(petId, name)
                }, this)
                break
            case this.powerLabel:
                ViewManager.ins().open(PetAttrPanel, petId)
                break
            case this.btnAdd:
                this._SendUp()
                break
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle()
                break
            case this.showAllAttr:
                ViewManager.ins().open(PetAllAttrPanel)
                break
            case this.skillComp:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.PetModel.GetPetInfo(petId).GetSkillId())
                break
            case this.btnSC:
                ViewManager.ins().open(PetTuJianMainPanel);
                break
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin)
                break
        }
    }

    private GetPetInfo(): PetInfo {
        let selectConfig = this.mContext.mPetList[this.mContext.mSelectIndex]
        let petId = selectConfig.id
        return GameGlobal.PetModel.GetPetInfo(petId)
    }

    private _SendUp(): boolean {
        return this.mRoleSendCheckData.SendUp()
    }

    private _DoUpdateExp() {
        this.mRoleAutoSendData.Continue()
        this._UpdateExp()
    }

    private _UpdateExp() {
        let petInfo = this.GetPetInfo()
        if (!petInfo) {
            return
        }
        let config = petInfo.GetLevelConfig()
        if (!config) {
            return
        }
        this.bar.maximum = config.proexp
        this.bar.value = petInfo.mExp * config.exp
        this.consumeLabel.Set(config.cost)
    }

    public static RedPointCheck(): boolean {
        let redPoint = GameGlobal.PetModel.mRedPoint
        return redPoint.Get(PetModelRedPoint.INDEX_ACT)
            || redPoint.Get(PetModelRedPoint.INDEX_LEVEL)
            || redPoint.Get(PetModelRedPoint.INDEX_BATTLE)
            || redPoint.Get(PetModelRedPoint.INDEX_ZIZHI)
            || GameGlobal.YuanfenModel.IsRedPoint()
    }
}