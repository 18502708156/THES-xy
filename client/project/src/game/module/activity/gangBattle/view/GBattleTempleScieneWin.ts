class GBattleTempleScieneWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_GAME_MAP;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM
	
    /////////////////////////////////////////////////////////////////////////////
    // GBattleTempleSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected durationLab: DurationLabel;
    protected labCount: eui.Label;
    protected labView: eui.Label;
    protected labNum1: eui.Label;
    protected labName1: eui.Label;
    protected labScore1: eui.Label;
    protected labNum2: eui.Label;
    protected labName2: eui.Label;
    protected labScore2: eui.Label;
    protected labNum3: eui.Label;
    protected labName3: eui.Label;
    protected labScore3: eui.Label;
    protected labRange: eui.Label;
    protected btnReturn: eui.Button;
    protected btnTeam: eui.Button;
    protected btnArr: eui.Button;
    protected btnFight: eui.Button;
    protected roleHead1: GBRoleHead;
    protected roleHead2: GBRoleHead;
    protected roleHead3: GBRoleHead;
    protected labViewRank: eui.Label;
    protected groupAdaptation: eui.Group;
    protected groupRank: eui.Group;
    protected boxItem: GBattleBoxItem;
    protected btnInstruction: eui.Button;
    protected durationShowGuard: DurationLabel;
    /////////////////////////////////////////////////////////////////////////////

    private mTimerStartFlag: boolean = false

	public constructor() {
		super()
        this.skinName = "GBattleTempleSceneSkin"
		UIHelper.SetLinkStyleLabel(this.labView)
        UIHelper.SetLinkStyleLabel(this.labViewRank)
	}

	public OnOpen() {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos()
        
        this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, this.SetOtherInfo)
		this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK, this.SetPlayerRankInfo)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration)
        this.observe(MessageDef.GANGBATTLE_SHOW_GUARDTIP, this.SetGuardShowTip)

        this._AddClick(this.btnTeam, this._OnClicked)
        this._AddClick(this.btnReturn, this._OnClicked)
        this._AddClick(this.labView, this._OnClicked)
        this._AddClick(this.labViewRank, this._OnClicked)
        this._AddClick(this.btnArr, this._OnClicked)
        this._AddClick(this.btnInstruction, this._OnClicked)
        this._AddClick(this.btnFight, this._OnClicked)

        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

        this.mTimerStartFlag = false
        this.SetGuardShowTip()
        this.StartDuration()
        this.AdaptationGroup(true)
        this.SetPlayerRankInfo()
        this.SetOtherInfo()
	}

	public OnClose() {
		
	}

    private SetGuardShowTip() {
        let showEndTime = GameGlobal.GangBattleModel.mGuardShowTime
        if (!showEndTime)
        {
            return
        }
        this.durationShowGuard.SetColor(Color.Green)
        this.durationShowGuard.SetTextFormat("{0}后神龙鼎出现")
        this.durationShowGuard.SetCallbackFunc(() => {
            this.durationShowGuard.visible = false
        })
        this.durationShowGuard.SetEndTime(showEndTime)
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
			return lhs.mRankData.mKillRank - rhs.mRankData.mKillRank
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
        this.boxItem.SetScoreInfo()

        let gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || []
        gRanksInfo.sort(function (lhs, rhs) {
			return lhs.mScoreRank - rhs.mScoreRank
		})
		
		for (let idx=0; idx<3; idx++)
		{
			let gRankInfo = gRanksInfo[idx]
            this[`labNum${idx+1}`].text = gRankInfo ? `${idx+1}` : ""
			this[`labName${idx+1}`].text = gRankInfo ? `${gRankInfo.mGangName}.S${gRankInfo.mServerId}` : ""
            this[`labScore${idx+1}`].text = gRankInfo ? `${gRankInfo.mScore}` : ""
		}

        let gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo
        this.labCount.text = `同帮人数：${gbGangGlobalInfo.mPlayerCount}`

        let  myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo
        // let mScoreText = (myGBattleInfo.mMyGangRankInfo.mScoreRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mScoreRank : "未排名"
        // this.labRange.text = `本帮排名：${mScoreText}     ${myGBattleInfo.mMyGangRankInfo.mScore ? myGBattleInfo.mMyGangRankInfo.mScore : 0}`
        this.labRange.text = `本帮积分：${myGBattleInfo.mMyGangRankInfo.mScore ? myGBattleInfo.mMyGangRankInfo.mScore : 0}`
    }

    private _OnClicked(e: egret.TouchEvent) {
		switch (e.currentTarget) {
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
                ViewManager.ins().openIndex(GBattleRankWin, 2)
            break
            case this.labView:
                ViewManager.ins().openIndex(GBattleRankWin, 1)
            break
            case this.btnArr:
                this.ShowRankList(this.btnArr.$getScaleX() != -1)
            break
            case this.btnInstruction:
                ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.GuildBattleBaseConfig.s_helpid)
            break
            case this.btnFight:
                let showEndTime = GameGlobal.GangBattleModel.mGuardShowTime
                if (!showEndTime)
                    return

                if (showEndTime > GameServer.serverTime)
                {
                    UserTips.ins().showTips("神龙鼎尚未出现，不可挑战")
                    return
                }
                let pos = GameGlobal.Config.GuildBattleBaseConfig.lboss_bronpos
                let bossId = GameGlobal.Config.GuildBattleBaseConfig.lbossid
                GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, pos[0], pos[1])
            break
        }

        
    }

    private AdaptationGroup(zoomFlag) {
        if (zoomFlag == null)
            return

        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 200

        this.ShowRankList(!zoomFlag)
    }

    private ShowRankList(isShow)
    {
        this.btnArr.$setScaleX(isShow ? -1 : 1)
        this.groupRank.visible = isShow
    }
}