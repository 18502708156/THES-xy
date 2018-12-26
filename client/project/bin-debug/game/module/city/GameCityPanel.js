var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameCityPanel = (function (_super) {
    __extends(GameCityPanel, _super);
    function GameCityPanel() {
        var _this = _super.call(this) || this;
        _this.ruleList = {};
        _this.skinName = "GameCityPanelSkin";
        for (var _i = 0, _a = _this.gGroup.$children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (egret.is(child, "eui.Button")) {
                var img = child.getChildByName("icon");
                if (img) {
                    img.anchorOffsetX = img.width >> 1;
                    img.anchorOffsetY = img.height >> 1;
                    img.x += img.anchorOffsetX;
                    img.y += img.anchorOffsetY;
                }
                var red = child.getChildByName("redPoint");
                if (red) {
                    red.visible = false;
                }
            }
        }
        _this.SetFullType();
        //top
        _this._AddIconRule(_this.fuliBtn, FuliIconRule);
        _this._AddIconRule(_this.kaifuBtn, KaiFuIconRule);
        _this._AddIconRule(_this.dailyChargeBtn, DailyChargeIconRule);
        _this._AddIconRule(_this.fightPetFBBtn, FightPetFBIconRule);
        _this._AddIconRule(_this.sevenDayBtn, SevenDayIconRule);
        _this._AddIconRule(_this.shootUpBtn, ShootUpIconRule);
        _this._AddIconRule(_this.treasureBtn, TreasureIconRule);
        _this._AddIconRule(_this.totemsDrawBtn, TotemsDrawIconRule);
        _this._AddIconRule(_this.totemsDraw2Btn, TotemsDrawIconRule2);
        _this._AddIconRule(_this.totemsBtn, TotemsIconRule);
        _this._AddIconRule(_this.rebateBtn, RebateIconRule);
        _this._AddIconRule(_this.godPetAwardBtn, GodPetAwardIconRule);
        _this._AddIconRule(_this.godPetLotteryBtn, GodPetLotteryIconRule);
        _this._AddIconRule(_this.godLotteryBtn, GodLotteryIconRule);
        _this._AddIconRule(_this.growupBtn, GrowUpIconRule);
        _this._AddIconRule(_this.investmentBtn, InvestmentIconRule);
        _this._AddIconRule(_this.jingCaiBtn, JingCaiIconRule);
        _this._AddIconRule(_this.xuannvBtn, XuannvBefallIconRule);
        _this._AddIconRule(_this.discountBtn, DiscountRule);
        _this._AddIconRule(_this.mysteryShopBtn, MysteryRule);
        // this._AddIconRule(this.ladderBtn, LadderRule)
        _this._AddIconRule(_this.dailyChargeGiftBtn, DailyChargeGiftIconRule);
        _this._AddIconRule(_this.rechargeFeedbackBtn, RechargeFeedbackIconRule);
        _this._AddIconRule(_this.destinyBtn, DestinyIconRule);
        _this._AddIconRule(_this.miJingIconBtn, MiJingIconRule);
        _this._AddIconRule(_this.lingTongCallBtn, LingTongCallRule);
        //左侧按钮
        _this._AddIconRule(_this.auctionBtn, AuctionIconRule);
        _this._AddIconRule(_this.btnShop, ShopIconRule); //元宝商店
        _this._AddIconRule(_this.btnEquipSp, EquipSpIconRule); //装扮商店
        // this._AddIconRule(this.btnFashionSp, FashionSpIconRule)//装扮
        // this._AddIconRule(this.btnArenaSp, ArenaionSpIconRule)//竞技商店
        _this._AddIconRule(_this.btnMail, MailIconRule);
        _this._AddIconRule(_this.friendBtn, FriendRule);
        //右铡按钮
        _this._AddIconRule(_this.btnKuaFu, KuaFuIconRule);
        _this._AddIconRule(_this.btnArena, ArenaIconRule);
        _this._AddIconRule(_this.btnBoss, BossIconRule);
        _this._AddIconRule(_this.btnFuBen, FubenIconRule);
        _this._AddIconRule(_this.btnRelation, RelationIconRule);
        _this._AddIconRule(_this.btnActive, ActivityIconRule);
        _this._AddIconRule(_this.yingYue, YingYuanIconRule);
        _this._AddIconRule(_this.gangBtn, GangIconRule);
        for (var key in _this.ruleList) {
            var ruleIcon = _this.ruleList[key];
            ruleIcon.DoHide();
        }
        if (XuannvBefallIconRule.AutoCheckShow()) {
            _this.AddTimer(800, 1, _this.AutoShowXuannv);
        }
        return _this;
    }
    // 引导对象
    GameCityPanel.prototype.GetGuideTarget = function () {
        this.validateNow();
        this.rightGroup.validateNow();
        return _a = {},
            _a[1] = this.btnFuBen,
            _a;
        var _a;
    };
    GameCityPanel.prototype.SetFullType = function () {
        // this.SetFullScreenType()
    };
    GameCityPanel.prototype.AutoShowXuannv = function () {
        XuannvBefallIconRule.AutoShow();
    };
    GameCityPanel.prototype.destoryView = function () { };
    ;
    GameCityPanel.prototype._AddIconRule = function (obj, iconRule) {
        this.ruleList[obj.hashCode] = new iconRule(obj);
        this._AddClick(obj, this.onTap);
        return this.ruleList[obj.hashCode];
    };
    GameCityPanel.prototype.onTap = function (e) {
        if (this.ruleList[e.currentTarget.hashCode]) {
            this.ruleList[e.currentTarget.hashCode].tapExecute(e.target);
            return;
        }
    };
    // public AdaptationGroup() {
    // 	MiniChatPanel.UpdateViewPos(this.groupAdaptation)
    // }
    GameCityPanel.prototype.OnOpen = function () {
        this.playerInfo.OnOpen();
        // this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup)
        // this.observe(MessageDef.QIU_MARRY_INFO, this.ShowQiuHunView)       // 求婚消息
        // this.observe(MessageDef.INVITATION_INFO, this.ShowInvitationView)  //请帖消息
        // this.observe(MessageDef.FLOWER_INFO, this.ShowFlower)
        // this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.ShowHouseBuild) //房屋
        this.observe(MessageDef.PLAYER_VIEW_ONCITYMAP, this.RecordViewPlayerId);
        // this.observe(MessageDef.PALYER_INFO, this.UpdateViewPlayer)
        if (!MiniChatPanel.GAME_CITY_CLICK) {
            GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
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
        this._AddClick(this.xuannvCard, this._Onclick);
        // this._AddClick(this.groupPlayer, this._Onclick)
        this.updateXuannvCard();
        // this.groupPlayer.visible = false
        GameGlobal.StageUtils.GetStage().addEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this, false, 999);
        this.OnFullScreenResize();
        // this.activityAdvance = new ActivityAdvance(this.topGp);
    };
    GameCityPanel.prototype.OnClose = function () {
        this.playerInfo.OnClose();
        GameGlobal.StageUtils.GetStage().removeEventListener(egret.Event.RESIZE, this.OnFullScreenResize, this);
        this.removeRuleEvent();
        // if (this.activityAdvance)
        // 	delete this.activityAdvance;
    };
    GameCityPanel.prototype.updateXuannvCard = function () {
        if (Deblocking.Check(DeblockingType.TYPE_118, true)) {
            if ((!Deblocking.Check(DeblockingType.TYPE_19, true) || (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))) && !GameCityPanel.firstShowXuanNv)
                this.xuannvCard.visible = GameGlobal.RechargeModel.xuanNvCard;
            if ((UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9)))
                ViewManager.ins().open(HavingTipsPanel);
        }
        if (GameCityPanel.firstShowXuanNv)
            GameGlobal.RechargeModel.xuanNvCard = false;
        GameCityPanel.firstShowXuanNv = false;
    };
    GameCityPanel.prototype._Onclick = function (e) {
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
    };
    GameCityPanel.prototype.RecordViewPlayerId = function (id) {
        this.mRecordViewPlayerId = id;
    };
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
    GameCityPanel.prototype.addRuleEvent = function () {
        var rule;
        for (var i in this.ruleList) {
            rule = this.ruleList[i];
            if (rule.updateMessage) {
                rule.addEvent();
            }
        }
    };
    GameCityPanel.prototype.removeRuleEvent = function () {
        for (var key in this.ruleList) {
            var rule = this.ruleList[key];
            if (rule && rule.updateMessage) {
                rule.removeEvent();
            }
        }
    };
    GameCityPanel.prototype.updateRules = function () {
        // TimerManager.ins().doTimer(100, 1, this.startUpdateRule, this);
        // for (var i in this.ruleList) {
        // 	this.ruleList[i].update()
        // }
        TimerManager.ins().doNext(this.startUpdateRule, this);
    };
    GameCityPanel.prototype.startUpdateRule = function () {
        for (var i in this.ruleList) {
            this.ruleList[i].update();
        }
    };
    GameCityPanel.openCheck = function () {
        return Deblocking.Check(DeblockingType.TYPE_95);
    };
    GameCityPanel.LAYER_LEVEL = LayerManager.UI_Main;
    /////////////////////////////////////////////////////////////////////////////
    // private activityAdvance;
    GameCityPanel.firstShowXuanNv = true;
    return GameCityPanel;
}(BaseEuiView));
__reflect(GameCityPanel.prototype, "GameCityPanel");
//# sourceMappingURL=GameCityPanel.js.map