class GangBossPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    protected commonWindowBg: CommonWindowBg;
	protected lbShowTitle: eui.Label;
	protected lbPlayerName: eui.Label;
	protected lbUnionName: eui.Label;
	protected labTimeText: eui.Label;
	protected lbTime: eui.Label;
	protected counterLabel: DurationLabel;
	private listBoss: eui.List;
	private listHave: eui.List;
	protected showPanel: PetShowPanel
	protected btnOpen: eui.Button
	protected btnInfo: eui.Button
	protected btnShowAward: eui.Button
	////////
	tPanelData = [];//界面总体数据数据
	oConfig; //boss 配表数据
	nStatus = 0;//boss状态
	nCountTime = 0;//倒计时
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangBossPanelSkin"
        this.commonWindowBg.SetTitle("帮会BOSS")
		this.listBoss.itemRenderer = ItemBaseNotName;
		this.listHave.itemRenderer = ItemBaseNotName;
	}

	public childrenCreated() {
		this.oConfig = GameGlobal.Config.GuildBossBaseConfig
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this)
		this.observe(MessageDef.GANGBOSS_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.GANGBOSS_CHANGE, this.UpdateContent)//boss数据变化
		this.observe(MessageDef.GANGBOSS_RANK_NOW, this.UpdateContent)//boss数据变化
		this._AddClick(this.btnOpen, this.onClick)
		this._AddClick(this.btnInfo, this.showTip)
		this._AddClick(this.btnShowAward, this.showAward)

		this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BOSS]

		//获取排行
		GameGlobal.GangBossModel.sendGetLastRank()
		this.showPanel.SetBodyId(MonstersConfig.GetAppId(this.oConfig.bossid))
		this.AddLoopTimer(1000, this.upTime);
		this.UpdateContent()
	}

	public UpdateContent() {
		this.setData()
		this.listBoss.dataProvider = new eui.ArrayCollection(this.oConfig.showItem1);
		this.listHave.dataProvider = new eui.ArrayCollection(this.oConfig.showItem2);
		this.upInfo()
	}

	public static openCheck(...param: any[]) {
		if (!GameGlobal.GangModel.HasGang())
		{
			UserTips.ins().showTips("您还没有帮会，请先加入帮会")
			return false
		}
		return Deblocking.Check(DeblockingType.TYPE_50)
	}

	public upInfo() {
		let tRankLast;
		let strName = ""
		let strId = ""
		if (this.nStatus) {
			this.btnOpen.label = "挑战"
			this.lbShowTitle.text = "当前所属"
			if (GameGlobal.GangBossModel.mCurRank && GameGlobal.GangBossModel.mCurRank.playerranks && GameGlobal.GangBossModel.mCurRank.playerranks[0]) {
				strName = GameGlobal.GangBossModel.mCurRank.playerranks[0].name
				strId = GameGlobal.GangBossModel.mCurRank.playerranks[0].serverid + ""
			}
		}
		else {
			this.btnOpen.label = "未开始"
			this.lbShowTitle.text = "上次归属"
			if (GameGlobal.GangBossModel.tRankLast && GameGlobal.GangBossModel.tRankLast.firstinfo) {
				strName = GameGlobal.GangBossModel.tRankLast.firstinfo.name
				strId = GameGlobal.GangBossModel.tRankLast.firstinfo.serverid + ""
			}
		}

		this.lbPlayerName.text = strName || ""
		this.lbUnionName.text = "" //帮会数据暂时还没有
	}

	private setPower(str) {
		if (str.length > 4) {
			var wNum = Math.floor(Number(str) / 1000);
			str = wNum / 10 + "万";
		}

		return str
	}

	public upTime() {
		//时间更新
		if (this.nStatus) {
			let activityTime = this.nStatus == AcrossBossState.REBORNING ? GameGlobal.GangBossModel.getBossRebornTime() : GameGlobal.GangBossModel.getEndTime()
			this.labTimeText.text = this.nStatus == AcrossBossState.REBORNING ? "复活时间:" : "结束时间:"
			this.lbTime.text = DateUtils.getFormatBySecond(activityTime)
		}
		else {
			this.labTimeText.text = "挑战时间:"
			//倒计时显示
			if (this.oConfig.opentime && this.oConfig.opentime.length) {
				this.lbTime.text = this.oConfig.opentime[0] + "~" + this.oConfig.opentime[1]
			}
		}
	}

	public setData() {
		this.nStatus = GameGlobal.GangBossModel.status//boss状态
		this.nCountTime = GameGlobal.GangBossModel.changetime//状态时间
	}

	private onClick(e: egret.TouchEvent) {
		if (this.nStatus) {
			let lv = GlobalConfig.ins().GuildBossBaseConfig.guildlv || 0
			let unionLv = GameGlobal.GangModel.getGangLv()
			if (unionLv >= lv) {
				GameGlobal.GangBossModel.enterMap()
				ViewManager.ins().close(GangMainWin)
                ViewManager.ins().close(GangBossPanel)
			}
			else {
				UserTips.FormatTip(GameGlobal.Config.GuildBossBaseConfig.kfboss_tips01, lv)
			}
		}
		else {
			UserTips.ins().showTips("未开始")
		}
	}

	private showTip(e) {
		ViewManager.ins().open(ActivityDescPanel, 31);
	}

	private showAward() {
		ActivityRewardShowWin.Open(ActivityModel.TYPE_GANG_BOSS)
	}
}