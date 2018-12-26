class ItemAuctionTipsWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // ItemAuctionTipsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected colorCanvas: eui.Component;
    protected group1: eui.Group;
    protected itemIcon: ItemIcon;
    protected nameLabel: eui.Label;
    protected num: eui.Label;
    protected group2: eui.Group;
    protected description: eui.Label;
    protected group3: eui.Group;
    protected useBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private itemid: number = 0;

	public constructor() {
		super();
	}

	initUI() {
		super.initUI()
		this.skinName = "ItemAuctionTipsSkin";
	};

	OnOpen(...param: any[]) {
		let type = param[0];
		this.itemid = param[1];
		this.AddClick(this.colorCanvas, this.CloseSelf)
		this.AddClick(this.useBtn, this.onTap);
		this.setData(type, this.itemid);
	};

	OnClose() {
		this.removeEvents();
	};

	onTap(e) {
		if (UserBag.ins().sendUseItem(this.itemid, 1)) {
			this.CloseSelf();
		}
	};

	setData(type, id) {
		var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
		var config = GlobalConfig.ins().ItemConfig[id];
		this.nameLabel.text = config.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.itemIcon.setData(config);
		this.num.text = "数量：" + data.count;
		this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
	}
}