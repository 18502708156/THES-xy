class CaiLiaoFbPanel extends BaseView implements ICommonWindowTitle {
	public static readonly NAME = "材料副本";
	public cailiaoShop: eui.Button;
	public itemScroller: eui.Scroller;
	public itemList: eui.List;

	// 引导对象
	public GetGuideTarget() {
		this.itemList.validateNow()
		return {
			[1]: this.itemList.getElementAt(0) ? (this.itemList.getElementAt(0) as CaiLiaoFBItem).saodangBtn  : null,
		}
	}

	public constructor() {
		super()
		this.skinName = "CaiLiaoFBSkin";
		//this.itemScroller.viewport = this.itemList;
		this.itemList.itemRenderer = CaiLiaoFBItem;
		this.itemList.dataProvider =  new eui.ArrayCollection([])
	}
	UpdateContent(): void {
		var fbObj = GameGlobal.UserFb.fbModel;
		var fbArr = [];
		for (let obj in fbObj) {
			fbArr.push(fbObj[obj]);
			var config = GlobalConfig.ins().DailyFubenConfig;
			if (GameLogic.ins().actorModel.level < config[fbObj[obj].fbID].levelLimit) {
				break;
			}
		}
		;

		(this.itemList.dataProvider as eui.ArrayCollection).replaceAll(fbArr);

	}
	public OnOpen() {
		this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateContent)
		this.UpdateContent();
		this.AddClick(this.cailiaoShop, this.onTap);
	}
	public OnClose() {
		this.removeObserve();
		this.removeEvents();
	}
	onTap() {
		ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CAILIAO])
	}
}

class CaiLiaoFBItem extends eui.ItemRenderer {
	public titleName: eui.BitmapLabel;
	public itemList: eui.List;
	public group1: eui.Group;
	public saodangBtn: eui.Button;
	public tipstxt1: eui.Label;
	public tipsTxt2: eui.Label;
	public moneyTxt: PriceIcon;
	public redPoint: eui.Image;

	public constructor() {
		super();
		this.skinName = "CaiLiaoItemSkin";
		this.itemList.itemRenderer = ItemBaseNotName;
		this.saodangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	public onTap(e) {
		if (!UserFb.FinishAndCheckFighting()) {
		} else {
			var config = GlobalConfig.ins().DailyFubenConfig[this.data.fbID];
			var maxExSwap = config.vipBuyCount[GameLogic.ins().actorModel.vipLv]

			//可以直接挑战的时候
			if(this.data.useCount<config.freeCount)
			{
				GameGlobal.UserFb.sendfbJoin(1, this.data.fbID);
				return
			}
			
			if(this.data.vipBuyCount<maxExSwap)
			{
				if(GameLogic.ins().actorModel.yb >= config.buyPrice[maxExSwap])
				{
					GameGlobal.UserFb.sendfbJoin(1, this.data.fbID);
				}
				else
				{
					UserTips.ins().showTips("元宝不足")
				}
			}
			else
			{


				var nNextVip = CommonUtils.getObjectLength(config.vipBuyCount)-1 + ""
				var nNextTime = 0

				//下级vip以及级次数
				for (const item in config.vipBuyCount) {
					let time =config.vipBuyCount[item]
					if(time>(this.data.useCount-config.freeCount))
					{
						nNextVip = item
						nNextTime = time -this.data.useCount + config.freeCount
						break
					}
				}

				UserTips.ins().showTips("VIP"+nNextVip + "可再扫荡"+nNextTime+"次")
			}
			
		}
	}
	dataChanged(): void {
		let data = this.data;
		var config = GlobalConfig.ins().DailyFubenConfig;

		this.titleName.text = config[data.fbID].uititle;
		this.itemList.dataProvider = new eui.ArrayCollection(config[data.fbID].showItem);

		if (GameLogic.ins().actorModel.level < config[data.fbID].levelLimit) {
			this.group1.visible = false;
			this.tipsTxt2.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T: 角色等级|C:0x4fcd4c&T:${config[data.fbID].levelLimit}|C:0x6E330B&T:级开启|`);
			this.tipsTxt2.visible = true;
		} else {
			this.group1.visible = true;
			this.tipsTxt2.visible = false;

			var nNextVip =  CommonUtils.getObjectLength(config[data.fbID].vipBuyCount)-1 + "";
			var nNextTime = 0

			//下级vip以及级次数
			for (const item in config[data.fbID].vipBuyCount) {
				let time =config[data.fbID].vipBuyCount[item]
				if(time>(data.useCount-config[data.fbID].freeCount))
				{
					nNextVip = item
					nNextTime = time -data.useCount + config[data.fbID].freeCount
					break
				}
			}


			if (config[data.fbID].needsuccess > data.totalCount) {
				if (data.useCount >= config[data.fbID].freeCount) {
					this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T: VIP|C:0x6E330B&T:${nNextVip}|C:0x6E330B&T: 可再扫荡|C:0x4fcd4c&T:${nNextTime}|C:0x6E330B&T: 次|`);
					this.saodangBtn.labelDisplay.text = "扫荡";
					this.redPoint.visible = false;
					this.moneyTxt.visible = true;
					this.moneyTxt.text = config[data.fbID].buyPrice[data.vipBuyCount];
				} else {
					this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T: 今日可挑战次数：|C:0x4fcd4c&T:${(config[data.fbID].freeCount)}|`);
					this.saodangBtn.labelDisplay.text = "挑战";
					this.redPoint.visible = true;
					this.moneyTxt.visible = false;
				}
			} else {

				if (data.useCount >= config[data.fbID].freeCount) {
					this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T: VIP|C:0x6E330B&T:${nNextVip}|C:0x6E330B&T: 可再扫荡|C:0x4fcd4c&T:${nNextTime}|C:0x6E330B&T: 次|`);
					this.saodangBtn.labelDisplay.text = "扫荡";
					this.redPoint.visible = false;
					this.moneyTxt.visible = true;
					this.moneyTxt.text = config[data.fbID].buyPrice[data.vipBuyCount];
				} else {
					this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow(`|C:0x6E330B&T:今日可扫荡次数：|C:0x4fcd4c&T:${config[data.fbID].freeCount}|`);
					this.saodangBtn.labelDisplay.text = "免费扫荡";
					this.redPoint.visible = true;
					this.moneyTxt.visible = false;
				}
			}

			if(!this.bGray())
			{
				this.saodangBtn.filters = Color.GetFilter()//变灰
			}
			else
			{
				this.saodangBtn.filters = null
			}


		}
	}

	bGray()
	{
		var bCan = false
		var config = GlobalConfig.ins().DailyFubenConfig[this.data.fbID];
			var maxExSwap = config.vipBuyCount[GameLogic.ins().actorModel.vipLv]
			if(this.data.vipBuyCount<maxExSwap)
			{
				bCan = true
			}

			return bCan ;

	}
}