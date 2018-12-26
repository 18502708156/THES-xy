
class UserTemplateRedPoint extends IRedPoint {

	// 装备
	public static readonly INDEX_EQUIP = 0
	// 升阶
	public static readonly INDEX_RANK = 1
	// 技能
	public static readonly INDEX_SKILL = 2
	// 进阶巨礼
	public static readonly INDEX_REWARD = 3
	// 皮肤
	public static readonly INDEX_SKIN = 4
	// 属性丹
	public static readonly INDEX_ATTR_ITEM = 5
	public static readonly INDEX_UP_LEVEL_ITEM = 6

	protected mEquipType: number
	protected mModel: UserTemplate

	private mEquip: number[] = []
	private mSkill: boolean[] = []
	private mSkin: {[key: number]: boolean} = {}

	public constructor(model: UserTemplate) {
		super()
		this.mModel = model
	}

	public IsRedPoint(): boolean {
		if (this.mModel.BaseConfig && this.mModel.BaseConfig.open) {
			if (!Deblocking.IsDeblocking(this.mModel.BaseConfig.open)) {
				return false
			}
		}
		return super.IsRedPoint()
	}

	protected OnChange(index: number) {
		if (index == UserTemplateRedPoint.INDEX_EQUIP) {
			GameGlobal.MessageCenter.dispatch(this.mModel.GetItemEquipRpUpdateMsg())
		} else {
			GameGlobal.MessageCenter.dispatch(this.mModel.GetItemRpUpdateMsg())
		}
	}

	public Get(index: number): boolean {
		if (!this.mModel.mLevel) {
			return false
		}
		return super.Get(index)
	}

	public OnMessage(type: string): boolean {
		if (!this.mModel.mLevel) {
			return false
		}
		let bool = false
		if (type == this.mModel.GetItemEquipUpdateMsg() || type == this.mModel.GetRankUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_EQUIP)
			bool = true
		} 
		if (type == this.mModel.GetItemSkillUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_SKILL)
			bool = true
		}
		if (type == this.mModel.GetItemSkinUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_SKIN)
			bool = true
		}
		if (type == this.mModel.GetItemAttrItemUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_ATTR_ITEM)
			bool = true
		}
		if (type == this.mModel.GetRankRewardUpdateMsg() || type == this.mModel.GetRankUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_REWARD)
			bool = true
		}
		if (type == this.mModel.GetItemRankItemUpdateMsg()) {
			this.ClearFlag(UserTemplateRedPoint.INDEX_RANK)
			bool = true
		}
		if (!bool) {
			super.OnMessage(type)
		}
		return true
	}

	public GetMessageDef(): string[] {
		let list = [
			this.mModel.GetItemEquipUpdateMsg(),
			this.mModel.GetItemSkillUpdateMsg(),
			this.mModel.GetItemSkinUpdateMsg(),
			this.mModel.GetItemAttrItemUpdateMsg(),
			this.mModel.GetItemRankItemUpdateMsg(),
			this.mModel.GetRankRewardUpdateMsg(),
			this.mModel.GetRankUpdateMsg(),
			this.mModel.GetUpLevelItemUpdateMsg(),
			this.mModel.mMsgDefInit,
			this.mModel.mMsgDefUpdateEquip,
		]
		return list
	}

	protected GetCheckFuncList() {
		let dict = {
			[UserTemplateRedPoint.INDEX_EQUIP]: this.GetIndexEquip,
			[UserTemplateRedPoint.INDEX_RANK]: this.GetIndexRank,
			[UserTemplateRedPoint.INDEX_SKILL]: this.GetIndexSkill,
			[UserTemplateRedPoint.INDEX_REWARD]: this.GetIndexReward,
			[UserTemplateRedPoint.INDEX_SKIN]: this.GetIndexSkin,
			[UserTemplateRedPoint.INDEX_ATTR_ITEM]: this.GetIndexAttrItem,
			[UserTemplateRedPoint.INDEX_UP_LEVEL_ITEM]: this.GetIndexUpLevelItem,
		}
		return dict
	}

	// UserTemplateRedPoint.INDEX_EQUIP
	private GetIndexEquip(): boolean {
		this.DoUpdateEquip()
		for (let data of this.mEquip) {
			if (data) {
				return true
			}
		}
		return false
	}

	// UserTemplateRedPoint.INDEX_RANK
	private GetIndexRank(): boolean {
		if (this.mModel.mLevel < this.mModel.mMaxLevel) {
			let config = this.mModel.LvproConfig[this.mModel.mLevel]
			if (config) {
				// let upnum = Math.floor(config.proexp / config.exp)
				// upnum = upnum - this.mModel.mUpNum
				let upnum = 1
				let enough = true
				for (let data of config.cost) {
					if (!Checker.Data({type: data.type, id: data.id, count: data.count * upnum}, false)) {
						enough = false	
						break
					}
				}
				if (enough) {
					return true
				}
			}
		}
		return false
	}

	// UserTemplateRedPoint.INDEX_SKILL
	private GetIndexSkill(): boolean {
		let skillList = this.mModel.BaseConfig.skilllist
		if (!skillList) {
			return
		}
		if (!this.mModel.mSkills) {
			return
		}
		this.mSkill = []
		for (let i = 0; i < 4; i++) {
			let can = false
			if (this.mModel.IsOpen(i)) {
				let skillId = skillList[i]
				let level = this.mModel.mSkills[i]
				if (level && this.mModel.SkillConfig[skillId][level]) {
					if (Checker.Data(this.mModel.SkillConfig[skillId][level - 1].cost, false)) {
						can = true
					}
				}
			} 
			this.mSkill[i] = can
		}
		for (let data of this.mSkill) {
			if (data) {
				return true
			}
		}
		return false
	}

	// UserTemplateRedPoint.INDEX_REWARD
	private GetIndexReward(): boolean {


		let config = GameGlobal.Config.ProgressRewardConfig[this.mModel.mTemplateType]
		if (!config) {
			return false
		}
		for (let key in config) {
			if (this.mModel.GetRewardState(Number(key)) == RewardState.CanGet) {
				return true
			}
		}
		return false
	}

	// UserTemplateRedPoint.INDEX_SKIN
	private GetIndexSkin(): boolean {
		this.mSkin = {}
		let skinConfig = this.mModel.SkinConfig
		if (skinConfig) {
			let dict = this.mModel.GetDressDict().mDict
			for (let k in skinConfig) {
				let id = Number(k)
				if (id >= 1000 && !dict[id]) {
					if (Checker.Data(skinConfig[k].itemid, false)) {
						this.mSkin[id] = true
					}
				}
			}
		}
		for (let k in this.mSkin) {
			return true
		}
		return false
	}

	// UserTemplateRedPoint.INDEX_ATTR_ITEM
	private GetIndexAttrItem(): boolean {
		if (this.mModel.BaseConfig.attreitemid) {
			return GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid) > 0
		}
		return false
	}

	private GetIndexUpLevelItem(): boolean {
		let openday = GameServer.serverOpenDay;
		if (openday <= 8) {
			if (this.mModel.mLevel < this.mModel.mMaxLevel) {
				return GameGlobal.UserBag.GetCount(this.mModel.GetShootUpDrugID()) > 0
			}
		}
		return false
	}

	private GetCanEquipList(): { [key: number]: ItemData[] } {
		let lv = this.mModel.mLevel
		//背包装备
		var equipItems = UserBag.ins().getBagEquipByType(this.mEquipType);
		if (!equipItems) {
			return {}
		}
		let subEquipItems = {}
		for (let j = 0; j < equipItems.length; j++) {
			let item = equipItems[j];
			if (lv < item.itemConfig.level) {
				continue
			}
			let itemSubType = item.itemConfig.subType;
			let list = subEquipItems[itemSubType]
			if (!list) {
				list = subEquipItems[itemSubType] = []
			}
			list.push(item)
		}
		return subEquipItems
	}

	private DoUpdateEquip() {
		if (!this.mEquipType) {
			return
		}
		var subEquipItems = this.GetCanEquipList()
		if (!subEquipItems)
			return;

		var tempEquips = []; 

		let checkFunc2 = (item: ItemData) => {
			//已经装备的就跳过
			if (tempEquips.indexOf(item) >= 0) {
				return false
			}
			return true
		}

		var modelEquipData = this.mModel.mEquip
		var equipCount = modelEquipData.length;
		for (let i = 0; i < equipCount; i++) {
			let equip = modelEquipData[i]
			//有装备跳过
			if (equip.handle != 0)
				continue;
			let subList = subEquipItems[i]
			if (subList) {
				for (let item of subList) {
					if (!checkFunc2(item)) {
						continue
					}
					tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
				}
			}
		}
		//对比有装备的
		for (let i = 0; i < equipCount; i++) {
			let equip = modelEquipData[i]
			//无装备跳过
			if (equip.handle == 0)
				continue;

			let subList = subEquipItems[i]
			if (subList) {
				for (let item of subList) {
					if (!checkFunc2(item)) {
						continue
					}
					tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip, item);
				}
			}
		}
		let equipRedPoint = this.mEquip
		for (let i = 0, len = UserTemplate.EQUIP_COUNT; i < len; i++) {
			let equip = modelEquipData[i];
			equipRedPoint[i] = tempEquips[i] && equip.handle != tempEquips[i].handle ? tempEquips[i].handle : 0
		}
	}

	public IsRedEquip(index: number): number {
		return this.mEquip[index]
	}

	public IsRedSkill(index: number): boolean {
		return this.mSkill[index] ? true : false
	}

	public IsRedSkin(skinId: number): boolean {
		return this.mSkin[skinId] ? true : false
	}
}