var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ActivityDataFactory = (function () {
    function ActivityDataFactory() {
    }
    ActivityDataFactory.create = function (rsp) {
        var typeData;
        var id = rsp.baseData.id;
        var openState = rsp.baseData.openState;
        var startTime = rsp.baseData.startTime;
        var endTime = rsp.baseData.endTime;
        var type = rsp.baseData.type;
        switch (type) {
            case 1:
                typeData = new ActivityType1Data();
                break;
            case 2:
                typeData = new ActivityType2Data();
                break;
            case 3:
                typeData = new ActivityType3Data();
                break;
            case 4:
                typeData = new ActivityType4Data();
                break;
            case 5:
                typeData = new ActivityType5Data();
                break;
            case 6:
                typeData = new ActivityType6Data();
                break;
            case 7:
                typeData = new ActivityType7Data();
                break;
            case 8:
                typeData = new ActivityType8Data();
                break;
            case 9:
                typeData = new ActivityType9Data();
                break;
            case 10:
                typeData = new ActivityType10Data();
                break;
            case 11:
                typeData = new ActivityType11Data();
                break;
            case 12:
                typeData = new ActivityType12Data();
                break;
            case 13:
                typeData = new ActivityType13Data();
                break;
            case 14:
                typeData = new ActivityType14Data();
                break;
            case 15:
                typeData = new ActivityType15Data();
                break;
            case 16:
                typeData = new ActivityType16Data();
                break;
            case 17:
                typeData = new ActivityType17Data();
                break;
            case 18:
                typeData = new ActivityType18Data();
                break;
            case 19:
                typeData = new ActivityType19Data();
                break;
            case 20:
                typeData = new ActivityType20Data();
                break;
            case 21:
                typeData = new ActivityType21Data();
                break;
            case 22:
                typeData = new ActivityType22Data();
                break;
            case 23:
                typeData = new ActivityType23Data();
                break;
            case 24:
                typeData = new ActivityType24Data();
                break;
            case 25:
                typeData = new ActivityType25Data();
                break;
            case 26:
                typeData = new ActivityType26Data();
                break;
            case 27:
                typeData = new ActivityType27Data();
                break;
            case 28:
                typeData = new ActivityType28Data();
                break;
            default:
                return null;
        }
        if (typeData) {
            typeData.id = id;
            typeData.startTime = startTime;
            typeData.endTime = endTime;
            typeData.type = type;
            typeData.openState = openState;
            typeData.init();
            typeData.update(rsp);
            var a = typeData.isOpenActivity() && 1 == typeData.openState;
        }
        return typeData;
    };
    ActivityDataFactory.GetPanel = function (type) {
        if (!this.PANEL_LIST) {
            this.PANEL_LIST = (_a = {},
                _a[ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop] = KaiFuTargetTeamBuyPanel,
                _a[ActivityKaiFuFuncType.ACT_1_Upgrade] = KaiFuTargetUpLevelPanel,
                _a[ActivityKaiFuFuncType.ACT_20_RechargeGroupon] = KaiFuTargetPowerPanel,
                _a[ActivityKaiFuFuncType.ACT_3_RechargeContinue] = KaiFuTargetReChargePanel,
                _a[ActivityKaiFuFuncType.ACT_26_DisCountShop] = KaiFuTargetShopPanel,
                _a[ActivityKaiFuFuncType.ACT_22_OrangePetTarget] = KaiFuTargetFightPanel,
                _a[ActivityKaiFuFuncType.ACT_17_ArenaTarget] = KaiFuTargetFuncTargetPanel,
                _a[ActivityKaiFuFuncType.ACT_99990_JiJie] = KaiFuJiJiePanel,
                _a[ActivityKaiFuFuncType.ACT_99991_JiJieRank] = KaiFuJiJieRankPanel,
                _a[ActivityKaiFuFuncType.ACT_99992_JiJieShop] = KaiFuJiJieShopPanel,
                _a[ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge] = KaiFuLeiJiReChargePanel,
                _a);
        }
        var cls = this.PANEL_LIST[type];
        if (!cls) {
            console.warn("not imple act id => ", type);
        }
        return cls;
        var _a;
    };
    return ActivityDataFactory;
}());
__reflect(ActivityDataFactory.prototype, "ActivityDataFactory");
//# sourceMappingURL=ActivityDataFactory.js.map