class PetXilianPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// PetXilianSkillSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected group01: eui.Group;
	protected group02: eui.Group;
	protected btn01: eui.Button;
	protected btn02: eui.Button;
	protected btnchage: eui.Button;
	protected btnInfo: eui.Button;
	protected checkBox: eui.CheckBox;
	protected curSelCount: eui.Label;
	protected needYbLabel: eui.Label;
	protected consume01: ConsumeLabel;
	protected consume02: ConsumeLabel;

	/////////////////////////////////////////////////////////////////////////////

	private static LOCK_IMG = "ui_bt_suo"
	private static UNLOCK_IMG = "ui_bt_weisuo"

	private mItemLeft: PetXilianItem[] = []
	private mItemRight: PetXilianItem[] = []

	private mPetId: number

	public constructor() {
		super()
		this.skinName = "PetXilianSkillSkin"
		this.commonWindowBg.SetTitle("技能洗练")
		this._AddClick(this.btn01, this._OnClick)
		this._AddClick(this.btn02, this._OnClick)
		this._AddClick(this.btnchage, this._OnClick)
		this._AddClick(this.btnInfo, this._OnClick)
		for (let i = 0; i < this.group01.numChildren; i++) {
			let item = this.group01.getChildAt(i) as PetXilianItem
			this.SetBg(item, i)
			this.mItemLeft.push(item)
			item.lockImg.name = i + ""
			this._AddClick(item.lockImg, this._OnLockClick)

			item.skillGroup.name = i.toString()
			this._AddClick(item.skillGroup, this._OnSkillIconClick)
		}
		for (let i = 0; i < this.group02.numChildren; i++) {
			let item = this.group02.getChildAt(i) as PetXilianItem
			this.SetBg(item, i)
			this.mItemRight.push(item)

			item.skillGroup.name = i.toString()
			this._AddClick(item.skillGroup, this._OnRightSkillIconClick)
		}
		this.consume01.mIsImg = true
		this.consume02.mIsImg = true
	}

	private SetBg(item: PetXilianItem, index: number) {
		item.bgImg.source = index % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02"
	}

	public OnOpen(...param: any[]) {
		this.mPetId = param[0]
		this.commonWindowBg.OnAdded(this)

		let buffSkill = this.GetBuffSkill()
		let len = buffSkill.length
		for (let i = 0; i < len; i++) {
			let leftItem = this.mItemLeft[i]
			leftItem.skillGroup.visible = true
			leftItem.lockGroup.visible = false
			let rightItem = this.mItemRight[i]
			rightItem.skillGroup.visible = true
			rightItem.lockGroup.visible = false
		}
		for (let i = len; i < this.mItemLeft.length; i++) {
			let leftItem = this.mItemLeft[i]
			leftItem.lockImg.visible = false
			leftItem.skillGroup.visible = false
			leftItem.lockGroup.visible = true
			leftItem.skillName.text = ""
			leftItem.skillDesc.text = "未开放"
			let rightItem = this.mItemRight[i]
			rightItem.lockImg.visible = false
			rightItem.skillGroup.visible = false
			rightItem.lockGroup.visible = true
			rightItem.skillName.text = ""
			rightItem.skillDesc.text = "未开放"
		}

		this.GetMsgDef()
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)
		this.UpdateContent()
	}

	protected GetMsgDef() {
		this.observe(MessageDef.PET_UPATE_INFO, this.UpdateContent)
	}

	protected GetBuffSkill() {
		let petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId)
		let buffSkill = petInfo.mBuffSkill
		return buffSkill
	}

	protected GetXilianSkill(i: number) {
		let petInfo = GameGlobal.PetModel.GetPetInfo(this.mPetId)
		return petInfo.mXilianSkill[i]
	}

	protected SendSkillXilian() {
		GameGlobal.PetModel.SendSetXilian(this.mPetId)
	}

	protected SendSendXilian(list, type) {
		GameGlobal.PetModel.SendXilian(this.mPetId, list, type, this.checkBox.selected)
	}

	protected GetBaseConfig() {
		return GameGlobal.Config.petbaseConfig
	}

	public UpdateContent() {
		let buffSkill = this.GetBuffSkill()
		let len = buffSkill.length
		for (let i = 0; i < len; i++) {
			let leftItem = this.mItemLeft[i]
			let skillId = buffSkill[i]
			this.SetData(leftItem, skillId)
		}
		for (let i = 0; i < len; i++) {
			let rightItem = this.mItemRight[i]
			let data = this.GetXilianSkill(i)
			if (data) {
				this.SetData(rightItem, data)
			} else {
				rightItem.skillImg.source = ""
				rightItem.skillImg.source = "ui_cw_bm_cheng"
				rightItem.skillName.text = ""
				rightItem.skillDesc.text = "未洗练"
			}
		}

		let baseConfig = this.GetBaseConfig()
		let data1 = baseConfig.freshitemid[0]
		this.consume01.consumeItemId = data1.itemId
		this.consume01.curValue = GameGlobal.UserBag.GetCount(data1.itemId)
		this.consume01.consumeValue = 1
		let data2 = baseConfig.freshitemid[1]
		this.consume02.consumeItemId = data2.itemId
		this.consume02.curValue = GameGlobal.UserBag.GetCount(data2.itemId)
		this.consume02.consumeValue = 1
	}

	public static GetSkillNameColor(skillName: string) {
		let sName = ""
		for (let i = 0, len = skillName.length; i < len; i++) {
			let str = skillName.charAt(i)
			sName += `|C:${ItemBase.SKILL_NAME_COLOR[i % ItemBase.SKILL_NAME_COLOR.length]}&T:${str}`;
		}
		return TextFlowMaker.generateTextFlow(sName)
	}

	private SetData(item: PetXilianItem, skillId: number) {
		let quality = PetConst.GetPassSkillQuality(skillId)
		item.qImg.source = PetConst.QUALITY_SKILL_BG[quality]
		item.skillImg.source = PetConst.GetPassSkillIcon(skillId)
		let skillName = PetConst.GetPassSkillName(skillId)
		if (quality == 6) {
			item.skillName.textFlow = PetXilianPanel.GetSkillNameColor(skillName)
		} else {
			item.skillName.text = skillName
			item.skillName.textColor = ItemBase.GetColorByQuality(quality)
		}
		item.skillDesc.text = PetConst.GetPassSkillDesc(skillId)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btn01:
				this.SendXilian(0)
				break
			case this.btn02:
				this.SendXilian(1)
				break
			case this.btnchage:
				this.SendSkillXilian()
				break
			case this.btnInfo:
				ViewManager.ins().open(ActivityDescPanel, 46);
				break
		}
	}

	private SendXilian(type: number) {
		let baseConfig = this.GetBaseConfig()
		let data = baseConfig.freshitemid[type]
		let itemId = data.itemId
		let value = 1

		let list = []
		for (let i = 0; i < this.mItemLeft.length; i++) {
			if (this.mItemLeft[i].lock) {
				list.push(i)
			}
		}
		let yb = 0
		if (list.length) {
			yb = this.GetBaseConfig().freshMoney[list.length - 1]
			if (!Checker.Money(MoneyConst.yuanbao, yb)) {
				return
			}
		}
		let price = GameGlobal.actorModel.yb - yb
		if (Checker.CheckItem(itemId, value, this.checkBox.selected, price, ShopController.EN_SHOP_YUANBAO)) {
			this.SendSendXilian(list, type)
		}
	}

	private _OnLockClick(e: egret.TouchEvent) {
		let index = parseInt(e.currentTarget.name)
		let item = this.mItemLeft[index]
		if (this._IsLastOne() && !item.lock) {
			UserTips.ins().showTips("技能不可全部锁定")
			return
		}
		item.lock = !item.lock
		item.lockImg.source = item.lock ? PetXilianPanel.LOCK_IMG : PetXilianPanel.UNLOCK_IMG
		this._UpdateLock()
	}

	private _OnSkillIconClick(e: egret.TouchEvent) {
		let index = parseInt(e.currentTarget.name)
		let buffSkill = this.GetBuffSkill()
		let skillId = buffSkill[index]
		if (!skillId)
			return

		ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
	}

	private _OnRightSkillIconClick(e: egret.TouchEvent) {
		let index = parseInt(e.currentTarget.name)
		let skillId = this.GetXilianSkill(index)
		if (!skillId)
			return

		ViewManager.ins().open(PetSkillTipPanel, 2, skillId)
	}

	private _UpdateLock() {
		let lockCount = 0
		for (let i = 0; i < this.mItemRight.length; i++) {
			let rightItem = this.mItemRight[i]
			let leftItem = this.mItemLeft[i]
			if (leftItem.lock) {
				++lockCount
			}
			rightItem.lockImg.source = leftItem.lockImg.source
		}
		this.curSelCount.text = lockCount + "个"
		let cost = 0
		if (lockCount != 0) {
			cost = this.GetBaseConfig().freshMoney[lockCount - 1]
		}
		this.needYbLabel.text = cost + "元宝"
	}

	private _IsLastOne() {
		let lockCount = 0
		for (let i = 0; i < this.mItemLeft.length; i++) {
			let leftItem = this.mItemLeft[i]
			if (leftItem.lock) {
				++lockCount
			}
		}

		let buffSkill = this.GetBuffSkill()
		return buffSkill.length == lockCount + 1
	}
}

interface PetXilianItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// PetXilianItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	bgImg: eui.Image;
	skillName: eui.Label;
	skillDesc: eui.Label;
	lockGroup: eui.Group;
	skillGroup: eui.Group;
	skillImg: eui.Image;
	qImg: eui.Image;
	lockImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	lock: boolean
}