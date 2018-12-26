class GameCityPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// GameCityPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected gGroup: eui.Group;
	protected btnActive: eui.Button;
	protected btnBoss: eui.Button;
	protected btnFuBen: eui.Button;
	protected gangBtn: eui.Button;
	protected btnArena: eui.Button;
	protected btnKuaFu: eui.Button;
	protected topGp: eui.Group;
	protected fuliBtn: eui.Button;
	protected kaifuBtn: eui.Button;
	protected discountBtn: eui.Button;
	protected dailyChargeBtn: eui.Button;
	protected sevenDayBtn: eui.Button;
	protected fightPetFBBtn: eui.Button;
	protected shootUpBtn: eui.Button;
	protected rebateBtn: eui.Button;
	protected godPetAwardBtn: eui.Button;
	protected godPetLotteryBtn: eui.Button;
	protected godLotteryBtn: eui.Button;
	protected growupBtn: eui.Button;
	protected investmentBtn: eui.Button;
	protected jingCaiBtn: eui.Button;
	protected xuannvBtn: eui.Button;
	protected treasureBtn: eui.Button;
	// protected totemsDrawBtn: eui.Button;
	protected totemsDraw2Btn: eui.Button;
	protected leftGp: eui.Group;
	protected btnMail: eui.Button;
	protected friendBtn: eui.Button;
	protected rightGroup: eui.Group;
	protected bottomGp: eui.Group;
	protected btnEquipSp: eui.Button;
	protected btnShop: eui.Button;
	protected auctionBtn: eui.Button;
	protected btnRelation: eui.Button;
	protected yingYue: eui.Button;
	protected totemsBtn: eui.Button;
	protected xuannvCard: eui.Component;
	protected playerInfo: MainPlayerInfoView;
	protected mysteryShopBtn: eui.Button
	// protected ladderBtn: eui.Button
	protected dailyChargeGiftBtn: eui.Button;
	protected destinyBtn: eui.Button;
	protected rechargeFeedbackBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	// private activityAdvance;
	public static firstShowXuanNv = true;
	// 引导对象
	public GetGuideTarget() {
		this.validateNow()
		this.rightGroup.validateNow()
		return {
			[1]: this.btnFuBen,
		}
	}

	private mRecordViewPlayerId: number
	private ruleList: { [key: number]: RuleIconBase } = {}

	protected SetFullType() {
		// this.SetFullScreenType()
	}

	public constructor() {
		super()
		this.skinName = "GameCityPanelSkin"

		for (let child of this.gGroup.$children) {
			if (egret.is(child, "eui.Button")) {
				let img = (child as eui.Button).getChildByName("icon") as eui.Image
				if (img) {
					img.anchorOffsetX = img.width >> 1;
					img.anchorOffsetY = img.height >> 1;
					img.x += img.anchorOffsetX
					img.y += img.anchorOffsetY
				}
				let red = (child as eui.Button).getChildByName("redPoint")
				if (red) {
					red.visible = false
				}
			}
		}

		this.SetFullType()

		//top
		this._AddIconRule(this.fuliBtn, FuliIconRule)
		this._AddIconRule(this.kaifuBtn, KaiFuIconRule)
		this._AddIconRule(this.dailyChargeBtn, DailyChargeIconRule)
		this._AddIconRule(this.fightPetFBBtn, FightPetFBIconRule)
		this._AddIconRule(this.sevenDayBtn, SevenDayIconRule)
		this._AddIconRule(this.shootUpBtn, ShootUpIconRule)
		this._AddIconRule(this.treasureBtn, TreasureIconRule)
		// this._AddIconRule(this.totemsDrawBtn, TotemsDrawIconRule)
		this._AddIconRule(this.totemsDraw2Btn, TotemsDrawIconRule2)
		this._AddIconRule(this.totemsBtn, TotemsIconRule)
		this._AddIconRule(this.rebateBtn, RebateIconRule)
		this._AddIconRule(this.godPetAwardBtn, GodPetAwardIconRule)
		this._AddIconRule(this.godPetLotteryBtn, GodPetLotteryIconRule)
		this._AddIconRule(this.godLotteryBtn, GodLotteryIconRule)
		this._AddIconRule(this.growupBtn, GrowUpIconRule)
		this._AddIconRule(this.investmentBtn, InvestmentIconRule)
		this._AddIconRule(this.jingCaiBtn, JingCaiIconRule)
		this._AddIconRule(this.xuannvBtn, XuannvBefallIconRule)
		this._AddIconRule(this.discountBtn, DiscountRule)
		this._AddIconRule(this.mysteryShopBtn, MysteryRule)
		// this._AddIconRule(this.ladderBtn, LadderRule)
		this._AddIconRule(this.dailyChargeGiftBtn, DailyChargeGiftIconRule)
		this._AddIconRule(this.rechargeFeedbackBtn, RechargeFeedbackIconRule)
		this._AddIconRule(this.destinyBtn, DestinyIconRule)

		//左侧按钮
		this._AddIconRule(this.auctionBtn, AuctionIconRule)
		this._AddIconRule(this.btnShop, ShopIconRule)//元宝商店
		this._AddIconRule(this.btnEquipSp, EquipSpIconRule)//装扮商店
		// this._AddIconRule(this.btnFashionSp, FashionSpIconRule)//装扮
		// this._AddIconRule(this.btnArenaSp, ArenaionSpIconRule)//竞技商店
		this._AddIconRule(this.btnMail, MailIconRule)
		this._AddIconRule(this.friendBtn, FriendRule)

		//右铡按钮
		this._AddIconRule(this.btnKuaFu, KuaFuIconRule)
		this._AddIconRule(this.btnArena, ArenaIconRule)
		this._AddIconRule(this.btnBoss, BossIconRule)
		this._AddIconRule(this.btnFuBen, FubenIconRule)
		this._AddIconRule(this.btnRelation, RelationIconRule)
		this._AddIconRule(this.btnActive, ActivityIconRule)
		this._AddIconRule(this.yingYue, YingYuanIconRule)
		this._AddIconRule(this.gangBtn, GangIconRule)


		for (var key in this.ruleList) {
			let ruleIcon = this.ruleList[key]
			ruleIcon.DoHide()
		}


		if (XuannvBefallIconRule.AutoCheckShow()) {
			this.AddTimer(800, 1, this.AutoShowXuannv)
		}
	}

	private AutoShowXuannv() {
		XuannvBefallIconRule.AutoShow()
	}

	destoryView() { };

	private _AddIconRule(obj: egret.DisplayObject, iconRule: any): RuleIconBase {
		this.ruleList[obj.hashCode] = new iconRule(obj)
		this._AddClick(obj, this.onTap)
		return this.ruleList[obj.hashCode]
	}

	onTap(e: egret.TouchEvent) {
		if (this.ruleList[e.currentTarget.hashCode]) {
			this.ruleList[e.currentTarget.hashCode].tapExecute(e.target);
			return;
		}
	}

	// public AdaptationGroup() {
	// 	MiniChatPanel.UpdateViewPos(this.groupAdaptation)
	// }

	OnOpen() {
		this.playerInfo.OnOpen()

		// this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
		// this.observe(MessageDef.QIU_MARRY_INFO, this.ShowQiuHunView)       // 求婚消息
		// this.observe(MessageDef.INVITATION_INFO, this.ShowInvitationView)  //请帖消息
		// this.observe(MessageDef.FLOWER_INFO, this.ShowFlower)
		// this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.ShowHouseBuild) //房屋
		this.observe(MessageDef.PLAYER_VIEW_ONCITYMAP, this.RecordViewPlayerId)
		// this.observe(MessageDef.PALYER_INFO, this.UpdateViewPlayer)

		if (!MiniChatPanel.GAME_CITY_CLICK) {
			GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)
		}

		this.addRuleEvent();
		this.updateRules();
		// this.AdaptationGroup();

		// this.ShowQiuHunView()
		// this.ShowInvitationView()
		// this.ShowFlower()
		// this.ShowHouseBuild()

		// this._AddClick(this.xiTieBnt, this._Onclick)
		// this._AddClick(this.qiuHunBnt, this._Onclick)
		// this._AddClick(this.xianHuanBnt, this._Onclick)
		// this._AddClick(this.btnHouseBuild, this._Onclick)
		this._AddClick(this.xuannvCard, this._Onclick)
		// this._AddClick(this.groupPlayer, this._Onclick)

		this.updateXuannvCard()
		// this.groupPlayer.visible = false

		GameGlobal.StageUtils.GetStage().addEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this, false, 999);
		this.OnFullScreenResize()
		// this.activityAdvance = new ActivityAdvance(this.topGp);
	}

	OnClose() {
		this.playerInfo.OnClose()
		GameGlobal.StageUtils.GetStage().removeEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this);
		this.removeRuleEvent();
		// if (this.activityAdvance)
		// 	delete this.activityAdvance;
	}

	updateXuannvCard() {
		if (Deblocking.Check(DeblockingType.TYPE_118, true)) {
			if ((!Deblocking.Check(DeblockingType.TYPE_19, true) || (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))) && !GameCityPanel.firstShowXuanNv)
				this.xuannvCard.visible = GameGlobal.RechargeModel.xuanNvCard;
			if ((UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9)))
				ViewManager.ins().open(HavingTipsPanel);
		}
		if (GameCityPanel.firstShowXuanNv)
			GameGlobal.RechargeModel.xuanNvCard = false
		GameCityPanel.firstShowXuanNv = false;
	}
	private _Onclick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			// case this.xiTieBnt:
			// 	ViewManager.ins().open(YingYuanHeLiPanel)
			// 	break
			// case this.qiuHunBnt:
			// 	ViewManager.ins().open(ShouDaoPanel)
			// 	break
			// case this.xianHuanBnt:
			// 	ViewManager.ins().open(ShouDaoXianHuaPanel)
			// 	break
			// case this.btnHouseBuild:
			// 	ViewManager.ins().open(HouseUpgradeTipWin)
			// 	break
			// case this.groupPlayer:
			// 	ViewManager.ins().open(PlayerDetailsPanel, this.mRecordViewPlayerId)
			// 	this.groupPlayer.visible = false
			// 	this.mRecordViewPlayerId = null
			// 	break
			case this.xuannvCard:
				this.xuannvCard.visible = false;
				ViewManager.ins().open(HavingTipsPanel);
				break;
		}
	}

	public RecordViewPlayerId(id) {
		this.mRecordViewPlayerId = id
	}

	// public UpdateViewPlayer(playerInfo: Sproto.sc_show_other_player_request) {
	// 	if (this.mRecordViewPlayerId != playerInfo.id)
	// 		return

	// 	this.groupPlayer.visible = true
	// 	this.imgFace.source = ResDataPath.GetHeadImgName(playerInfo.job, playerInfo.sex)
	// }

	// public ShowQiuHunView() {
	// 	if (GameGlobal.YingYuanModel.askMarry.length == 0) {
	// 		this.qiuHun.visible = false
	// 		return
	// 	}
	// 	this.qiuHun.visible = true
	// 	if (GameGlobal.YingYuanModel.askMarry.length > 9) {
	// 		this.qiuHunText.text = "···"
	// 	} else {
	// 		this.qiuHunText.text = GameGlobal.YingYuanModel.askMarry.length + ""
	// 	}

	// }

	// public ShowInvitationView() {
	// 	if (GameGlobal.YingYuanModel.marryInvita.length == 0) {
	// 		this.xiTie.visible = false
	// 		return
	// 	}
	// 	this.xiTie.visible = true
	// 	if (GameGlobal.YingYuanModel.marryInvita.length > 9) {
	// 		this.xiTieText.text = "···"
	// 	} else {
	// 		this.xiTieText.text = GameGlobal.YingYuanModel.marryInvita.length + ""
	// 	}

	// }

	// public ShowFlower() {
	// 	if (GameGlobal.YingYuanModel.marrySFlower.length == 0) {
	// 		this.xianHuan.visible = false
	// 		return
	// 	}
	// 	this.xianHuan.visible = true
	// 	if (GameGlobal.YingYuanModel.marrySFlower.length > 9) {
	// 		this.xianHuanText.text = "···"
	// 	} else {
	// 		this.xianHuanText.text = GameGlobal.YingYuanModel.marrySFlower.length + ""
	// 	}

	// }

	// public ShowHouseBuild() {
	// 	let shareBuildUpInfo = GameGlobal.YingYuanModel.shareUpInfo
	// 	this.btnHouseBuild.visible = shareBuildUpInfo != null
	// }

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
		// TimerManager.ins().doTimer(100, 1, this.startUpdateRule, this);
		// for (var i in this.ruleList) {
		// 	this.ruleList[i].update()
		// }
		TimerManager.ins().doNext(this.startUpdateRule, this);
	}

	startUpdateRule() {
		for (var i in this.ruleList) {
			this.ruleList[i].update()
		}
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_95)
	}
}