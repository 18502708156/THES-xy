var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FuliIconRuleEx = (function (_super) {
    __extends(FuliIconRuleEx, _super);
    function FuliIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FuliIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.FULI))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return FuliIconRuleEx;
}(FuliIconRule));
__reflect(FuliIconRuleEx.prototype, "FuliIconRuleEx");
var KaiFuIconRuleEx = (function (_super) {
    __extends(KaiFuIconRuleEx, _super);
    function KaiFuIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KaiFuIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.KAIFU))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return KaiFuIconRuleEx;
}(KaiFuIconRule));
__reflect(KaiFuIconRuleEx.prototype, "KaiFuIconRuleEx");
var DailyChargeIconRuleEx = (function (_super) {
    __extends(DailyChargeIconRuleEx, _super);
    function DailyChargeIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DailyChargeIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.DAILYCHARGE))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return DailyChargeIconRuleEx;
}(DailyChargeIconRule));
__reflect(DailyChargeIconRuleEx.prototype, "DailyChargeIconRuleEx");
var FightPetFBIconRuleEx = (function (_super) {
    __extends(FightPetFBIconRuleEx, _super);
    function FightPetFBIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FightPetFBIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.FIGHTPETFB))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return FightPetFBIconRuleEx;
}(FightPetFBIconRule));
__reflect(FightPetFBIconRuleEx.prototype, "FightPetFBIconRuleEx");
var SevenDayIconRuleEx = (function (_super) {
    __extends(SevenDayIconRuleEx, _super);
    function SevenDayIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SevenDayIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.SEVENDAY))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return SevenDayIconRuleEx;
}(SevenDayIconRule));
__reflect(SevenDayIconRuleEx.prototype, "SevenDayIconRuleEx");
var ShootUpIconRuleEx = (function (_super) {
    __extends(ShootUpIconRuleEx, _super);
    function ShootUpIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShootUpIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.SHOOTUP))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return ShootUpIconRuleEx;
}(ShootUpIconRule));
__reflect(ShootUpIconRuleEx.prototype, "ShootUpIconRuleEx");
var TreasureIconRuleEx = (function (_super) {
    __extends(TreasureIconRuleEx, _super);
    function TreasureIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.TREASURE))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return TreasureIconRuleEx;
}(TreasureIconRule));
__reflect(TreasureIconRuleEx.prototype, "TreasureIconRuleEx");
var RebateIconRuleEx = (function (_super) {
    __extends(RebateIconRuleEx, _super);
    function RebateIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RebateIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.REBATE))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return RebateIconRuleEx;
}(RebateIconRule));
__reflect(RebateIconRuleEx.prototype, "RebateIconRuleEx");
var GodPetAwardIconRuleEx = (function (_super) {
    __extends(GodPetAwardIconRuleEx, _super);
    function GodPetAwardIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GodPetAwardIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.GODPETAWARD))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return GodPetAwardIconRuleEx;
}(GodPetAwardIconRule));
__reflect(GodPetAwardIconRuleEx.prototype, "GodPetAwardIconRuleEx");
var GodPetLotteryIconRuleEx = (function (_super) {
    __extends(GodPetLotteryIconRuleEx, _super);
    function GodPetLotteryIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GodPetLotteryIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.GODPETLOTTERY))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return GodPetLotteryIconRuleEx;
}(GodPetLotteryIconRule));
__reflect(GodPetLotteryIconRuleEx.prototype, "GodPetLotteryIconRuleEx");
var GodLotteryIconRuleEx = (function (_super) {
    __extends(GodLotteryIconRuleEx, _super);
    function GodLotteryIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GodLotteryIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.GODLOTTERY))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return GodLotteryIconRuleEx;
}(GodLotteryIconRule));
__reflect(GodLotteryIconRuleEx.prototype, "GodLotteryIconRuleEx");
var GrowUpIconRuleEx = (function (_super) {
    __extends(GrowUpIconRuleEx, _super);
    function GrowUpIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GrowUpIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.GROWUP))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return GrowUpIconRuleEx;
}(GrowUpIconRule));
__reflect(GrowUpIconRuleEx.prototype, "GrowUpIconRuleEx");
var InvestmentIconRuleEx = (function (_super) {
    __extends(InvestmentIconRuleEx, _super);
    function InvestmentIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvestmentIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.INVESTMENT))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return InvestmentIconRuleEx;
}(InvestmentIconRule));
__reflect(InvestmentIconRuleEx.prototype, "InvestmentIconRuleEx");
var JingCaiIconRuleEx = (function (_super) {
    __extends(JingCaiIconRuleEx, _super);
    function JingCaiIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JingCaiIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.JINGCAI))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return JingCaiIconRuleEx;
}(JingCaiIconRule));
__reflect(JingCaiIconRuleEx.prototype, "JingCaiIconRuleEx");
var XuannvBefallIconRuleEx = (function (_super) {
    __extends(XuannvBefallIconRuleEx, _super);
    function XuannvBefallIconRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XuannvBefallIconRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.XUANNVBEFALL))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return XuannvBefallIconRuleEx;
}(XuannvBefallIconRule));
__reflect(XuannvBefallIconRuleEx.prototype, "XuannvBefallIconRuleEx");
var DiscountRuleEx = (function (_super) {
    __extends(DiscountRuleEx, _super);
    function DiscountRuleEx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiscountRuleEx.prototype.checkShowIcon = function () {
        if (!TopActivityConst.IsShow(TopActivityType.DISCOUNT))
            return false;
        return _super.prototype.checkShowIcon.call(this);
    };
    return DiscountRuleEx;
}(DiscountRule));
__reflect(DiscountRuleEx.prototype, "DiscountRuleEx");
var TopActivityConst = (function () {
    function TopActivityConst() {
    }
    TopActivityConst.IsShow = function (id) {
        var config = GameGlobal.Config.GButtonConfig[id];
        if (!config)
            return false;
        return (config.show || 0) == 1;
    };
    return TopActivityConst;
}());
__reflect(TopActivityConst.prototype, "TopActivityConst");
var TopActivityType;
(function (TopActivityType) {
    TopActivityType[TopActivityType["FULI"] = 1] = "FULI";
    TopActivityType[TopActivityType["KAIFU"] = 2] = "KAIFU";
    TopActivityType[TopActivityType["DAILYCHARGE"] = 3] = "DAILYCHARGE";
    TopActivityType[TopActivityType["FIGHTPETFB"] = 4] = "FIGHTPETFB";
    TopActivityType[TopActivityType["SEVENDAY"] = 5] = "SEVENDAY";
    TopActivityType[TopActivityType["SHOOTUP"] = 6] = "SHOOTUP";
    TopActivityType[TopActivityType["TREASURE"] = 7] = "TREASURE";
    TopActivityType[TopActivityType["REBATE"] = 8] = "REBATE";
    TopActivityType[TopActivityType["GODPETAWARD"] = 9] = "GODPETAWARD";
    TopActivityType[TopActivityType["GODPETLOTTERY"] = 10] = "GODPETLOTTERY";
    TopActivityType[TopActivityType["GODLOTTERY"] = 11] = "GODLOTTERY";
    TopActivityType[TopActivityType["GROWUP"] = 12] = "GROWUP";
    TopActivityType[TopActivityType["INVESTMENT"] = 13] = "INVESTMENT";
    TopActivityType[TopActivityType["JINGCAI"] = 14] = "JINGCAI";
    TopActivityType[TopActivityType["XUANNVBEFALL"] = 15] = "XUANNVBEFALL";
    TopActivityType[TopActivityType["DISCOUNT"] = 16] = "DISCOUNT";
})(TopActivityType || (TopActivityType = {}));
//# sourceMappingURL=ActivityIconRuleEx.js.map