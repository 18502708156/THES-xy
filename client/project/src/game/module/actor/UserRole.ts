class UserRole extends IRedPoint {

	// 装备
	public static readonly INDEX_EQUIP = 0
	// 时装
	public static readonly INDEX_SKIN = 1
	// 称号
	public static readonly INDEX_TITLE = 2
	// 升级
	public static readonly INDEX_UP_LEVEL = 3
	// //法宝
	// public static readonly INDEX_TREASURE = 4
	//经脉
	public static readonly INDEX_JINGAMI = 5
	//丹药
	public static readonly INDEX_ELIXIR = 6

	public static readonly INDEX_ORANGE = 7


	private mSkin: { [key: number]: boolean } = {}
	private mTitle: { [key: number]: boolean } = {}

	protected OnChange(index: number) {
		if (index == UserRole.INDEX_EQUIP) {
			MessageCenter.ins().dispatch(MessageDef.ROLE_HINT);
		} else {
			MessageCenter.ins().dispatch(MessageDef.RP_ROLE_HINT);
		}
	}

	public OnMessage(type: string): boolean {
		let ret = true
		if (type == MessageDef.BAG_USER_ORANGE_COUNT_UPDATE || type == MessageDef.BAG_USER_EQUIP_COUNT_UPDATE || type == MessageDef.LEVEL_CHANGE || type == MessageDef.CHANGE_EQUIP) {
			this.ClearFlag(UserRole.INDEX_ORANGE)
			ret = false
		}
		if (type == MessageDef.BAG_USER_SKIN_COUNT_UPDATE || type == MessageDef.ROLE_SKIN_UPDATE) {
			this.ClearFlag(UserRole.INDEX_SKIN)
		} else if (type == MessageDef.BAG_USER_TITLE_COUNT_UPDATE || type == MessageDef.ROLE_TITLE_UPDATE) {
			this.ClearFlag(UserRole.INDEX_TITLE)
		} else if (type == MessageDef.EXP_CHANGE) {
			this.ClearFlag(UserRole.INDEX_UP_LEVEL)
		// } else if (type == MessageDef.TREASURE_CHANGE) { //法宝
		// 	this.ClearFlag(UserRole.INDEX_TREASURE)
		} else if (type == MessageDef.JINGMAI_DATA_UPDATE) {
			this.ClearFlag(UserRole.INDEX_JINGAMI)
		}else if (type == MessageDef.ROLE_ELIXIR_UPDATE) {
			this.ClearFlag(UserRole.INDEX_ELIXIR)
		} else {
			return super.OnMessage(type)
		}
		return ret
	}

	public GetMessageDef(): string[] {
		let list = [
			MessageDef.BAG_USER_EQUIP_COUNT_UPDATE, MessageDef.LEVEL_CHANGE, MessageDef.CHANGE_EQUIP,
			MessageDef.BAG_USER_SKIN_COUNT_UPDATE, MessageDef.ROLE_SKIN_UPDATE,	// 皮肤
			MessageDef.BAG_USER_TITLE_COUNT_UPDATE, MessageDef.ROLE_TITLE_UPDATE, // 称号
			MessageDef.EXP_CHANGE,
			MessageDef.CHANGE_ITEM,
			// MessageDef.TREASURE_CHANGE, //法宝
			MessageDef.JINGMAI_DATA_UPDATE,
			MessageDef.ROLE_ELIXIR_UPDATE,

			MessageDef.BAG_USER_ORANGE_COUNT_UPDATE
		]
		return list
	}

	protected GetCheckFuncList() {
		let dict = {
			[UserRole.INDEX_EQUIP]: this.GetIndexEquip,
			[UserRole.INDEX_SKIN]: this.GetIndexSkin,
			[UserRole.INDEX_TITLE]: this.GetIndexTitle,
			[UserRole.INDEX_UP_LEVEL]: this.GetIndexUpLevel,
			// [UserRole.INDEX_TREASURE]: this.GetIndexTreasure,
			[UserRole.INDEX_JINGAMI]: this.GetIndexJingmai,
			[UserRole.INDEX_ELIXIR]: this.GetIndexElixir,
			[UserRole.INDEX_ORANGE]: this.GetIndexOrange,
		}
		return dict
	}

	private GetIndexSkin(): boolean {
		this.mSkin = {}
		let config = GameGlobal.Config.FashionSkinConfig
		let sex = GameGlobal.actorModel.sex
		for (let key in config) {
			let data = config[key][sex]
			if (data) {
				if (!GameGlobal.UserSkin.HasDress(data.skinid)) {
					if (Checker.Data(data.itemid, false)) {
						this.mSkin[data.skinid] = true
					}
				}
			}

		}
		for (let k in this.mSkin) {
			return true
		}
		return false
	}

	private GetIndexUpLevel(): boolean {
		let level = GameGlobal.actorModel.level
		let exp = GameGlobal.actorModel.exp
		let config = GameGlobal.Config.ExpConfig[level]
		let canUp = false
		if (GameGlobal.Config.ExpConfig[level + 1]) {
			canUp = exp >= config.exp
		}
		return canUp
	}

	// private GetIndexTreasure(): boolean {
	// 	let canUp =false
	// 	if(Deblocking.Check(DeblockingType.TYPE_31, true))
	// 	{
	// 		canUp = GameGlobal.TreasureController.mRedPoint.IsRedPoint()
	// 	}
	// 	return canUp
	// }



	private GetIndexTitle(): boolean {
		this.mTitle = {}
		let config = GameGlobal.Config.TitleConf
		for (let key in config) {
			let data = config[key]
			if (!GameGlobal.UserTitle.HasDress(data.skinid)) {
				if (Checker.Data(data.itemid, false)) {
					this.mTitle[data.skinid] = true
				}
			}
		}
		for (let k in this.mTitle) {
			return true
		}
		return false
	}

	private GetIndexEquip(): boolean {
		this.checkHaveCan()
		for (var j = 0; j < this.canChangeEquips.length; j++) {
			if (this.canChangeEquips[j]) {
				return true
			}
		}
		return false
	}

	canChangeEquips: number[] = []

	private m_CheckHaveCanTimer: number = null
	private m_CheckTimer: number = 0

	private _ContinueCheck(): void {
		this.checkHaveCan()
	}

	// 获取该职业所以可以装备的物品
	private GetCanEquipList(job: number) {
		let lv = GameGlobal.actorModel.level
		//背包装备
		var equipItems = UserBag.ins().getBagEquipByType(0);
		if (!equipItems) {
			return
		}
		let checkFunc = (item: ItemData) => {
			if (!item.itemConfig)
				return false
			if ((item.itemConfig.job != 0 //是通用职业装备
				&& item.itemConfig.job != job) //职业不符合的跳过
				|| lv < item.itemConfig.level //等级不足的跳过
			)
				return false
			return true
		}
		let subEquipItems = {}
		for (let j = 0; j < equipItems.length; j++) {
			let item = equipItems[j];
			if (!checkFunc(item)) {
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

	public SendEquip() {
		this.checkHaveCan(true)
	}

    /**
     * 检测是否有装备可以穿
     * @param isWear 是否要穿可以穿的装备
     * @param roleIndex 传装备的角色索引
     */
	checkHaveCan(isWear: boolean = false) {
		if (!isWear && this.m_CheckTimer > egret.getTimer()) {
			// 如果在检查时间内
			if (this.m_CheckHaveCanTimer == null) {
				this.m_CheckHaveCanTimer = egret.setTimeout(this._ContinueCheck, this, 1000)
			}
			return
		}
		this.m_CheckTimer = egret.getTimer() + 800
		if (this.m_CheckHaveCanTimer) {
			egret.clearTimeout(this.m_CheckHaveCanTimer)
			this.m_CheckHaveCanTimer = null
		}

		//记录处理的装备
		var tempEquips = [];
		//角色身上装备
		let role = SubRoles.ins().GetRoleData()

		if (!role) return;
		//背包装备
		let subEquipItems = this.GetCanEquipList(role.job)

		let checkFunc2 = (item: ItemData) => {
			//已经装备的就跳过
			if (tempEquips.indexOf(item) >= 0) {
				return false
			}
			return true
		}

		let equipLen = role.getEquipLen();
		//优先处理没有装备的位置
		for (let i = 0; i < equipLen; i++) {
			let equip = role.getEquipByIndex(i);
			//有装备跳过
			if (equip.item.handle != 0) {
				continue;
			}
			let subList = subEquipItems[ForgeConst.EQUIP_POS_TO_SUB[i]]
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
		for (let i = 0; i < equipLen; i++) {
			let equip = role.getEquipByIndex(i);
			//无装备跳过
			if (equip.item.handle == 0) {
				continue;
			}
			let subList = subEquipItems[equip.item.itemConfig.subType]
			if (subList) {
				for (let item of subList) {
					if (!checkFunc2(item)) {
						continue
					}
					tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip.item, item);
				}
			}
		}
		for (let i = 0; i < equipLen; i++) {
			let equip = role.getEquipByIndex(i);
			this.canChangeEquips[i] = 0;
			if (tempEquips[i] && equip.item.handle != tempEquips[i].handle) {
				if (isWear) {
					UserEquip.ins().sendWearEquipment(tempEquips[i].handle, i);
					this.canChangeEquips[i] = 0;
				}
				else {
					this.canChangeEquips[i] = tempEquips[i].configID;
				}
			}
		}
		let has = false
		for (let id of this.canChangeEquips) {
			if (id) {
				has = true
				break
			}
		}
		if (!has) {
			this.canChangeEquips.length = 0;
		}
		MessageCenter.ins().dispatch(MessageDef.ROLE_HINT);
	}

	public IsRedEquip(): boolean {
		for (var j = 0; j < this.canChangeEquips.length; j++) {
			if (this.canChangeEquips[j]) {
				return true
			}
		}
		return false
	}

	public IsRedSkin(skinId: number): boolean {
		return this.mSkin[skinId] ? true : false
	}

	public GetIndexJingmai() {
		if (!Deblocking.Check(DeblockingType.TYPE_30, true)) {
			return false
		}
		let config = GameGlobal.Config.JingMaiLevelConfig;
		let configData = config[0 == GameGlobal.JingMaiData.level ? 1 : GameGlobal.JingMaiData.level]
		if (!configData) {
			return false
		}
		let item = configData.itemid;
		if (!item) {
			return false
		}
		return item.count <= GameGlobal.UserBag.GetCount(item.id);
	}

	public GetIndexElixir() {
		if (!Deblocking.Check(DeblockingType.TYPE_29, true)) {
			return false
		}
		let config = GameGlobal.UserElixir.getElixirData();
		for (let key in config) {
			let item = config[key].itemid;
			if (item.count <= GameGlobal.UserBag.GetCount(item.id)) {
				return true;
			}
		}
		return false;
	}

	private mOrangeCount: {[key: number]: number} = {}

	public GetIndexOrange() {
		this.mOrangeCount = {}
		let count = GameGlobal.UserBag.GetCount(SHOP_MONEY.jinzhuang)
		let role = GameGlobal.SubRoles.GetRoleData()
		if (!role) {
			return
		}
		let minLevel = 40
		let actLevel = GameGlobal.actorModel.level
		if (actLevel < minLevel) {
			return
		}
		let level = Math.max(Math.floor(actLevel / 20) * 20, minLevel)
		let pos = 0
		for (let data of role.equipsData) {
			let curLevel = 0
			// 有橙装
			if (data.item && data.item.itemConfig) {
				let quality = data.item.itemConfig.quality
				if (quality == 4) {
					curLevel = data.item.itemConfig.level
				} else if (quality > 4) {
					curLevel = 99999
				}
			}
			for (let cLevel = level; cLevel >= minLevel; cLevel -= 20) {
				let itemLevel = pos * 2 + cLevel
				if (itemLevel > actLevel) {
					continue
				}
				if (itemLevel <= curLevel) {
					continue
				}
				let needCount = GameGlobal.ShopController.mEquipCurrencyCount[cLevel]
				if (count >= needCount) {
					this.mOrangeCount[pos] = cLevel
					break
				}
			}
			++pos
		}
	}

	public IsOrange(pos: number): number {
		return this.mOrangeCount[pos] || 0
	}
}