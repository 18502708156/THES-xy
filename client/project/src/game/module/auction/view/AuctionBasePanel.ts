class AuctionBasePanel extends BaseView implements ICommonWindowTitle {

	/////////////////////////////////////////////////////////////////////////////
	// AuctionPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected conGroup: eui.Group;
	protected scroller: eui.Scroller;
	protected auctionList: eui.List;
	protected selectGroup: eui.Group;
	protected selectTxt: eui.Label;
	protected qualityGroup: eui.Group;
	protected quality2Txt: eui.Label;
	protected quality3Txt: eui.Label;
	protected quality4Txt: eui.Label;
	protected quality5Txt: eui.Label;
	protected quality6Txt: eui.Label;
	protected quality0Txt: eui.Label;
	protected pageBtn: PageButton;
	protected recordTxt: eui.Label;
	protected tipTxt: eui.Label;
	protected ratioTxt: eui.Label;
	protected helpBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	/**显示品质拍卖品 */
	private quality = 0;
	/**0全服， 1帮会 */
	public static aucType: number = 0;

	private dataProvider: eui.ArrayCollection;

	private curPage = 1;

	public constructor() {
		super()
		this.skinName = 'AuctionPanelSkin';
	}

	public childrenCreated() {
		UIHelper.SetLinkStyleLabel(this.recordTxt, '成交记录');
		this.auctionList.itemRenderer = AuctionItem;
		this.dataProvider = new eui.ArrayCollection([]);
		this.auctionList.dataProvider = this.dataProvider;
		this.qualityGroup.visible = false;
		this.pageBtn.setPage(1);
		this.recoverTouchPos();
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.helpBtn, this.onClick);
		this.AddClick(this.selectGroup, this.onClick);
		this.AddClick(this.qualityGroup, this.onClick);
		this.AddClick(this.recordTxt, this.onClick);
		this.AddClick(this.ratioTxt, this.onClick);
		this.scroller.addEventListener(egret.Event.CHANGE, this.OnRefresh, this)
		this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun)
		this.observe(MessageDef.AUCTION_LIST_UPDATE, this.updateQuality);
		GameGlobal.AuctionModel.sendAuctionList(AuctionBasePanel.aucType);
	}

	/**回调当前页码 */
	private pageChangeFun(page) {
		this.curPage = page;
		this.SetPos((page - 1) * (this.scroller.height - 20));
	}

	private SetPos(pos: number): void {
		let touch = this.scroller.$Scroller[9]
		touch.maxScrollPos = this.auctionList.contentHeight;
		touch.throwTo(pos);
	}

	private recoverTouchPos() {
		let touch = this.scroller.$Scroller[9]
		touch.maxScrollPos = this.auctionList.contentHeight;
		touch.currentScrollPos = 0;
	}

	private OnRefresh() {
		let sv = this.auctionList.scrollV;
		this.pageBtn.setPage(Math.ceil(1 + sv / this.scroller.height));
	}

	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.quality0Txt:
			case this.quality2Txt:
			case this.quality3Txt:
			case this.quality4Txt:
			case this.quality5Txt:
			case this.quality6Txt:
				this.qualityGroup.visible = false;
				//更新排序
				this.quality = parseInt(e.target.name);
				this.updateQuality();
				break;
		}
		switch (e.currentTarget) {
			case this.selectGroup:
				this.qualityGroup.visible = !this.qualityGroup.visible;
				break;
			case this.qualityGroup:
				this.qualityGroup.visible = false;
				break;
			case this.recordTxt:
				ViewManager.ins().open(AuctionRecordPanel, AuctionBasePanel.aucType);
				break;
			case this.helpBtn:
				ViewManager.ins().open(ActivityDescPanel, 29, '拍卖说明');
				break;
			case this.ratioTxt:
				GameGlobal.AuctionModel.showRatioPanel();
				break;
		}
	}

	private updateQuality() {
		this.ratioTxt.textFlow = (new egret.HtmlTextParser).parser('<a href=\"event:\"><u>我的拍卖额度：' + GameGlobal.AuctionModel.getRemainRatio() + '</u></a>');
		this.selectTxt.text = this['quality' + this.quality + 'Txt'].text;
		this.selectTxt.textColor = this['quality' + this.quality + 'Txt'].textColor;
		let list = GameGlobal.AuctionModel.auctionLists[AuctionBasePanel.aucType]
		let infos = []
		if (list) {
			infos = list.slice();
		}
		let lists = 0 == this.quality ? infos : [];
		if (0 != this.quality) {
			if (6 == this.quality) {//我竞价品
				for (let i = 0; i < infos.length; i++) {
					if (infos[i].offername == GameGlobal.actorModel.name) {
						lists.push(infos[i]);
					}
				}
			}
			else {
				for (let i = 0; i < infos.length; i++) {
					let config = GameGlobal.Config.ItemConfig[infos[i].itemid];
					if (config && config.quality == this.quality) {
						lists.push(infos[i]);
					}
				}
			}
		}
		let len = lists.length;
		this.tipTxt.visible = len == 0;
		this.conGroup.visible = len > 0;
		let maxPage = Math.ceil(len / 4) >> 0;
		this.pageBtn.setMax(maxPage);
		if (this.curPage > maxPage) {
			this.pageChangeFun(maxPage)
		}
		this.dataProvider.replaceAll(lists);
		this.auctionList.dataProvider = this.dataProvider;

		if (len > 0 && !TimerManager.ins().isExists(this.updateTime, this)) {
			this.AddTimer(1000, 0, this.updateTime);
		}
	}

	private updateTime(...parma) {
		let i = 0;
		let len = this.auctionList.numChildren;
		let item: AuctionItem;
		for (i = 0; i < len; i++) {
			item = this.auctionList.getChildAt(i) as AuctionItem;
			item.updateTime();
		}
	}

	public UpdateContent() { }

	public OnClose() {
		TimerManager.ins().remove(this.updateTime, this);
	}
}

class AuctionItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// AuctionItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected selfImg: eui.Image;
	protected itemIcon: ItemBase;
	protected linkTxt: eui.Label;
	protected playNameTxt: eui.Label;
	protected priceicon: PriceIcon;
	protected descTxt: eui.Label;
	protected timeTxt: eui.Label;
	protected priceGroup: eui.Group;
	protected priceBtn: eui.Button;
	protected priceicon0: PriceIcon;
	protected offerGroup: eui.Group;
	protected offerBtn: eui.Button;
	protected priceicon1: PriceIcon;
	/////////////////////////////////////////////////////////////////////////////
	/**一口价 */
	private _price = 0;
	/**竞价 */
	private _offerprice = 0;
	/**数量 */
	private _count = 1;

	private isMySelf: boolean = false;


	private isPost: boolean = false;

	public childrenCreated() {
		super.childrenCreated();
		this.selfImg.visible = false;
		this.linkTxt.visible = false;
		UIHelper.SetLinkStyleLabel(this.linkTxt, '可激活');
		this.priceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.offerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.linkTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	private onClick(e: egret.TouchEvent) {
		if (e.target == this.priceBtn) {
			if (GameGlobal.AuctionModel.getRemainRatio() - this._price <= 0) {
				GameGlobal.AuctionModel.showAlert();
				return;
			}
			WarnWin.show('是否花费 ' + this._price + '元宝 立即拍下物品', () => {
				GameGlobal.AuctionModel.sendAuctionBuy(this.data.id, AuctionBasePanel.aucType);
			}, this);
		}
		else if (e.target == this.offerBtn) {
			if (this.isMySelf) {
				GameGlobal.UserTips.showTips('您已出价，不需要重复出价');
				return;
			}
			if (GameGlobal.AuctionModel.getRemainRatio() - this._offerprice <= 0) {
				GameGlobal.AuctionModel.showAlert();
				return;
			}
			WarnWin.show('是否花费 ' + this._offerprice + '元宝 参与竞价', () => {
				GameGlobal.AuctionModel.sendAuctionOffer(this.data.id, AuctionBasePanel.aucType);
			}, this);
		}
		else {

		}
	}

	public dataChanged() {
		super.dataChanged();
		if (!this.data) return;

		this.isPost = false;

		let info = this.data as AuctionInfo;

		this.selfImg.visible = GameGlobal.actorModel.name == info.playername;

		this.itemIcon.num = info.count;
		this.itemIcon.data = info.itemid;
		this._count = info.count;

		this.isMySelf = GameGlobal.actorModel.name == info.offername;
		this.playNameTxt.text = this.isMySelf ? '我的竞价' : info.offername;

		let hasOffer = info.HasOffer()

		this.priceicon.type = MoneyConst.yuanbao;
		this.priceicon.price = info.price * this._count;

		this.priceicon0.type = info.numerictype;
		this.priceicon0.price = info.dealprice * this._count;
		this._price = info.dealprice * this._count;
		
		this.priceicon1.type = info.numerictype;
		if (hasOffer) {
			this._offerprice = (info.addprice + info.price) * this._count;
		} else {
			this._offerprice = (info.price) * this._count;
		}
		this.priceicon1.price = this._offerprice

		this.descTxt.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.AuctionModel.getDescByStatus(info.status));
		this.updateTime();
	}

	public updateTime(...param) {
		let cd = GameServer.serverTime - this.data.createtime;
		this.timeTxt.textFlow = TextFlowMaker.generateTextFlow(this.getTimeByStatus(this.data.status, cd));
	}

	/**1公示 2竞拍 3抢拍 4成交 5流拍 */
	public getTimeByStatus(status, cd) {
		let str = '已结束';
		let time = 0;
		let color = Color.Blue;
		switch (status) {
			case 1:
				time = GameGlobal.AuctionModel.getBaseConfig().showtime;
				color = Color.Blue;
				break;
			case 2:
				time = GameGlobal.AuctionModel.getBaseConfig().showtime + GameGlobal.AuctionModel.getBaseConfig().auctiontime;
				color = 0x019704;
				break;
			case 3:
				time = GameGlobal.AuctionModel.getBaseConfig().showtime + GameGlobal.AuctionModel.getBaseConfig().auctiontime + GameGlobal.AuctionModel.getBaseConfig().robtime;
				color = Color.Red;
				break;
		}
		if (status <= 3) {
			str = '|C:' + color + '&T:' + DateUtils.format_1((time - cd) * 1000) + '后结束|';
			if (time - cd <= 0) {
				if (!this.isPost) {
					GameGlobal.AuctionModel.sendAuctionUpdate(this.data.id, AuctionBasePanel.aucType);
					this.isPost = true;
				}
			}
		}
		return str;
	}
}