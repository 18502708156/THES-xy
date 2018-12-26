class GBattleMainWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // GBattleGateSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected groupUnopen: eui.Group;
	protected item1: ItemBaseNotName;
	protected item2: ItemBaseNotName;
	protected item3: ItemBaseNotName;
	protected item4: ItemBaseNotName;
	protected labMasterName: eui.Label;
	protected labGangName: eui.Label;
	protected labDesc: eui.Label;
	protected labDetail: eui.Label;
	protected labJoinGang: eui.Label;
	protected groupOpen: eui.Group;
	protected durationLab: DurationLabel;
	protected labCount: eui.Label;
	protected labName1: eui.Label;
	protected labData1: eui.Label;
	protected labName2: eui.Label;
	protected labData2: eui.Label;
	protected labName3: eui.Label;
	protected labData3: eui.Label;
	protected labMyRank: eui.Label;
	protected groupGateBlood: eui.Group;
	protected progDef: eui.ProgressBar;
	protected progBlood: eui.ProgressBar;
	protected progDefNum: eui.Label;
	protected progBloodNum: eui.Label;
	protected labBrokenTip: eui.Label;
	protected btnEnter: eui.Button;
	protected btnReturn: eui.Button;
	protected durationAtkCD: DurationLabel;
	protected durationDefCD: DurationLabel;
	protected labDurationTip: eui.Label;
	protected btnShowAward: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private mTimerStartFlag: boolean = false

	public constructor() {
		super()
		this.skinName = "GBattleGateSkin"
		this.commonWindowBg.SetTitle("南天门")

		UIHelper.SetLinkStyleLabel(this.labDetail)
		UIHelper.SetLinkStyleLabel(this.labJoinGang)
		this._AddClick(this.labJoinGang, this._OnClick)
		this._AddClick(this.labDetail, this._OnClick)
		this._AddClick(this.btnEnter, this._OnClick)
		this._AddClick(this.btnReturn, this._OnClick)
		this._AddClick(this.btnShowAward, this._OnClick)

		this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, this.SetBossInfo)
		this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOpenInfo)
		this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOpenInfo)
		this.observe(MessageDef.GANGBATTLE_ENTER_NEXT_GATE, this.JumpToNext)
		this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration)
	}

	public childrenCreated() {
		
	}

	public OnOpen(...args) {
		this.commonWindowBg.OnAdded(this)
		this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BATTLE]
		this.UpdateContent()
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
            case this.labJoinGang:
				ViewManager.ins().open(GBattleJoinTipWin)
			break
			case this.labDetail:
				ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.GuildBattleBaseConfig.n_helpid)
			break
			case this.btnEnter:
				if (!GameGlobal.GangBattleModel.IsActive())
				{
					UserTips.ins().showTips("活动未开启")
					return
				}

				if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE))
				{
					GameGlobal.GangBattleModel.SendEnterNext()
				}
				else
				{
					if (!GameGlobal.GangBattleModel.CanAttack())
					{
						UserTips.ins().showTips("攻击CD未结束")
						return
					}
					GameGlobal.GangBattleModel.SendAttackBoss(null)
				}
			break
			case this.btnReturn:
				if (GameGlobal.GangBattleModel.IsActive())
				{
					GameGlobal.GangBattleModel.SendExitGBattle()
				}
				this.CloseSelf()
			break
			case this.btnShowAward:
				ActivityRewardShowWin.Open(ActivityModel.TYPE_GANG_BATTLE)
			break
		}
	}

	private JumpToNext() {
		this.CloseSelf()
	}

	private StartDuration() {
		if (this.mTimerStartFlag)
        {
            return
        }
        
		if (GameGlobal.GangBattleModel.IsActive()) 
		{
			let endTime = GameGlobal.GangBattleModel.GetActiveEndTime()
			if (endTime > 0)
			{
				this.mTimerStartFlag = true
			}
			this.durationLab.SetColor(Color.Green)
			this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS)
		}
	}

	private UpdateContent() {
		this.StartDuration()
		this.SetUnopenInfo()
		this.SetOpenInfo()
		this.SetBossInfo()
	}

	private SetUnopenInfo() {
		if (GameGlobal.GangBattleModel.IsActive())
			return

		this.labDesc.text = GameGlobal.Config.GuildBattleBaseConfig.helpdes

		let championInfo = GameGlobal.GangBattleModel.mChampionInfo
		this.labMasterName.text = (championInfo && championInfo.leaderName) ? `${championInfo.leaderName}.s${championInfo.serverId}` : "暂无"
		this.labGangName.text = (championInfo && championInfo.guildName) ? `(${championInfo.guildName})` : ""

		let rewards = GameGlobal.Config.GuildBattleBaseConfig.n_showItem
		let idx = 1
		for (let reward of rewards)
		{
			let itemName = `item${idx}`
			if (this[itemName])
			{
				this[itemName].visible = true
				this[itemName].setItemAward(reward.type, reward.id, reward.count)
			}
			
			idx++
		}
	}

	private SetOpenInfo() {
		this.groupUnopen.visible = !GameGlobal.GangBattleModel.IsActive()
		this.groupOpen.visible = GameGlobal.GangBattleModel.IsActive()
		this.labBrokenTip.visible = GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE)
		this.btnEnter.label = GameGlobal.GangBattleModel.IsActive() ? "攻 门" : "未开启"
		this.btnEnter.label = GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE) ? "进入殿前" : this.btnEnter.label

		if (!GameGlobal.GangBattleModel.IsActive())
		{
			return
		}

		if (GameGlobal.GangBattleModel.CanAttack() || GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE))
		{
			this.durationAtkCD.visible = false
		}
		else
		{
			let atkEndTime = GameGlobal.GangBattleModel.myGBattleInfo.mAttackTime
			this.durationAtkCD.SetColor(0x6e330b)
			this.durationAtkCD.SetTextFormat("{0}后可攻击")
			this.durationAtkCD.SetEndTime(atkEndTime, DurationLabel.TIMETEXT_TYPE_MMSS)
			this.durationAtkCD.SetCallbackFunc(() => {
				this.durationAtkCD.visible = false
			})
		}
			

		let gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || []
		gRanksInfo.sort(function (lhs, rhs) {
			return lhs.mDamageRank - rhs.mDamageRank
		})
		
		for (let idx=0; idx<3; idx++)
		{
			let gRankInfo = gRanksInfo[idx]
			this[`labName${idx+1}`].text = gRankInfo ? `${idx+1}.${gRankInfo.mGangName}.S${gRankInfo.mServerId}` : ""
			this[`labData${idx+1}`].text = gRankInfo ? `${gRankInfo.mDamage}` : ""
		}
		
		let gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo
		this.labCount.text = `同帮人数：${gbGangGlobalInfo.mPlayerCount}`

		let myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo
		let rankText = (myGBattleInfo.mMyGangRankInfo.mDamageRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mDamageRank : "未排名"
		this.labMyRank.text = `本帮排名：${rankText}    ${myGBattleInfo.mMyGangRankInfo.mDamage || 0}`
	}

	private SetBossInfo() {
		if (!GameGlobal.GangBattleModel.IsActive())
		{
			return
		}

		this.groupGateBlood.visible = !GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE)

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

}