var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityConst = (function () {
    function ActivityConst() {
    }
    ActivityConst.JiJieTypeName = function (type) {
        switch (type) {
            case ActivityKaiFuJiJieType.ride: return "坐骑";
            case ActivityKaiFuJiJieType.wing: return "翅膀";
            case ActivityKaiFuJiJieType.fairy: return "守护";
            case ActivityKaiFuJiJieType.weapon: return "神兵";
            case ActivityKaiFuJiJieType.pet_psychic: return "宠物兽魂";
            case ActivityKaiFuJiJieType.pet_soul: return "宠物通灵";
            case ActivityKaiFuJiJieType.xianlv_circle: return "仙侣仙位";
            case ActivityKaiFuJiJieType.xianlv_position: return "仙侣法阵";
            case ActivityKaiFuJiJieType.tiannv: return "玄女";
            case ActivityKaiFuJiJieType.tiannv_nimbus: return "玄女灵气";
            case ActivityKaiFuJiJieType.tiannv_flower: return "玄女花辇";
            case ActivityKaiFuJiJieType.lingtong: return "灵童";
            case 100: return "VIP";
        }
    };
    ActivityConst.JiJieTypeName2 = function (type) {
        switch (type) {
            case ActivityKaiFuJiJieType.ride: return "坐骑";
            case ActivityKaiFuJiJieType.wing: return "翅膀";
            case ActivityKaiFuJiJieType.fairy: return "守护";
            case ActivityKaiFuJiJieType.weapon: return "神兵";
            case ActivityKaiFuJiJieType.pet_psychic: return "兽魂";
            case ActivityKaiFuJiJieType.pet_soul: return "通灵";
            case ActivityKaiFuJiJieType.xianlv_circle: return "仙位";
            case ActivityKaiFuJiJieType.xianlv_position: return "法阵";
            case ActivityKaiFuJiJieType.tiannv: return "玄女";
            case ActivityKaiFuJiJieType.tiannv_nimbus: return "灵气";
            case ActivityKaiFuJiJieType.tiannv_flower: return "花辇";
            case ActivityKaiFuJiJieType.lingtong: return "灵童";
        }
    };
    ActivityConst.GetQiTianActivityIds = function (day, index) {
        return GameGlobal.Config.WeekEnjoyEverydayConfig[day][index].content;
    };
    ActivityConst.GetConfigByActityType = function (type) {
        return GameGlobal.Config["ActivityType" + type + "Config"];
    };
    /**valuedata == {type=16,id=7,value=1}, */
    ActivityConst.GetCfgObjByValue = function (valuedata) {
        var config = this.GetConfigByActityType(valuedata.type);
        var obj = config[valuedata.id];
        if (obj instanceof Array) {
            return obj[valuedata.value - 1];
        }
        else {
            return obj[valuedata.value];
        }
    };
    ActivityConst.ActivityKaiFuJiJieRankType = [0, 5, 6, 7, 8, 14, 13, 12, 11, 9, 16, 15, 20];
    return ActivityConst;
}());
__reflect(ActivityConst.prototype, "ActivityConst");
// enum ActivityKaiFuType{
// 	 SCSB = 1  ,//首充双倍
// 	 SC = 2  ,//首充
// 	 CCJJ= 3  ,//成长基金
// 	 TZJH= 4  ,//投资计划
// 	 XFYL= 5  ,//消费有礼
// 	 KFHD= 6  ,//开服活动
// 	 KFMB= 7  ,//开服目标
// 	 QTZX= 8  ,//七天尊享
// 	 MRSC= 9  ,//每日首充
// 	 ZSYJ= 10  ,//直升一阶
// 	 RMBLB= 11  ,//人民币礼包
// 	 CJ= 12  ,//抽奖
// 	 KFPMH= 13  ,//跨服拍卖行
// }
/** 开服运营活动 种类*/
var ActivityKaiFuFuncType;
(function (ActivityKaiFuFuncType) {
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_1_Upgrade"] = 1] = "ACT_1_Upgrade";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_2_PackageDiscount"] = 2] = "ACT_2_PackageDiscount";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_3_RechargeContinue"] = 3] = "ACT_3_RechargeContinue";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_4_Reach"] = 4] = "ACT_4_Reach";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_5_WeekLogin"] = 5] = "ACT_5_WeekLogin";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_6_RechargeWheel"] = 6] = "ACT_6_RechargeWheel";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_7_RechargeTotal"] = 7] = "ACT_7_RechargeTotal";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_8_Invest"] = 8] = "ACT_8_Invest";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_9_Loop"] = 9] = "ACT_9_Loop";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_10_MergeWing"] = 10] = "ACT_10_MergeWing";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_11_MergeBag"] = 11] = "ACT_11_MergeBag";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_12_MergeRecharge"] = 12] = "ACT_12_MergeRecharge";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_13_umulativeRecharge"] = 13] = "ACT_13_umulativeRecharge";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_14_ResetDouble"] = 14] = "ACT_14_ResetDouble";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_15_ActivitySingleRecharge"] = 15] = "ACT_15_ActivitySingleRecharge";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_16_DayLogin"] = 16] = "ACT_16_DayLogin";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_17_ArenaTarget"] = 17] = "ACT_17_ArenaTarget";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_18_CashGift"] = 18] = "ACT_18_CashGift";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_19_PowerTarget"] = 19] = "ACT_19_PowerTarget";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_20_RechargeGroupon"] = 20] = "ACT_20_RechargeGroupon";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_21_OutdrawDiscountShop"] = 21] = "ACT_21_OutdrawDiscountShop";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_22_OrangePetTarget"] = 22] = "ACT_22_OrangePetTarget";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_23_AdvanceLevel"] = 23] = "ACT_23_AdvanceLevel";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_24_GrowFund"] = 24] = "ACT_24_GrowFund";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_25_Consumption"] = 25] = "ACT_25_Consumption";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_26_DisCountShop"] = 26] = "ACT_26_DisCountShop";
    // ACT_2001_Upgrade = 2001  ,//冲级奖励
    // ACT_2002_PackageDiscount = 2002  ,//特价限购
    // ACT_2003_RechargeContinue = 2003  ,//连续充值
    // ACT_2004_Reach = 2004    ,//达标排行
    // ACT_2005_WeekLogin = 2005  ,//开服登录  送十万元宝
    // ACT_2006_RechargeWheel = 2006    ,//充值转盘
    // ACT_2007_RechargeTotal = 2007,//累计充值
    // ACT_2008_Invest = 2008  ,//投资计划
    // ACT_2009_Loop = 2009    ,//循环限购
    // ACT_2010_MergeWing = 2010,//羽翼暴击
    // ACT_2011_MergeBag = 2011  ,//合服礼包
    // ACT_2012_MergeRecharge = 2012  ,//合服累计充值
    // ACT_2013_umulativeRecharge = 2013,//累充活动
    // ACT_2014_ResetDouble = 2014,//充值重置
    // ACT_2015_ActivitySingleRecharge = 2015  ,//单笔充值
    // ACT_2016_DayLogin = 2016  ,//开服每日登陆
    // ACT_2017_ArenaTarget = 2017  ,//每日竞技目标
    // ACT_2018_CashGift = 2018  ,//每日充值
    // ACT_2019_PowerTarget = 2019  ,//人民币礼包
    // ACT_2020_RechargeGroupon = 2020  ,//战力目标
    // ACT_2021_OutdrawDiscountShop = 2021,//首充团购
    // ACT_2022_OrangePetTarget = 2022  ,//橙宠目标
    // ACT_2023_AdvanceLevel = 2023 ,//--直升一阶
    // ACT_2024_GrowFund = 2024 ,//--成长基金
    // ACT_2025_Consumption = 2025 ,//--消费有礼
    // ACT_2026_DisCountShop = 2026  ,// 折扣商店
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_99990_JiJie"] = 99990] = "ACT_99990_JiJie";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_99991_JiJieRank"] = 99991] = "ACT_99991_JiJieRank";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_99992_JiJieShop"] = 99992] = "ACT_99992_JiJieShop";
    ActivityKaiFuFuncType[ActivityKaiFuFuncType["ACT_99993_LeiJiReCharge"] = 99993] = "ACT_99993_LeiJiReCharge";
})(ActivityKaiFuFuncType || (ActivityKaiFuFuncType = {}));
/** 开服活动 ，折扣商店 限购类型*/
var ActivityKaiFuShopLimitBuyType;
(function (ActivityKaiFuShopLimitBuyType) {
    ActivityKaiFuShopLimitBuyType[ActivityKaiFuShopLimitBuyType["long"] = 1] = "long";
    ActivityKaiFuShopLimitBuyType[ActivityKaiFuShopLimitBuyType["noTimes"] = 2] = "noTimes";
    ActivityKaiFuShopLimitBuyType[ActivityKaiFuShopLimitBuyType["day"] = 3] = "day";
})(ActivityKaiFuShopLimitBuyType || (ActivityKaiFuShopLimitBuyType = {}));
var ActivityKaiFuJiJieType;
(function (ActivityKaiFuJiJieType) {
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["ride"] = 1] = "ride";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["wing"] = 2] = "wing";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["fairy"] = 3] = "fairy";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["weapon"] = 4] = "weapon";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["pet_psychic"] = 5] = "pet_psychic";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["pet_soul"] = 6] = "pet_soul";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["xianlv_circle"] = 7] = "xianlv_circle";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["xianlv_position"] = 8] = "xianlv_position";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["tiannv"] = 9] = "tiannv";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["tiannv_nimbus"] = 10] = "tiannv_nimbus";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["tiannv_flower"] = 11] = "tiannv_flower";
    ActivityKaiFuJiJieType[ActivityKaiFuJiJieType["lingtong"] = 12] = "lingtong";
})(ActivityKaiFuJiJieType || (ActivityKaiFuJiJieType = {}));
var ActivityKaiFuTargetId;
(function (ActivityKaiFuTargetId) {
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["team"] = 1] = "team";
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["petCopy"] = 2] = "petCopy";
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["upLevel"] = 3] = "upLevel";
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["power"] = 4] = "power";
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["show"] = 5] = "show";
    ActivityKaiFuTargetId[ActivityKaiFuTargetId["recharge"] = 6] = "recharge";
})(ActivityKaiFuTargetId || (ActivityKaiFuTargetId = {}));
//# sourceMappingURL=ActivityConst.js.map