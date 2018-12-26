class SwordModel extends UserTemplate {
	public mMsgDefUpdateExp = MessageDef.ROLE_SWORD_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.ROLE_SWORD_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.ROLE_SWORD_UPDATE

	public mMsgDefInit = MessageDef.ROLE_SWORD_INIT
	public mMsgDefUpdateEquip = MessageDef.ROLE_SWORD_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_SWORD_EQUIP_UP

	public constructor() {
		super(UserTemplate.TYPE_SHENGB);
		this.mRedPoint = new SwordModelRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.WeaponBaseConfig
		this.LvproConfig = GameGlobal.Config.WeaponLvproConfig
		this.SkillConfig = GameGlobal.Config.WeaponSkillConfig
		this.AttrsConfig = GameGlobal.Config.WeaponAttrsConfig
		this.ProgressConfig = GameGlobal.Config.WeaponProgressConfig
		this.SkinConfig = GameGlobal.Config.WeaponSkinConfig


		super.Init()
	}

	public mRedPoint: SwordModelRedPoint
}


class SwordModelRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_SWORD_EQUIP_UP
	protected mEquipType: number = ItemType.SHENGB

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_SWORD_EQUIP_UP, MessageDef.ROLE_SWORD_INIT, MessageDef.ROLE_SWORD_UPDATE_EQUIP]
	// }
}