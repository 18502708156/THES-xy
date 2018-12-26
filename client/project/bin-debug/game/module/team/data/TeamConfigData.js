var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuildTeamConfigData = (function () {
    function GuildTeamConfigData() {
    }
    GuildTeamConfigData.prototype.Init = function (config) {
        this.config = config;
    };
    GuildTeamConfigData.prototype.GetFirstDropShow = function () {
        return this.config.firstdropshow;
    };
    GuildTeamConfigData.prototype.GetDropShow = function () {
        return this.config.dropshow;
    };
    GuildTeamConfigData.prototype.GetShowItem = function () {
        return this.config.showItem;
    };
    GuildTeamConfigData.prototype.GetSuggest = function () {
        return this.config.suggest;
    };
    GuildTeamConfigData.prototype.GetUititle = function () {
        return this.config.uititle;
    };
    GuildTeamConfigData.prototype.GetBossId = function () {
        return this.config.bossid;
    };
    GuildTeamConfigData.prototype.GetKey = function () {
        return this.config.id;
    };
    return GuildTeamConfigData;
}());
__reflect(GuildTeamConfigData.prototype, "GuildTeamConfigData", ["TeamConfigData"]);
var CrossTeamConfigData = (function () {
    function CrossTeamConfigData() {
    }
    CrossTeamConfigData.prototype.Init = function (config) {
        this.config = config;
    };
    CrossTeamConfigData.prototype.GetFirstDropShow = function () {
        return this.config.firstRewards;
    };
    CrossTeamConfigData.prototype.GetDropShow = function () {
        return this.config.normalRewards;
    };
    CrossTeamConfigData.prototype.GetShowItem = function () {
        return this.config.luckRewards;
    };
    CrossTeamConfigData.prototype.GetSuggest = function () {
        return 0;
    };
    CrossTeamConfigData.prototype.GetUititle = function () {
        // return this.config.level + "级副本"
        return this.config.uititle;
    };
    CrossTeamConfigData.prototype.GetBossId = function () {
        return this.config.bossid;
    };
    CrossTeamConfigData.prototype.GetKey = function () {
        return this.config.level;
    };
    return CrossTeamConfigData;
}());
__reflect(CrossTeamConfigData.prototype, "CrossTeamConfigData", ["TeamConfigData"]);
//# sourceMappingURL=TeamConfigData.js.map