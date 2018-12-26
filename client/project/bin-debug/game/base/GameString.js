var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameString = (function () {
    function GameString() {
    }
    GameString.GetLvName = function (zsLevel, level) {
        if (zsLevel > 0) {
            return zsLevel + "\u9636" + level + "\u7EA7";
        }
        return level + "\u7EA7";
    };
    GameString.GetLvName2 = function (zsLevel, level) {
        if (zsLevel === void 0) { zsLevel = 0; }
        if (level === void 0) { level = 0; }
        if (zsLevel > 0) {
            return zsLevel + "\u9636";
        }
        return level + "\u7EA7";
    };
    GameString.GetThirdPerson = function (sex) {
        if (sex == 0) {
            return "他";
        }
        return "她";
    };
    GameString.GetSerAndName = function (serverId, name) {
        if (serverId) {
            return name + ".S" + serverId;
        }
        return name;
    };
    GameString.GetSer = function (serverId) {
        return "S" + serverId;
    };
    // 获取时间
    // {"*.*.*-21:00 ^ *.*.*-21:10"}
    GameString.GetSpecTimeString = function (str) {
        var array = str[0].split("^");
        return [array[0].trim().split("-")[1], array[1].trim().split("-")[1]];
    };
    return GameString;
}());
__reflect(GameString.prototype, "GameString");
//# sourceMappingURL=GameString.js.map