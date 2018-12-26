class GameBattlePanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_BATTLE
    public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM
    /////////////////////////////////////////////////////////////////////////////
    // GameBattleSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected battleInfo: eui.Group;
    protected treasureInfo: eui.Group;
    protected progress: eui.ProgressBar;
    protected lbMax: eui.Label;
    protected lbMid: eui.Label;
    protected lbMin: eui.Label;
    protected bossInfo: eui.Group;
    protected lbDes: eui.Label;
    protected caName: eui.Label;
    protected speedBtn: eui.Button;
    protected turnLabel: eui.BitmapLabel;
    protected timeLabel: eui.BitmapLabel;
    protected selGroup: eui.Group;
    protected groupAdaptation: eui.Group;
    protected finishBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

    private mChildView: BaseView[] = []

    private showFinishTurn: number = null
    private m_IsTip = false

    private mManualPanel: GameBattleManualPanel
    private mSelectPanel: GameBattleSelectPanel

    private static SPPED_ICON = [
        "ui_bm_sp_1",
        "ui_bm_sp_2",
        "ui_bm_sp_3",
    ]

    public destoryView() {
    }

	public constructor() {
		super()
		this.skinName = "GameBattleSkin"
        this.timeLabel.visible = false

		this._AddClick(this.finishBtn, this._OnClick);
		this._AddClick(this.speedBtn, this._OnClick);
	}

    private mShowType: number = 0

	public OnOpen(...param: any[]) {
        this.mShowType = param[0]

        this.caName.text = BattleMap.mFbName
        this.lbDes.text = BattleMap.mFbDesc

        this.observe(MessageDef.BATTLE_TURN, this.UpdateContent)
        this.observe(MessageDef.BATTLE_TURN_START, this.TurnStart)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos)
        this._UpdatePos()
        this.UpdateSpdBtn()

        this.showFinishTurn = null
        this.m_IsTip = false
        this.finishBtn.visible = false

        if (BattleMap.IsNoramlLevel()) {
            this.battleInfo.visible = false
            this.treasureInfo.visible = false
            
        } else {
            let skipbattle =false
            this.battleInfo.visible = true
            if (BattleMap.IsGuanQiaBoss()) {
                let cfg = GameGlobal.RaidModel.mChapterData.fbcfg
                 this.treasureInfo.visible = false
                 this.showFinishTurn = cfg.jbutton
            }
             else {
                let cfg = GameGlobal.Config.InstanceConfig[BattleMap.mFbId]
                this.showFinishTurn = cfg[GameGlobal.Config.InstanceConfig_keys.jbutton]
                skipbattle = cfg[GameGlobal.Config.InstanceConfig_keys.skipbattle]

                //是否为藏宝图副本
                if(BattleMap.IsCangBaoTu())
                {
                    this.bossInfo.visible = false
                    this.treasureInfo.visible = true
                    //需要特殊的按钮跳过方式 by 海梵 
                    if(UserVip.ins().lv>=GameGlobal.Config.TreasureMapBaseConfig.roundviplevel)
                    {
                        //通关后的
                        if(GameGlobal.UserFb.bCbtAcross)
                        {
                            this.showFinishTurn = 1//开始就出现逃过按钮
                        }
                    }
                }
                else
                {
                    this.bossInfo.visible = true
                    this.treasureInfo.visible = false
                }
            }
            if (this.showFinishTurn) {
                if (skipbattle && GameGlobal.FuliModel.FuliData.IsMonth()) {
                    this.showFinishTurn = 1
                }
            }
        }
        if (GameGlobal.RaidMgr.mBattleRaid.mIsManual) {
            if (!this.mManualPanel) {
                this.mManualPanel = new GameBattleManualPanel(this)
            }
            this.addChild(this.mManualPanel)
            this.mManualPanel.DoOpen()
            this.mManualPanel.UpdateContent()
        } else {
            if (this.mManualPanel && this.mManualPanel.parent) {
                DisplayUtils.removeFromParent(this.mManualPanel)
            }
        }
        this.UpdateContent()
	}

	private _UpdatePos() {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
	}

    public StartManual(time: number, entitySkill: Sproto.entity_skill[]) {
        if (time) {
            this.timeLabel.visible = true
            this.timeLabel.text = time + ""
            this.AddTimer(1000, time, this._UpdateTime)
        }
        if (this.mManualPanel) {
            this.mManualPanel.StartManual(entitySkill)
        }
    }

    public SetAuto(isauto: boolean) {
        if (this.mManualPanel) {
            this.mManualPanel.SetAuto(isauto)
        }
    }

    private _UpdateTime() {
        let val = Math.max(Number(this.timeLabel.text) - 1, 0)
        this.timeLabel.text = val + "" 
    }

    private TurnStart() {
        if (!this.m_IsTip && BattleMap.IsGuanQiaBoss()) {
            LayerManager.UI_Main_2.addChild(new BossComeToAttackView)
            this.m_IsTip = true
        }

        if (this.timeLabel.visible) {
            this.timeLabel.visible = false
            TimerManager.ins().remove(this._UpdateTime, this)
        }
        if (this.mSelectPanel) {
            this.mSelectPanel.CancelSelectTarget()
        }
    }

    public AddChildBaseView(view: BaseView) {
        this.mChildView.push(view)
        this.addChildAt(view, 0) 
        view.DoOpen(null)
    }

    public OnClose() {
        for (let view of this.mChildView) {
            DisplayUtils.removeFromParent(view)
            view.DoClose()
        }
        this.mChildView = []
        if (this.mManualPanel && this.mManualPanel.parent) {
            this.mManualPanel.DoClose()
            DisplayUtils.removeFromParent(this.mManualPanel)
        }
    }


	public _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.finishBtn:
                GameGlobal.RaidMgr.mBattleRaid.FinishBattle()
			break
			case this.speedBtn:

                let speed = SystemSettingPanel.GetSpeed()
                if (speed > 1.5) {
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false)
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, false)
                } else if (speed > 1) {
                    if (GameGlobal.actorModel.vipLv >= 9) {
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, true)
                    } else {
                        UserTips.InfoTip("达到VIP9，开启3倍速度")
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD3, false)
                        FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, false)
                    }
                } else {
                    FuncOpenModel.SetData(FuncOpenModel.SAVE_SYSTEM_SETTING_ZDSD2, true)
                }
                this.UpdateSpdBtn()
			break
		}
	}

    private UpdateSpdBtn() {
        let speed = SystemSettingPanel.GetSpeed()
        if (speed > 1.5) {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[2]
        } else if (speed > 1) {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[1]
        } else {
            this.speedBtn.icon = GameBattlePanel.SPPED_ICON[0]
        }
    }

    public UpdateContent() {
        let config = GameGlobal.Config.InstanceConfig[BattleMap.mFbId]
        let maxTurn = config ? (config[GameGlobal.Config.InstanceConfig_keys.totalTime] || 5) : 5
        let turnid = GameGlobal.RaidMgr.mBattleRaid.GetTurnId()
        turnid = turnid <= maxTurn ? turnid : maxTurn
        this.turnLabel.text = `${turnid}/${maxTurn}`

        if (GameGlobal.RaidMgr.mBattleRaid.mIsVideo) {
            this.finishBtn.visible = true
        } else if (this.showFinishTurn) {
            this.finishBtn.visible = turnid >= this.showFinishTurn
        }

        //是否为藏宝图副本
        if(BattleMap.IsCangBaoTu())
        {
            this.lbMax.text = maxTurn
            this.lbMid.text = GameGlobal.Config.TreasureMapBaseConfig.onestar
            this.lbMin.text = GameGlobal.Config.TreasureMapBaseConfig.twostar

            this.progress.labelDisplay.visible = false
            this.progress.maximum = maxTurn
            this.progress.value = (maxTurn-turnid)
        }
    }

    public CancelSelectTarget() {
        if (this.mSelectPanel) {
            this.mSelectPanel.CancelSelectTarget()
        }
    }

    public SelectTarget(roleType: number, skillId: number): void {
        if (!this.mSelectPanel) {
            this.mSelectPanel = new GameBattleSelectPanel(this)
        }
        this.selGroup.addChild(this.mSelectPanel)
        this.mSelectPanel.SelectTarget(roleType, skillId)
    }

    public SelectDone(roleType: number, skillId: number, handle: number[]) {
        if (this.mManualPanel) {
            this.mManualPanel.SelectTarget(roleType, skillId, handle)
        } else {
            console.error("not mManualPanel")
        }
    }
}