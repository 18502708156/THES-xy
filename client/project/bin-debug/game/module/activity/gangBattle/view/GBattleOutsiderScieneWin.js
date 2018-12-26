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
var GBattleOutsiderScieneWin = (function (_super) {
    __extends(GBattleOutsiderScieneWin, _super);
    function GBattleOutsiderScieneWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mTimerStartFlag = false;
        _this.skinName = "GBattleOutsiderSceneSkin";
        return _this;
    }
    GBattleOutsiderScieneWin.prototype.OnOpen = function () {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos();
        this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_KINGINFO, this.UpdateKingInfo);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration);
        this._AddClick(this.img1, this._OnClicked);
        this._AddClick(this.img2, this._OnClicked);
        this._AddClick(this.img3, this._OnClicked);
        this._AddClick(this.img4, this._OnClicked);
        this._AddClick(this.btnTeam, this._OnClick);
        this._AddClick(this.btnEnter, this._OnClick);
        this._AddClick(this.returnBtn, this._OnClick);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this.durationReborn1.SetTextFormat("{0}s后复活");
        this.durationReborn2.SetTextFormat("{0}s后复活");
        this.durationReborn3.SetTextFormat("{0}s后复活");
        this.durationReborn4.SetTextFormat("{0}s后复活");
        this.durationReborn1.SetColor(0x019704);
        this.durationReborn2.SetColor(0x019704);
        this.durationReborn3.SetColor(0x019704);
        this.durationReborn4.SetColor(0x019704);
        this.mTimerStartFlag = false;
        this.StartDuration();
        this.AdaptationGroup();
        this.SetBossList();
        this.SetOtherInfo();
    };
    GBattleOutsiderScieneWin.prototype.OnClose = function () {
    };
    GBattleOutsiderScieneWin.prototype.StartDuration = function () {
        if (this.mTimerStartFlag) {
            return;
        }
        var endTime = GameGlobal.GangBattleModel.GetActiveEndTime();
        if (endTime > 0) {
            this.mTimerStartFlag = true;
        }
        this.durationLab.SetColor(Color.Green);
        this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS);
    };
    GBattleOutsiderScieneWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnTeam:
                if (GameGlobal.GangBattleTeamModel.mTeamInfo.HasTeam()) {
                    ViewManager.ins().open(GBattleTeamPanel);
                }
                else {
                    ViewManager.ins().open(GBattleTeamWin);
                }
                break;
            case this.btnEnter:
                var score = GameGlobal.Config.GuildBattleBaseConfig.t_points;
                if (!GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_OUTSIDER)) {
                    UserTips.ins().showTips("\u51FB\u6740\u5929\u738B\u6216\u73A9\u5BB6\uFF0C\u96C6\u591F" + score + "\u79EF\u5206\u53EF\u8FDB\u5165\u51CC\u5BB5\u6BBF");
                    return;
                }
                GameGlobal.GangBattleModel.SendEnterNext();
                break;
            case this.returnBtn:
                WarnWin.show("是否退出当前副本？", function () {
                    GameGlobal.CommonRaidModel.MapLeave();
                    GameGlobal.GangBattleModel.SendExitGBattle();
                }, this);
                break;
        }
    };
    GBattleOutsiderScieneWin.prototype._OnClicked = function (e) {
        var bossId = parseInt(e.currentTarget.name);
        if (!GameGlobal.GangBattleModel.IsKingAlive(bossId)) {
            UserTips.ins().showTips("BOSS未复活");
            return;
        }
        var bossConf = GangBattleConst.GetKingConfig(bossId);
        GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, (bossConf.pos[0]), (bossConf.pos[1]));
    };
    GBattleOutsiderScieneWin.prototype.SetOtherInfo = function () {
        var memCount = GameGlobal.Config.GuildBattleBaseConfig.t_count;
        this.labTip.text = "\u672C\u5E2E\u8FDB\u5165" + memCount + "\u4EBA\u540E\uFF0C\u5168\u5E2E\u6210\u5458\u53EF\u76F4\u63A5\u8FDB\u5165";
        var myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo;
        var gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo;
        this.labCount.text = "\u540C\u5E2E\u4EBA\u6570\uFF1A" + gbGangGlobalInfo.mPlayerCount;
        this.labScore.text = "\u79EF\u5206\uFF1A" + (myGBattleInfo.mMyGangRankInfo.mScore || 0);
        var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
        var curScore = gbPlayerGlobalInfo.mScore;
        var score = GameGlobal.Config.GuildBattleBaseConfig.t_points;
        var color = curScore >= score ? Color.Green : Color.Red;
        this.labScoreTip.textFlow = TextFlowMaker.generateTextFlow("\u79EF\u5206\uFF1A|C:" + color + "&T:" + curScore + "|/" + score);
        this.labMemberCount.text = "\u6211\u7684\u5E2E\u4F1A\u8FDB\u5165\u6570\uFF1A" + myGBattleInfo.mPassCount;
        this.boxItem.SetScoreInfo();
        var gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || [];
        gRanksInfo.sort(function (lhs, rhs) {
            return lhs.mScoreRank - rhs.mScoreRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gRankInfo = gRanksInfo[idx];
            this["labNum" + (idx + 1)].text = gRankInfo ? "" + (idx + 1) : "";
            this["labName" + (idx + 1)].text = gRankInfo ? gRankInfo.mGangName + ".S" + gRankInfo.mServerId : "";
            this["labCount" + (idx + 1)].text = gRankInfo ? "" + gRankInfo.mPassCount : "";
            this["labData" + (idx + 1)].text = gRankInfo ? "" + gRankInfo.mScore : "";
        }
    };
    GBattleOutsiderScieneWin.prototype.SetBossList = function () {
        var bossList = GangBattleConst.GetKingList();
        var idx = 1;
        for (var _i = 0, bossList_1 = bossList; _i < bossList_1.length; _i++) {
            var bossConf = bossList_1[_i];
            if (this["labBossName" + idx]) {
                this["img" + idx].name = bossConf.id;
                this["labBossName" + idx].text = bossConf.uititle;
                UIHelper.SetLinkStyleLabel(this["labBossName" + idx]);
                this["labDifficulty" + idx].text = "(" + bossConf.des + ")";
                this["labReward" + idx].text = "\u79EF\u5206 * " + bossConf.points;
            }
            idx++;
        }
        this.UpdateKingInfo();
    };
    GBattleOutsiderScieneWin.prototype.UpdateKingInfo = function () {
        var bossList = GangBattleConst.GetKingList();
        var idx = 1;
        for (var _i = 0, bossList_2 = bossList; _i < bossList_2.length; _i++) {
            var bossConf = bossList_2[_i];
            var rebornTime = GameGlobal.GangBattleModel.GetKingRebornTime(bossConf.id);
            this["durationReborn" + idx].visible = rebornTime > GameServer.serverTime;
            if (rebornTime > GameServer.serverTime) {
                this["durationReborn" + idx].SetEndTime(rebornTime, DurationLabel.TIMETEXT_TYPE_ONLYSS);
            }
            idx++;
        }
    };
    GBattleOutsiderScieneWin.prototype.AdaptationGroup = function () {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 300;
    };
    GBattleOutsiderScieneWin.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    GBattleOutsiderScieneWin.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GBattleOutsiderScieneWin;
}(BaseEuiView));
__reflect(GBattleOutsiderScieneWin.prototype, "GBattleOutsiderScieneWin");
//# sourceMappingURL=GBattleOutsiderScieneWin.js.map