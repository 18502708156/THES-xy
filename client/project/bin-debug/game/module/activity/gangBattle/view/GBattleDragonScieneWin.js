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
var GBattleDragonScieneWin = (function (_super) {
    __extends(GBattleDragonScieneWin, _super);
    function GBattleDragonScieneWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mTimerStartFlag = false;
        _this.skinName = "GBattleDragonSceneSkin";
        UIHelper.SetLinkStyleLabel(_this.labView);
        UIHelper.SetLinkStyleLabel(_this.labViewRank);
        return _this;
    }
    GBattleDragonScieneWin.prototype.OnOpen = function () {
        GameGlobal.GangBattleTeamModel.SendGetMyTeamInfos();
        this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, this.SetBossInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, this.SetOtherInfo);
        this.observe(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK, this.SetPlayerRankInfo);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, this.StartDuration);
        this._AddClick(this.btnEnter, this._OnClicked);
        this._AddClick(this.btnTeam, this._OnClicked);
        this._AddClick(this.btnReturn, this._OnClicked);
        this._AddClick(this.labViewRank, this._OnClicked);
        this._AddClick(this.labView, this._OnClicked);
        this._AddClick(this.btnArr, this._OnClicked);
        this._AddClick(this.btnFight, this._OnClicked);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this.mTimerStartFlag = false;
        this.StartDuration();
        this.AdaptationGroup(true);
        this.SetPlayerRankInfo();
        this.SetOtherInfo();
        this.SetBossInfo();
    };
    GBattleDragonScieneWin.prototype.OnClose = function () {
    };
    GBattleDragonScieneWin.prototype.StartDuration = function () {
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
    GBattleDragonScieneWin.prototype.SetPlayerRankInfo = function () {
        var gbPlayerRanksInfo = GameGlobal.GangBattleModel.gbPlayerRanksInfo.mGBPlayerRankInfoList || [];
        gbPlayerRanksInfo.sort(function (lhs, rhs) {
            return lhs.mRankData.mDamageRank - rhs.mRankData.mDamageRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gbPlayerRankInfo = gbPlayerRanksInfo[idx];
            if (this["roleHead" + (idx + 1)] && gbPlayerRankInfo) {
                this["roleHead" + (idx + 1)].visible = true;
                this["roleHead" + (idx + 1)].SetPlayerInfo(gbPlayerRankInfo, idx + 1);
            }
        }
    };
    GBattleDragonScieneWin.prototype.SetOtherInfo = function () {
        var gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || [];
        gRanksInfo.sort(function (lhs, rhs) {
            return lhs.mDamageRank - rhs.mDamageRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gRankInfo = gRanksInfo[idx];
            this["labNum" + (idx + 1)].text = gRankInfo ? "" + (idx + 1) : "";
            this["labName" + (idx + 1)].text = gRankInfo ? gRankInfo.mGangName + ".S" + gRankInfo.mServerId : "";
            this["labData" + (idx + 1)].text = gRankInfo ? "" + gRankInfo.mDamage : "";
        }
        var gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo;
        this.labCount.text = "\u540C\u5E2E\u4EBA\u6570\uFF1A" + gbGangGlobalInfo.mPlayerCount;
        var myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo;
        var damageRankText = (myGBattleInfo.mMyGangRankInfo.mDamageRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mDamageRank : "未排名";
        this.labRange.text = "\u672C\u5E2E\u6392\u540D\uFF1A" + damageRankText + "     " + (myGBattleInfo.mMyGangRankInfo.mDamage ? myGBattleInfo.mMyGangRankInfo.mDamage : 0);
        this.boxItem.SetScoreInfo();
    };
    GBattleDragonScieneWin.prototype.SetBossInfo = function () {
        this.groupBossBlood.visible = !GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON);
        var bossInfo = GameGlobal.GangBattleModel.bossInfo;
        this.progBlood.maximum = 100;
        this.progBlood.value = bossInfo.mHp;
        this.progBloodNum.text = bossInfo.mHp + "%";
        this.progDef.maximum = 100;
        this.progDef.value = bossInfo.mDefend;
        this.durationDefCD.visible = bossInfo.mDefend == 0;
        this.progDefNum.visible = bossInfo.mDefend > 0;
        this.progDefNum.text = bossInfo.mDefend + "%";
        this.durationDefCD.SetTextFormat("{0}后护盾恢复");
        this.durationDefCD.SetEndTime(bossInfo.mRecoveryTime, DurationLabel.TIMETEXT_TYPE_MMSS);
    };
    GBattleDragonScieneWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.btnEnter:
                if (!GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)) {
                    UserTips.ins().showTips("击杀神龙后，伤害前三名的帮会才能进入神龙殿");
                    return;
                }
                ViewManager.ins().open(GBattleEnterTempleTipWin);
                break;
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
                ViewManager.ins().open(GBattleRankWin);
                break;
            case this.labView:
                ViewManager.ins().openIndex(GBattleRankWin, 1);
                break;
            case this.btnArr:
                this.ShowRankList(this.btnArr.$getScaleX() != -1);
                break;
            case this.btnFight:
                if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_DRAGON)) {
                    UserTips.ins().showTips("BOSS已经死亡");
                    return;
                }
                var pos = GameGlobal.Config.GuildBattleBaseConfig.sboss_bronpos;
                var bossId = GameGlobal.Config.GuildBattleBaseConfig.sbossid;
                GameGlobal.RaidMgr.mMapRaid.MoveOrder(bossId, pos[0], pos[1]);
                break;
        }
    };
    GBattleDragonScieneWin.prototype.AdaptationGroup = function (zoomFlag) {
        if (zoomFlag == null)
            return;
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 280;
        this.ShowRankList(!zoomFlag);
    };
    GBattleDragonScieneWin.prototype.ShowRankList = function (isShow) {
        this.btnArr.$setScaleX(isShow ? -1 : 1);
        this.groupRank.visible = isShow;
    };
    GBattleDragonScieneWin.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    GBattleDragonScieneWin.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GBattleDragonScieneWin;
}(BaseEuiView));
__reflect(GBattleDragonScieneWin.prototype, "GBattleDragonScieneWin");
//# sourceMappingURL=GBattleDragonScieneWin.js.map