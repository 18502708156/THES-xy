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
var GangBattleRankInfo = (function () {
    function GangBattleRankInfo() {
    }
    GangBattleRankInfo.prototype.UpdateInfo = function (info) {
        if (!info)
            return;
        this.mDamage = info.injure;
        this.mDamageRank = info.injureRank;
        this.mHoldtracks = info.holdtracks;
        this.mHoldtracksRank = info.holdtracksRank;
        this.mScore = info.score;
        this.mScoreRank = info.scoreRank;
        this.mKill = info.kill;
        this.mKillRank = info.killRank;
    };
    return GangBattleRankInfo;
}());
__reflect(GangBattleRankInfo.prototype, "GangBattleRankInfo");
var MyGangBattleInfo = (function () {
    function MyGangBattleInfo() {
        this.mGBRankInfo = new GangBattleRankInfo;
        this.mMemberCount = 0;
        this.mPassCount = 0;
        this.mMyGangRankInfo = new GangBattleRankInfo;
    }
    MyGangBattleInfo.prototype.UpdateInfo = function (info) {
        this.mGateId = info.barrierId;
        this.mBrokenFlag = info.through;
        this.mRebornTime = info.reborntime;
        this.mAttackTime = info.attacktime || 0;
        this.mGBRankInfo.UpdateInfo(info.rankData);
    };
    MyGangBattleInfo.prototype.UpdateGangInfo = function (info) {
        this.mMemberCount = info.playerNum || this.mMemberCount;
        this.mPassCount = info.throughNum || this.mPassCount;
        this.mMyGangRankInfo.UpdateInfo(info.rankData);
    };
    MyGangBattleInfo.prototype.UpdateGateInfo = function (info) {
        this.mCurGatePlayerCount = info.playerNum;
    };
    return MyGangBattleInfo;
}());
__reflect(MyGangBattleInfo.prototype, "MyGangBattleInfo");
var GangBattleBossInfo = (function () {
    function GangBattleBossInfo() {
    }
    GangBattleBossInfo.prototype.UpdateInfo = function (info) {
        this.mGateId = info.barrierId;
        this.mDefend = info.shield;
        this.mHp = info.hp;
        this.mRecoveryTime = info.recovertime;
    };
    return GangBattleBossInfo;
}());
__reflect(GangBattleBossInfo.prototype, "GangBattleBossInfo");
var GangBattleKingInfo = (function () {
    function GangBattleKingInfo() {
    }
    GangBattleKingInfo.prototype.UpdateInfo = function (info) {
        this.mBossId = info.bossid;
        this.mRebornTime = info.reborntime || 0;
    };
    return GangBattleKingInfo;
}());
__reflect(GangBattleKingInfo.prototype, "GangBattleKingInfo");
var GuardInfo = (function () {
    function GuardInfo() {
    }
    GuardInfo.prototype.UpdateInfo = function (info) {
        this.mName = info.name;
        this.mGangName = info.guildName;
        this.mJob = info.job;
        this.mSex = info.sex;
        this.mServerId = info.serverId;
    };
    return GuardInfo;
}());
__reflect(GuardInfo.prototype, "GuardInfo");
var GuardsInfo = (function () {
    function GuardsInfo() {
    }
    GuardsInfo.prototype.UpdataInfo = function (info) {
        this.mGuardType = info.guardtype; //0:怪物 1:玩家
        this.mHoldTime = info.holdtime;
        this.mResistCount = info.resistNum;
        this.mHp = info.hp;
        this.mGangId = info.ownerGuildId;
        if (this.mGuardType == 1) {
            this.mGuardList = new Array();
            for (var _i = 0, _a = info.guardinfos; _i < _a.length; _i++) {
                var guardInfo = _a[_i];
                var tempGuardInfo = new GuardInfo;
                tempGuardInfo.UpdateInfo(guardInfo);
                this.mGuardList.push(tempGuardInfo);
            }
        }
    };
    return GuardsInfo;
}());
__reflect(GuardsInfo.prototype, "GuardsInfo");
var GangRankInfo = (function (_super) {
    __extends(GangRankInfo, _super);
    function GangRankInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GangRankInfo.prototype.UpdateGRankInfo = function (info) {
        this.UpdateInfo(info.rankData);
        this.mGangId = info.guildId;
        this.mGangName = info.guildName;
        this.mServerId = info.serverId;
        this.mPassCount = info.throughNum;
    };
    return GangRankInfo;
}(GangBattleRankInfo));
__reflect(GangRankInfo.prototype, "GangRankInfo");
var GangRanksInfo = (function () {
    function GangRanksInfo() {
    }
    GangRanksInfo.prototype.UpdateInfo = function (info) {
        this.mGateId = info.barrierId;
        this.mGangRankInfoList = new Array();
        for (var _i = 0, _a = info.guildinfos; _i < _a.length; _i++) {
            var gRankInfo = _a[_i];
            var tempGRankInfo = new GangRankInfo;
            tempGRankInfo.UpdateGRankInfo(gRankInfo);
            this.mGangRankInfoList.push(tempGRankInfo);
        }
    };
    return GangRanksInfo;
}());
__reflect(GangRanksInfo.prototype, "GangRanksInfo");
var GBattlePlayerGlobalInfo = (function () {
    function GBattlePlayerGlobalInfo() {
    }
    GBattlePlayerGlobalInfo.prototype.UpdateInfo = function (info) {
        this.mRebornTime = info.reborntime;
        this.mScore = info.score;
        this.mScoreRank = info.scoreRank;
        this.mKill = info.kill;
        this.mKillRank = info.killRank;
        this.mScoreReward = info.rewardMark;
        this.mEndTime = info.endtime;
        this.mWorldLevel = info.worldlevel;
    };
    return GBattlePlayerGlobalInfo;
}());
__reflect(GBattlePlayerGlobalInfo.prototype, "GBattlePlayerGlobalInfo");
var GBattlePlayerRankInfo = (function () {
    function GBattlePlayerRankInfo() {
        this.mRankData = new GangBattleRankInfo;
    }
    GBattlePlayerRankInfo.prototype.UpdateInfo = function (info) {
        this.mPlayerId = info.dbid;
        this.mName = info.name;
        this.mJob = info.job;
        this.mSex = info.sex;
        this.mServerId = info.serverId;
        this.mGangName = info.guildName;
        this.mRankData.UpdateInfo(info.rankData);
    };
    return GBattlePlayerRankInfo;
}());
__reflect(GBattlePlayerRankInfo.prototype, "GBattlePlayerRankInfo");
var GBattlePlayerRanksInfo = (function () {
    function GBattlePlayerRanksInfo() {
    }
    GBattlePlayerRanksInfo.prototype.UpdateInfo = function (info) {
        this.mGateId = info.barrierId;
        this.mGBPlayerRankInfoList = new Array();
        for (var _i = 0, _a = info.rankInfos; _i < _a.length; _i++) {
            var gbPlayerRankInfo = _a[_i];
            var tempgbPlayerRankInfo = new GBattlePlayerRankInfo;
            tempgbPlayerRankInfo.UpdateInfo(gbPlayerRankInfo);
            this.mGBPlayerRankInfoList.push(tempgbPlayerRankInfo);
        }
    };
    return GBattlePlayerRanksInfo;
}());
__reflect(GBattlePlayerRanksInfo.prototype, "GBattlePlayerRanksInfo");
var GBattleGangGlobalInfo = (function () {
    function GBattleGangGlobalInfo() {
    }
    GBattleGangGlobalInfo.prototype.UnpdateInfo = function (info) {
        this.mPlayerCount = info.playerNum;
        this.mScore = info.score;
        this.mScoreRank = info.scoreRank;
    };
    return GBattleGangGlobalInfo;
}());
__reflect(GBattleGangGlobalInfo.prototype, "GBattleGangGlobalInfo");
//# sourceMappingURL=GangBattleInfo.js.map