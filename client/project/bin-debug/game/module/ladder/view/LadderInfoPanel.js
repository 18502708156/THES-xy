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
var LadderInfoPanel = (function (_super) {
    __extends(LadderInfoPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LadderInfoPanel() {
        var _this = _super.call(this) || this;
        _this.m_OtherHeadList = [];
        _this.mActorInfo = null;
        _this.skinName = "LadderInfoPanelSkin";
        return _this;
    }
    LadderInfoPanel.prototype.childrenCreated = function () {
        var config = this.GetLadderModel().GetSelfLevelConfig();
        for (var i = 0; i < 5; ++i) {
            var data = new Sproto.sc_ladder_player_back_request;
            data.id = 0;
            data.name = "";
            data.job = i == 0 ? -1 : MathUtils.randomArray([1, 2, 3]);
            data.sex = MathUtils.randomArray([0, 1]);
            data.grade = MathUtils.randomArray([1, 2, 3, 4, 5]);
            this.m_OtherHeadList[i] = data;
        }
        this.starGroup.itemRenderer = LadderStarItem;
        this.otherHeadList.useVirtualLayout = false;
        this.otherHeadList.itemRenderer = LadderInfoHeadItem;
        this.otherHeadList.dataProvider = new eui.ArrayCollection(this.m_OtherHeadList);
        this.m_TimeOutID = -1;
        this.enterTime.visible = false;
        this.ingImg.visible = false;
        this._AddClick(this.rankBtn, this._OnClick);
        this._AddClick(this.preBtn, this._OnClick);
        this._AddClick(this.winnerBtn, this._OnClick);
        this.notEnterLabel.text = "本周一0:00您未进入本服战力榜前" + GameGlobal.Config.KingSportsBaseConfig.inum + "名，无法参加王者争霸";
    };
    LadderInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.rankBtn:
                ViewManager.ins().open(LadderRankWin);
                break;
            case this.preBtn:
                ViewManager.ins().open(LadderWeekRankWin);
                break;
            case this.winnerBtn:
                ViewManager.ins().open(LadderWinnerWin);
                break;
        }
    };
    LadderInfoPanel.prototype.IsMacth = function () {
        return this.enterTime.visible || this.ingImg.visible;
    };
    LadderInfoPanel.prototype._ClearTimeOut = function () {
        if (this.m_TimeOutID < 1) {
            return;
        }
        egret.clearTimeout(this.m_TimeOutID);
        this.m_TimeOutID = -1;
    };
    LadderInfoPanel.prototype.OnOpen = function () {
        this._AddClick(this.flowPlayer, this.onTap);
        this._AddClick(this.buyTime, this.onTap);
        this.observe(MessageDef.LADDER_CHANGE, this.UpdateContent);
        // this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateRankList)
        this.observe(MessageDef.LADDER_PLAYER_BACK, this.playerBack);
        this.observe(MessageDef.LADDER_PRE_WEEK_REWARD, this.UpdateRedPoint);
        this.observe(MessageDef.LADDER_WINNER, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.buyTime.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>购买次数</u></fomt>");
        this.AddLoopTimer(1000, this._updateNextTime);
        this.otherLevel.visible = false;
        this.SetLevelName(this.otherLevel, 0);
        this.UpdateRankList();
        this.mActorInfo = GameGlobal.Ladder.getActorInfo();
    };
    LadderInfoPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.preBtn, GameGlobal.Ladder.isCanReward);
        UIHelper.ShowRedPoint(this.winnerBtn, GameGlobal.Ladder.mWinnerRecords && !GameGlobal.Ladder.mWinnerRecords.worship);
    };
    LadderInfoPanel.prototype.OnClose = function () {
        this._ClearTimeOut();
        egret.clearInterval(this.timeOut);
        this.ClearMatchInfo();
        egret.Tween.removeTweens(this.otherHeadList);
        var info = this.mActorInfo;
        if (info && info.id) {
            this.sendStarPlay();
        }
        this.mActorInfo = null;
    };
    // closeNew()
    // {
    // 	if(this.initEvent == true)
    // 	{
    // 		this.initEvent = false
    // 		//滚动页close
    // 		this._ClearTimeOut()
    // 		this.removeObserve()
    // 		egret.Tween.removeTweens(this.otherHeadList)
    // 		this.ingImg.visible = false
    // 		this.enterTime.visible = false
    // 	}
    // }
    LadderInfoPanel.prototype.UpdateRankList = function () {
        var list = GameGlobal.Ladder.mRankList;
        if (!list || !list.length) {
            return;
        }
        var index = 1;
        for (var i = 0; i < 30; ++i) {
            var randData = list[Math.floor(Math.random() * list.length)];
            if (!randData) {
                continue;
            }
            if (randData.id == GameGlobal.actorModel.actorID) {
                continue;
            }
            var headData = this.m_OtherHeadList[index++];
            if (headData.id) {
                continue;
            }
            headData.job = randData.job;
            headData.sex = randData.sex;
            headData.name = randData.player;
            headData.serverid = randData.serverid;
            if (index >= this.m_OtherHeadList.length) {
                break;
            }
        }
        this.otherHeadList.dataProvider.replaceAll(this.m_OtherHeadList);
    };
    /**触摸事件 */
    LadderInfoPanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.flowPlayer:
                this.DoChallenge();
                break;
            case this.buyTime:
                var ladder_1 = this.GetLadderModel();
                var config_1 = this.GetTianTiConfig();
                if (ladder_1.todayBuyTime >= config_1.time) {
                    UserTips.ErrorTip("今日购买次数已达上限");
                    return;
                }
                if (ladder_1.isTipsFlag) {
                    if (!Checker.Data(config_1.cost, true)) {
                        return;
                    }
                    ladder_1.sendBuyChallgeTime();
                }
                else {
                    var tips = "确定花费<font color='#019704'>" + config_1.cost.count + "元宝</font>购买1次跨服王者挑战次数吗？" +
                        "\n今日已购买：" + ladder_1.todayBuyTime + "/" + config_1.time;
                    if (ladder_1.isTipsFlag == false) {
                        tips = tips + "\n\n<font color='#019704'>点击确定后，本次登录不再提示。";
                    }
                    WarnWin.show(tips, function () {
                        ladder_1.isTipsFlag = true;
                        if (!Checker.Data(config_1.cost, true)) {
                            return;
                        }
                        ladder_1.sendBuyChallgeTime();
                    }, this);
                }
                break;
        }
    };
    ;
    LadderInfoPanel.prototype.GetLadderModel = function () {
        return GameGlobal.Ladder;
    };
    LadderInfoPanel.prototype.GetTianTiConfig = function () {
        return GlobalConfig.ins().KingSportsBaseConfig;
    };
    //更新时间
    LadderInfoPanel.prototype._updateNextTime = function () {
        if (this.GetLadderModel().challgeNum >= this.GetTianTiConfig().sportstime) {
            this.updatatimetext.text = '(2小时恢复1次)';
        }
        else {
            if (this.GetLadderModel().NextTime - GameServer.serverTime > 0) {
                this.updatatimetext.text = "(" + GameServer.GetPkTime(this.GetLadderModel().NextTime) + "\u540E\u6062\u590D\u4E00\u6B21)";
            }
            else {
                this.updatatimetext.text = '(2小时恢复1次)';
            }
        }
    };
    /**刷新 自己的挑战数据*/
    LadderInfoPanel.prototype.UpdateContent = function () {
        if (GameGlobal.Ladder.isOpen) {
            this.notEnterLabel.visible = !GameGlobal.Ladder.canJoin;
            this.enterGroup.visible = GameGlobal.Ladder.canJoin;
        }
        else {
            this.enterGroup.visible = true;
        }
        this.setMyHead();
        var ladder = this.GetLadderModel();
        this.lastNum.text = "剩余次数：" + ladder.challgeNum + "/" + this.GetTianTiConfig().sportstime;
        if (ladder.challgeNum > 0) {
            this.lastNum.textColor = 0x2ECA22;
        }
        else {
            this.lastNum.textColor = 0xFF0000;
        }
        this.winNum.text = "净胜场：" + ladder.winNum;
        var grade = ladder.grade;
        for (var key in GameGlobal.Config.DWKingSportsConfig) {
            var data = GameGlobal.Config.DWKingSportsConfig[key];
            if (grade >= data.typelv[0] && grade <= data.typelv[1]) {
                this.item.data = data.rankreward[0];
                break;
            }
        }
        var config = ladder.GetSelfLevelConfig();
        if (config) {
            LadderConst.SetGradeInfo(this.levtxt, ladder.grade);
            this.SetLevelName(this.myLevel, ladder.grade);
            this.otherLevelIcon.source = LadderConst.GetMiddleIcon(config.showType);
            var list = [];
            for (var i = 1, len = config.needstar; i <= len; ++i) {
                list.push(ladder.star >= i);
            }
            this.starGroup.dataProvider = new eui.ArrayCollection(list);
            this.starGroup.validateNow();
        }
        this.winImg.visible = ladder.lianWin;
        this.truceUIChange();
    };
    LadderInfoPanel.prototype.SetLevelName = function (comp, grade) {
        comp.rankImg.source = LadderConst.GetMiniIcon(grade);
        comp.levelLabel.text = LadderConst.GetGradeInfo(grade);
    };
    LadderInfoPanel.prototype.truceUIChange = function () {
        var ladder = this.GetLadderModel();
        this.stateGroup.visible = ladder.isOpen;
        this.wz_open_time.visible = !ladder.isOpen;
        this.starGroup.visible = ladder.isOpen;
        this.winNum.visible = ladder.isOpen;
    };
    LadderInfoPanel.prototype.DoChallenge = function () {
        var _this = this;
        if (this.GetLadderModel().challgeNum <= 0) {
            UserTips.InfoTip("挑战次数不足");
            return;
        }
        if (this.IsMacth()) {
            UserTips.InfoTip("匹配中");
            return;
        }
        if (!UserFb.CheckActMap()) {
            return;
        }
        this.ingImg.visible = true;
        this.PlayAnim();
        this.GetLadderModel().sendGetSomeOne();
        this.m_TimeOutID = egret.setTimeout(function () {
            UserTips.InfoTip("请求超时");
            _this._ClearTimeOut();
            _this.ClearMatchInfo();
        }, this, 5000);
    };
    /**
     * 设置自己的数据显示
     */
    LadderInfoPanel.prototype.setMyHead = function () {
        var model = SubRoles.ins().GetRoleData();
        this.myName.text = GameLogic.ins().actorModel.name;
        this.myhead.source = ResDataPath.GetLadderHead(model.job, model.sex);
    };
    LadderInfoPanel.prototype.ClearMatchInfo = function () {
        this.otherHeadList.scrollV = 0;
        this.ingImg.visible = false;
        this.enterTime.visible = false;
        this.otherLevel.visible = false;
    };
    // private _SetBackState(matching: boolean, result: boolean = false) {
    // 	egret.Tween.removeTweens(this.otherHeadList)
    // 	this.ingImg.visible = matching
    // 	if (result) {
    // 	} else {
    // 		this.otherHeadList.scrollV = 0
    // 	}
    // }
    LadderInfoPanel.prototype.PlayAnim = function () {
        var _this = this;
        egret.Tween.removeTweens(this.otherHeadList);
        var tween = egret.Tween.get(this.otherHeadList);
        tween.wait(LadderInfoPanel.WAIT_TIME);
        this.otherHeadList.scrollV = 0;
        var y = 0;
        var _loop_1 = function (i) {
            y += 284;
            // console.log("Y:========  "+ y);
            var index = i;
            tween.to({ scrollV: y }, LadderInfoPanel.DUR_TIME, egret.Ease.circOut).call(function () {
                _this.ShowPlayerInfo(_this.m_OtherHeadList[index + 1]);
            }, this_1).wait(LadderInfoPanel.WAIT_TIME);
        };
        var this_1 = this;
        for (var i = 0; i < this.m_OtherHeadList.length - 1; ++i) {
            _loop_1(i);
        }
        tween.call(function () {
            _this.rollOver();
        });
    };
    LadderInfoPanel.prototype.ShowPlayerInfo = function (data) {
        if (!data) {
            this.otherName.text = "";
            return;
        }
        this.otherLevel.visible = true;
        this.otherName.text = GameString.GetSerAndName(data.serverid, data.name);
        this.SetLevelName(this.otherLevel, data.grade);
    };
    LadderInfoPanel.prototype.playerBack = function () {
        this._ClearTimeOut();
        var info = this.mActorInfo = this.GetLadderModel().getActorInfo();
        if (info && info.id) {
            this.m_OtherHeadList[this.m_OtherHeadList.length - 1] = info;
        }
        this.otherHeadList.dataProvider.replaceAll(this.m_OtherHeadList);
    };
    /**
     * 对手头像滚动完成
     */
    LadderInfoPanel.prototype.rollOver = function () {
        egret.Tween.removeTweens(this.otherHeadList);
        this.ingImg.visible = false;
        this.enterTime.visible = true;
        this.rollTime = 3;
        //进入倒计时xxx秒
        this.enterTime.text = "进入倒计时 " + this.rollTime + " 秒";
        var info = this.mActorInfo;
        if (!info || info.id == 0) {
            UserTips.ins().showTips("|C:0xff0000&T:未匹配到对手|");
            this.ClearMatchInfo();
        }
        else {
            this.timeOut = egret.setInterval(this.refushLabel, this, 1000);
        }
    };
    LadderInfoPanel.prototype.refushLabel = function () {
        this.rollTime--;
        //进入倒计时xxx秒
        this.enterTime.text = "进入倒计时 " + this.rollTime + " 秒";
        if (this.rollTime < 1) {
            this.sendStarPlay();
            egret.clearInterval(this.timeOut);
        }
    };
    ;
    //开始挑战
    LadderInfoPanel.prototype.sendStarPlay = function () {
        var info = this.mActorInfo;
        if (info) {
            this.GetLadderModel().sendStarPlay(info.id, info.type);
        }
        this.mActorInfo = null;
    };
    LadderInfoPanel.NAME = "王者争霸";
    LadderInfoPanel.DUR_TIME = 286;
    LadderInfoPanel.WAIT_TIME = 286;
    return LadderInfoPanel;
}(BaseView));
__reflect(LadderInfoPanel.prototype, "LadderInfoPanel", ["ICommonWindowTitle"]);
var LadderInfoHeadItem = (function (_super) {
    __extends(LadderInfoHeadItem, _super);
    function LadderInfoHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LadderInfoHeadItem.prototype.dataChanged = function () {
        var data = this.data;
        if (data.job == -1) {
            this.img.source = "ui_wzzb_wenhao";
        }
        else {
            this.img.source = ResDataPath.GetLadderHead(data.job, data.sex);
        }
    };
    return LadderInfoHeadItem;
}(eui.ItemRenderer));
__reflect(LadderInfoHeadItem.prototype, "LadderInfoHeadItem");
//# sourceMappingURL=LadderInfoPanel.js.map