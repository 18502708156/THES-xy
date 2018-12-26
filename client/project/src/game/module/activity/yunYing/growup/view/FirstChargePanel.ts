class FirstChargePanel extends BaseView implements ICommonWindowTitle {

	public static NAME = '充值';

	/////////////////////////////////////////////////////////////////////////////
	// FirstChargePanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected titleImg: eui.Image;
	protected rewardImg: eui.Image;
	protected showImg: eui.Image;
	protected roleShowPanel: RoleShowPanel;
	protected tabList: eui.List;
	protected powerTxt: eui.Label;
	protected titleTxt: eui.Label;
	protected itemList: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected chargeBtn: eui.Button;
	protected chargeTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public static lists: any[] = [];
	private mListLRBtnCtrl;
	private _movie: MovieObject;

	public constructor() {
		super()
		this.skinName = 'FirstChargePanelSkin';
	}

	public childrenCreated() {
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.tabList, this.leftBtn, this.rightBtn, 152)
		this.itemList.itemRenderer = ItemBaseNotName;
		this.itemList.dataProvider = null;

		FirstChargePanel.lists = CommonUtils.GetArray(GameGlobal.Config.FirstRechargeConfig);
		let labels = [];
		for (let config of FirstChargePanel.lists) {
			labels.push('充值' + config.recharge + '元\n' + config.buttondes);
		}
		this.tabList.dataProvider = new eui.ArrayCollection(labels);
		this.tabList.itemRenderer = BtnTab5Item;
		this.tabList.selectedIndex = 1;
	}

	private onClick(e: egret.TouchEvent) {
		let config = FirstChargePanel.lists[this.tabList.selectedIndex];
		if (this.chargeBtn.label == '立即充值') {
			// RechargeWin.Open()
			GameGlobal.RechargeModel.sendRecharge(config.buyid)
		}
		else {
			GameGlobal.RechargeModel.sendRechargeFirstReward(config.id);
		}
	}

	private onItemClick(e: egret.TouchEvent) {
		this.UpdateContent();
	}

	public OnOpen(...param: any[]) {
		this.AddClick(this.chargeBtn, this.onClick);
		this.AddItemClick(this.tabList, this.onItemClick);
		this.observe(MessageDef.RECHARGE_FIRST_UPDATE, this.UpdateContent);
	}

	private _NewMovieObject() {
		let obj = new MovieObject
		let scale = 1
		obj.scaleX = obj.scaleY = scale
		obj.x = (this.width * scale) >> 1
		obj.y = (this.height * scale) >> 1
		this.addChild(obj)
		return obj
	}

	private posY: number = 0;
	private hasPos: boolean = false;
	private onEnterFrame(e) {
		if (this._movie) {
			if (this.posY < -16) {
				this.hasPos = true;
			}
			else if (this.posY == 0) {
				this.hasPos = false;
			}
			if (this.hasPos) {
				this.posY++;
			} else {
				this.posY--;
			}
			this._movie.y = this.roleShowPanel.y + 54 + this.posY >> 0;
		}
	}

	public UpdateContent() {
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		UIHelper.ListRefresh(this.tabList);
		let config = FirstChargePanel.lists[this.tabList.selectedIndex];
		this.itemList.dataProvider = new eui.ArrayCollection(config.item);
		this.titleImg.source = config.title;
		if (this.roleShowPanel)
			this.roleShowPanel.ClearCache();
		if (this.tabList.selectedIndex == 3)
			this.roleShowPanel.y = 420
		else
			this.roleShowPanel.y = 368
		if (config.showtype == 0) {
			this.showImg.source = config.show;
			this.showImg.visible = true;
			this.roleShowPanel.visible = false;
			if (this._movie) {
				this._movie.ClearCache();
			}
		}
		else if (config.showtype == 1) {
			let roleShowData = new RoleShowData;
			roleShowData.clothID = config.show;
			this.roleShowPanel.Set(RoleShowDressType.ROLE, roleShowData)
			this.showImg.visible = false;
			this.roleShowPanel.visible = true;
			if (this._movie) {
				this._movie.ClearCache();
			}

		}
		else if (config.showtype == 3) {
			let fashionSkinConfig = GameGlobal.Config.FashionSkinConfig
			let roleShowData = new RoleShowData;
			roleShowData.clothID = fashionSkinConfig[config.show][GameGlobal.actorModel.sex].pid;
			roleShowData.sex = GameGlobal.actorModel.sex;
			roleShowData.job = GameGlobal.actorModel.job;

			roleShowData.rideId = 2000105;
			this.roleShowPanel.SetAll(roleShowData)
			this.showImg.visible = false;
			this.roleShowPanel.visible = true;
			if (this._movie) {
				this._movie.ClearCache();
			}
		}
		else {
			if (!this._movie) {
				this._movie = this._NewMovieObject();
			}
			this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
			this._movie.LoadByUrl(ResDataPath.GetUIEffePath(config.show));
			this._movie.y = this.roleShowPanel.y + 54 >> 0;
			this.showImg.visible = this.roleShowPanel.visible = false;
		}

		this.powerTxt.textFlow = TextFlowMaker.generateTextFlow(config.powertitle);
		this.titleTxt.textFlow = TextFlowMaker.generateTextFlow(config.valuetitle);

		let num = GameGlobal.RechargeModel.rechargeNum;
		this.chargeTxt.text = '累计已充值' + num + '元';
		this.chargeBtn.enabled = true;
		UIHelper.ShowRedPoint(this.chargeBtn, false);
		if (num >= config.recharge) {
			if (GameGlobal.RechargeModel.GetFirstRewardState(config.id)) {
				this.chargeBtn.label = '已领取';
				this.chargeBtn.enabled = false;
			} else {
				UIHelper.ShowRedPoint(this.chargeBtn, true);
				this.chargeBtn.label = '领 取';
			}
		}
		else {
			this.chargeBtn.label = '立即充值';
		}
	}

	public static RedPointCheck(): boolean {
		return GameGlobal.GrowUpModel.checkFirstChargeRedPoint()
	}

	public OnClose() {
		this.removeEvents();
		this.removeObserve();
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}
}

class BtnTab5Item extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// BtnTab5Skin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected redPoint: eui.Image;
	protected labelDisplay: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		super.dataChanged();
		let config = FirstChargePanel.lists[this.itemIndex];
		let num = GameGlobal.RechargeModel.rechargeNum;
		if (num >= config.recharge) {
			this.redPoint.visible = !GameGlobal.RechargeModel.GetFirstRewardState(this.itemIndex + 1);
		}
	}

}