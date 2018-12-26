var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RankDataType = (function () {
    function RankDataType() {
    }
    /** 战力排行 */
    RankDataType.TYPE_POWER = 0;
    /** 竞技场排行 */
    RankDataType.TYPE_ARENA = 1;
    /** pk排行 */
    RankDataType.TYPE_SKIRMISH = 2;
    /** 关卡排行 */
    RankDataType.TYPE_PASS = 3;
    /** 副本排行 */
    RankDataType.TYPE_COPY = 4;
    /** 等级排行 */
    RankDataType.TYPE_LEVEL = 5;
    /**披风排行 */
    RankDataType.TYPE_WING = 6;
    /** 职业排行（萧平章） */
    RankDataType.TYPE_JOB_ZS = 7;
    /** 职业排行（萧平旌） */
    RankDataType.TYPE_JOB_FS = 8;
    /** 职业排行（蒙浅雪） */
    RankDataType.TYPE_JOB_DS = 9;
    /** 神功排行 */
    RankDataType.TYPE_LILIAN = 10;
    /** 王者排行 */
    RankDataType.TYPE_LADDER = 11;
    /** 宝石排行 */
    RankDataType.TYPE_BAOSHI = 12;
    /** 威名排行 */
    RankDataType.TYPE_PRESTIGE = 20;
    /** 佣兵排行 */
    RankDataType.TYPE_HERO = 21;
    /** 侍女排行 */
    RankDataType.TYPE_SHINV = 22;
    /** 宠物排行 */
    RankDataType.TYPE_PET = 23;
    // 跨服boss个人排行
    RankDataType.TYPE_ACROSS_PERSON = 24;
    // 帮会boss个人排行
    RankDataType.TYPE_GANG_BOSS_PERSON = 25;
    /**钓鱼排行 */
    RankDataType.TYPE_FISH = 113;
    /** 排名 - short */
    RankDataType.DATA_POS = 'pos';
    /** ID - int */
    RankDataType.DATA_ID = 'id';
    /** 名字 - string */
    RankDataType.DATA_PLAYER = 'player';
    /** 等级 - short */
    RankDataType.DATA_LEVEL = 'level';
    /** 境界 - short */
    RankDataType.DATA_ZHUAN = 'zhuan';
    /** VIP等级 - short */
    RankDataType.DATA_VIP = 'vip';
    /** 月卡 - short */
    RankDataType.DATA_MONTH = 'month';
    /** 战斗力 - int */
    RankDataType.DATA_POWER = 'power';
    /** 数量 - int */
    RankDataType.DATA_COUNT = 'count';
    /** 经验 - int */
    RankDataType.DATA_EXP = 'exp';
    /** 职业 - char */
    RankDataType.DATA_JOB = 'job';
    /** 性别 - char */
    RankDataType.DATA_SEX = 'sex';
    /** 第2名背景标志 */
    RankDataType.DATA_BG2 = 'xphb_json.phb_7';
    /** 第3名背景标志 */
    RankDataType.DATA_BG3 = 'xphb_json.phb_8';
    /** 排行项目内容 */
    // public static ITEMS = []
    //数据对应的读取方式
    RankDataType.readFunc = {};
    RankDataType.TYPE_ZHANLING = 13;
    RankDataType.TYPE_LONGHUN = 14;
    RankDataType.TYPE_XIAOFEI = 16;
    return RankDataType;
}());
__reflect(RankDataType.prototype, "RankDataType");
//# sourceMappingURL=RankDataType.js.map