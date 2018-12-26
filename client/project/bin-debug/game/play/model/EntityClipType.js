// 动画类型
var EntityClipType;
(function (EntityClipType) {
    EntityClipType[EntityClipType["ATTACK"] = 0] = "ATTACK";
    EntityClipType[EntityClipType["STAND"] = 1] = "STAND";
    EntityClipType[EntityClipType["RUN"] = 2] = "RUN";
    EntityClipType[EntityClipType["DIE"] = 3] = "DIE";
    EntityClipType[EntityClipType["HIT"] = 4] = "HIT";
    EntityClipType[EntityClipType["JUMP"] = 5] = "JUMP";
    EntityClipType[EntityClipType["RIDE_ATTACK"] = 100] = "RIDE_ATTACK";
    EntityClipType[EntityClipType["RIDE_STAND"] = 101] = "RIDE_STAND";
    EntityClipType[EntityClipType["RIDE_RUN"] = 102] = "RIDE_RUN";
    EntityClipType[EntityClipType["RIDE_DIE"] = 103] = "RIDE_DIE";
    EntityClipType[EntityClipType["RIDE_HIT"] = 104] = "RIDE_HIT";
    EntityClipType[EntityClipType["RIDE_JUMP"] = 105] = "RIDE_JUMP";
})(EntityClipType || (EntityClipType = {}));
// 类型转动画名称
var EntityClipTypeToName = (_a = {},
    _a[EntityClipType.ATTACK] = ["a", "attack"],
    _a[EntityClipType.STAND] = ["s"],
    _a[EntityClipType.RUN] = ["r"],
    _a[EntityClipType.DIE] = ["a", "die"],
    _a[EntityClipType.HIT] = ["a", "hit"],
    _a[EntityClipType.JUMP] = ["s"],
    _a[EntityClipType.RIDE_ATTACK] = ["i", "attack"],
    _a[EntityClipType.RIDE_STAND] = ["p"],
    _a[EntityClipType.RIDE_RUN] = ["o"],
    _a[EntityClipType.RIDE_DIE] = ["p",],
    _a[EntityClipType.RIDE_HIT] = ["i", "hit"],
    _a[EntityClipType.RIDE_JUMP] = ["p"],
    _a);
var _a;
//# sourceMappingURL=EntityClipType.js.map