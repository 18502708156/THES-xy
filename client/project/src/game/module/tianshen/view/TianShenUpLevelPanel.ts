class TianShenUpLevelPanel extends TianShenBaseInfoPanel {

    public static NAME = "天神"

    /////////////////////////////////////////////////////////////////////////////
    // TianShenLevelUpSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected consumeLabel: ConsumeTwoLabel;
    protected checkBox: eui.CheckBox;
    protected btnYuanfen: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    private tianshenId: number = 0;

    private mRoleAutoSendData: RoleAutoSendData;
    private mRoleSendCheckData: RoleSendCheckData;

    public constructor() {
        super()
        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this._SendUp()) {
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
            if (this.model) {
                this.model.SendUpLevel(this.tianshenId, type);
            }
        }, () => {
            let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex];
            let level = this.model.mTianShenList[selectConfig.id].mLevel;
            let levelConfig = GameGlobal.Config.AirMarshalLvproConfig[selectConfig.quality][level];
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
        super.childrenCreated()
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
        this._AddClick(this.baseView.btnZZ, this._OnClick)
        this._AddClick(this.btnYuanfen, this._OnClick)
    }

    public OnOpen() {
        super.OnOpen()
        this.observe(MessageDef.TIANSHEN_UPDATE_INFO, this.UpdateContent)
        this.observe(MessageDef.TIANSHEN_UPDATE_EXP, this._DoUpdateExp)

        this.observe(MessageDef.BAG_TIANSHEN_LEVEL_ITEM, this._UpdateExp)
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateRedPoint)
        this.observe(MessageDef.RP_TIANSHEN , this.UpdateRedPoint)
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateYuanfenRedPoint)
        this.UpdateRedPoint()

        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true)
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

    private UpdateRedPoint() {
        UIHelper.ShowRedPoint(this.baseView.btnZZ, GameGlobal.TianShenModel.mRedPoint.Get(TianShenModelRedPoint.INDEX_BATTLE))
        UIHelper.ShowRedPoint(this.baseView.btnSXD, GameGlobal.TianShenModel.mRedPoint.Get(TianShenModelRedPoint.INDEX_ATTR))
    }

    UpdateContent(): void {
        super.UpdateContent();
        this._UpdateExp();
        this.UpdateYuanfenRedPoint()
    }

    public UpdateYuanfenRedPoint() {
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.CanActInList(null))
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnCulture:
                this._SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
            case this.baseView.btnZZ:
                GameGlobal.TianShenModel.SendBattle(this.tianshenId, this.model.mBattleID == this.tianshenId ? 0 : 1);
                break
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin)
                break
        }
    }

    public UpdateInfo(id: number) {
        this.tianshenId = id;
        super.UpdateInfo(id)
        let model = GameGlobal.TianShenModel
        let info = GameGlobal.TianShenModel.mTianShenList[id];
        if (info.mLevel >= model.MAX_LEVEL) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        this._UpdateExp()
    }


    private _DoUpdateExp() {
        this.mRoleAutoSendData.Continue()
        this._UpdateExp()
    }

    private _UpdateExp() {
        let selectConfig = this.mContext.mTianShenList[this.mContext.mSelectIndex];
        let tianshenId = selectConfig.id;
        let quality = selectConfig.quality;
        let level = GameGlobal.TianShenModel.GetLevel(tianshenId);
        let levelConfig = GameGlobal.Config.AirMarshalLvproConfig[quality][level - 1];
        if (!levelConfig) {
            return
        }
        this.bar.maximum = levelConfig.proexp
        this.bar.value = GameGlobal.TianShenModel.mTianShenList[tianshenId].mExpUpNum * levelConfig.exp

        this.consumeLabel.Set(levelConfig.cost)
    }

    private _SendUp(): boolean {
        return this.mRoleSendCheckData.SendUp()
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.TianShenModel.mRedPoint.IsRedPoint() || GameGlobal.YuanfenModel.IsRedPoint()
    }
}
