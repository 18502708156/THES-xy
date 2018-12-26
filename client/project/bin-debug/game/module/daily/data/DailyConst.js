var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DailyConst = (function () {
    function DailyConst() {
    }
    DailyConst.GetPeaceList = function () {
        var list = [];
        var peaceLists = GameGlobal.Config.DailyBonusConfig[DailyConst.TYPE_PEACE];
        for (var key in peaceLists) {
            var peaceList = peaceLists[key];
            var config = this._GetConfig(peaceList);
            if (config)
                list.push(config);
        }
        return list;
    };
    DailyConst.GetTeamConfig = function () {
        var configList = GameGlobal.Config.DailyBonusConfig[DailyConst.TYPE_TEAM][0];
        return this._GetConfig(configList);
    };
    DailyConst._GetConfig = function (configList) {
        var curPlayerLevel = GameGlobal.actorModel.level;
        for (var key in configList) {
            var config = configList[key];
            if (curPlayerLevel >= config.level[0] && curPlayerLevel <= (config.level[1] || 999))
                return config;
        }
    };
    DailyConst.GetMedalId = function (level) {
        var medalId;
        for (var id in GameGlobal.Config.DailyMedalConfig) {
            var config = GameGlobal.Config.DailyMedalConfig[id];
            if (config.level > level)
                return medalId;
            medalId = config.id;
        }
        return medalId;
    };
    DailyConst.HasPrevMedal = function (medalId) {
        var config = GameGlobal.Config.DailyMedalConfig[medalId - 1];
        return config != null;
    };
    DailyConst.HasNextMedal = function (medalId) {
        var config = GameGlobal.Config.DailyMedalConfig[medalId + 1];
        return config != null;
    };
    DailyConst.GetMaxExpPerDay = function () {
        var exp = 0;
        for (var id in GameGlobal.Config.DailyProgressConfig) {
            var config = GameGlobal.Config.DailyProgressConfig[id];
            exp += config.exp * config.maxtimes;
        }
        return exp;
    };
    DailyConst.GetRetrieveConfig = function (taskId, costType, findType) {
        var config = this._GetRetrieveConfig(taskId, costType, findType);
        if (!config)
            return;
        var curPlayerLevel = GameGlobal.actorModel.level;
        var confList = GameGlobal.Config.DailyLevelRetrieveConfig[config.index];
        for (var key in confList) {
            var retrieveConfig = confList[key];
            if (curPlayerLevel >= retrieveConfig.level[0] && curPlayerLevel <= (retrieveConfig.level[1] || 999)) {
                return retrieveConfig;
            }
        }
    };
    DailyConst.CanMedalUpgrade = function (level, exp) {
        var nextConfig = GameGlobal.Config.DailyAttrsConfig[level + 1];
        if (!nextConfig) {
            return false;
        }
        return nextConfig.proexp <= exp;
    };
    DailyConst.GetMonsterId = function (taskId) {
        var config = GameGlobal.Config.DailyExpDungeonStar[taskId];
        if (!config) {
            return 0;
        }
        return config.showid;
    };
    DailyConst._GetRetrieveConfig = function (taskId, costType, findType) {
        var configList = GameGlobal.Config.DailyRetrieveConfig[taskId][costType];
        for (var key in configList) {
            var config = configList[key];
            if (config.restype == findType)
                return config;
        }
    };
    DailyConst.TYPE_PEACE = 2; //平定安邦
    DailyConst.TYPE_TEAM = 3; //组队历练
    DailyConst.TASK_TYPE_PERSONALBOSS = 1;
    DailyConst.TASK_TYPE_PUBLICBOSS = 2;
    DailyConst.TASK_TYPE_EQUIPSMELT = 3;
    DailyConst.TASK_TYPE_ARENA = 4;
    DailyConst.TASK_TYPE_MATERIALCOPY = 5;
    DailyConst.TASK_TYPE_ESCORT = 6;
    DailyConst.TASK_TYPE_TEAMCOPY = 7;
    DailyConst.TASK_TYPE_PERLOGIN = 8;
    DailyConst.TASK_TYPE_PERCHARGE = 9;
    DailyConst.TASK_RETRIEVE_COST_GOD = 2;
    DailyConst.TASK_RETRIEVE_COST_BINDGOD = 3;
    DailyConst.TASK_RETRIEVE_TYPE_RES = 1;
    DailyConst.TASK_RETRIEVE_TYPE_EXP = 2;
    return DailyConst;
}());
__reflect(DailyConst.prototype, "DailyConst");
//# sourceMappingURL=DailyConst.js.map