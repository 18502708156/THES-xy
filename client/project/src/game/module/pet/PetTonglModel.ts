class PetTonglModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.PET_TONGL_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.PET_TONGL_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.PET_TONGL_UPDATE

	public mMsgDefInit = MessageDef.PET_TONGL_INIT
	public mMsgDefUpdateEquip = MessageDef.PET_TONGL_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_PET_TONGL_EQUIP_UP


	public mRedPoint: PetTonglRedPoint

	public constructor() {
		super(UserTemplate.TYPE_PET_TONGL);
		this.mRedPoint = new PetTonglRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.PsychicBaseConfig
		this.LvproConfig = GameGlobal.Config.PsychicLvproConfig
		this.SkillConfig = GameGlobal.Config.PsychicSkillConfig
		this.AttrsConfig = GameGlobal.Config.PsychicAttrsConfig
		this.ProgressConfig = GameGlobal.Config.PsychicProgressConfig
		this.SkinConfig = GameGlobal.Config.PsychicSkinConfig

		super.Init()
	}
	
	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRolePetTongl(this.mDressId)
	}
}

class PetTonglRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_PET_TONGL_EQUIP_UP
	protected mEquipType: number = ItemType.PET_TL

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_PET_TONGL_EQUIP_UP, MessageDef.PET_TONGL_INIT, MessageDef.PET_TONGL_UPDATE_EQUIP]
	// }
}