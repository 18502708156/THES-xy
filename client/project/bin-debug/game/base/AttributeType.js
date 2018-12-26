var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AttributeType;
(function (AttributeType) {
    AttributeType[AttributeType["atHp"] = 0] = "atHp";
    AttributeType[AttributeType["atMaxHp"] = 1] = "atMaxHp";
    AttributeType[AttributeType["atAttack"] = 2] = "atAttack";
    AttributeType[AttributeType["atDef"] = 3] = "atDef";
    AttributeType[AttributeType["atSpeed"] = 4] = "atSpeed";
    AttributeType[AttributeType["atCrit"] = 5] = "atCrit";
    AttributeType[AttributeType["atTough"] = 6] = "atTough";
    AttributeType[AttributeType["atHitRate"] = 7] = "atHitRate";
    AttributeType[AttributeType["atEvade"] = 8] = "atEvade";
    AttributeType[AttributeType["atDefy"] = 9] = "atDefy";
    AttributeType[AttributeType["atDefyReduction"] = 10] = "atDefyReduction";
    AttributeType[AttributeType["atDamageEnhance"] = 11] = "atDamageEnhance";
    AttributeType[AttributeType["atDamageReduction"] = 12] = "atDamageReduction";
    AttributeType[AttributeType["atDamageEnhancePerc"] = 13] = "atDamageEnhancePerc";
    AttributeType[AttributeType["atDamageReductionPerc"] = 14] = "atDamageReductionPerc";
    AttributeType[AttributeType["atCritEnhance"] = 15] = "atCritEnhance";
    AttributeType[AttributeType["atCritReduction"] = 16] = "atCritReduction";
    AttributeType[AttributeType["atPVPEnhance"] = 17] = "atPVPEnhance";
    AttributeType[AttributeType["atPVPReduction"] = 18] = "atPVPReduction";
    AttributeType[AttributeType["atPVEEnhance"] = 19] = "atPVEEnhance";
    AttributeType[AttributeType["atPVEReduction"] = 20] = "atPVEReduction";
    AttributeType[AttributeType["atCount"] = 21] = "atCount";
    // atHp = 0,
    // atMp = 1,
    // atMaxHp = 2,//生命
    // atMaxMp = 3,//魔法
    // atAttack = 4,//攻击
    // atDef = 5,//物防
    // atRes = 6,//法防
    // atCrit = 7,//暴击
    // atTough = 8,//抗暴击几率
    // atMoveSpeed = 9,//移速
    // atAttackSpeed = 10,//攻速
    // atHpEx = 11,//生命加成
    // atAtkEx = 12,//攻击加成
    // atStunPower = 13,//眩晕力
    // atStunRes = 14,//抵抗眩晕 万分比
    // atStunTime = 15,//眩晕时间
    // atDamageReduction = 16,//伤害减免
    // atCritHurt = 17,//暴伤
    // atRegeneration = 18,
    // atCritEnhance = 19,
    // atPenetrate = 20,
    // atRoleDamageEnhance = 21,
    // atRoleDamageReduction = 22,
    // atJob1DamageEnhance = 23,   // 战士  后面6个(包括这个)顺序不能改变
    // atJob2DamageEnhance = 24,   // 法师
    // atJob3DamageEnhance = 25,   // 道士
    // atJob1DamageReduction = 26, //
    // atJob2DamageReduction = 27, //
    // atJob3DamageReduction = 28, //
    // atTianzhuCrit         = 29, // 天珠暴击触发几率
    // atTianzhuCritTime     = 30, // 天珠暴击持续时间
    // atSuperarmor          = 31, // 抵抗击飞
    // atToughHurt          = 32, // 抗暴击伤害
    // atCancelCritHurt      = 32, // 抵消暴击伤害，伤害抵消量(加法)
    // atCancelCritEnhance   = 33, // 抵消暴击伤害加成，伤害额外抵消百分比
    // atCount = 34
})(AttributeType || (AttributeType = {}));
var AttributeValue = (function () {
    function AttributeValue() {
    }
    AttributeValue.BaseCritEnhance = 15000; // 基本暴击倍率
    return AttributeValue;
}());
__reflect(AttributeValue.prototype, "AttributeValue");
//# sourceMappingURL=AttributeType.js.map