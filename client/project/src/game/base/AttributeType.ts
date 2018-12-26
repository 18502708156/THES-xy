enum AttributeType {

    atHp					= 0,	// 
	atMaxHp					= 1,	// 生命
	atAttack				= 2,	// 攻击力
	atDef					= 3,	// 防御
	atSpeed					= 4,	// 速度
	atCrit					= 5,	// 暴击
	atTough					= 6,	// 抗暴
	atHitRate				= 7,	// 命中
	atEvade					= 8,	// 闪避
	atDefy					= 9,	// 无视防御
	atDefyReduction			= 10,	// 减免无视防御
	atDamageEnhance			= 11,	// 伤害加深值
	atDamageReduction		= 12,	// 伤害减少值
	atDamageEnhancePerc		= 13,	// 伤害加深百分比
	atDamageReductionPerc	= 14,	// 伤害减少百分比
	atCritEnhance			= 15,	// 暴击加成百分比
	atCritReduction			= 16,	// 暴击减少百分比
	atPVPEnhance			= 17,	// PVP伤害加深百分比
	atPVPReduction			= 18,	// PVP伤害减少百分比
	atPVEEnhance			= 19,	// PVE伤害加深万分比
	atPVEReduction			= 20,	// PVE伤害减少万分比
	atCount					= 21

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
}

class AttributeValue {
    public static BaseCritEnhance = 15000      // 基本暴击倍率
}