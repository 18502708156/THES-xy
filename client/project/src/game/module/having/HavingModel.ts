class HavingModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.HAVING_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.HAVING_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.HAVING_UPDATE
	public mMsgDefInit = MessageDef.HAVING_INIT

	public constructor() {
		super(UserTemplate.TYPE_HAVING_HAVING);
		this.mRedPoint = new HavingModelRedPoint(this)
	}

	public IsDeblocking(): boolean {
		return Deblocking.Check(DeblockingType.TYPE_19, true)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.FemaleDevaBaseConfig
		this.LvproConfig = GameGlobal.Config.FemaleDevaLvproConfig
		// this.SkillConfig = GameGlobal.Config.FemaleDevaSkillAttrsConfig 没有通用技能
		this.AttrsConfig = GameGlobal.Config.FemaleDevaAttrsConfig
		this.ProgressConfig = GameGlobal.Config.FemaleDevaProgressConfig
		this.SkinConfig = GameGlobal.Config.FemaleDevaSkinConfig

		for (let data of GameGlobal.Config.FemaleDevaBaseConfig.freshitemid) {
			GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.HAVING_SKILL_ITEM_UPDATE)
		}

		super.Init()
	}

	// public GetTotalAttr() {
	// 	let list = []
	// 	let attr = this.GetCurAttr()	
	// 	list = AttributeData.AttrAddition(list, attr)

	// 	let magicList = []
	// 	let data = GameGlobal.HavingMagicModel.skillData && GameGlobal.HavingMagicModel.skillData[0]
	// 	if (data) {
	// 		for (let item of data.attrData) {
	// 			if (item.type == 1) {
	// 				let attrdata = GameGlobal.HavingMagicModel.getAttrsConfigById(item.attrs);
	// 				if (attrdata && attrdata.attrs) {
	// 					magicList.push(attrdata.attrs)
	// 				}
	// 			}
	// 		}
	// 	}
	// 	list = AttributeData.AttrAddition(list, magicList)

	// 	list = AttributeData.AttrAddition(list, GameGlobal.HavingHuanModel.GetCurAttr())
	// 	list = AttributeData.AttrAddition(list, GameGlobal.HavingLingqModel.GetCurAttr())
	// 	return list
	// }

	protected OnActive() {
		GameGlobal.RaidMgr.UpdateRoleTiannv()	
	}

	//获取玄女消耗配置表
	public getLevelConfig(level) {
		return GameGlobal.Config.FemaleDevaLvproConfig[level];
	}

	//获取玄女基本配置表
	public getBaseConfig() {
		return GameGlobal.Config.FemaleDevaBaseConfig;
	}

	public GetSkillIds() {
		let skillIds = [];
		let baseConfig = GameGlobal.Config.FemaleDevaBaseConfig
		skillIds.push(baseConfig.skill)
		for (let i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
			let data = GameGlobal.HavingMagicModel.skillData[i];
			if (data && data.attrData && data.attrData.length == 4) {
				skillIds[i + 1] = data.attrData[3].skillNo;
			}
		}
		return skillIds
	}
}

class HavingModelRedPoint extends UserTemplateRedPoint {

	public static readonly INDEX_SKILL_ITEM = 20

	// 玄女没有装备
	protected mEquipType: number = null

	public GetMessageDef(): string[] {
		let list = super.GetMessageDef()
		list.push(MessageDef.HAVING_SKILL_ITEM_UPDATE)
		return list
	}

	protected GetCheckFuncList() {
		let dict = super.GetCheckFuncList()
		dict[HavingModelRedPoint.INDEX_SKILL_ITEM] = this.GetIndexSkillItem
		return dict
	}

	public OnMessage(type: string): boolean {
		if (type == MessageDef.HAVING_SKILL_ITEM_UPDATE) {
			this.ClearFlag(HavingModelRedPoint.INDEX_SKILL_ITEM)
		} else {
			return super.OnMessage(type)
		}
		return true
	}

	private GetIndexSkillItem(): boolean {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_20)) {
			return false
		}
		for (let data of GameGlobal.Config.FemaleDevaBaseConfig.freshitemid) {
			if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
				return true
			}
		}
		return false
	}
}