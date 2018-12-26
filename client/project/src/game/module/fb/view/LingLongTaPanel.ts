class LingLongTaPanel extends BaseView implements ICommonWindowTitle {
	public static readonly NAME = "玲珑宝塔";
	public cailiaoShop: eui.Button;
	public tiaozhanBtn: eui.Button;
	public item0: FBRankCom;
	public item1: LingLongTaItemCom;
	public item2: LingLongTaItemCom;
	public item3: LingLongTaItemCom;


	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.tiaozhanBtn
		}
	}

	public constructor() {
		super();
		this.skinName = "LingLongTaSkin";
	}
	UpdateContent(): void {
		var taData = GameGlobal.UserFb.lltModel;
		this.item0.onUpdate();  //排行榜数据更新		
		this.item1.onUpdate(taData, 1);	//第一个塔数据更新
		this.item2.onUpdate(taData, 2);  //第二个塔数据更新
		this.item3.onUpdate(taData, 3);  //第三个塔数据更新
	}
	public OnOpen() {
		GameGlobal.UserFb.rankType = RankingModel.RANK_TYPE_LLT
		GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_LLT);
		this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent);

		this.AddClick(this.cailiaoShop, this.onTap);
		this.AddClick(this.tiaozhanBtn, this.onTap);

		UIHelper.ShowRedPoint(this.tiaozhanBtn, true) //红点常驻
		this.UpdateContent();
	}
	public OnClose() {
		this.removeEvents();
		this.removeObserve();
	}
	onTap(e: egret.TouchEvent) {

		switch (e.target) {
			case this.cailiaoShop:
				ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DAYAN])
				break;
			case this.tiaozhanBtn:
				if (UserFb.FinishAndCheckFighting2()) {
					GameGlobal.UserFb.sendfbJoin(3, 0);
				}
				break;
		}

	}
}

class FBRankCom extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// FbRankSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected rankBtn: eui.Label;
	protected name01: eui.Label;
	protected ca01: eui.Label;
	protected name02: eui.Label;
	protected ca02: eui.Label;
	protected name03: eui.Label;
	protected ca03: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "FbRankSkin";
		this.rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	onUpdate(): void {
		let rankData: Sproto.sc_rank_data_request = GameGlobal.RankingModel.ranks[GameGlobal.UserFb.rankType];
		if (rankData)
			for (let value of rankData.datas) {
				if (value.pos == 1) {
					this.name01.text = `${value.name}`;
					this.ca01.text = ` ${value.chapterlevel}层`
				}
				else if (value.pos == 2) {
					this.name02.text = `${value.name}`;
					this.ca02.text = ` ${value.chapterlevel}层`
				}
				else if (value.pos == 3) {
					this.name03.text = `${value.name}`;
					this.ca03.text = ` ${value.chapterlevel}层`
				}
			}
	}
	onTap() {
		if (GameGlobal.UserFb.rankType == RankingModel.RANK_TYPE_LLT)
			ViewManager.ins().open(LingLongRankPanel);
		if (GameGlobal.UserFb.rankType == RankingModel.RANK_TYPE_TT)
			ViewManager.ins().open(TianshilianRankPanel);
	}
}