class RechargeAwardPanel extends BaseEuiView {
	static NAME = "特惠充值"
	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// RechargeAwardSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected list: eui.List;
	protected btn0: eui.Component;
	protected btn1: eui.Component;
	protected btn2: eui.Component;
	protected btn3: eui.Component;
	protected titelImg: eui.Image;
	protected btnGroup: eui.Group;
	protected giftBtn: eui.Button;
	protected getImg: eui.Image;
	protected petShowpanel: PetShowPanel;
	/////////////////////////////////////////////////////////////////////////////

	protected _resources = ["ui_czth_bm_biaotou", "chongzhitehui_json", "ui_czth_bm_tupian02", "ui_czth_bm_tupian01"]

	public constructor() {
		super()
		this.skinName = "RechargeAwardSkin";
		this.list.itemRenderer = RechargeAwardItem;
		this.commonDialog.notClickMask = true;
	}

	childrenCreated() {
		let items = CommonUtils.GetArray(GameGlobal.Config.DiscountBaseConfig.itemid);
		this.list.dataProvider = new eui.ArrayCollection(items);

		let textdes 
		if (LocationProperty.GetRechargeId() == 3) {
			textdes = GameGlobal.Config.DiscountBaseConfig.textdes2
		} else {
			textdes = GameGlobal.Config.DiscountBaseConfig.textdes
		}
		let i = 0;
		for (let val of textdes) {
			let btn = this[`btn${i}`] as RechargeAwardBtn
			btn.getTxt.text = val.des;
			btn.tipsTxt.text = `充值${GameGlobal.Config.PayItemsConfig[val.id].amount / 100}元`
			btn.rechargeId = val.id;
			btn.tipsImg.visible = textdes[i].taget;
			this._AddClick(btn.rechargeBtn, this.tap);
			i++;
		}
		this.AddClick(this.giftBtn, this.gift)
	}

	OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.observe(MessageDef.RECHARGE_UPDATE, this.updataContent)

		this.updataContent();
	}

	updataContent() {
		let config = GameGlobal.Config.DiscountBaseConfig;
		if (config.showtype == 0)
			this.titelImg.source = GameGlobal.Config.TitleConf[config.titlpid].icon;
		else
			this.petShowpanel.SetBody(AppearanceConfig.GetUIPath(config.titlpid));

		this.btnGroup.visible = GameGlobal.RechargeModel.choicerechare == 0;
		this.giftBtn.visible = GameGlobal.RechargeModel.choicerechare > 0
		this.getImg.visible = GameGlobal.RechargeModel.choicerechare < 0
	}

	private tap(e: egret.TouchEvent) {
		let obj = e.currentTarget;
		while (obj.skinName != "RechargeAwardBtnSkin" && obj.parent) {
			obj = obj.parent;
		}
		let config = GameGlobal.Config.DiscountBaseConfig;
		
		if (LocationProperty.NotRechargeGood()) {
			config.rechargegood = null
		}

		if (config.rechargegood && obj.rechargeId != config.rechargegood) {
			let rechargeConfig = GameGlobal.Config.PayItemsConfig;
			let data = {};
			for (let key in rechargeConfig) {
				if (parseInt(key) == obj.rechargeId)
					data["btnName"] = `充值${rechargeConfig[key].cash}元`
				if (parseInt(key) == config.rechargegood)
					data["btnName2"] = `充值${rechargeConfig[key].cash}元`
			}
			data["closeExecuteCallFun2"] = false;
			WarnWin.show(config.des, () => {
				if (obj.rechargeId)
					GameGlobal.RechargeModel.sendRecharge(obj.rechargeId);
			}, this, () => {
				GameGlobal.RechargeModel.sendRecharge(config.rechargegood)
			}, this, "normal", data)
		}
		else if (obj.rechargeId) {
			GameGlobal.RechargeModel.sendRecharge(obj.rechargeId)
		}
	}

	private gift() {
		GameGlobal.RechargeModel.sendGiftAward();
	}
}

interface RechargeAwardBtn {
	/////////////////////////////////////////////////////////////////////////////
	// RechargeAwardBtnSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	rechargeBtn: eui.Button;
	getTxt: eui.BitmapLabel;
	tipsTxt: eui.Label;
	tipsImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////
	rechargeId;
}

class RechargeAwardItem extends ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// RechargeAwardItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	item: ItemBaseNotName;
	tipsImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "RechargeAwardItemSkin"
	}

	dataChanged() {
		this.item.data = this.data;
		this.tipsImg.visible = this.data.taget;
	}
}