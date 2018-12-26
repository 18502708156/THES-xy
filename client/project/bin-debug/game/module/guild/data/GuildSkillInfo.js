var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuildSkillInfo = (function () {
    function GuildSkillInfo() {
        this.level = 0;
        this.exp = 0;
    }
    return GuildSkillInfo;
}());
__reflect(GuildSkillInfo.prototype, "GuildSkillInfo");
//# sourceMappingURL=GuildSkillInfo.js.map