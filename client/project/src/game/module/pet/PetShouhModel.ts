class PetShouhModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.PET_SHOUH_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.PET_SHOUH_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.PET_SHOUH_UPDATE

	public mMsgDefInit = MessageDef.PET_SHOUH_INIT
	public mMsgDefUpdateEquip = MessageDef.PET_SHOUH_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_PET_SHOUH_EQUIP_UP

	public mRedPoint: PetShohRedPoint

	public constructor() {
		super(UserTemplate.TYPE_PET_SHOUH);
		this.mRedPoint = new PetShohRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.SoulBaseConfig
		this.LvproConfig = GameGlobal.Config.SoulLvproConfig
		this.SkillConfig = GameGlobal.Config.SoulSkillConfig
		this.AttrsConfig = GameGlobal.Config.SoulAttrsConfig
		this.ProgressConfig = GameGlobal.Config.SoulProgressConfig
		this.SkinConfig = GameGlobal.Config.SoulSkinConfig

		super.Init()
	}

	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRolePetShouh(this.mDressId)
	}
}

class PetShohRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_PET_SHOUH_EQUIP_UP
	protected mEquipType: number = ItemType.PET_SH

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_PET_SHOUH_EQUIP_UP, MessageDef.PET_SHOUH_INIT, MessageDef.PET_SHOUH_UPDATE_EQUIP]
	// }
}