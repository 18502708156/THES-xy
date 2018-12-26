class ForgePanel extends BaseView implements ICommonWindowTitle {

	public mContext: ForgeWin
	public equipComp: ForgeEquipList

	public mSelectIndex = 0
	public mForgeType: ForgeType

	protected lv: number = 0
	private config: any
	private nextConfig: any

	private mLevelList: number[] = []
	private mIsUpdate = false

	public constructor() {
		super()
	}

	childrenCreated() {
		this.equipComp.consumeLabel.mIsImg = true
		UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel)
	}

	UpdateContent(): void {
		this.UpdateConsumeLabel()
		this.UpdateMasterValue()
	}

	OnOpen() {
		// this.equipComp.consumeLabel.consumeItemId = this.mConsumeTypeId
		let role = GameGlobal.SubRoles.GetRoleData()
		if (!role) {
			return
		}
		this.UpdateAllItem()
		this.mSelectIndex = role.getMinEquipIndexByType(this.mForgeType)
		this.UpdateSel(this.mSelectIndex)
		this.UpdateContent()
		// this.equipComp.getwayLabel.visible = true
		let data = this.GetConsumeValue()
		let txt = ""
		if (data) {
			let config = GameGlobal.Config.ItemConfig[data.id]
			if (config) {
				txt = "获取" + config.name
			}
		}
		UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel, txt)
	}

	OnClose() {
		this._StopUpgradeAnim()
	}

	public UpdateConsumeLabel() {
		let consumeLabel = this.equipComp.consumeLabel
		let data = this.GetConsumeValue()
		if (!data) {
			return
		}
		consumeLabel.consumeItemId = data.id
		if (data.type == 0) {
			consumeLabel.overLengthFlag = true
			consumeLabel.curValue = GameGlobal.actorModel.gold
			consumeLabel.consumeValue = data.count
		} else {
			consumeLabel.overLengthFlag = false
			consumeLabel.curValue = GameGlobal.UserBag.GetCount(data.id)
			consumeLabel.consumeValue = data.count
		}
	}

	private UpdateMasterValue() {
		this.equipComp.powerLabel.text = GameGlobal.SubRoles.GetRoleData().getForgeTotalPower(this.mForgeType)
		ForgeViewHelper.UpdateMasterBtn(this.mForgeType, this.equipComp.masterBtn)
	}

	public UpdateSelAnim() {
		let role = GameGlobal.SubRoles.GetRoleData()
		let nextId = (this.mSelectIndex + 1) % EquipPos.MAX
		let equipData = role.getEquipByIndex(nextId)
		let val = this.GetForgeValue(equipData);
		this.mSelectIndex = nextId
		if (val == this.mLevelList[nextId]) {
			this._StopUpgradeAnim()
		}
		this.UpdateSel(this.mSelectIndex)
	}

	public UpdateForge() {
		let role = GameGlobal.SubRoles.GetRoleData()
		let val = this.GetForgeValue(role.getEquipByIndex(this.mSelectIndex));
		if (val != this.mLevelList[this.mSelectIndex]) {
			this.UpdateSel(this.mSelectIndex)
			this._PlayUpgradeAnim()
		}
	}

	public UpdateAllItem() {
		let role = GameGlobal.SubRoles.GetRoleData()
		if (!role) {
			return
		}
		for (let i = 0; i < this.equipComp.itemGroup.numChildren; i++) {
			let equipData = role.getEquipByIndex(i)
			if (!equipData) {
				continue
			}
			let child = this.equipComp.itemGroup.getChildAt(i) as ForgeEquipItem
			let val = this.GetForgeValue(equipData)
			this.mLevelList[i] = val
			child.starLevel.text = "+" + val
		}
	}

	public UpdateSel(index: number) {
		let role = GameGlobal.SubRoles.GetRoleData()
		for (let i = 0; i < this.equipComp.itemGroup.numChildren; i++) {
			(this.equipComp.itemGroup.getChildAt(i) as ForgeEquipItem).selectImg.visible = index == i
		}
		let equipData = role.getEquipByIndex(index)
		let val = this.GetForgeValue(equipData);

		if (this.mLevelList[index] != val) {
			let forgeEquipItem = (this.equipComp.itemGroup.getChildAt(index) as ForgeEquipItem);
			forgeEquipItem.eff = new MovieClip;
			forgeEquipItem.eff.loadUrl(ResDataPath.GetUIEffePath2("ui_eff_qh_001"), true, 1);
			forgeEquipItem.eff.x = forgeEquipItem.width >> 1;
			forgeEquipItem.eff.y = forgeEquipItem.height >> 1;
			forgeEquipItem.addChild(forgeEquipItem.eff);
		}

		this.mLevelList[index] = val;
		(this.equipComp.itemGroup.getChildAt(index) as ForgeEquipItem).starLevel.text = "+" + val

		this.lv = val
		this.config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgeType);
		this.nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgeType);

		// if (val) {
		// 	let config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgetType)
		// 	this.text_1.text = AttributeData.getAttStr(config.attr)
		// } else {
		// 	this.text_1.text = "未激活"
		// }
		// let nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgetType)
		// if (nextConfig) {
		// this.text_2.text = AttributeData.getAttStr(nextConfig.attr, 0)
		// }
		let isFull = !this.nextConfig ? true : false
		// UIHelper.SetVisible(this.arrowImg, !isFull)
		// UIHelper.SetVisible(this.text_2, !isFull)
		this.equipComp.upGroup.visible = !isFull
		this.equipComp.fullLabel.visible = isFull

		this.SetAttrData(this.config, this.nextConfig)
	}

	protected SetAttrData(config, nextConfig) {

	}

	protected GetForgeValue(data: EquipsData) {
		return 0
	}

	public CheckUpgrade() {
		let data = this.GetConsumeValue()
		if (!data) {
			return false
		}
		if (data.type == 0) {
			return Checker.Money(data.id, data.count)
		} else {
			if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
				return true
			}
		}
		return false
	}

	public SendUpgrade() {
		if (this.mIsUpdate) {
			return
		}
		GameGlobal.ForgeModel.SendUpGrade(this.mForgeType)
	}

	private _PlayUpgradeAnim() {
		if (this.mIsUpdate) {
			return
		}
		this.mIsUpdate = true
		this.AddTimer(100, 0, this.UpdateSelAnim)
	}

	private _StopUpgradeAnim() {
		if (!this.mIsUpdate) {
			return
		}
		this.mIsUpdate = false
		TimerManager.ins().remove(this.UpdateSelAnim, this)
		this.UpdateContent()
	}

	public GetConsumeValue(): { type: number, id: number, count: number } {
		let role = GameGlobal.SubRoles.GetRoleData()
		let [index, lv] = role.GetMinEquipIndexAndLevel(this.mForgeType)
		var costConfig = GameGlobal.ForgeModel.GetConfigCostData(this.mForgeType, lv + 1);
		if (costConfig) {
			return costConfig.cost;
		}
		return null
	}
}

interface ForgeEquipList extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// ForgeEquipListSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	itemGroup: eui.Group;
	powerLabel: PowerLabel;
	upGroup: eui.Group;
	getwayLabel: eui.Label;
	onKeyBtn: eui.Button;
	consumeLabel: ConsumeLabel;
	fullLabel: eui.Label;
	masterBtn: ForgeMasterBtn;
	/////////////////////////////////////////////////////////////////////////////
}

interface ForgeEquipItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// ForgeEquipItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	imgBg: eui.Image;
	imgIcon: eui.Image;
	Etext: eui.Image;
	starLevel: eui.Label;
	selectImg: eui.Image;
	eff: MovieClip;
	/////////////////////////////////////////////////////////////////////////////
}

interface ForgeMasterBtn extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// ForgeMasterBtnSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	masterBtn: eui.Button;
	masterLabel: eui.Label;
	rankLabel: eui.BitmapLabel;
	/////////////////////////////////////////////////////////////////////////////
}