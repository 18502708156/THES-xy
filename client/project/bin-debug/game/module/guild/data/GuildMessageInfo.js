var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuildMessageInfo = (function () {
    function GuildMessageInfo() {
        this.time = 0;
    }
    GuildMessageInfo.prototype.parserMessage = function (bytes) {
        this.type = bytes.type;
        this.content = bytes.content;
        //帮会聊天才有一下内容
        if (this.type == 1) {
            this.roleId = bytes.playerid;
            this.name = bytes.name;
            this.job = bytes.job;
            this.sex = bytes.sex;
            this.vip = bytes.vip;
            this.office = bytes.office;
            this.time = bytes.time || 0;
        }
    };
    ;
    return GuildMessageInfo;
}());
__reflect(GuildMessageInfo.prototype, "GuildMessageInfo");
//# sourceMappingURL=GuildMessageInfo.js.map