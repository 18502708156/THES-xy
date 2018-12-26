var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangConst = (function () {
    function GangConst() {
    }
    GangConst.GetMaxMemberCount = function (level) {
        var config = GameGlobal.Config.GuildLevelConfig[level];
        if (!config)
            return 0;
        return config.people || 0;
    };
    GangConst.GetMaxCapital = function (level) {
        var config = GameGlobal.Config.GuildLevelConfig[level];
        if (!config)
            return 0;
        return config.upExp || 0;
    };
    GangConst.GetAuditingRight = function (office) {
        return GameGlobal.Config.GuildConfig.examine[office] != 0;
    };
    GangConst.GetKickOutRight = function (office) {
        return GameGlobal.Config.GuildConfig.expel[office] != 0;
    };
    GangConst.GetModifyNoticeRight = function (office) {
        return GameGlobal.Config.GuildConfig.notice[office] != 0;
    };
    GangConst.sortSkill = function (a, b) {
        if (a.posId > b.posId) {
            return 1;
        }
        else if (a.posId < b.posId) {
            return -1;
        }
        else {
            return 0;
        }
    };
    GangConst.GetFuBenBossSkin = function (fuBenId) {
        return AppearanceConfig.GetUIPath(fuBenId);
    };
    GangConst.GetSkillIcon = function (skillPosId, level) {
        if (level === void 0) { level = 0; }
        var config = GameGlobal.Config.GuildCommonSkillConfig[level][skillPosId];
        if (!config)
            return;
        return ResDataPath.GetItemFullPath(config.icon);
    };
    GangConst.GetProtectorUpgradeExp = function (level) {
        var config = GameGlobal.Config.GuildActiveConfig[level];
        if (!config)
            return -1;
        return config.exp;
    };
    GangConst.IsGangMapAssembledTIme = function () {
        if (!GameGlobal.GangModel.HasGang())
            return false;
        var date = new Date(GameServer.serverTime * 1000);
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var doudleTime = GameGlobal.Config.GuideConfig.doubletime;
        if (!doudleTime)
            return false;
        var strArr = doudleTime.star.split(":");
        var startHour = parseInt(strArr[0]);
        var startMinutes = parseInt(strArr[1]);
        strArr = doudleTime.ends.split(":");
        var endHour = parseInt(strArr[0]);
        var endMinutes = parseInt(strArr[1]);
        if (hour == startHour) {
            return minutes >= startMinutes;
        }
        if (hour == endHour) {
            return minutes <= endMinutes;
        }
        if (hour > startHour && hour < endHour) {
            return true;
        }
        return false;
    };
    GangConst.OFFICE_TO_TEXT = (_a = {},
        _a[0] = "成员",
        _a[1] = "副帮主",
        _a[2] = "帮主",
        _a);
    GangConst.MASTER_OFFICE = 2;
    GangConst.DEPUTY_OFFICE = 1;
    GangConst.MEMBER_OFFICE = 0;
    return GangConst;
}());
__reflect(GangConst.prototype, "GangConst");
var _a;
//# sourceMappingURL=GangConst.js.map