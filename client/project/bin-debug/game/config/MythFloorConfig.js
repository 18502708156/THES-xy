var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MythFloorConfig = (function () {
    function MythFloorConfig() {
    }
    MythFloorConfig.getFloorByFloorAndPace = function (floor, pace) {
        return GlobalConfig.ins().MythFloorConfig[(floor - 1) * MiJingModel.MaxPace + pace];
    };
    return MythFloorConfig;
}());
__reflect(MythFloorConfig.prototype, "MythFloorConfig");
//# sourceMappingURL=MythFloorConfig.js.map