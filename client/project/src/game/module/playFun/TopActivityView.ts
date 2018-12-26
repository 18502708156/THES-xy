class TopActivityView extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
    // TopActivitySkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected btnArrow: eui.Button;
    protected scroller: eui.Scroller;
    protected group: eui.Group;
    protected fuliBtn: eui.Button;
    protected treasureBtn: eui.Button;
    protected kaifuBtn: eui.Button;
    protected dailyChargeBtn: eui.Button;
    protected sevenDayBtn: eui.Button;
    protected fightPetFBBtn: eui.Button;
    protected shootUpBtn: eui.Button;
    protected rebateBtn: eui.Button;
    protected godPetAwardBtn: eui.Button;
    protected godPetLotteryBtn: eui.Button;
    protected godLotteryBtn: eui.Button;
    protected growupBtn: eui.Button;
    protected investmentBtn: eui.Button;
    protected jingCaiBtn: eui.Button;
    protected xuannvBtn: eui.Button;
    protected discountBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
	}

	public childrenCreated() {
        this.btnArrow.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClicked, this)
        this.group.addEventListener(egret.Event.RESIZE, this.UpdateGroup, this)
	}

    public InitIconList(view: PlayFunView) {
        view._AddIconRule(this.fuliBtn, FuliIconRuleEx)
		view._AddIconRule(this.kaifuBtn, KaiFuIconRuleEx)
		view._AddIconRule(this.dailyChargeBtn, DailyChargeIconRuleEx)
		view._AddIconRule(this.fightPetFBBtn, FightPetFBIconRuleEx)
		view._AddIconRule(this.sevenDayBtn, SevenDayIconRuleEx)
		view._AddIconRule(this.shootUpBtn, ShootUpIconRuleEx)
		view._AddIconRule(this.treasureBtn, TreasureIconRuleEx)
		view._AddIconRule(this.rebateBtn, RebateIconRuleEx)
		view._AddIconRule(this.godPetAwardBtn, GodPetAwardIconRuleEx)
		view._AddIconRule(this.godPetLotteryBtn, GodPetLotteryIconRuleEx)
		view._AddIconRule(this.godLotteryBtn, GodLotteryIconRuleEx)
		view._AddIconRule(this.growupBtn, GrowUpIconRuleEx)
		view._AddIconRule(this.investmentBtn, InvestmentIconRuleEx)
        view._AddIconRule(this.jingCaiBtn, JingCaiIconRuleEx)
        view._AddIconRule(this.xuannvBtn, XuannvBefallIconRuleEx)
        view._AddIconRule(this.discountBtn, DiscountRuleEx)
    }

    public OnClose() {

    }

    public UpdateGroup() {
        this.btnArrow.visible = this.group.numChildren > 0
    }

    private _OnClicked() {
        this.btnArrow.scaleX = this.btnArrow.scaleX * -1
        this.scroller.visible = this.btnArrow.scaleX == -1
    }
}
