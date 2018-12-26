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
var PlayFunView = (function (_super) {
    __extends(PlayFunView, _super);
    function PlayFunView() {
        var _this = _super.call(this) || this;
        _this.ruleList = {};
        _this.m_ShowCatchPet = false;
        _this.skinName = "MainPlayFunViewSkin";
        DisplayUtils.removeFromParent(_this.xuannvCard);
        DisplayUtils.removeFromParent(_this.gAnswer);
        DisplayUtils.removeFromParent(_this.xiTie);
        DisplayUtils.removeFromParent(_this.qiuHun);
        DisplayUtils.removeFromParent(_this.xianHuan);
        DisplayUtils.removeFromParent(_this.btnHouseBuild);
        var config = GameGlobal.Config.ShowUiConfig;
        for (var key in config) {
            PlayFunView.pngFirstShow[config[key].followicon] = true;
        }
        return _this;
    }
    // 引导对象
    PlayFunView.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.taskTraceBtn,
            _a[2] = this.chapterInfo,
            _a[3] = this.fateInfo,
            _a[4] = this.guanqiaBtn.cbAuto,
            _a;
        var _a;
    };
    PlayFunView.prototype.ShowQiuHunView = function () {
        if (GameGlobal.YingYuanModel.askMarry.length == 0) {
            DisplayUtils.removeFromParent(this.qiuHun);
            return;
        }
        this.g1.addChild(this.qiuHun);
        if (GameGlobal.YingYuanModel.askMarry.length > 9) {
            this.qiuHunText.text = "···";
        }
        else {
            this.qiuHunText.text = GameGlobal.YingYuanModel.askMarry.length + "";
        }
    };
    PlayFunView.prototype.ShowInvitationView = function () {
        if (GameGlobal.YingYuanModel.marryInvita.length == 0) {
            DisplayUtils.removeFromParent(this.xiTie);
            return;
        }
        this.g1.addChild(this.xiTie);
        if (GameGlobal.YingYuanModel.marryInvita.length > 9) {
            this.xiTieText.text = "···";
        }
        else {
            this.xiTieText.text = GameGlobal.YingYuanModel.marryInvita.length + "";
        }
    };
    PlayFunView.prototype.ShowFlower = function () {
        if (GameGlobal.YingYuanModel.marrySFlower.length == 0) {
            DisplayUtils.removeFromParent(this.xianHuan);
            return;
        }
        this.g1.addChild(this.xianHuan);
        if (GameGlobal.YingYuanModel.marrySFlower.length > 9) {
            this.xianHuanText.text = "···";
        }
        else {
            this.xianHuanText.text = GameGlobal.YingYuanModel.marrySFlower.length + "";
        }
    };
    PlayFunView.prototype.ShowHouseBuild = function () {
        var shareBuildUpInfo = GameGlobal.YingYuanModel.shareUpInfo;
        if (shareBuildUpInfo != null) {
            this.g2.addChild(this.btnHouseBuild);
        }
        else {
            DisplayUtils.removeFromParent(this.btnHouseBuild);
        }
    };
    PlayFunView.prototype.destoryView = function () { };
    ;
    PlayFunView.prototype._AddIconRule = function (obj, iconRule) {
        this.ruleList[obj.hashCode] = new iconRule(obj);
        this._AddClick(obj, this.onTap);
        return this.ruleList[obj.hashCode];
    };
    PlayFunView.prototype._AddIconRule2 = function (obj, iconRule) {
        this.ruleList[obj.hashCode] = new iconRule(obj);
        return this.ruleList[obj.hashCode];
    };
    PlayFunView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.tipIconList.itemRenderer = PlayFunTipBtn;
        this._AddIconRule(this.guanqiaBtn, GuanQiaRuleIcon);
        this._AddIconRule(this.firstRechargeBtn, FirstRechargeIconRule);
        this._AddIconRule(this.xuannvBtn, XuannvBefallIconRule2);
        this._AddIconRule(this.bagBtn, BagIconRule);
        // this._AddIconRule(this.rankingBtn, RankingRule)
        this._AddIconRule(this.dailyBtn, DailyIconRule);
        this._AddIconRule(this.monthBtn, MonthIconRule);
        this._AddIconRule(this.rmbGiftBtn, RmbGiftIconRule);
        this._AddIconRule(this.taskTraceBtn, TaskTraceIconRule);
        this._AddIconRule(this.discountBtn, DiscountRule);
        this._AddIconRule(this.openDayGif, OpenDayGifRule);
        // this._AddIconRule(this.sevenDayBtn, SevenDayIconRule)
        this._AddIconRule(this.JinJieRankBtn, JinJieRankIconRule);
        this._AddIconRule(this.upLvBtn, UpLvIconRule);
        this._AddIconRule(this.positionBtn, PositionRule);
        this._AddClick(this.imgGoto, this._Onclick);
        this._AddClick(this.btnHouseBuild, this._Onclick);
        this._AddClick(this.fateInfo, this._Onclick);
        this._AddClick(this.xuannvCard, this._Onclick);
        //this._AddClick(this.crossBat, this._Onclick)
        for (var key in this.ruleList) {
            var ruleIcon = this.ruleList[key];
            ruleIcon.DoHide();
        }
        //答题相关
        this._AddClick(this.btnAnswerClose, this._Onclick);
        this._AddClick(this.imgAsBg, this._Onclick);
        //結婚
        this._AddClick(this.xiTieBnt, this._Onclick);
        this._AddClick(this.qiuHunBnt, this._Onclick);
        this._AddClick(this.xianHuanBnt, this._Onclick);
    };
    PlayFunView.prototype.OnOpen = function () {
        this.observe(MessageDef.FUBEN_CHANGE, this.upDataGuanqia);
        this.observe(MessageDef.LEVEL_CHANGE, this.levelChange);
        this.observe(MessageDef.GUANQIA_CHANGE, this.UpdateGuanqiaBtnState);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.BZ_PET_INFO, this.ShowCatchPet);
        this.observe(MessageDef.ANSWER_CHANGE, this.upDateAnswer);
        this.observe(MessageDef.UPDATE_TEAM_MAIN_INFO, this._UpdateTipGroup);
        this.observe(MessageDef.MAIL_DATA_CHANGE, this._UpdateTipGroup);
        this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this._UpdateTipGroup);
        //this.observe(MessageDef.QUJING_ROBBEDFLAG_CHANGE, this._UpdateTipGroup)
        this.observe(MessageDef.QIU_MARRY_INFO, this.ShowQiuHunView); // 求婚消息
        this.observe(MessageDef.INVITATION_INFO, this.ShowInvitationView); //请帖消息
        this.observe(MessageDef.FLOWER_INFO, this.ShowFlower);
        this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.ShowHouseBuild); //房屋
        this.observe(MessageDef.UPDATE_MAIN_TASK, this.updateMainTask);
        // this.verticalGroup.addEventListener(egret.Event.ADDED, this.updateGroup, this)
        if (!MiniChatPanel.PLAY_FUNC_CLICK) {
            GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        }
        this.chapterInfo.DoOpen([MainChapterInfoView.FIGHT_TYPE]);
        this.fateInfo.DoOpen();
        this.addRuleEvent();
        this.upDataGuanqia();
        this.updateRules();
        this.UpdateGuanqiaBtnState();
        this._UpdateTipGroup();
        this.AdaptationGroup();
        if (this.m_GameNotice && this.m_GameNotice.parent) {
            this.m_GameNotice.DoOpen();
        }
        this.CatchPet();
        this.ShowQiuHunView();
        this.ShowInvitationView();
        this.ShowFlower();
        this.ShowHouseBuild();
        this.updateMainTask();
        this.updateXuannvCard();
        if (XuannvBefallIconRule.AutoCheckShow()) {
            this.AddTimer(800, 1, this.AutoShowXuannv);
        }
        this.activityAdvance = new ActivityAdvance(this.horizontalGroup);
    };
    PlayFunView.prototype.AutoShowXuannv = function () {
        XuannvBefallIconRule.AutoShow();
    };
    // updateGroup() {
    // if (this.verticalGroup.numChildren > 7) {//左边按钮的最大容纳数
    // 	this.horizontalGroup.addChild(this.verticalGroup.getChildAt(0));
    // }
    // }
    PlayFunView.prototype.updateXuannvCard = function () {
        if (Deblocking.Check(DeblockingType.TYPE_118, true)) {
            if ((!Deblocking.Check(DeblockingType.TYPE_19, true) || (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))) && !PlayFunView.firstShowXuanNv)
                if (GameGlobal.RechargeModel.xuanNvCard) {
                    this.addChild(this.xuannvCard);
                }
                else {
                    DisplayUtils.removeFromParent(this.xuannvCard);
                }
            if (UserVip.ins().lv >= 9 && !BitUtil.Has(UserVip.ins().otherreward, 9))
                ViewManager.ins().open(HavingTipsPanel);
        }
        if (PlayFunView.firstShowXuanNv)
            GameGlobal.RechargeModel.xuanNvCard = false;
        PlayFunView.firstShowXuanNv = false;
    };
    PlayFunView.prototype.updateMainTask = function () {
        var task = GameGlobal.UserTask.mainTaskData[0];
        if (!task) {
            return;
        }
        var source = "";
        var config = GameGlobal.Config.ShowUiConfig;
        this.followBtn = null;
        for (var key in config) {
            if (task.id >= config[key].showui && task.id <= config[key].closeui) {
                if (GameGlobal.RechargeModel.rechargeNum <= 0) {
                    if (PlayFunView.pngFirstShow[config[key].followicon]) {
                        source = config[key].pic;
                    }
                    else if (!RaidModel.IS_FIGHT_WIN) {
                        source = config[key].pic;
                    }
                    this.preShowPng.source = source;
                    if (source != "") {
                        for (var ruleList in this.ruleList) {
                            if (egret.is(this.ruleList[ruleList].tar, "eui.Button")) {
                                var btn = this.ruleList[ruleList].tar;
                                if (btn.icon == config[key].followicon) {
                                    this.preShowPng.x = config[key].pos[0];
                                    this.preShowPng.y = config[key].pos[1];
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
    };
    PlayFunView.prototype.OnClose = function () {
        this.chapterInfo.DoClose();
        this.fateInfo.DoClose();
        this.removeRuleEvent();
        this.removeObserve();
        this.removeEvents();
        TimerManager.ins().removeAll(this);
        if (this.m_GameNotice && this.m_GameNotice.parent) {
            this.m_GameNotice.DoClose();
        }
        if (this.activityAdvance)
            delete this.activityAdvance;
    };
    PlayFunView.prototype.CatchPetClick = function () {
        var _this = this;
        WarnWin.show("偶遇宠物宝宝，是否前去捕捉", function () {
            _this.m_ShowCatchPet = false;
            _this._UpdateTipGroup();
            if (GameGlobal.CatchPetModel.HasCatch()) {
                GameGlobal.RaidMgr.EnterCatchPet();
            }
            else {
                UserTips.InfoTip("宠物已经逃跑");
            }
        }, this);
    };
    PlayFunView.prototype.CatchPet = function () {
        if (GameGlobal.CatchPetModel.HasCatch()) {
            this.ShowCatchPet();
        }
    };
    PlayFunView.prototype.ShowCatchPet = function () {
        this.AddLoopTimer(1000, this.ShowCatchPetTime);
    };
    PlayFunView.prototype.ShowCatchPetTime = function () {
        var catchtime = GameGlobal.CatchPetModel.catchtime;
        if (catchtime <= GameServer.serverTime) {
            this.m_ShowCatchPet = true;
            this._UpdateTipGroup();
            this.RemoveTimer(this.ShowCatchPetTime);
            return;
        }
        this.m_ShowCatchPet = false;
        this._UpdateTipGroup();
    };
    PlayFunView.prototype.addRuleEvent = function () {
        var rule;
        for (var i in this.ruleList) {
            rule = this.ruleList[i];
            if (rule.updateMessage) {
                rule.addEvent();
            }
        }
    };
    PlayFunView.prototype.removeRuleEvent = function () {
        for (var key in this.ruleList) {
            var rule = this.ruleList[key];
            if (rule && rule.updateMessage) {
                rule.removeEvent();
            }
        }
    };
    PlayFunView.prototype.updateRules = function () {
        TimerManager.ins().doNext(this.startUpdateRule, this);
    };
    PlayFunView.prototype.startUpdateRule = function () {
        for (var i in this.ruleList) {
            this.ruleList[i].update();
        }
    };
    PlayFunView.prototype.levelChange = function () {
        this._UpdateTipGroup();
    };
    PlayFunView.prototype.onTap = function (e) {
        if (this.ruleList[e.currentTarget.hashCode]) {
            this.taskShowPngControl(e.currentTarget);
            this.ruleList[e.currentTarget.hashCode].tapExecute(e.target);
            return;
        }
    };
    PlayFunView.prototype.upDataGuanqia = function () {
    };
    //更新答题的内容
    PlayFunView.prototype.upDateAnswer = function () {
        var pAnswerData = GameGlobal.AnswerController.getAnswerData();
        if (!pAnswerData) {
            DisplayUtils.removeFromParent(this.gAnswer);
            return;
        }
        var openId = GameGlobal.Config.AnswerBaseConfig.open;
        if (!Deblocking.Check(openId, true)) {
            DisplayUtils.removeFromParent(this.gAnswer);
            return;
        }
        if (GameGlobal.AnswerController.bOpenLayer)
            return;
        if (pAnswerData.type) {
            this.addChild(this.gAnswer);
            this.gAnswer.visible = true;
            this.lbAnswerInfo.textFlow = TextFlowMaker.generateTextFlow("|C:369427&T:\u6B63\u5728\u8FDB\u884C\u7B2C|C:0x369427&T:" + pAnswerData.answerNum + "|C:0x369427&T:\u9898|");
        }
        else {
            DisplayUtils.removeFromParent(this.gAnswer);
        }
    };
    PlayFunView.prototype._Onclick = function (e) {
        switch (e.currentTarget) {
            case this.imgGoto:
                // GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)
                ViewManager.ins().open(WorldMapPanel);
                break;
            case this.btnAnswerClose:
                DisplayUtils.removeFromParent(this.gAnswer);
                break;
            case this.imgAsBg://答题内容 回调
                DisplayUtils.removeFromParent(this.gAnswer);
                if (GameGlobal.AnswerController.bOpenAnswer()) {
                    ViewManager.ins().open(AnswerLayer);
                }
                else {
                    GameGlobal.UserTips.showTips('活动未开启');
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
                break;
            case this.btnHouseBuild:
                ViewManager.ins().open(HouseUpgradeTipWin);
                break;
            case this.fateInfo:
                ViewManager.ins().open(FateMainPanel, this.fateInfo.getTabID());
                break;
            case this.xiTieBnt:
                ViewManager.ins().open(YingYuanHeLiPanel);
                break;
            case this.qiuHunBnt:
                ViewManager.ins().open(ShouDaoPanel);
                break;
            case this.xianHuanBnt:
                ViewManager.ins().open(ShouDaoXianHuaPanel);
                break;
            /*case this.crossBat:
                ViewManager.ins().open(CrossBattleWin)
                break*/
            case this.xuannvCard:
                DisplayUtils.removeFromParent(this.xuannvCard);
                ViewManager.ins().open(HavingTipsPanel);
                break;
        }
    };
    PlayFunView.prototype.taskShowPngControl = function (clickBtn) {
        if (this.followBtn == clickBtn) {
            PlayFunView.pngFirstShow[this.followBtn.icon] = false;
            this.preShowPng.source = "";
            RaidModel.IS_FIGHT_WIN = true;
        }
    };
    PlayFunView.prototype._UpdateTipGroup = function () {
        var list = [];
        if (this.m_ShowCatchPet) {
            list.push({
                id: PlayFunTipBtnType.CATCH_PET,
            });
        }
        if (TeamBaseModelMsg.HasTeam()) {
            list.push({
                id: PlayFunTipBtnType.TEAM,
            });
        }
        if (MailIconRule.CheckShowRedPoint()) {
            list.push({
                id: PlayFunTipBtnType.MAIL,
            });
        }
        if (GameGlobal.QujingModel.HasAward()) {
            list.push({
                id: PlayFunTipBtnType.QUJING_AWARD,
            });
        }
        if (GameGlobal.QujingModel.HasRobbed()) {
            list.push({
                id: PlayFunTipBtnType.QUJING_ROBBED,
            });
        }
        this.tipIconList.dataProvider = new eui.ArrayCollection(list);
    };
    PlayFunView.prototype._UpdateTipGroupTimer = function () {
    };
    PlayFunView.prototype.UpdateGuanqiaBtnState = function () {
        var nextMapFlag = GameGlobal.UserFb.nextMap;
        this.imgGoto.visible = nextMapFlag;
        this.guanqiaBtn.visible = !nextMapFlag;
    };
    PlayFunView.prototype.AdaptationGroup = function (zoomFlag) {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        var height = GameGlobal.StageUtils.GetHeight();
        this.bGroup.bottom = height - this.groupAdaptation.y + 94;
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
    };
    PlayFunView.GameNotice = function (type, time, showType) {
        if (GameGlobal.actorModel.level < 30) {
            return;
        }
        var view = ViewManager.ins().getView(PlayFunView);
        if (!view) {
            return;
        }
        if (!time || time < 0) {
            return;
        }
        if (!view.m_GameNotice) {
            view.m_GameNotice = new MainGameNoticeView;
        }
        if (!view.m_GameNotice.parent) {
            view.gameNoticeGroup.addChild(view.m_GameNotice);
            view.m_GameNotice.DoOpen();
        }
        view.m_GameNotice.SetData(type, time, showType);
        if (view.$stage) {
            view.m_GameNotice.StartTime();
        }
    };
    PlayFunView.RemoveGameNotice = function (type) {
        var view = ViewManager.ins().getView(PlayFunView);
        if (!view) {
            return;
        }
        if (view.m_GameNotice && view.m_GameNotice.parent) {
            if (view.m_GameNotice.mType == type) {
                view.m_GameNotice.Close();
            }
        }
    };
    PlayFunView.LAYER_LEVEL = LayerManager.UI_USER_INFO;
    /////////////////////////////////////////////////////////////////////////////
    PlayFunView.pngFirstShow = {};
    PlayFunView.firstShowXuanNv = true;
    return PlayFunView;
}(BaseEuiView));
__reflect(PlayFunView.prototype, "PlayFunView");
//# sourceMappingURL=PlayFunView.js.map