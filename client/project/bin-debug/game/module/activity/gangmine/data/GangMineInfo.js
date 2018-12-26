var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GangMineInfo = (function () {
    function GangMineInfo() {
        /**1=怪物守护， 2=玩家守护者， 3=怪物守护战斗中， 4=玩家守护战斗中， 5=玩家守护战斗过(不可加入)*/
        this.status = 0;
    }
    GangMineInfo.prototype.updateInfo = function (info) {
        this.status = info.status;
        this.mineId = info.mineId;
        if (info.status != 1) {
            this.guildName = info.guildName;
            var i = 0, len = info.guard.length;
            var guardInfo = void 0;
            this.guardList = [];
            for (i; i < len; i++) {
                guardInfo = new GangMineGuardInfo;
                guardInfo.updateInfo(info.guard[i]);
                this.guardList[i] = guardInfo;
            }
        }
    };
    return GangMineInfo;
}());
__reflect(GangMineInfo.prototype, "GangMineInfo");
var GangMineGuardInfo = (function () {
    function GangMineGuardInfo() {
        /**玩家等级 */
        this.level = 0;
        /**玩家战力 */
        this.power = 0;
        /**玩家血条百分比 */
        this.hp = 0;
    }
    GangMineGuardInfo.prototype.updateInfo = function (info) {
        this.name = info.name;
        this.hp = info.hp;
        this.level = info.level;
        this.power = info.power;
        this.job = info.job;
        this.sex = info.sex;
    };
    return GangMineGuardInfo;
}());
__reflect(GangMineGuardInfo.prototype, "GangMineGuardInfo");
//# sourceMappingURL=GangMineInfo.js.map