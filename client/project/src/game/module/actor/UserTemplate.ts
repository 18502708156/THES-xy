class UserTemplate extends BaseSystem {

	public static readonly EQUIP_COUNT = 4

	public static TYPE_RIDE = 1				// 坐骑
	public static TYPE_WING = 2				// 翅膀
	public static TYPE_TIANX = 3			// 守护
	public static TYPE_SHENGB = 4			// 神兵
	public static TYPE_PET_SHOUH = 5		// 兽魂
	public static TYPE_PET_TONGL = 6		// 通灵
	public static TYPE_XIANLV_XW = 7		// 仙侣仙位
	public static TYPE_XIANLV_FZ = 8		// 仙侣法阵

	public static TYPE_HAVING_HAVING = 9	//玄女
	public static TYPE_HAVING_LINGQ = 10	//灵气
	public static TYPE_HAVING_HUAN = 11	    //花辇

	public static TYPE_LINGTONG = 12 		// 灵童

	public static TYPE_DRESS_FATION = 100	   //时装
	public static TYPE_TITLE = 101	   //称号

	public static TEMPTYPE_TO_ITEMTYPE = {
		[UserTemplate.TYPE_RIDE]: ItemType.RIDE,
		[UserTemplate.TYPE_WING]: ItemType.WING,
		[UserTemplate.TYPE_TIANX]: ItemType.TIANXIAN,
		[UserTemplate.TYPE_SHENGB]: ItemType.SHENGB,
		[UserTemplate.TYPE_PET_SHOUH]: ItemType.PET_SH,
		[UserTemplate.TYPE_PET_TONGL]: ItemType.PET_TL,
		[UserTemplate.TYPE_XIANLV_XW]: ItemType.XIAN_XW,
		[UserTemplate.TYPE_XIANLV_FZ]: ItemType.XIAN_FZ,
		[UserTemplate.TYPE_HAVING_LINGQ]: ItemType.LINGQI,
		[UserTemplate.TYPE_HAVING_HUAN]: ItemType.HUA,
		[UserTemplate.TYPE_HAVING_HAVING]: ItemType.TIANNV,
	}

	private static ITEMTYPE_TO_TEMPTYPE = null

	public static GetTemplateTypeByItemType(itemType: number) {
		if (!UserTemplate.ITEMTYPE_TO_TEMPTYPE) {
			let data = UserTemplate.ITEMTYPE_TO_TEMPTYPE = {}
			for (let k in UserTemplate.TEMPTYPE_TO_ITEMTYPE) {
				data[UserTemplate.TEMPTYPE_TO_ITEMTYPE[k]] = k
			}
		}
		return UserTemplate.ITEMTYPE_TO_TEMPTYPE[itemType]
	}

	public IsShowShootUpDrugID(): boolean {
		let openday = GameServer.serverOpenDay;
        return openday <= 8;
	}

	/**获取直升丹ID */
	public GetShootUpDrugID(): number {
		let config = GameGlobal.Config.AdvanceItemConfig;
		let drugId = 0;
		for(let key in config) {
			if(config[key].type == this.mTemplateType) {
				drugId = config[key].item;
				break;
			}
		}
		return drugId;
	}

	// 进阶奖励
	public GetRankUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_RANK_UP_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 进阶奖励
	public GetRankRewardUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 装备物品更新的消息
	public GetItemEquipUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_EQUIP_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 技能物品更新的消息
	public GetItemSkillUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_SKILL_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 皮肤物品更新的消息
	public GetItemSkinUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_SKIN_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 属性丹更新的消息
	public GetItemAttrItemUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_ATTR_ITEM_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 直升丹更新的消息
	public GetUpLevelItemUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_UP_LEVEL_ITEM_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 升阶丹更新的消息
	public GetItemRankItemUpdateMsg(): string {
		return MessageDef.USER_TEMPLATE_RANK_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 装备物品更新红点消息
	public GetItemEquipRpUpdateMsg(): string {
		return MessageDef.RP_USER_TEMPLATE_EQUIP_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	// 其它更新的红点消息
	public GetItemRpUpdateMsg(): string {
		return MessageDef.RP_USER_TEMPLATE_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType]
	}

	public mRedPoint: UserTemplateRedPoint

	public mReward: number = 0
	public mLevel: number = 0
	public mUpNum: number = 0
	public mDrugNum: number = 0
	public mSkills: number[] = []
	public mEquip: ItemBaseData[] = []
	public mEquipIcon: string[] = []
	public mDressId: number = 0
	public mDressList: number[] = []
	private mTmpDressList: {
		mList: number[],
		mDict: { [key: number]: boolean },
	}

	public mMaxLevel: number = 10

	public mTemplateType: number
	public mMsgDefUpdateExp: string
	public mMsgDefInit: string
	public mMsgDefUpdate: string
	public mMsgDefUpdateDrug: string
	public mMsgDefUpdateEquip: string

	public BaseConfig
	public LvproConfig
	public SkillConfig
	public AttrsConfig
	public ProgressConfig
	public SkinConfig

	public mRideSkills: number[] = []
	public LOCK_SKILLS: number[] = []

	public constructor(type: number) {
		super();
		this.mTemplateType = type
		GameGlobal.SubRoles.mTemplate[type] = this
	}

	protected GetTemplateType(): number {
		return this.mTemplateType
	}

	public Init() {
		this.LOCK_SKILLS = []
		for (let key in this.BaseConfig.openskilllv) {
			this.LOCK_SKILLS.push(parseInt(key))
		}
		this.LOCK_SKILLS.sort(function (lhs, rhs) {
			return lhs - rhs
		})
		this.mRideSkills = this.BaseConfig.skilllist
		for (let k in this.mRideSkills) {
			this.mSkills.push(0)
		}
		let equipIcon = this.BaseConfig.equip
		for (let i = 0; i < 4; i++) {
			this.mEquip.push(new ItemBaseData)
			this.mEquipIcon.push(equipIcon ? (equipIcon[i] || "") : "")
		}
		if (this.SkillConfig) {
			// 绑定技能道具消息
			let skillMsg = this.GetItemSkillUpdateMsg()
			for (let key in this.SkillConfig) {
				let data = this.SkillConfig[key]
				GameGlobal.UserBag.AddListenerItem(data[1].cost.id, skillMsg)
			}
		}
		// 绑定皮肤道具消息
		if (this.SkinConfig) {
			let skinMsg = this.GetItemSkinUpdateMsg()
			for (let key in this.SkinConfig) {
				let data = this.SkinConfig[key]
				let item = data.itemid
				if (item) {
					GameGlobal.UserBag.AddListenerItem(item.id, skinMsg)
				}
			}
		}
		for (let key in this.LvproConfig) {
			GameGlobal.UserBag.AddListenerItem(this.LvproConfig[key].cost[1].id, this.GetItemRankItemUpdateMsg())
			break
		}
		GameGlobal.UserBag.AddListenerItem(this.BaseConfig.attreitemid, this.GetItemAttrItemUpdateMsg())
		this.mMaxLevel = CommonUtils.getObjectLength(this.AttrsConfig)

		let id = this.GetShootUpDrugID()
		if (id) {
			GameGlobal.UserBag.AddListenerItem(id, this.GetUpLevelItemUpdateMsg())
		}
	}

	public IsOpen(index: number) {
		let openLevel = this.GetOpenLevel(index)
		return this.mLevel >= openLevel
	}

	public GetOpenLevel(index: number) {
		return this.LOCK_SKILLS[index]
	}

	protected OnActive() {

	}

	public _DoInitData(rsp: Sproto.sc_template_init_data_request) {
		this.mLevel = rsp.lv
		this.mUpNum = rsp.upNum
		this.mDressId = rsp.useClothes
		this.mDressList = rsp.clothesList || []
		this.mTmpDressList = null
		this.mSkills = rsp.skillList
		this.mDrugNum = rsp.drugNum || 0
		this.mReward = rsp.reward || 0
		this.UpdateDress()
		for (let i = 0; i < rsp.equipList.length; i++) {
			let data = rsp.equipList[i]
			if(data.id) this.mEquip[i].ParserByEquipData(data)
		}
		GameGlobal.MessageCenter.dispatch(this.mMsgDefInit)
		GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdate)

		this.OnActive()
	}

	public _DoUpdateData(rsp: Sproto.sc_template_update_data_request) {
		if (rsp.reward != null) {
			this.mReward = rsp.reward || 0
			GameGlobal.MessageCenter.dispatch(this.GetRankRewardUpdateMsg())
			GameGlobal.MessageCenter.dispatch(MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ALL___)
		}
		if (rsp.lv) {
			this.mLevel = rsp.lv
			GameGlobal.MessageCenter.dispatch(this.GetRankUpdateMsg())
			GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateExp, true)
		}
		if (rsp.upNum != null) {
			this.mUpNum = rsp.upNum
			GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateExp, false)
		}
		if (rsp.drugNum) {
			this.mDrugNum = rsp.drugNum
			GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateDrug)
		}
		if (rsp.clothesList) {
			this.mDressList = rsp.clothesList || []
			this.mTmpDressList = null
		}
		if (rsp.useClothes) {
			this.mDressId = rsp.useClothes
			this.UpdateDress()
		}
		if (rsp.skillList) {
			this.mSkills = rsp.skillList
		}
		if (rsp.equipList) {
			let change = false
			for (let i = 0; i < rsp.equipList.length; i++) {
				let data = rsp.equipList[i]
				if (data.id) {
					this.mEquip[i].ParserByEquipData(data)
					change = true
				}
			}
			if (change) {
				GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateEquip)
			}
		}
		GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdate)
	}

	protected UpdateDress() {
		let role = SubRoles.ins().GetRoleData()
		if (role) {
			role.UpdateTemplateData(this.mTemplateType, this.mDressId, this.mDressList)
		}
	}

	public SendBoost(useyb: number) {
		var rsp = new Sproto.cs_template_up_level_request();
		rsp.autoBuy = useyb;
		rsp.templateType = this.mTemplateType
		this.Rpc(C2sProtocol.cs_template_up_level, rsp);
	}

	public SendUpSkill(skillIndex: number) {
		let rsp = new Sproto.cs_template_up_skill_request
		rsp.skillNo = skillIndex + 1
		rsp.templateType = this.mTemplateType
		this.Rpc(C2sProtocol.cs_template_up_skill, rsp)
	}

	public SendDress(id: number) {
		let rsp = new Sproto.cs_template_clothes_request
		rsp.clothesNo = id
		rsp.templateType = this.mTemplateType
		this.Rpc(C2sProtocol.cs_template_clothes, rsp)
	}

	public SendEquip(itemhandle: number) {
		var rsp = new Sproto.cs_template_equip_request();
		rsp.itemNo = itemhandle;
		rsp.templateType = this.mTemplateType
		this.Rpc(C2sProtocol.cs_template_equip, rsp);
	}

	public SendGetReward(id: number) {
		let rsp = new Sproto.cs_template_reward_request
		rsp.templateType = this.mTemplateType
		rsp.no = id
		this.Rpc(C2sProtocol.cs_template_reward, rsp)
	}

	public SendActiveDress(id: number) {
		let req = new Sproto.cs_template_buy_clothes_request
		req.templateType = this.mTemplateType
		req.clothesNo = id
		this.Rpc(C2sProtocol.cs_template_buy_clothes, req)
	}

	public SendDrug(count: number) {
		let rsp = new Sproto.cs_template_drug_request();
		rsp.drugNum = count;
		rsp.templateType = this.mTemplateType
		this.Rpc(C2sProtocol.cs_template_drug, rsp);
	}

	/**使用直升丹 */
	public SendShootUpDrug(drugId: number) {
		let rsp = new Sproto.cs_template_up_stage_request
		rsp.drugId = drugId;
		this.Rpc(C2sProtocol.cs_template_up_stage, rsp);
	}

	public GetNextAddPower(level: number) {
		return ItemConfig.CalcAttrScoreValue(this.GetAttrByLv(this.mLevel + 1)) - ItemConfig.CalcAttrScoreValue(this.GetCurAttr())
	}

	public GetAppaId(): number {
		if (this.SkinConfig) {
			let data = this.SkinConfig[this.mDressId]
			if (data) {
				return data.pid
			}
		} else {
			console.error("not GetAppaId skinconfig => " + egret.getQualifiedClassName(this))
		}
		return 0
	}

	public static GetAppaId(config: any, dressId: number) {
		if (config) {
			let data = config[dressId]
			if (data) {
				return data.pid ||0
			}
		}
		return 0
	}

	public GetPower(): number {
		let power = 0
		power += ItemConfig.CalcAttrScoreValue(this.GetCurAttr())
		power += ItemConfig.CalcAttrScoreValue(this.GetCurEquipAttr())
		return power
	}

	public GetDescPower(): number {
		let attr1 = this.GetCurAttr()
		let attr2 = this.GetCurEquipAttr()
		let attr3 = this.GetCurDressAttr()
		let attr4 = this.GetCurDrugAttr()
		let attr5 = this.GetCurSkillAttr()

		let power = 0
		power += ItemConfig.CalcAttrScoreValue(attr1)
		power += ItemConfig.CalcAttrScoreValue(attr2)
		power += ItemConfig.CalcAttrScoreValue(attr3)
		power += ItemConfig.CalcAttrScoreValue(attr4)
		power += ItemConfig.CalcAttrScoreValue(attr5)
		return power
	}

	public GetCurAttr() {
		return this.GetAttrByLv(this.mLevel)
	}

	//public GetCurAttr() {
	public GetAttrByLv(level) {
		let config = this.ProgressConfig[level]//this.mLevel]
		if (!config) {
			return []
		}
		let cfg = this.AttrsConfig[this.mLevel]
		if (!cfg) {
			return []
		}
		let upConfig = cfg.attrpower
		let attr = []
		let configAttr = config.attrpower
		for (let k in configAttr) {
			let data = configAttr[k]
			for (let k2 in upConfig) {
				if (upConfig[k2].type == data.type) {
					attr.push({ type: data.type, value: data.value + upConfig[k2].value * this.mUpNum })
					break
				}
			}
		}
		return attr
	}

	public GetCurEquipAttr() {
		let allAttr = {}
		for (let data of this.mEquip) {
			if (data.configID) {
				AttributeData.AttrAddTo(allAttr, GameGlobal.Config.EquipConfig[data.configID].attrs)
				AttributeData.AttrAddTo(allAttr, data.att)
			}
		}
		let list = []
		for (let k in allAttr) {
			list.push({ type: k, value: allAttr[k] })
		}
		if (!list.length) {
			return [
				{ type: AttributeType.atMaxHp, value: 0 },
				{ type: AttributeType.atAttack, value: 0 },
				{ type: AttributeType.atDef, value: 0 },
			]
		}
		return list
	}

	public GetCurDressAttr() {
		let allAttr = {}
		for (let id of this.GetDressDict().mList) {
			AttributeData.AttrAddTo(allAttr, this.SkinConfig[id].attrpower)
		}
		let list = []
		for (let k in allAttr) {
			list.push({ type: k, value: allAttr[k] })
		}
		if (!list.length) {
			let cfg = this.SkinConfig[1000]
			if (cfg) {
				let list = CommonUtils.copyDataHandler(cfg.attrpower)
				for (let data of list) {
					data.value = 0
				}
				return list
			}
		}
		return list
	}

	public GetCurSkillAttr() {
		this.SkillConfig
		let i = 0
		let list = []
		if (!this.BaseConfig.skilllist) {
			return null
		}
		for (let id of this.BaseConfig.skilllist) {
			let config = this.SkillConfig[id]	
			if (config && this.mSkills[i]) {
				let configData = config[this.mSkills[i] - 1]
				if (configData) {
					list = AttributeData.AttrAddition(list, configData.attrpower)
				}
			}
			++i
		}
		if (!list.length) {
			return [
				{ type: AttributeType.atMaxHp, value: 0 },
				{ type: AttributeType.atAttack, value: 0 },
				{ type: AttributeType.atDef, value: 0 },
			]
		}
		return list
	}

	public GetCurDrugAttr() {
		let attr = CommonUtils.copyDataHandler(this.BaseConfig.attredata)
		let drugNum = this.mDrugNum
		for (let k in attr) {
			attr[k].value *= drugNum
		}
		return attr
	}

	public GetSkinConfig() {
		let config = this.SkinConfig
		let list = []
		for (let k in config) {
			if (parseInt(k) >= 1000) {
				list.push(config[k])
			}
		}
		list.sort(function (lhs, rhs) {
			return lhs.skinid - rhs.skinid
		})
		return list
		// CommonUtils.GetArray(this.SkinConfig, "skinid")
	}

	public GetDressPower(): number {
		let power = 0
		for (let data of this.GetDressDict().mList) {
			power += ItemConfig.CalcAttrScoreValue(this.SkinConfig[data].attrpower)
		}
		return power
	}

	public GetActiveDressCount(): number {
		return this.GetDressDict().mList.length
	}

	public GetLevelSkin(level: number): number {
		let id = this.BaseConfig.pictureid ? this.BaseConfig.pictureid[level - 1] : 1;
		let config = this.SkinConfig[id]
		if (config) {
			return config.pid
		}
		return 0
	}

	public HasDress(id: number) {
		return this.GetDressDict().mDict[id] ? true : false
	}

	public GetDressDict() {
		if (!this.mTmpDressList) {
			let list = []
			let dict = {}
			for (let data of this.mDressList) {
				if (data >= 1000) {
					list.push(data)
					dict[data] = true
				}
			}
			list.sort(function (lhs, rhs) {
				return lhs - rhs
			})
			this.mTmpDressList = {
				mList: list,
				mDict: dict,
			}
		}
		return this.mTmpDressList
	}

	public GetRewardState(id: number): RewardState {
		let config = GameGlobal.Config.ProgressRewardConfig[this.mTemplateType]
		if (!config) {
			return RewardState.NotReached
		}
		let data = config[id]
		if (!data) {
			return RewardState.NotReached
		}
		if (this.mLevel >= data.progress) {
			if (BitUtil.Has(this.mReward, data.id)) {
				return RewardState.Gotten
			}
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}
}
