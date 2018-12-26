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
var TopActivityView = (function (_super) {
    __extends(TopActivityView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TopActivityView() {
        return _super.call(this) || this;
    }
    TopActivityView.prototype.childrenCreated = function () {
        this.btnArrow.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClicked, this);
        this.group.addEventListener(egret.Event.RESIZE, this.UpdateGroup, this);
    };
    TopActivityView.prototype.InitIconList = function (view) {
        view._AddIconRule(this.fuliBtn, FuliIconRuleEx);
        view._AddIconRule(this.kaifuBtn, KaiFuIconRuleEx);
        view._AddIconRule(this.dailyChargeBtn, DailyChargeIconRuleEx);
        view._AddIconRule(this.fightPetFBBtn, FightPetFBIconRuleEx);
        view._AddIconRule(this.sevenDayBtn, SevenDayIconRuleEx);
        view._AddIconRule(this.shootUpBtn, ShootUpIconRuleEx);
        view._AddIconRule(this.treasureBtn, TreasureIconRuleEx);
        view._AddIconRule(this.rebateBtn, RebateIconRuleEx);
        view._AddIconRule(this.godPetAwardBtn, GodPetAwardIconRuleEx);
        view._AddIconRule(this.godPetLotteryBtn, GodPetLotteryIconRuleEx);
        view._AddIconRule(this.godLotteryBtn, GodLotteryIconRuleEx);
        view._AddIconRule(this.growupBtn, GrowUpIconRuleEx);
        view._AddIconRule(this.investmentBtn, InvestmentIconRuleEx);
        view._AddIconRule(this.jingCaiBtn, JingCaiIconRuleEx);
        view._AddIconRule(this.xuannvBtn, XuannvBefallIconRuleEx);
        view._AddIconRule(this.discountBtn, DiscountRuleEx);
    };
    TopActivityView.prototype.OnClose = function () {
    };
    TopActivityView.prototype.UpdateGroup = function () {
        this.btnArrow.visible = this.group.numChildren > 0;
    };
    TopActivityView.prototype._OnClicked = function () {
        this.btnArrow.scaleX = this.btnArrow.scaleX * -1;
        this.scroller.visible = this.btnArrow.scaleX == -1;
    };
    return TopActivityView;
}(eui.Component));
__reflect(TopActivityView.prototype, "TopActivityView");
//# sourceMappingURL=TopActivityView.js.map