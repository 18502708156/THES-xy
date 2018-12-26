class HavingHuanModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.HAVING_HUAN_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.HAVING_HUAN_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.HAVING_HUAN_UPDATE

	public mMsgDefInit = MessageDef.HAVING_HUAN_INIT
	public mMsgDefUpdateEquip = MessageDef.HAVING_HUAN_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_HAVING_HUAN_EQUIP_UP

	public mRedPoint: HavingHuanRedPoint

	public constructor() {
		super(UserTemplate.TYPE_HAVING_HUAN);
		this.mRedPoint = new HavingHuanRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.FlowerBaseConfig
		this.LvproConfig = GameGlobal.Config.FlowerLvproConfig
		this.SkillConfig = GameGlobal.Config.FlowerSkillConfig
		this.AttrsConfig = GameGlobal.Config.FlowerAttrsConfig
		this.ProgressConfig = GameGlobal.Config.FlowerProgressConfig
		this.SkinConfig = GameGlobal.Config.FlowerSkinConfig
		super.Init()
	}

	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRoleTiannvHua(this.mDressId)
	}
}

class HavingHuanRedPoint extends UserTemplateRedPoint {
	protected mEquipType: number = ItemType.HUA
}