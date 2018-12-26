var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Const = (function () {
    function Const() {
    }
    // 地图坐标到像素坐标的转换
    Const.PosToPixel = function (val) {
        return val * 64;
    };
    Const.PixelToPos = function (val) {
        return Math.floor(val / 64);
    };
    Const.GetMoveSpeed = function () {
        return Math.max(4750 / 1000 * GameMap.CELL_SIZE, 1);
    };
    Const.MAX_INT = 999999999;
    // 默认熔炼个数
    Const.SMELT_COUNT = 12;
    //大量熔炼个数
    Const.SMELT_LARGE_COUNT = 50;
    Const.CELL_SIZE = 64;
    return Const;
}());
__reflect(Const.prototype, "Const");
var GuildSkillType;
(function (GuildSkillType) {
    GuildSkillType[GuildSkillType["NORMAL"] = 1] = "NORMAL";
    GuildSkillType[GuildSkillType["PRACTICE"] = 2] = "PRACTICE";
})(GuildSkillType || (GuildSkillType = {}));
var GuildRobberState;
(function (GuildRobberState) {
    GuildRobberState[GuildRobberState["NORMAL"] = 1] = "NORMAL";
    GuildRobberState[GuildRobberState["FIGHT"] = 2] = "FIGHT";
    GuildRobberState[GuildRobberState["DEAD"] = 3] = "DEAD";
})(GuildRobberState || (GuildRobberState = {}));
//# sourceMappingURL=Const.js.map