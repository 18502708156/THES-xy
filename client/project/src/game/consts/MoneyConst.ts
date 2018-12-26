enum MoneyConst {
    exp = 0,
    gold = 1,
    yuanbao = 2,
    byb = 3,

    GuildContrib = 5,
    GuildFund = 6,

    Medal = 7,  // 功勋

    FriendCion = 8,  // 友币

    RECHARGE = 99,    // 充值
    JingZhuang = 2000025,//金装碎片
    DEITYEQUIP_PIECE = 2000040, //神装碎片
}

var MoneyConstToName = {
    [MoneyConst.exp]: "经验",
    [MoneyConst.gold]: "银两",
    [MoneyConst.byb]: "绑元",
    [MoneyConst.yuanbao]: "元宝",
    [MoneyConst.RECHARGE]: "充值",
    [MoneyConst.GuildContrib]: "帮贡"
}

var MoneyConstToRes = {
    [MoneyConst.exp]: "ui_icon_item_4201",
    [MoneyConst.gold]: "ui_icon_item_4202",
    [MoneyConst.yuanbao]: "ui_icon_item_4204",
    [MoneyConst.byb]: "ui_icon_item_4203",
    [MoneyConst.RECHARGE]: "",
    [MoneyConst.GuildContrib]: "ui_icon_item_9"
}

var MoneyConstToMiniRes = {
    [MoneyConst.exp]: "ui_zjm_exp",
    [MoneyConst.gold]: "ui_common_res_004",
    [MoneyConst.yuanbao]: "ui_common_res_002",
    [MoneyConst.byb]: "ui_common_res_001",
    [MoneyConst.GuildContrib]: "ui_common_gongxian001",    

    [MoneyConst.RECHARGE]: "",
    [MoneyConst.GuildContrib]: "ui_common_bg_01",

    [200002]: "ui_mini_icon_jinglian",
    [900000]: "ui_mini_icon_jinglian",


    [2000025]: "ui_common_suipian001", // 金装碎片
    [2000026]: "ui_common_huanshouling001", // 宠物币
    [2000027]: "ui_common_xianlvling001", // 仙侣币	
    [2000028]: "ui_comon_xuancaibi",// 炫彩币
    [2000029]: "ui_common_youqing001",// 友情币
    [2000030]: "ui_common_weiwang001",// 威望
    [2000031]: "ui_common_gong001",// 功勋
    [2000043]: "ui_ico_staron",// 寻宝积分
    // [2000042]: "ui_ico_staron",// 寻宝积分


}