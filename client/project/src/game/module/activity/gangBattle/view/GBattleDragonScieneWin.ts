class GBattleDragonScieneWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_GAME_MAP;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM

    /////////////////////////////////////////////////////////////////////////////
    // GBattleDragonSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected durationLab: DurationLabel;
    protected labCount: eui.Label;
    protected labView: eui.Label;
    protected labNum1: eui.Label;
    protected labName1: eui.Label;
    protected labData1: eui.Label;
    protected labNum2: eui.Label;
    protected labName2: eui.Label;
    protected labData2: eui.Label;
    protected labNum3: eui.Label;
    protected labName3: eui.Label;
    protected labData3: eui.Label;
    protected labRange: eui.Label;
    protected btnReturn: eui.Button;
    protected btnTeam: eui.Button;
    protected btnArr: eui.Button;
    protected roleHead1: GBRoleHead;
    protected roleHead2: GBRoleHead;
    protected roleHead3: GBRoleHead;
    protected labViewRank: eui.Label;
    protected progDef: eui.ProgressBar;
    protected progBlood: eui.ProgressBar;
    protected progDefNum: eui.Label;
    protected progBloodNum: eui.Label;
    protected btnEnter: eui.Button;
    protected btnFight: eui.Button;
    protected groupBossBlood: eui.Group;
    protected groupAdaptation: eui.Group;
    protected groupRank: eui.Group;
    protected boxItem: GBattleBoxItem;
    protected durationDefCD: DurationLabel;
    /////////////////////////////////////////////////////////////////////////////
	
    private mTimerStartFlag: boolean = false

	public constructor() {
		super()
		this.skinName = "GBattleDragonSceneSkin"
		UIHelper.SetLinkStyleLabel(this.labView)
        UIHelper.SetLinkStyleLabel(this.labViewRank)
	}

	public OnOpen() {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos()

        this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, this.SetBossInfo)
		this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK, this.SetPlayerRankInfo)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration)
        
        this._AddClick(this.btnEnter, this._OnClicked)
        this._AddClick(this.btnTeam, this._OnClicked)
        this._AddClick(this.btnReturn, this._OnClicked)
        this._AddClick(this.labViewRank, this._OnClicked)
        this._AddClick(this.labView, this._OnClicked)
        this._AddClick(this.btnArr, this._OnClicked)
        this._AddClick(this.btnFight, this._OnClicked)

        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

        this.mTimerStartFlag = false
        this.StartDuration()
        this.AdaptationGroup(true)
		this.SetPlayerRankInfo()
		this.SetOtherInfo()
        this.SetBossInfo()
	}

	public OnClose() {
		
	}

    private StartDuration() {
        if (this.mTimerStartFlag)
        {
            return
        }
		let endTime = GameGlobal.GangBattleModel.GetActiveEndTime()
        if (endTime > 0)
        {
            this.mTimerStartFlag = true
        }
		this.durationLab.SetColor(Color.Green)
		this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS)
	}

    private SetPlayerRankInfo() {
        let gbPlayerRanksInfo = GameGlobal.GangBattleModel.gbPlayerRanksInfo.mGBPlayerRankInfoList || []
        gbPlayerRanksInfo.sort(function (lhs, rhs) {
			return lhs.mRankData.mDamageRank - rhs.mRankData.mDamageRank
		})

        for (let idx=0; idx<3; idx++)
        {
            let gbPlayerRankInfo = gbPlayerRanksInfo[idx]
            if (this[`roleHead${idx+1}`] && gbPlayerRankInfo)
            {
                this[`roleHead${idx+1}`].visible = true
                this[`roleHead${idx+1}`].SetPlayerInfo(gbPlayerRankInfo, idx+1)
            }
        }
    }

    private SetOtherInfo() {
        let gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || []
        gRanksInfo.sort(function (lhs, rhs) {
			return lhs.mDamageRank - rhs.mDamageRank
		})
		
		for (let idx=0; idx<3; idx++)
		{
			let gRankInfo = gRanksInfo[idx]
            this[`labNum${idx+1}`].text = gRankInfo ? `${idx+1}` : ""
			this[`labName${idx+1}`].text = gRankInfo ? `${gRankInfo.mGangName}.S${gRankInfo.mServerId}` : ""
			this[`labData${idx+1}`].text = gRankInfo ? `${gRankInfo.mDamage}` : ""
		}

        let gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo
        this.labCount.text = `同帮人数：${gbGangGlobalInfo.mPlayerCount}`

        let myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo
        let damageRankText = (myGBattleInfo.mMyGangRankInfo.mDamageRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mDamageRank : "未排名"
        this.labRange.text = `本帮排名：${damageRankText}     ${myGBattleInfo.mMyGangRankInfo.mDamage ? myGBattleInfo.mMyGangRankInfo.mDamage : 0}`

        this.boxItem.SetScoreInfo()
    }

    private SetBossInfo() {
        this.groupBossBlood.visible = !GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)
        let bossInfo = GameGlobal.GangBattleModel.bossInfo
		this.progBlood.maximum = 100
		this.progBlood.value = bossInfo.mHp
		this.progBloodNum.text = `${bossInfo.mHp}%`
		this.progDef.maximum = 100
		this.progDef.value = bossInfo.mDefend
		this.durationDefCD.visible = bossInfo.mDefend == 0
		this.progDefNum.visible = bossInfo.mDefend > 0
		this.progDefNum.text = `${bossInfo.mDefend}%`
		this.durationDefCD.SetTextFormat("{0}后护盾恢复")
		this.durationDefCD.SetEndTime(bossInfo.mRecoveryTime, DurationLabel.TIMETEXT_TYPE_MMSS)
    }

    private _OnClicked(e: egret.TouchEvent) {
		switch (e.currentTarget) {
            case this.btnEnter:
                if (!GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON))
                {
                    UserTips.ins().showTips("击杀神龙后，伤害前三名的帮会才能进入神龙殿")
                    return
                }
                
                ViewManager.ins().open(GBattleEnterTempleTipWin)
            break
            case this.btnTeam:
                if (GameGlobal.GangBattleTeamModel.mTeamInfo.HasTeam()) {//已有队伍
					ViewManager.ins().open(GBattleTeamPanel);
				} else {
                    ViewManager.ins().open(GBattleTeamWin);
                }
            break
            case this.btnReturn:
                ViewManager.ins().open(GBattleExitTipWin)
            break
            case this.labViewRank:
                ViewManager.ins().open(GBattleRankWin)
            break
            case this.labView:
                ViewManager.ins().openIndex(GBattleRankWin, 1)
            break
            case this.btnArr:
                this.ShowRankList(this.btnArr.$getScaleX() != -1)
            break
            case this.btnFight:
                if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON))
                {
                    UserTips.ins().showTips("BOSS已经死亡")
                    return
                }
                
                let pos = GameGlobal.Config.GuildBattleBaseConfig.sboss_bronpos
                let bossId = GameGlobal.Config.GuildBattleBaseConfig.sbossid
                GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, pos[0], pos[1])
            break
        }
    }

    private AdaptationGroup(zoomFlag) {
        if (zoomFlag == null)
            return
        
        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 280

        this.ShowRankList(!zoomFlag)
    }

    private ShowRankList(isShow)
    {
        this.btnArr.$setScaleX(isShow ? -1 : 1)
        this.groupRank.visible = isShow
    }
}