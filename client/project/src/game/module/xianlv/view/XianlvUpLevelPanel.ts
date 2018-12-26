class XianlvUpLevelPanel extends XianlvBaseInfoPanel {

    public static NAME = "仙侣"

    mWindowHelpId?: number = 5

    /////////////////////////////////////////////////////////////////////////////
    // XianlvUpLevelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnAdd: eui.Button;
    protected btnCulture: eui.Button;
    protected btnYuanfen: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected consumeLabel: ConsumeTwoLabel;
    protected checkBox: eui.CheckBox;
    /////////////////////////////////////////////////////////////////////////////

    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

    constructor() {
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
            let xianlvInfo = this.GetXianlvInfo()
            if (xianlvInfo) {
                GameGlobal.XianlvModel.SendUpLevel(xianlvInfo.mXianlvId, type)
            }
        }, () => {
            let xianlvInfo = this.GetXianlvInfo()
            if (xianlvInfo) {
                let config = xianlvInfo.GetLevelConfig()
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
        super.childrenCreated()
        this._AddClick(this.btnAdd, this._OnClick)
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.baseView.btnZZ, this._OnClick)
        this._AddClick(this.baseView.btnShow, this._OnClick)
        this._AddClick(this.btnYuanfen, this._OnClick)
        //this._AddClick(this.baseView.btnSC, this._OnClick)
    }

    public OnOpen() {
        super.OnOpen()
        this.observe(MessageDef.RP_XIANLV, this.UpdateRedPoint)
        this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent)
        this.observe(MessageDef.XIANLV_UPATE_EXP, this._DoUpdateExp)
        this.observe(MessageDef.BAG_XIANLV_RANK_ITEM, this._UpdateExp)
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint)
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

    public UpdateYuanfenRedPoint() {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null))
    }

    private _OnClick(e: egret.TouchEvent) {
        let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
        let xianlvId = selectConfig.id
        switch (e.currentTarget) {
            case this.btnAdd:
                this._SendUp()
            break
            case this.btnCulture:
                this.mRoleAutoSendData.Toggle()
            break
            case this.baseView.btnZZ:
                if (GameGlobal.XianlvModel.HasBattle(xianlvId)) {
                    GameGlobal.XianlvModel.SendUnBattle(xianlvId)
                } else {
                    ViewManager.ins().open(XianlvBattlePanel, xianlvId)
                }
            break
            case this.baseView.btnShow:
                GameGlobal.XianlvModel.SetShowId(xianlvId)
            break
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin)
            break
        }
    }

    public UpdateInfo(id: number) {
        super.UpdateInfo(id)
        let model = GameGlobal.XianlvModel
        let info = GameGlobal.XianlvModel.GetXianlvInfo(id)
        if (info.mLevel >= model.MAX_LEVEL) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        this._UpdateExp()
        this.UpdateRedPoint()
        this.UpdateYuanfenRedPoint()
    }

    private GetXianlvInfo(): XianlvInfo {
        let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
        let petId = selectConfig.id
        return GameGlobal.XianlvModel.GetXianlvInfo(petId)
    }

    private _DoUpdateExp() {
        this.mRoleAutoSendData.Continue()
        this._UpdateExp()
    }

    private _UpdateExp() {
        let xianlvInfo = this.GetXianlvInfo()
        if (!xianlvInfo) {
            return
        }
        let config = xianlvInfo.GetLevelConfig()
        if (!config) {
            return
        }
        this.bar.maximum = config.proexp
        this.bar.value = xianlvInfo.mExp * config.exp
        this.consumeLabel.Set(config.cost)
    }

    private _SendUp(): boolean {
        return this.mRoleSendCheckData.SendUp()
    }

    private UpdateRedPoint() {
        let selectConfig = this.mContext.mXianlvList[this.mContext.mSelectIndex]
        let xianlvId = selectConfig.id

        let redMode = GameGlobal.XianlvModel.mRedPoint
        UIHelper.ShowRedPoint(this.baseView.btnZZ, !GameGlobal.XianlvModel.HasBattle(xianlvId) && redMode.Get(XianlvModelRedPoint.INDEX_BATTLE))


        UIHelper.ShowRedPoint(this.btnAdd, redMode.IsRedRank(xianlvId))
        UIHelper.ShowRedPoint(this.btnCulture, redMode.IsRedRank(xianlvId))
        
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_ACT) || GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_RANK) || GameGlobal.XianlvModel.mRedPoint.Get(XianlvModelRedPoint.INDEX_BATTLE) || GameGlobal.YuanfenModel.IsRedPoint()
    }
}