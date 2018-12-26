var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangMapConst = (function () {
    function GangMapConst() {
    }
    GangMapConst.GetGangMapItemName = function (gmItemId) {
        var config = GameGlobal.Config.GuildGitemConfig[gmItemId];
        if (!config) {
            return "";
        }
        return config.name;
    };
    GangMapConst.GetGangMapEntityId = function (type) {
        var config = this.GetGangMapMonsterConfig(type);
        if (!config)
            return 0;
        return config.pid;
    };
    GangMapConst.GetGangMapTaskId = function (type) {
        for (var key in GameGlobal.Config.GuildMapTaskConfig) {
            var config = GameGlobal.Config.GuildMapTaskConfig[key];
            if (config.type == type) {
                return config.id;
            }
        }
    };
    GangMapConst.GetGangMapMonsterConfig = function (type) {
        var curPlayerLevel = GameGlobal.actorModel.level;
        var monsterConfig;
        for (var key in GameGlobal.Config.GuildMonsterConfig) {
            var configList = GameGlobal.Config.GuildMonsterConfig[key];
            monsterConfig = configList[type];
            if (monsterConfig.level > curPlayerLevel) {
                break;
            }
        }
        return monsterConfig;
    };
    GangMapConst.TYPE_MONSTER = 0;
    GangMapConst.TYPE_PLANT = 1;
    return GangMapConst;
}());
__reflect(GangMapConst.prototype, "GangMapConst");
//# sourceMappingURL=GangMapConst.js.map