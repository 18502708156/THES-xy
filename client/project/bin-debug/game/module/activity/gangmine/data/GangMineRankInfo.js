var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangMineRankInfo = (function () {
    function GangMineRankInfo() {
        /**帮派Id */
        this.guildId = 0;
        /**服务器id */
        this.serverId = 0;
        /**积分 */
        this.score = 0;
        /**排名 */
        this.rank = 0;
    }
    GangMineRankInfo.prototype.updateInfo = function (info) {
        this.guildId = info.guildId;
        this.guildName = info.guildName;
        this.rank = info.rank;
        this.score = info.score;
    };
    /**获取排名奖励 */
    GangMineRankInfo.prototype.getRankReward = function () {
        var config = GameGlobal.Config.RankRewardConfig[this.rankType][this.rank - 1];
        if (config) {
            return config.reward;
        }
        return [];
    };
    return GangMineRankInfo;
}());
__reflect(GangMineRankInfo.prototype, "GangMineRankInfo");
//# sourceMappingURL=GangMineRankInfo.js.map