class RoleRideDressPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// RideDressSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected powerLabel: PowerLabel;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected showPanel: PetShowPanel;
	protected ridePanel: RideShowPanel;
	protected activeBtn: eui.Button;
	protected allPowerLabel: eui.Label;
	protected activeCountLabel: eui.Label;
	protected attrLabel: eui.Label;
	protected groupItem: eui.Group;
	protected nameLabel: eui.Label;
	protected getLabel: eui.Label;
	protected item: ItemBase;
	protected gaoupHave: eui.Group;
	protected changeBtn: eui.Button;
	protected imgHave: eui.Image;
	protected imgStyle: eui.Image;
	protected roleShowPanel: RoleShowPanel;
	/////////////////////////////////////////////////////////////////////////////

	private listCtrl: ListLRBtnCtrl

	public mModel: UserTemplate
	private mList: any[] = []

	public constructor() {
		super()
		this.skinName = "RideDressSkin"
		this.list.itemRenderer = RoleRideDressItem
		this.listCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 109)
		this._AddItemClick(this.list, this._OnItemClick)
		this._AddClick(this.activeBtn, this._OnClick)
		this._AddClick(this.getLabel, this._OnClick)
		this._AddClick(this.changeBtn, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
		this.mCommonWindowBg.SetTitle("皮肤");
		this.commonWindowBg.OnAdded(this)
		this.UpdateList()
		this.list.selectedIndex = 0;
		if (param[1]) {
			for (let key in this.mList) {
				if (this.mList[key].skinid == param[1])
					this.list.selectedIndex = parseInt(key);
			}
		}
		this.UpdateContent()
	}

	private UpdateList() {
		this.mList = CommonUtils.copyDataHandler(this.mModel.GetSkinConfig())
		let weight = (config) => {
			let skinid = config.skinid
			if (this.mModel.HasDress(skinid)) {
				return -100000 - skinid
			}
			let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
			let need = config.itemid.count
			if (cur >= need) {
				return -10000 - skinid
			}
			return skinid
		}
		this.mList.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(this.mList)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		let config = this.mList[this.list.selectedIndex]
		switch (e.currentTarget) {
			case this.activeBtn:
				this.mModel.SendActiveDress(config.skinid)
				break
			case this.getLabel:
				GainItemConfig.Guide(config.itemid.id)
				break
			case this.changeBtn:
				this.mModel.SendDress(config.skinid)
				break
		}
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		this.UpdateContent()
	}

	private UpdateContent() {
		let redList = []
		for (let data of this.mList) {
			let cur = GameGlobal.UserBag.GetCount(data.itemid.id)
			let need = data.itemid.count;
			let state = !this.mModel.HasDress(data.skinid) && cur >= need;
			data.__redPoint__ = state
			redList.push(state)
		}
		this.listCtrl.SetRedPointList(redList)
		this.listCtrl.OnRefresh()
		UIHelper.ListRefresh(this.list)
		let config = this.mList[this.list.selectedIndex]
		let itemConfig = GameGlobal.Config.ItemConfig[config.itemid.id]
		this.item.setItemData(config.itemid)
		this.item.isShowName(false)
		let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
		let need = config.itemid.count
		if (itemConfig) {
			this.nameLabel.text = itemConfig.name + `(${cur}/${need})`
		}
		let hasDress = this.mModel.HasDress(config.skinid)
		this.activeBtn.visible = !hasDress && cur >= need;
		this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0)
		this.attrLabel.textColor = hasDress ? Color.l_green_1 : Color.l_gray
		this.allPowerLabel.text = "皮肤总战力：" + this.mModel.GetDressPower()
		this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount()

		if (this.mModel.mTemplateType == UserTemplate.TYPE_RIDE) {
			this.ridePanel.SetBodyId(config.pid)
		} else {
			this.showPanel.SetBody(AppearanceConfig.GetUIPath(config.pid))
		}

		this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower)

		if (this.groupItem.visible = !hasDress) {
			UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id))
		}
		this.gaoupHave.visible = hasDress
		this.imgHave.visible = config.skinid == this.mModel.mDressId
		this.changeBtn.visible = !this.imgHave.visible
	}
}

class RoleRideDressItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////

	// RideDressItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected stateImg: eui.Image;
	protected nameLabel: eui.Label;
	protected imgRed: eui.Image;
	/////////////////////////////////////////////////////////////////////////////


	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let config = this.data
		this.nameLabel.text = config.name
		let panel = this.parent.parent.parent as RoleRideDressPanel
		this.stateImg.source = panel.mModel.HasDress(config.skinid) ? "ui_yuan" : "ui_yuan_quse"

		this.imgRed.visible = this.data.__redPoint__
	}
}