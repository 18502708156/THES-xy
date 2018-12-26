class PlayFunView extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_USER_INFO;

	private ruleList: { [key: number]: RuleIconBase } = {}

	/////////////////////////////////////////////////////////////////////////////
	// MainPlayFunViewSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected tGroup: eui.Group;
	protected chapterInfo: MainChapterInfoView;
	protected fateInfo: FateItemView;
	protected preShowPng: CImage;
	protected bGroup: eui.Group;
	protected verticalGroup: eui.Group;
	protected bagBtn: eui.Button;
	protected dailyBtn: eui.Button;
	protected monthBtn: eui.Button;
	protected rmbGiftBtn: eui.Button;
	protected firstRechargeBtn: eui.Button;
	protected openDayGif: eui.Button;
	protected discountBtn: eui.Button;
	protected xuannvBtn: eui.Button;
	protected sevenDayBtn: eui.Button;
	protected JinJieRankBtn: eui.Button;
	protected upLvBtn: eui.Button;
	protected groupAdaptation: eui.Group;
	protected g1: eui.Group;
	protected xiTie: eui.Group;
	protected xiTieBnt: eui.Button;
	protected xiTieText: eui.Label;
	protected qiuHun: eui.Group;
	protected qiuHunBnt: eui.Button;
	protected qiuHunText: eui.Label;
	protected xianHuan: eui.Group;
	protected xianHuanBnt: eui.Button;
	protected xianHuanText: eui.Label;
	protected g2: eui.Group;
	protected guanqiaBtn: eui.Component;
	protected taskTraceBtn: eui.Group;
	protected imgGoto: eui.Image;
	protected btnHouseBuild: eui.Button;
	protected tipIconGroup: eui.Group;
	protected tipIconList: eui.DataGroup;
	protected gameNoticeGroup: eui.Group;
	protected gAnswer: eui.Group;
	protected imgAsBg: eui.Image;
	protected imgAsIcon: eui.Image;
	protected lbAnswerInfo: eui.Label;
	protected btnAnswerClose: eui.Button;
	protected labelDisplay: eui.Label;
	protected XinWu: eui.Group;
	protected XinWulist: eui.List;
	protected xuannvCard: eui.Component;
	protected positionBtn: eui.Button
	protected horizontalGroup: eui.Group;	
	/////////////////////////////////////////////////////////////////////////////

	private static pngFirstShow = {};
	private static firstShowXuanNv: boolean = true;
	private followBtn;
	private activityAdvance;

	public constructor() {
		super();
		this.skinName = "MainPlayFunViewSkin";

		DisplayUtils.removeFromParent(this.xuannvCard)
		DisplayUtils.removeFromParent(this.gAnswer)

		DisplayUtils.removeFromParent(this.xiTie)
		DisplayUtils.removeFromParent(this.qiuHun)
		DisplayUtils.removeFromParent(this.xianHuan)
		DisplayUtils.removeFromParent(this.btnHouseBuild)
		let config = GameGlobal.Config.ShowUiConfig;
		for (let key in config) {
			PlayFunView.pngFirstShow[config[key].followicon] = true;
		}
	}

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.taskTraceBtn,
			[2]: this.chapterInfo,
			[3]: this.fateInfo,
			[4]: (this.guanqiaBtn as GuanQiaRuleIconTar).cbAuto,
		}
	}

	public ShowQiuHunView() {
		if (GameGlobal.YingYuanModel.askMarry.length == 0) {
			DisplayUtils.removeFromParent(this.qiuHun)
			return
		}
		this.g1.addChild(this.qiuHun)
		if (GameGlobal.YingYuanModel.askMarry.length > 9) {
			this.qiuHunText.text = "···"
		} else {
			this.qiuHunText.text = GameGlobal.YingYuanModel.askMarry.length + ""
		}

	}

	public ShowInvitationView() {
		if (GameGlobal.YingYuanModel.marryInvita.length == 0) {
			DisplayUtils.removeFromParent(this.xiTie)
			return
		}
		this.g1.addChild(this.xiTie)
		if (GameGlobal.YingYuanModel.marryInvita.length > 9) {
			this.xiTieText.text = "···"
		} else {
			this.xiTieText.text = GameGlobal.YingYuanModel.marryInvita.length + ""
		}

	}

	public ShowFlower() {
		if (GameGlobal.YingYuanModel.marrySFlower.length == 0) {
			DisplayUtils.removeFromParent(this.xianHuan)
			return
		}
		this.g1.addChild(this.xianHuan)
		if (GameGlobal.YingYuanModel.marrySFlower.length > 9) {
			this.xianHuanText.text = "···"
		} else {
			this.xianHuanText.text = GameGlobal.YingYuanModel.marrySFlower.length + ""
		}

	}

	public ShowHouseBuild() {
		let shareBuildUpInfo = GameGlobal.YingYuanModel.shareUpInfo
		if (shareBuildUpInfo != null) {
			this.g2.addChild(this.btnHouseBuild)
		} else {
			DisplayUtils.removeFromParent(this.btnHouseBuild)
		}
	}

	destoryView() { };

	public _AddIconRule(obj: egret.DisplayObject, iconRule: any): RuleIconBase {
		this.ruleList[obj.hashCode] = new iconRule(obj)
		this._AddClick(obj, this.onTap)
		return this.ruleList[obj.hashCode]
	}

	public _AddIconRule2(obj: egret.DisplayObject, iconRule: any): RuleIconBase {
		this.ruleList[obj.hashCode] = new iconRule(obj)
		return this.ruleList[obj.hashCode]
	}

	initUI() {
		super.initUI()

		this.tipIconList.itemRenderer = PlayFunTipBtn

		this._AddIconRule(this.guanqiaBtn, GuanQiaRuleIcon)
		this._AddIconRule(this.firstRechargeBtn, FirstRechargeIconRule)

		this._AddIconRule(this.xuannvBtn, XuannvBefallIconRule2)
		this._AddIconRule(this.bagBtn, BagIconRule)
		// this._AddIconRule(this.rankingBtn, RankingRule)
		this._AddIconRule(this.dailyBtn, DailyIconRule)
		this._AddIconRule(this.monthBtn, MonthIconRule)
		this._AddIconRule(this.rmbGiftBtn, RmbGiftIconRule)
		this._AddIconRule(this.taskTraceBtn, TaskTraceIconRule)
		this._AddIconRule(this.discountBtn, DiscountRule)
		this._AddIconRule(this.openDayGif, OpenDayGifRule)

		// this._AddIconRule(this.sevenDayBtn, SevenDayIconRule)
		this._AddIconRule(this.JinJieRankBtn, JinJieRankIconRule)
		this._AddIconRule(this.upLvBtn, UpLvIconRule);
		this._AddIconRule(this.positionBtn, PositionRule);

		this._AddClick(this.imgGoto, this._Onclick)
		this._AddClick(this.btnHouseBuild, this._Onclick)
		this._AddClick(this.fateInfo, this._Onclick);
		this._AddClick(this.xuannvCard, this._Onclick)

		//this._AddClick(this.crossBat, this._Onclick)

		for (var key in this.ruleList) {
			let ruleIcon = this.ruleList[key]
			ruleIcon.DoHide()
		}

		//答题相关
		this._AddClick(this.btnAnswerClose, this._Onclick)
		this._AddClick(this.imgAsBg, this._Onclick)

		//結婚
		this._AddClick(this.xiTieBnt, this._Onclick)
		this._AddClick(this.qiuHunBnt, this._Onclick)
		this._AddClick(this.xianHuanBnt, this._Onclick)
	}

	OnOpen() {
		this.observe(MessageDef.FUBEN_CHANGE, this.upDataGuanqia);
		this.observe(MessageDef.LEVEL_CHANGE, this.levelChange);
		this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateGuanqiaBtnState)
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
		this.observe(MessageDef.BZ_PET_INFO, this.ShowCatchPet)
		this.observe(MessageDef.ANSWER_CHANGE, this.upDateAnswer)
		this.observe(MessageDef.UPDATE_TEAM_MAIN_INFO, this._UpdateTipGroup)
		this.observe(MessageDef.MAIL_DATA_CHANGE, this._UpdateTipGroup)
		this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this._UpdateTipGroup)
		//this.observe(MessageDef.QUJING_ROBBEDFLAG_CHANGE, this._UpdateTipGroup)
		this.observe(MessageDef.QIU_MARRY_INFO, this.ShowQiuHunView)       // 求婚消息
		this.observe(MessageDef.INVITATION_INFO, this.ShowInvitationView)  //请帖消息
		this.observe(MessageDef.FLOWER_INFO, this.ShowFlower)
		this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.ShowHouseBuild) //房屋
		this.observe(MessageDef.UPDATE_MAIN_TASK, this.updateMainTask)
		// this.verticalGroup.addEventListener(egret.Event.ADDED, this.updateGroup, this)

		if (!MiniChatPanel.PLAY_FUNC_CLICK) {
			GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)
		}

		this.chapterInfo.DoOpen([MainChapterInfoView.FIGHT_TYPE])
		this.fateInfo.DoOpen();
		this.addRuleEvent();

		this.upDataGuanqia();
		this.updateRules();

		this.UpdateGuanqiaBtnState()
		this._UpdateTipGroup()
		this.AdaptationGroup()

		if (this.m_GameNotice && this.m_GameNotice.parent) {
			this.m_GameNotice.DoOpen()
		}

		this.CatchPet()
		this.ShowQiuHunView()
		this.ShowInvitationView()
		this.ShowFlower()
		this.ShowHouseBuild()
		this.updateMainTask();
		this.updateXuannvCard();

		if (XuannvBefallIconRule.AutoCheckShow()) {
			this.AddTimer(800, 1, this.AutoShowXuannv)
		}
		this.activityAdvance = new ActivityAdvance(this.horizontalGroup);
	}

	private AutoShowXuannv() {
		XuannvBefallIconRule.AutoShow()
	}

	// updateGroup() {
	// if (this.verticalGroup.numChildren > 7) {//左边按钮的最大容纳数
	// 	this.horizontalGroup.addChild(this.verticalGroup.getChildAt(0));
	// }
	// }
	updateXuannvCard() {
		if (Deblocking.Check(DeblockingType.TYPE_118, true)) {
			if ((!Deblocking.Check(DeblockingType.TYPE_19, true) || (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))) && !PlayFunView.firstShowXuanNv)
				if (GameGlobal.RechargeModel.xuanNvCard) {
					this.addChild(this.xuannvCard)
				} else {
					DisplayUtils.removeFromParent(this.xuannvCard)
				}
			if (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))
				ViewManager.ins().open(HavingTipsPanel);
		}
		if (PlayFunView.firstShowXuanNv)
			GameGlobal.RechargeModel.xuanNvCard = false
		PlayFunView.firstShowXuanNv = false;
	}
	private updateMainTask(): void {
		let task = GameGlobal.UserTask.mainTaskData[0];
		if (!task) {
			return
		}
		let source = "";
		let config = GameGlobal.Config.ShowUiConfig;
		this.followBtn = null;

		for (let key in config) {
			if (task.id >= config[key].showui && task.id <= config[key].closeui) {
				if (GameGlobal.RechargeModel.rechargeNum <= 0) {
					if (PlayFunView.pngFirstShow[config[key].followicon]) {
						source = config[key].pic
					}
					else if (!RaidModel.IS_FIGHT_WIN) {
						source = config[key].pic
					}
					this.preShowPng.source = source
					if (source != "") {
						for (let ruleList in this.ruleList) {
							if (egret.is(this.ruleList[ruleList].tar, "eui.Button")) {
								let btn: eui.Button = this.ruleList[ruleList].tar as eui.Button;
								if (btn.icon == config[key].followicon) {
									this.preShowPng.x = config[key].pos[0]
									this.preShowPng.y = config[key].pos[1]
									btn.addChild(this.preShowPng);
									this.followBtn = btn;
									break;
								}
							}
						}
					}
				}
			}
		}
	}

	OnClose() {
		this.chapterInfo.DoClose()
		this.fateInfo.DoClose();
		this.removeRuleEvent()
		this.removeObserve()
		this.removeEvents()
		TimerManager.ins().removeAll(this)

		if (this.m_GameNotice && this.m_GameNotice.parent) {
			this.m_GameNotice.DoClose()
		}
		if (this.activityAdvance)
			delete this.activityAdvance;
	}


	private m_ShowCatchPet: boolean = false

	public CatchPetClick() {
		WarnWin.show("偶遇宠物宝宝，是否前去捕捉", () => {
			this.m_ShowCatchPet = false;
			this._UpdateTipGroup()
			if (GameGlobal.CatchPetModel.HasCatch()) {
				GameGlobal.RaidMgr.EnterCatchPet();
			} else {
				UserTips.InfoTip("宠物已经逃跑")
			}
		}, this);
	}

	CatchPet() {
		if (GameGlobal.CatchPetModel.HasCatch()) {
			this.ShowCatchPet()
		}
	}

	ShowCatchPet() {
		this.AddLoopTimer(1000, this.ShowCatchPetTime)
	}

	ShowCatchPetTime() {
		let catchtime = GameGlobal.CatchPetModel.catchtime
		if (catchtime <= GameServer.serverTime) {
			this.m_ShowCatchPet = true
			this._UpdateTipGroup()
			this.RemoveTimer(this.ShowCatchPetTime)
			return
		}
		this.m_ShowCatchPet = false
		this._UpdateTipGroup()
	}

	addRuleEvent() {
		var rule: RuleIconBase;
		for (var i in this.ruleList) {
			rule = this.ruleList[i];
			if (rule.updateMessage) {
				rule.addEvent();
			}
		}
	}

	removeRuleEvent() {
		for (let key in this.ruleList) {
			let rule = this.ruleList[key]
			if (rule && rule.updateMessage) {
				rule.removeEvent();
			}
		}
	}

	updateRules() {
		TimerManager.ins().doNext(this.startUpdateRule, this);
	}

	startUpdateRule() {
		for (var i in this.ruleList) {
			this.ruleList[i].update()
		}
	}

	levelChange() {
		this._UpdateTipGroup()
	}

	onTap(e: egret.TouchEvent) {
		if (this.ruleList[e.currentTarget.hashCode]) {
			this.taskShowPngControl(e.currentTarget);
			this.ruleList[e.currentTarget.hashCode].tapExecute(e.target);
			return;
		}
	}

	upDataGuanqia() {

	}

	//更新答题的内容
	upDateAnswer() {

		var pAnswerData = GameGlobal.AnswerController.getAnswerData()
		if (!pAnswerData) {
			DisplayUtils.removeFromParent(this.gAnswer)
			return;
		}

		let openId = GameGlobal.Config.AnswerBaseConfig.open
		if (!Deblocking.Check(openId, true)) {
			DisplayUtils.removeFromParent(this.gAnswer)
			return;
		}

		if (GameGlobal.AnswerController.bOpenLayer) return


		if (pAnswerData.type) //1答题中 2等待中
		{
			this.addChild(this.gAnswer)
			this.gAnswer.visible = true
			this.lbAnswerInfo.textFlow = TextFlowMaker.generateTextFlow(`|C:369427&T:正在进行第|C:0x369427&T:${pAnswerData.answerNum}|C:0x369427&T:题|`);
		}
		else {
			DisplayUtils.removeFromParent(this.gAnswer)
		}

	}

	private _Onclick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.imgGoto:
				// GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)
				ViewManager.ins().open(WorldMapPanel)
				break
			case this.btnAnswerClose:
				DisplayUtils.removeFromParent(this.gAnswer)
				break
			case this.imgAsBg: //答题内容 回调
				DisplayUtils.removeFromParent(this.gAnswer)

				if (GameGlobal.AnswerController.bOpenAnswer()) {
					ViewManager.ins().open(AnswerLayer);
				}
				else {
					GameGlobal.UserTips.showTips('活动未开启')
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)
				break
			case this.btnHouseBuild:
				ViewManager.ins().open(HouseUpgradeTipWin)
				break
			case this.fateInfo:
				ViewManager.ins().open(FateMainPanel, this.fateInfo.getTabID());
				break
			case this.xiTieBnt:
				ViewManager.ins().open(YingYuanHeLiPanel)
				break
			case this.qiuHunBnt:
				ViewManager.ins().open(ShouDaoPanel)
				break
			case this.xianHuanBnt:
				ViewManager.ins().open(ShouDaoXianHuaPanel)
				break
			/*case this.crossBat:
				ViewManager.ins().open(CrossBattleWin)
				break*/
			case this.xuannvCard:
				DisplayUtils.removeFromParent(this.xuannvCard)
				ViewManager.ins().open(HavingTipsPanel);
				break;
		}
	}
	private taskShowPngControl(clickBtn) {
		if (this.followBtn == clickBtn) {
			PlayFunView.pngFirstShow[this.followBtn.icon] = false
			this.preShowPng.source = ""
			RaidModel.IS_FIGHT_WIN = true;
		}
	}
	private _UpdateTipGroup(): void {
		let list = []
		if (this.m_ShowCatchPet) {
			list.push({
				id: PlayFunTipBtnType.CATCH_PET,
			})
		}
		if (TeamBaseModelMsg.HasTeam()) {
			list.push({
				id: PlayFunTipBtnType.TEAM,
			})
		}
		if (MailIconRule.CheckShowRedPoint()) {
			list.push({
				id: PlayFunTipBtnType.MAIL,
			})
		}
		if (GameGlobal.QujingModel.HasAward()) {
			list.push({
				id: PlayFunTipBtnType.QUJING_AWARD,
			})
		}
		if (GameGlobal.QujingModel.HasRobbed()) {
			list.push({
				id: PlayFunTipBtnType.QUJING_ROBBED,
			})
		}
		this.tipIconList.dataProvider = new eui.ArrayCollection(list)
	}

	private _UpdateTipGroupTimer() {

	}

	public UpdateGuanqiaBtnState() {
		let nextMapFlag = GameGlobal.UserFb.nextMap
		this.imgGoto.visible = nextMapFlag
		this.guanqiaBtn.visible = !nextMapFlag
	}

	public AdaptationGroup(zoomFlag?) {
		MiniChatPanel.UpdateViewPos(this.groupAdaptation)
		let height = GameGlobal.StageUtils.GetHeight()
		this.bGroup.bottom = height - this.groupAdaptation.y + 94
		// if (zoomFlag == null)
		// 	zoomFlag = MiniChatPanel.IS_ZOOM

		// let itemHeight = 87
		// let contentHeight = height - this.bGroup.top - this.bGroup.bottom

		// let gap = 0
		// let paddingBottom = 0
		// let layout = this.verticalGroup.layout as eui.TileLayout
		// if (layout) {
		// 	gap = layout.verticalGap
		// 	paddingBottom = layout.paddingBottom
		// }
		// let pos = -gap + paddingBottom
		// for (let child of this.verticalGroup.$children) {
		// 	pos += gap + itemHeight
		// 	child.visible = pos < contentHeight
		// }

		// let itemHeight2 = 80
		// let rightGroupHeight = contentHeight - this.rightGroup.top - this.rightGroup.bottom
		// let pos2 = 0
		// for (let child of this.rightGroup.$children) {
		// 	pos2 += itemHeight2
		// 	child.visible = pos2 < rightGroupHeight
		// }
	}

	/** 活动开启预告 */

	private m_GameNotice: MainGameNoticeView

	public static GameNotice(type: number, time: number, showType: number) {
		if (GameGlobal.actorModel.level < 30) {
			return
		}
		let view = ViewManager.ins().getView(PlayFunView) as PlayFunView
		if (!view) {
			return
		}
		if (!time || time < 0) {
			return
		}
		if (!view.m_GameNotice) {
			view.m_GameNotice = new MainGameNoticeView
		}
		if (!view.m_GameNotice.parent) {
			view.gameNoticeGroup.addChild(view.m_GameNotice)
			view.m_GameNotice.DoOpen()
		}
		view.m_GameNotice.SetData(type, time, showType)
		if (view.$stage) {
			view.m_GameNotice.StartTime()
		}
	}

	public static RemoveGameNotice(type: number) {
		let view = ViewManager.ins().getView(PlayFunView) as PlayFunView
		if (!view) {
			return
		}
		if (view.m_GameNotice && view.m_GameNotice.parent) {
			if (view.m_GameNotice.mType == type) {
				view.m_GameNotice.Close()
			}
		}
	}
}