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
var GBattleTempleScieneWin = (function (_super) {
    __extends(GBattleTempleScieneWin, _super);
    function GBattleTempleScieneWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mTimerStartFlag = false;
        _this.skinName = "GBattleTempleSceneSkin";
        UIHelper.SetLinkStyleLabel(_this.labView);
        UIHelper.SetLinkStyleLabel(_this.labViewRank);
        return _this;
    }
    GBattleTempleScieneWin.prototype.OnOpen = function () {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos();
        this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK, this.SetPlayerRankInfo);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration);
        this.observe(MessageDef.GANGBATTLE_SHOW_GUARDTIP, this.SetGuardShowTip);
        this._AddClick(this.btnTeam, this._OnClicked);
        this._AddClick(this.btnReturn, this._OnClicked);
        this._AddClick(this.labView, this._OnClicked);
        this._AddClick(this.labViewRank, this._OnClicked);
        this._AddClick(this.btnArr, this._OnClicked);
        this._AddClick(this.btnInstruction, this._OnClicked);
        this._AddClick(this.btnFight, this._OnClicked);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this.mTimerStartFlag = false;
        this.SetGuardShowTip();
        this.StartDuration();
        this.AdaptationGroup(true);
        this.SetPlayerRankInfo();
        this.SetOtherInfo();
    };
    GBattleTempleScieneWin.prototype.OnClose = function () {
    };
    GBattleTempleScieneWin.prototype.SetGuardShowTip = function () {
        var _this = this;
        var showEndTime = GameGlobal.GangBattleModel.mGuardShowTime;
        if (!showEndTime) {
            return;
        }
        this.durationShowGuard.SetColor(Color.Green);
        this.durationShowGuard.SetTextFormat("{0}后神龙鼎出现");
        this.durationShowGuard.SetCallbackFunc(function () {
            _this.durationShowGuard.visible = false;
        });
        this.durationShowGuard.SetEndTime(showEndTime);
    };
    GBattleTempleScieneWin.prototype.StartDuration = function () {
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
    GBattleTempleScieneWin.prototype.SetPlayerRankInfo = function () {
        var gbPlayerRanksInfo = GameGlobal.GangBattleModel.gbPlayerRanksInfo.mGBPlayerRankInfoList || [];
        gbPlayerRanksInfo.sort(function (lhs, rhs) {
            return lhs.mRankData.mKillRank - rhs.mRankData.mKillRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gbPlayerRankInfo = gbPlayerRanksInfo[idx];
            if (this["roleHead" + (idx + 1)] && gbPlayerRankInfo) {
                this["roleHead" + (idx + 1)].visible = true;
                this["roleHead" + (idx + 1)].SetPlayerInfo(gbPlayerRankInfo, idx + 1);
            }
        }
    };
    GBattleTempleScieneWin.prototype.SetOtherInfo = function () {
        this.boxItem.SetScoreInfo();
        var gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || [];
        gRanksInfo.sort(function (lhs, rhs) {
            return lhs.mScoreRank - rhs.mScoreRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gRankInfo = gRanksInfo[idx];
            this["labNum" + (idx + 1)].text = gRankInfo ? "" + (idx + 1) : "";
            this["labName" + (idx + 1)].text = gRankInfo ? gRankInfo.mGangName + ".S" + gRankInfo.mServerId : "";
            this["labScore" + (idx + 1)].text = gRankInfo ? "" + gRankInfo.mScore : "";
        }
        var gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo;
        this.labCount.text = "\u540C\u5E2E\u4EBA\u6570\uFF1A" + gbGangGlobalInfo.mPlayerCount;
        var myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo;
        // let mScoreText = (myGBattleInfo.mMyGangRankInfo.mScoreRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mScoreRank : "未排名"
        // this.labRange.text = `本帮排名：${mScoreText}     ${myGBattleInfo.mMyGangRankInfo.mScore ? myGBattleInfo.mMyGangRankInfo.mScore : 0}`
        this.labRange.text = "\u672C\u5E2E\u79EF\u5206\uFF1A" + (myGBattleInfo.mMyGangRankInfo.mScore ? myGBattleInfo.mMyGangRankInfo.mScore : 0);
    };
    GBattleTempleScieneWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.btnTeam:
                if (GameGlobal.GangBattleTeamModel.mTeamInfo.HasTeam()) {
                    ViewManager.ins().open(GBattleTeamPanel);
                }
                else {
                    ViewManager.ins().open(GBattleTeamWin);
                }
                break;
            case this.btnReturn:
                ViewManager.ins().open(GBattleExitTipWin);
                break;
            case this.labViewRank:
                ViewManager.ins().openIndex(GBattleRankWin, 2);
                break;
            case this.labView:
                ViewManager.ins().openIndex(GBattleRankWin, 1);
                break;
            case this.btnArr:
                this.ShowRankList(this.btnArr.$getScaleX() != -1);
                break;
            case this.btnInstruction:
                ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.GuildBattleBaseConfig.s_helpid);
                break;
            case this.btnFight:
                var showEndTime = GameGlobal.GangBattleModel.mGuardShowTime;
                if (!showEndTime)
                    return;
                if (showEndTime > GameServer.serverTime) {
                    UserTips.ins().showTips("神龙鼎尚未出现，不可挑战");
                    return;
                }
                var pos = GameGlobal.Config.GuildBattleBaseConfig.lboss_bronpos;
                var bossId = GameGlobal.Config.GuildBattleBaseConfig.lbossid;
                GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, pos[0], pos[1]);
                break;
        }
    };
    GBattleTempleScieneWin.prototype.AdaptationGroup = function (zoomFlag) {
        if (zoomFlag == null)
            return;
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 200;
        this.ShowRankList(!zoomFlag);
    };
    GBattleTempleScieneWin.prototype.ShowRankList = function (isShow) {
        this.btnArr.$setScaleX(isShow ? -1 : 1);
        this.groupRank.visible = isShow;
    };
    GBattleTempleScieneWin.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    GBattleTempleScieneWin.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GBattleTempleScieneWin;
}(BaseEuiView));
__reflect(GBattleTempleScieneWin.prototype, "GBattleTempleScieneWin");
//# sourceMappingURL=GBattleTempleScieneWin.js.map