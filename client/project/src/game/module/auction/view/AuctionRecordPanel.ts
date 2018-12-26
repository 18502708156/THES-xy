class AuctionRecordPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// AuctionRecordPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected conGroup: eui.Group;
	protected recordList: eui.List;
	protected tipTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = 'AuctionRecordPanelSkin';
	}

	public childrenCreated() {
		this.recordList.itemRenderer = AuctionRecordItem;
		this.recordList.dataProvider = null;
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this.observe(MessageDef.AUCTION_RECORD_UPDATE, this.UpdateContent);
		this.commonWindowBg.SetTitle(0 == param[0] ? '全服成交记录' : '帮会成交记录')
		GameGlobal.AuctionModel.sendAuctionRecord(param[0]);
	}

	public UpdateContent() {
		let infos = GameGlobal.AuctionModel.recordInfos;
		let weight = (info: AuctionInfo) => {
			return info.dealtime;
		}
		infos.sort((lhs, rhs) => {
			return weight(rhs) - weight(lhs)
		})
		let len = infos.length;
		this.tipTxt.visible = len == 0;
		this.conGroup.visible = len > 0;
		this.recordList.dataProvider = new eui.ArrayCollection(infos);
	}
}

class AuctionRecordItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// AuctionRecordItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected itemIcon: ItemBase;
	protected priceicon: PriceIcon;
	protected descTxt: eui.Label;
	protected playNameTxt: eui.Label;
	protected dealTimeTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		super.childrenCreated();
	}

	public dataChanged() {
		super.dataChanged();
		if (!this.data) return;
		let info = this.data as AuctionInfo;
		this.itemIcon.num = info.count;
		this.itemIcon.data = info.itemid;

		this.playNameTxt.text = info.offername;

		this.priceicon.type = MoneyConst.yuanbao;
		this.priceicon.price = info.price * info.count;

		this.descTxt.text = 1 == info.isbuy ? '一口价成交' : '竞拍价成交';
		let milliSeconds = info.dealtime * 1000;
		let date = new Date(milliSeconds);
		let hstr = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let mstr = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		this.dealTimeTxt.text = (date.getMonth() + 1) + '月' + date.getDate() + '日' + hstr + ':' + mstr;
	}
}