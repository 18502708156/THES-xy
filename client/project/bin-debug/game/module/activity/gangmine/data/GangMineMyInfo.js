var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangMineMyInfo = (function () {
    function GangMineMyInfo() {
        /**1=采矿中，2=空闲*/
        this.status = 0;
        /**下次进攻时间 */
        this.attackTime = 0;
        /**连锁加成 */
        this.chainrate = 0;
        /**下次采集时间 */
        this.gatherTime = 0;
        /**本帮积分 */
        this.score = 0;
        /**本帮排名 */
        this.rank = 0;
    }
    GangMineMyInfo.prototype.updateInfo = function (info) {
        this.status = info.status;
        this.attackTime = info.attackTime;
        this.chainrate = info.chainrate;
        this.gatherTime = info.gatherTime;
        this.mineId = info.mineId;
        this.score = info.guildScore;
        this.rank = info.guildRank;
    };
    return GangMineMyInfo;
}());
__reflect(GangMineMyInfo.prototype, "GangMineMyInfo");
//# sourceMappingURL=GangMineMyInfo.js.map