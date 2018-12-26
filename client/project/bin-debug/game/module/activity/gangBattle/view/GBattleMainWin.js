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
var GBattleMainWin = (function (_super) {
    __extends(GBattleMainWin, _super);
    function GBattleMainWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mTimerStartFlag = false;
        _this.skinName = "GBattleGateSkin";
        _this.commonWindowBg.SetTitle("南天门");
        UIHelper.SetLinkStyleLabel(_this.labDetail);
        UIHelper.SetLinkStyleLabel(_this.labJoinGang);
        _this._AddClick(_this.labJoinGang, _this._OnClick);
        _this._AddClick(_this.labDetail, _this._OnClick);
        _this._AddClick(_this.btnEnter, _this._OnClick);
        _this._AddClick(_this.btnReturn, _this._OnClick);
        _this._AddClick(_this.btnShowAward, _this._OnClick);
        _this.observe(MessageDef.GANGBATTLE_UPDATE_BOSSINFO, _this.SetBossInfo);
        _this.observe(MessageDef.GANGBATTLE_UPDATE_MYINFO, _this.SetOpenInfo);
        _this.observe(MessageDef.GANGBATTLE_UPDATE_GANGRANK, _this.SetOpenInfo);
        _this.observe(MessageDef.GANGBATTLE_ENTER_NEXT_GATE, _this.JumpToNext);
        _this.observe(MessageDef.GANGBATTLE_UPDATE_DURATION, _this.StartDuration);
        return _this;
    }
    GBattleMainWin.prototype.childrenCreated = function () {
    };
    GBattleMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BATTLE];
        this.UpdateContent();
    };
    GBattleMainWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    GBattleMainWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.labJoinGang:
                ViewManager.ins().open(GBattleJoinTipWin);
                break;
            case this.labDetail:
                ViewManager.ins().open(ActivityDescPanel, GameGlobal.Config.GuildBattleBaseConfig.n_helpid);
                break;
            case this.btnEnter:
                if (!GameGlobal.GangBattleModel.IsActive()) {
                    UserTips.ins().showTips("活动未开启");
                    return;
                }
                if (GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE)) {
                    GameGlobal.GangBattleModel.SendEnterNext();
                }
                else {
                    if (!GameGlobal.GangBattleModel.CanAttack()) {
                        UserTips.ins().showTips("攻击CD未结束");
                        return;
                    }
                    GameGlobal.GangBattleModel.SendAttackBoss(null);
                }
                break;
            case this.btnReturn:
                if (GameGlobal.GangBattleModel.IsActive()) {
                    GameGlobal.GangBattleModel.SendExitGBattle();
                }
                this.CloseSelf();
                break;
            case this.btnShowAward:
                ActivityRewardShowWin.Open(ActivityModel.TYPE_GANG_BATTLE);
                break;
        }
    };
    GBattleMainWin.prototype.JumpToNext = function () {
        this.CloseSelf();
    };
    GBattleMainWin.prototype.StartDuration = function () {
        if (this.mTimerStartFlag) {
            return;
        }
        if (GameGlobal.GangBattleModel.IsActive()) {
            var endTime = GameGlobal.GangBattleModel.GetActiveEndTime();
            if (endTime > 0) {
                this.mTimerStartFlag = true;
            }
            this.durationLab.SetColor(Color.Green);
            this.durationLab.SetEndTime(endTime, DurationLabel.TIMETEXT_TYPE_MMSS);
        }
    };
    GBattleMainWin.prototype.UpdateContent = function () {
        this.StartDuration();
        this.SetUnopenInfo();
        this.SetOpenInfo();
        this.SetBossInfo();
    };
    GBattleMainWin.prototype.SetUnopenInfo = function () {
        if (GameGlobal.GangBattleModel.IsActive())
            return;
        this.labDesc.text = GameGlobal.Config.GuildBattleBaseConfig.helpdes;
        var championInfo = GameGlobal.GangBattleModel.mChampionInfo;
        this.labMasterName.text = (championInfo && championInfo.leaderName) ? championInfo.leaderName + ".s" + championInfo.serverId : "暂无";
        this.labGangName.text = (championInfo && championInfo.guildName) ? "(" + championInfo.guildName + ")" : "";
        var rewards = GameGlobal.Config.GuildBattleBaseConfig.n_showItem;
        var idx = 1;
        for (var _i = 0, rewards_1 = rewards; _i < rewards_1.length; _i++) {
            var reward = rewards_1[_i];
            var itemName = "item" + idx;
            if (this[itemName]) {
                this[itemName].visible = true;
                this[itemName].setItemAward(reward.type, reward.id, reward.count);
            }
            idx++;
        }
    };
    GBattleMainWin.prototype.SetOpenInfo = function () {
        var _this = this;
        this.groupUnopen.visible = !GameGlobal.GangBattleModel.IsActive();
        this.groupOpen.visible = GameGlobal.GangBattleModel.IsActive();
        this.labBrokenTip.visible = GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE);
        this.btnEnter.label = GameGlobal.GangBattleModel.IsActive() ? "攻 门" : "未开启";
        this.btnEnter.label = GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE) ? "进入殿前" : this.btnEnter.label;
        if (!GameGlobal.GangBattleModel.IsActive()) {
            return;
        }
        if (GameGlobal.GangBattleModel.CanAttack() || GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE)) {
            this.durationAtkCD.visible = false;
        }
        else {
            var atkEndTime = GameGlobal.GangBattleModel.myGBattleInfo.mAttackTime;
            this.durationAtkCD.SetColor(0x6e330b);
            this.durationAtkCD.SetTextFormat("{0}后可攻击");
            this.durationAtkCD.SetEndTime(atkEndTime, DurationLabel.TIMETEXT_TYPE_MMSS);
            this.durationAtkCD.SetCallbackFunc(function () {
                _this.durationAtkCD.visible = false;
            });
        }
        var gRanksInfo = GameGlobal.GangBattleModel.gRanksInfo.mGangRankInfoList || [];
        gRanksInfo.sort(function (lhs, rhs) {
            return lhs.mDamageRank - rhs.mDamageRank;
        });
        for (var idx = 0; idx < 3; idx++) {
            var gRankInfo = gRanksInfo[idx];
            this["labName" + (idx + 1)].text = gRankInfo ? idx + 1 + "." + gRankInfo.mGangName + ".S" + gRankInfo.mServerId : "";
            this["labData" + (idx + 1)].text = gRankInfo ? "" + gRankInfo.mDamage : "";
        }
        var gbGangGlobalInfo = GameGlobal.GangBattleModel.gbGangGlobalInfo;
        this.labCount.text = "\u540C\u5E2E\u4EBA\u6570\uFF1A" + gbGangGlobalInfo.mPlayerCount;
        var myGBattleInfo = GameGlobal.GangBattleModel.myGBattleInfo;
        var rankText = (myGBattleInfo.mMyGangRankInfo.mDamageRank || 0) > 0 ? myGBattleInfo.mMyGangRankInfo.mDamageRank : "未排名";
        this.labMyRank.text = "\u672C\u5E2E\u6392\u540D\uFF1A" + rankText + "    " + (myGBattleInfo.mMyGangRankInfo.mDamage || 0);
    };
    GBattleMainWin.prototype.SetBossInfo = function () {
        if (!GameGlobal.GangBattleModel.IsActive()) {
            return;
        }
        this.groupGateBlood.visible = !GameGlobal.GangBattleModel.IsBroken(GangBattleModel.ACTIVE_TYPE_GATE);
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
    GBattleMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GBattleMainWin;
}(BaseEuiView));
__reflect(GBattleMainWin.prototype, "GBattleMainWin", ["ICommonWindow"]);
//# sourceMappingURL=GBattleMainWin.js.map