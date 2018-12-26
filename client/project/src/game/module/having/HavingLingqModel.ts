class HavingLingqModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.HAVING_LINGQ_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.HAVING_LINGQ_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.HAVING_LINGQ_UPDATE

	public mMsgDefInit = MessageDef.HAVING_LINGQ_INIT
	public mMsgDefUpdateEquip = MessageDef.HAVING_LINGQ_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_HAVING_LINGQ_EQUIP_UP

	public mRedPoint: HavingLingqRedPoint

	public constructor() {
		super(UserTemplate.TYPE_HAVING_LINGQ);
		this.mRedPoint = new HavingLingqRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.NimbusBaseConfig
		this.LvproConfig = GameGlobal.Config.NimbusLvproConfig
		this.SkillConfig = GameGlobal.Config.NimbusSkillConfig
		this.AttrsConfig = GameGlobal.Config.NimbusAttrsConfig
		this.ProgressConfig = GameGlobal.Config.NimbusProgressConfig
		this.SkinConfig = GameGlobal.Config.NimbusSkinConfig
		
		super.Init()
	}

	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRoleTiannvLq(this.mDressId)
	}
}

class HavingLingqRedPoint extends UserTemplateRedPoint {
	protected mEquipType: number = ItemType.LINGQI
}