var MoneyConst;
(function (MoneyConst) {
    MoneyConst[MoneyConst["exp"] = 0] = "exp";
    MoneyConst[MoneyConst["gold"] = 1] = "gold";
    MoneyConst[MoneyConst["yuanbao"] = 2] = "yuanbao";
    MoneyConst[MoneyConst["byb"] = 3] = "byb";
    MoneyConst[MoneyConst["GuildContrib"] = 5] = "GuildContrib";
    MoneyConst[MoneyConst["GuildFund"] = 6] = "GuildFund";
    MoneyConst[MoneyConst["Medal"] = 7] = "Medal";
    MoneyConst[MoneyConst["FriendCion"] = 8] = "FriendCion";
    MoneyConst[MoneyConst["RECHARGE"] = 99] = "RECHARGE";
    MoneyConst[MoneyConst["JingZhuang"] = 2000025] = "JingZhuang";
    MoneyConst[MoneyConst["DEITYEQUIP_PIECE"] = 2000040] = "DEITYEQUIP_PIECE";
})(MoneyConst || (MoneyConst = {}));
var MoneyConstToName = (_a = {},
    _a[MoneyConst.exp] = "经验",
    _a[MoneyConst.gold] = "银两",
    _a[MoneyConst.byb] = "绑元",
    _a[MoneyConst.yuanbao] = "元宝",
    _a[MoneyConst.RECHARGE] = "充值",
    _a[MoneyConst.GuildContrib] = "帮贡",
    _a);
var MoneyConstToRes = (_b = {},
    _b[MoneyConst.exp] = "ui_icon_item_4201",
    _b[MoneyConst.gold] = "ui_icon_item_4202",
    _b[MoneyConst.yuanbao] = "ui_icon_item_4204",
    _b[MoneyConst.byb] = "ui_icon_item_4203",
    _b[MoneyConst.RECHARGE] = "",
    _b[MoneyConst.GuildContrib] = "ui_icon_item_9",
    _b);
var MoneyConstToMiniRes = (_c = {},
    _c[MoneyConst.exp] = "ui_zjm_exp",
    _c[MoneyConst.gold] = "ui_common_res_004",
    _c[MoneyConst.yuanbao] = "ui_common_res_002",
    _c[MoneyConst.byb] = "ui_common_res_001",
    _c[MoneyConst.GuildContrib] = "ui_common_gongxian001",
    _c[MoneyConst.RECHARGE] = "",
    _c[MoneyConst.GuildContrib] = "ui_common_bg_01",
    _c[200002] = "ui_mini_icon_jinglian",
    _c[900000] = "ui_mini_icon_jinglian",
    _c[2000025] = "ui_common_suipian001",
    _c[2000026] = "ui_common_huanshouling001",
    _c[2000027] = "ui_common_xianlvling001",
    _c[2000028] = "ui_comon_xuancaibi",
    _c[2000029] = "ui_common_youqing001",
    _c[2000030] = "ui_common_weiwang001",
    _c[2000031] = "ui_common_gong001",
    _c[2000043] = "ui_ico_staron",
    _c);
var _a, _b, _c;
//# sourceMappingURL=MoneyConst.js.map