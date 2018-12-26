var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuildRoleSkillInfo = (function () {
    function GuildRoleSkillInfo() {
        this.guildSkillInfo = [];
        this.practiceSkillInfo = [];
    }
    GuildRoleSkillInfo.prototype.GetSkillInfo = function (type) {
        if (type == GuildSkillType.NORMAL) {
            return this.guildSkillInfo;
        }
        return this.practiceSkillInfo;
    };
    GuildRoleSkillInfo.prototype.GetSkillInfoByIndex = function (type, index) {
        var data = this.GetSkillInfo(type);
        if (data) {
            return data[index];
        }
        return null;
    };
    return GuildRoleSkillInfo;
}());
__reflect(GuildRoleSkillInfo.prototype, "GuildRoleSkillInfo");
//# sourceMappingURL=GuildRoleSkillInfo.js.map