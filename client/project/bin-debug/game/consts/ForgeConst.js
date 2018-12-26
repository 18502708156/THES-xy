var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ForgeConst = (function () {
    function ForgeConst() {
    }
    /** 可锻造的装备索引 */
    ForgeConst.CAN_FORGE_EQUIP = [
        EquipPos.WEAPON,
        EquipPos.HEAD,
        EquipPos.NECKLACE,
        EquipPos.CLOTHES,
        EquipPos.SHOULDER,
        EquipPos.BELT,
        EquipPos.CUFF,
        EquipPos.RING,
        EquipPos.PANTS,
        EquipPos.SHOE,
    ];
    /** 装备索引对应的子类型 */
    ForgeConst.EQUIP_POS_TO_SUB = (_a = {},
        _a[EquipPos.WEAPON] = EquipPos.WEAPON,
        _a[EquipPos.HEAD] = EquipPos.HEAD,
        _a[EquipPos.NECKLACE] = EquipPos.NECKLACE,
        _a[EquipPos.CLOTHES] = EquipPos.CLOTHES,
        _a[EquipPos.SHOULDER] = EquipPos.SHOULDER,
        _a[EquipPos.BELT] = EquipPos.BELT,
        _a[EquipPos.CUFF] = EquipPos.CUFF,
        _a[EquipPos.RING] = EquipPos.RING,
        _a[EquipPos.PANTS] = EquipPos.PANTS,
        _a[EquipPos.SHOE] = EquipPos.SHOE,
        _a);
    return ForgeConst;
}());
__reflect(ForgeConst.prototype, "ForgeConst");
// 0 强化 1 精炼 2 锻炼 3 宝石
var ForgeType;
(function (ForgeType) {
    ForgeType[ForgeType["BOOST"] = 0] = "BOOST";
    ForgeType[ForgeType["REFINE"] = 1] = "REFINE";
    ForgeType[ForgeType["EXERCISE"] = 2] = "EXERCISE";
    ForgeType[ForgeType["GEM"] = 3] = "GEM";
})(ForgeType || (ForgeType = {}));
var _a;
//# sourceMappingURL=ForgeConst.js.map