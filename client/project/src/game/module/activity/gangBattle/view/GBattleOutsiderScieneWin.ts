class GBattleOutsiderScieneWin extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_GAME_MAP;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM

    /////////////////////////////////////////////////////////////////////////////
    // GBattleOutsiderSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected durationLab: DurationLabel;
    protected labCount: eui.Label;
    protected labNum1: eui.Label;
    protected labName1: eui.Label;
    protected labCount1: eui.Label;
    protected labData1: eui.Label;
    protected labNum2: eui.Label;
    protected labName2: eui.Label;
    protected labCount2: eui.Label;
    protected labData2: eui.Label;
    protected labNum3: eui.Label;
    protected labName3: eui.Label;
    protected labCount3: eui.Label;
    protected labData3: eui.Label;
    protected labMemberCount: eui.Label;
    protected labScore: eui.Label;
    protected labTip: eui.Label;
    protected labScoreTip: eui.Label;
    protected img1: eui.Image;
    protected img2: eui.Image;
    protected img3: eui.Image;
    protected img4: eui.Image;
    protected labBossName1: eui.Label;
    protected labDifficulty1: eui.Label;
    protected labReward1: eui.Label;
    protected labBossName2: eui.Label;
    protected labDifficulty2: eui.Label;
    protected labReward2: eui.Label;
    protected labBossName3: eui.Label;
    protected labDifficulty3: eui.Label;
    protected labReward3: eui.Label;
    protected labBossName4: eui.Label;
    protected labDifficulty4: eui.Label;
    protected durationReborn1: DurationLabel;
    protected durationReborn2: DurationLabel;
    protected durationReborn3: DurationLabel;
    protected durationReborn4: DurationLabel;
    protected labReward4: eui.Label;
    protected returnBtn: eui.Button;
    protected btnEnter: eui.Button;
    protected btnTeam: eui.Button;
    protected groupAdaptation: eui.Group;
    protected boxItem: GBattleBoxItem;
    /////////////////////////////////////////////////////////////////////////////
	
    private mTimerStartFlag: boolean = false

	public constructor() {
		super()
		this.skinName = "GBattleOutsiderSceneSkin"
	}

	public OnOpen() {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos()

        this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo)
        this.observe(MessageDef.GANGBATTLE_UPDATE_KINGINFO, this.UpdateKingInfo)
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration)

        this._AddClick(this.img1, this._OnClicked)
        this._AddClick(this.img2, this._OnClicked)
        this._AddClick(this.img3, this._OnClicked)
        this._AddClick(this.img4, this._OnClicked)

        this._AddClick(this.btnTeam, this._OnClick)
        this._AddClick(this.btnEnter, this._OnClick)
        this._AddClick(this.returnBtn, this._OnClick)

        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

        this.durationReborn1.SetTextFormat("{0}s后复活")
        this.durationReborn2.SetTextFormat("{0}s后复活")
        this.durationReborn3.SetTextFormat("{0}s后复活")
        this.durationReborn4.SetTextFormat("{0}s后复活")
        this.durationReborn1.SetColor(0x019704)
        this.durationReborn2.SetColor(0x019704)
        this.durationReborn3.SetColor(0x019704)
        this.durationReborn4.SetColor(0x019704)

        this.mTimerStartFlag = false
        this.StartDuration()
        this.AdaptationGroup()
		this.SetBossList()
        this.SetOtherInfo()
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

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.btnTeam:
                if (GameGlobal.GangBattleTeamModel.mTeamInfo.HasTeam()) {//已有队伍
					ViewManager.ins().open(GBattleTeamPanel);
				} else {
                    ViewManager.ins().open(GBattleTeamWin);
                }
            break
            case this.btnEnter:
                let score = GameGlobal.Config.GuildBattleBaseConfig.t_points
                if (!GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_OUTSIDER))
                {
                    UserTips.ins().showTips(`击杀天王或玩家，集够${score}积分可进入凌宵殿`)
                    return
                }
                GameGlobal.GangBattleModel.SendEnterNext()
            break
            case this.returnBtn:
                WarnWin.show("是否退出当前副本？", function () {
                    GameGlobal.CommonRaidModel.MapLeave()
                    GameGlobal.GangBattleModel.SendExitGBattle()
                }, this)
            break
        }
    }

    private _OnClicked(e: egret.TouchEvent) {
        let bossId = parseInt(e.currentTarget.name)
        if (!GameGlobal.GangBattleModel.IsKingAlive(bossId))
        {
            UserTips.ins().showTips("BOSS未复活")
            return
        }
	
        let bossConf = GangBattleConst.GetKingConfig(bossId)
        GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, (bossConf.pos[0]), (bossConf.pos[1]))
    }

    private SetOtherInfo() {
        let memCount = GameGlobal.Config.GuildBattleBaseConfig.t_count
        this.labTip.text = `本帮进入${memCount}人后，全帮成员可直接进入`
        let myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo
        let gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo
        this.labCount.text = `同帮人数：${gbGangGlobalInfo.mPlayerCount}`
        this.labScore.text = `积分：${myGBattleInfo.mMyGangRankInfo.mScore || 0}`
        
        let gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo
        let curScore = gbPlayerGlobalInfo.mScore
        let score = GameGlobal.Config.GuildBattleBaseConfig.t_points
        let color = curScore >= score ? Color.Green : Color.Red
        this.labScoreTip.textFlow = TextFlowMaker.generateTextFlow(`积分：|C:${color}&T:${curScore}|/${score}`)
        this.labMemberCount.text = `我的帮会进入数：${myGBattleInfo.mPassCount}`

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
            this[`labCount${idx+1}`].text = gRankInfo ? `${gRankInfo.mPassCount}` : ""
            this[`labData${idx+1}`].text = gRankInfo ? `${gRankInfo.mScore}` : ""
        }
    }

    private SetBossList() {
        let bossList = GangBattleConst.GetKingList()
        let idx =1
        for (let bossConf of bossList)
        {
            if (this[`labBossName${idx}`])
            {
                this[`img${idx}`].name = bossConf.id
                this[`labBossName${idx}`].text = bossConf.uititle
                UIHelper.SetLinkStyleLabel(this[`labBossName${idx}`])
                this[`labDifficulty${idx}`].text = `(${bossConf.des})`
                this[`labReward${idx}`].text = `积分 * ${bossConf.points}`
            }
            idx ++
        }

        this.UpdateKingInfo()
    }

    private UpdateKingInfo() {
        let bossList = GangBattleConst.GetKingList()
        let idx =1
        for (let bossConf of bossList)
        {
            let rebornTime = GameGlobal.GangBattleModel.GetKingRebornTime(bossConf.id)
            this[`durationReborn${idx}`].visible = rebornTime > GameServer.serverTime
            if (rebornTime > GameServer.serverTime)
            {
                this[`durationReborn${idx}`].SetEndTime(rebornTime, DurationLabel.TIMETEXT_TYPE_ONLYSS)
            }

            idx++
        }
        
    }

    private AdaptationGroup() {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		this.groupAdaptation.y -= 300
    }
}