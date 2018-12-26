var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyGangInfo = (function () {
    function MyGangInfo() {
        this.mGangId = 0;
        this.mLevel = 0;
        this.mMemberCount = 0;
        this.mGangName = "";
        this.mGangMasterName = "";
        this.mNeedPower = 0;
        this.mTotalPower = 0;
        this.mCapital = 0;
        this.mNotice = "";
        this.mAutoJoin = 0;
        this.mOffice = 0;
        this.mCurContribute = 0;
        this.mContribute = 0;
    }
    MyGangInfo.prototype.UpdateInfo = function (info, otherInfo) {
        if (!info) {
            return;
        }
        this.mGangId = info.id;
        this.mLevel = otherInfo.level;
        this.mMemberCount = info.playercount;
        this.mGangName = info.name;
        this.mGangMasterName = info.leaderinfo.playername;
        this.mTotalPower = info.totalpower;
        this.mCapital = otherInfo.fund;
        this.mNotice = otherInfo.notice;
        this.mAutoJoin = otherInfo.autoJoin;
        this.mNeedPower = otherInfo.needPower;
    };
    MyGangInfo.prototype.UpdateOtherInfo = function (info) {
        this.mOffice = info.office;
        this.mCurContribute = info.curcontribute;
        this.mContribute = info.contribute;
    };
    MyGangInfo.prototype.UpdateAutoJoinInfo = function (autoJoin, needPower) {
        this.mAutoJoin = autoJoin;
        this.mNeedPower = needPower;
    };
    return MyGangInfo;
}());
__reflect(MyGangInfo.prototype, "MyGangInfo");
var GangInfo = (function () {
    function GangInfo() {
    }
    GangInfo.prototype.UpdateInfo = function (info, idx) {
        if (idx === void 0) { idx = 0; }
        this.mGangId = info.id;
        this.mLevel = info.level;
        this.mMemberCount = info.playercount;
        this.mGangName = info.name;
        this.mGangMasterName = info.leaderinfo.playername;
        this.mNeedPower = info.needPower;
        this.mTotalPower = info.totalpower;
        this.mSex = info.leaderinfo.sex;
        this.mJob = info.leaderinfo.job;
        this.mIdx = idx;
    };
    return GangInfo;
}());
__reflect(GangInfo.prototype, "GangInfo");
var GangMemberInfo = (function () {
    function GangMemberInfo() {
    }
    GangMemberInfo.prototype.UpdateInfo = function (info) {
        this.mPlayerId = info.playerid;
        this.mPlayerName = info.playername;
        this.mOffice = info.office;
        this.mJob = info.job;
        this.mSex = info.sex;
        this.mVipLevel = info.vip;
        this.mContribute = info.contribute;
        this.mTodayContribute = info.todayContri;
        this.mPower = info.power;
        this.mLogoutTime = info.logouttime;
    };
    return GangMemberInfo;
}());
__reflect(GangMemberInfo.prototype, "GangMemberInfo");
var ApplicantInfo = (function () {
    function ApplicantInfo() {
    }
    ApplicantInfo.prototype.UpdateInfo = function (info) {
        this.mPlayerId = info.playerid;
        this.mVipLevel = info.vip;
        this.mJob = info.job;
        this.mSex = info.sex;
        this.mPower = info.power;
        this.mPlayerName = info.playername;
        this.mLevel = info.level;
        this.mLogoutTime = info.logouttime;
    };
    return ApplicantInfo;
}());
__reflect(ApplicantInfo.prototype, "ApplicantInfo");
var GangSkillInfo = (function () {
    function GangSkillInfo() {
    }
    GangSkillInfo.prototype.UpdateInfo = function (info) {
        this.mPosId = info.posId;
        this.mLevel = info.level;
    };
    GangSkillInfo.prototype.CanUpgrade = function () {
        var config = GameGlobal.Config.GuildCommonSkillConfig[this.mLevel + 1];
        if (!config)
            return false;
        var levelConfig = config[this.mPosId];
        if (!levelConfig || !levelConfig.cost)
            return false;
        var cost = levelConfig.cost;
        return Checker.Money(cost.id, cost.count, false);
    };
    return GangSkillInfo;
}());
__reflect(GangSkillInfo.prototype, "GangSkillInfo");
var GangProtectorInfo = (function () {
    function GangProtectorInfo() {
        this.todayActive = 0; //0 : integer		#当天活跃度
        this.totalActive = 0; //1 : integer		#总活跃度
        this.protectorLv = 0; //2 : integer		#守护兽等级
    }
    GangProtectorInfo.prototype.parser = function (info) {
        this.todayActive = info.todayActive || 0;
        this.totalActive = info.totalActive || 0;
        this.protectorLv = info.protectorLv || 0;
        this.rewardMark = info.rewardMark;
    };
    return GangProtectorInfo;
}());
__reflect(GangProtectorInfo.prototype, "GangProtectorInfo");
var GangBossInfo = (function () {
    function GangBossInfo() {
    }
    GangBossInfo.prototype.UpdateInfo = function (info) {
        this.mStatus = info.status;
        this.mHasAward = info.canreward;
    };
    return GangBossInfo;
}());
__reflect(GangBossInfo.prototype, "GangBossInfo");
var GangRecordInfo = (function () {
    function GangRecordInfo() {
        this.chatRecords = [];
        this.historyRecords = [];
    }
    GangRecordInfo.prototype.addRecordToString = function (rsp) {
        if (rsp.type == GangRecordInfo.History) {
            this.historyRecords.unshift(rsp.historyRecord);
        }
        else if (rsp.type == GangRecordInfo.History) {
            this.chatRecords.unshift(rsp.chatRecord);
        }
    };
    GangRecordInfo.prototype.getTypeName = function (type, time, name) {
        var str = "";
        var color = "|C:0x019704&T:";
        var colorRed = "|C:0xdb0000&T:";
        var milliSeconds = time * 1000;
        var date = new Date(milliSeconds);
        var hstr = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var mstr = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        str = (date.getMonth() + 1) + '月' + date.getDate() + '日' + hstr + ':' + mstr;
        str += "   [|C:0x2f6ff6&T:" + name + "|] ";
        switch (type) {
            case 1:
                str += color + "加入了| 帮会";
                break;
            case 2:
                str += color + "离开了| 帮会";
                break;
            case 3:
                str += colorRed + "被踢出了| 帮会";
                break;
            case 4:
                str += "被任命为副会长";
                break;
            case 5:
                str += "成为新的会长";
                break;
        }
        return str;
    };
    GangRecordInfo.History = 1; //帮会记录
    GangRecordInfo.Chat = 2; //聊天
    return GangRecordInfo;
}());
__reflect(GangRecordInfo.prototype, "GangRecordInfo");
//# sourceMappingURL=GangInfo.js.map