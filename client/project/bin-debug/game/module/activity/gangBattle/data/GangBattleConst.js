var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangBattleConst = (function () {
    function GangBattleConst() {
    }
    Object.defineProperty(GangBattleConst, "level", {
        set: function (level) {
            this.mLevel = Math.max(level, 1);
        },
        enumerable: true,
        configurable: true
    });
    GangBattleConst.GetKingList = function () {
        var list = [];
        for (var key in GameGlobal.Config.GuildBattleKingConfig) {
            var configList = GameGlobal.Config.GuildBattleKingConfig[key];
            var config = this._GetConfig(configList);
            if (config)
                list.push(config);
        }
        return list;
    };
    GangBattleConst.GetKingConfig = function (kingId) {
        return this._GetConfig(GameGlobal.Config.GuildBattleKingConfig[kingId]);
    };
    GangBattleConst.GetScoreList = function () {
        var list = [];
        for (var key in GameGlobal.Config.GuildBattleRewardsConfig) {
            var configList = GameGlobal.Config.GuildBattleRewardsConfig[key];
            var config = this._GetConfig(configList);
            if (config)
                list.push(config);
        }
        return list;
    };
    GangBattleConst.GetScoreConfig = function (scoreId) {
        return this._GetConfig(GameGlobal.Config.GuildBattleRewardsConfig[scoreId]);
    };
    GangBattleConst._GetConfig = function (configList) {
        var config;
        for (var level in configList) {
            if (this.mLevel >= parseInt(level)) {
                config = configList[level];
            }
            else {
                break;
            }
        }
        return config;
    };
    GangBattleConst.mLevel = 10;
    return GangBattleConst;
}());
__reflect(GangBattleConst.prototype, "GangBattleConst");
//# sourceMappingURL=GangBattleConst.js.map