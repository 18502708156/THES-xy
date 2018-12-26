class RechargeWin extends BaseEuiView {
	public static NAME = "充值"
	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// RechargeWinSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected itemScroller: eui.Scroller;
	protected itemList: eui.List;
	protected nextVIPTxt: eui.Label;
	protected curVipTxt: eui.Label;
	protected bar: eui.ProgressBar;
	protected vipTeQuanBtn: eui.Button
	/////////////////////////////////////////////////////////////////////////////

	// 打开充值或者首充界面
	public static Open() {
		if (GameGlobal.RechargeModel.choicerechare >= 0) {
			ViewManager.ins().open(RechargeAwardPanel)
		} else {
			ViewManager.ins().open(RechargeWin)
		}
	}

	public static OpenMonthCard() {
		ViewManager.ins().open(RechargeWin)
	}

	public constructor() {
		super();
		this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE, this.initData)
	}


	initUI() {
		super.initUI()
		this.skinName = "RechargeWinSkin";
		this.commonWindowBg.SetTitle("充值")
		// this.touchEnabled = false;
	}

	initData() {
		this.itemList.itemRenderer = RechargeListItem;
		this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.RechargeModel.getListItemDate())
	}

	OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this._AddItemClick(this.itemList, this.itemClick)
		this._AddClick(this.vipTeQuanBtn, this.onClick);
		this.observe(MessageDef.UPDATA_VIP_EXP, this.UpdateContent);
		this.observe(MessageDef.RECHARGE_UPDATE, this.UpdateList);
		this.UpdateContent();
	}
	onClick(e) {
		switch (e.target) {
			case this.vipTeQuanBtn:
				ViewManager.ins().open(VipMainPanel)
				break;

			default:
				break;
		}
	}
	itemClick(e: egret.TouchEvent) {
		GameGlobal.RechargeModel.sendRecharge(this.itemList.selectedItem.id);
	}

	private UpdateList() {
		(this.itemList.dataProvider as eui.ArrayCollection).replaceAll(GameGlobal.RechargeModel.getListItemDate())
	}

	public UpdateContent() {
		if (GameGlobal.actorModel.vipLv < RechargeModel.MAX_VIPLV) {
			this.bar.maximum = GameGlobal.RechargeModel.getVipConfig()[GameGlobal.actorModel.vipLv + 1].needYb;
			let rechargeRMB = (this.bar.maximum - UserVip.ins().exp);
			this.nextVIPTxt.textFlow = TextFlowMaker.generateTextFlow("再充值" + '|C:0xFFED21&T:' + rechargeRMB + '|' + "元可成为" + '|C:0xFFED21&T:VIP' + (GameGlobal.actorModel.vipLv + 1) + '|')
			CommonUtils.addLableStrokeColor(this.nextVIPTxt, 0x460009, 3);
		} else {
			this.bar.maximum = UserVip.ins().exp;
			this.bar.value = UserVip.ins().exp;
			this.nextVIPTxt.text = "VIP等级已满"
		}
		this.bar.value = UserVip.ins().exp;
		this.curVipTxt.text = `${GameGlobal.actorModel.vipLv}`
		// CommonUtils.addLableStrokeColor(this.curVipTxt, 0x460009, 3);
	}
}

class RechargeListItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RechargeItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected RMBTxt: eui.BitmapLabel;
	protected SCGroup: eui.Group;
	protected SCZSTxt: eui.Label;
	protected otherTxt: eui.BitmapLabel;
	protected ybTxt: eui.BitmapLabel;
	protected centreImage: eui.Image;
	protected tipsImg: eui.Image
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "RechargeItemSkin"
	}

	public childrenCreated() {
		super.childrenCreated()

	}

	public dataChanged() {
		super.dataChanged()
		this.ybTxt.text = this.data.itemName;
		this.RMBTxt.text = this.data.cash + '元';
		this.SCZSTxt.text = this.data.award;
		this.centreImage.source = this.data.icon;
		this.otherTxt.text = this.data.exDesc;
		this.tipsImg.source = this.data.tipsicon;
		if (this.data.type == 1)
			this.currentState = "normal"
		else
			this.currentState = "other"

		this.SCGroup.visible = !GameGlobal.RechargeModel.reward[this.data.id] ? true : false
	}
}
