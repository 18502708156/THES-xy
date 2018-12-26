var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// 道具类型
var ItemType;
(function (ItemType) {
    ItemType[ItemType["EQUIP"] = 0] = "EQUIP";
    ItemType[ItemType["MATERIAL"] = 1] = "MATERIAL";
    ItemType[ItemType["RIDE"] = 2] = "RIDE";
    ItemType[ItemType["WING"] = 3] = "WING";
    ItemType[ItemType["XIAN_FZ"] = 4] = "XIAN_FZ";
    ItemType[ItemType["XIAN_XW"] = 5] = "XIAN_XW";
    ItemType[ItemType["PET_TL"] = 6] = "PET_TL";
    ItemType[ItemType["PET_SH"] = 7] = "PET_SH";
    ItemType[ItemType["TIANXIAN"] = 8] = "TIANXIAN";
    ItemType[ItemType["SHENGB"] = 9] = "SHENGB";
    ItemType[ItemType["TIANNV"] = 10] = "TIANNV";
    ItemType[ItemType["XIANQ"] = 11] = "XIANQ";
    ItemType[ItemType["HUA"] = 12] = "HUA";
    ItemType[ItemType["LINGQI"] = 13] = "LINGQI";
    ItemType[ItemType["DESTINY"] = 14] = "DESTINY";
})(ItemType || (ItemType = {}));
var ItemConst = (function () {
    function ItemConst() {
    }
    ItemConst.OPEN_EQUIPS_TIPS = (_a = {},
        _a[ItemType.EQUIP] = true,
        _a[ItemType.RIDE] = true,
        _a[ItemType.WING] = true,
        _a[ItemType.XIAN_FZ] = true,
        _a[ItemType.XIAN_XW] = true,
        _a[ItemType.PET_TL] = true,
        _a[ItemType.PET_SH] = true,
        _a[ItemType.TIANXIAN] = true,
        _a[ItemType.SHENGB] = true,
        _a[ItemType.TIANNV] = true,
        _a[ItemType.XIANQ] = true,
        _a[ItemType.HUA] = true,
        _a[ItemType.LINGQI] = true,
        _a);
    /** 显示阶数和附加值的物品类型 */
    ItemConst.ITEM_SHOW_RANK_TYPE = (_b = {},
        _b[ItemType.RIDE] = true,
        _b[ItemType.WING] = true,
        _b[ItemType.XIAN_FZ] = true,
        _b[ItemType.XIAN_XW] = true,
        _b[ItemType.PET_TL] = true,
        _b[ItemType.PET_SH] = true,
        _b[ItemType.TIANXIAN] = true,
        _b[ItemType.SHENGB] = true,
        _b[ItemType.HUA] = true,
        _b[ItemType.LINGQI] = true,
        _b);
    ItemConst.TYPE_NAME = (_c = {},
        _c[ItemType.RIDE] = "坐骑",
        _c[ItemType.WING] = "翅膀",
        _c[ItemType.XIAN_FZ] = "法阵",
        _c[ItemType.XIAN_XW] = "仙位",
        _c[ItemType.PET_TL] = "通灵",
        _c[ItemType.PET_SH] = "兽魂",
        _c[ItemType.TIANXIAN] = "守护",
        _c[ItemType.SHENGB] = "神兵",
        _c[ItemType.TIANNV] = "玄女",
        _c[ItemType.HUA] = "花辇",
        _c[ItemType.LINGQI] = "灵气",
        _c);
    return ItemConst;
}());
__reflect(ItemConst.prototype, "ItemConst");
var ItemUseType;
(function (ItemUseType) {
    ItemUseType[ItemUseType["TYPE00"] = 0] = "TYPE00";
    ItemUseType[ItemUseType["TYPE01"] = 1] = "TYPE01";
    ItemUseType[ItemUseType["TYPE02"] = 2] = "TYPE02";
    ItemUseType[ItemUseType["TYPE03"] = 3] = "TYPE03";
    ItemUseType[ItemUseType["TYPE04"] = 4] = "TYPE04";
})(ItemUseType || (ItemUseType = {}));
var _a, _b, _c;
//# sourceMappingURL=ItemConst.js.map