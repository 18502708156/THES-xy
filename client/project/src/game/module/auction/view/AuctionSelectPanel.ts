class AuctionSelectPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// AuctionSelectSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected titleLabel: eui.BitmapLabel;
	protected useBtn: eui.Button;
	protected auctionBtn: eui.Button;
	protected itemIcon: ItemBase;
	protected priceicon1: PriceIcon;
	protected priceicon0: PriceIcon;
	/////////////////////////////////////////////////////////////////////////////

	private rewardData: Sproto.reward_data;

	public constructor() {
		super()
		this.skinName = 'AuctionSelectSkin';
	}

	public childrenCreated() {
		this.itemIcon.isShowName(false);
	}

	private onClick(e: egret.TouchEvent) {
		this.CloseSelf();
		GameGlobal.AuctionModel.sendAuctionSelect(e.target == this.useBtn ? 1 : 2);
		let tips = ''
		if(e.target == this.useBtn) {
			tips = '已放入背包'
		}
		else {
			tips = '已放入拍卖行'
		}
		GameGlobal.UserTips.showTips(tips);
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.useBtn, this.onClick);
		this.AddClick(this.auctionBtn, this.onClick);

		this.observe(MessageDef.AUCTION_ITEM_PRICE_UPDATE, this.UpdateContent)
		this.rewardData = param[0];

		if (this.rewardData) {
			GameGlobal.AuctionModel.SendGetItemPrice(this.rewardData.id)
		}

		this.UpdateContent();
	}

	public UpdateContent() {
		if (this.rewardData) {
			this.itemIcon.data = this.rewardData;
			let data = GameGlobal.AuctionModel.mAuctionItemPrice
			let obj = data[this.rewardData.id]
			if (obj) {
				this.priceicon0.type = obj.numerictype
				this.priceicon0.price = obj.dealprice * this.rewardData.count;
				
				this.priceicon1.type = obj.numerictype
				this.priceicon1.price = obj.price * this.rewardData.count;

				this.priceicon0.visible = true
				this.priceicon1.visible = true
			} else {
				this.priceicon0.visible = false
				this.priceicon1.visible = false
			}
		}
	}
}