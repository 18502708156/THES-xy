class UserWing extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.ROLE_WING_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.ROLE_WING_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.ROLE_WING_UPDATE

	public mMsgDefInit = MessageDef.ROLE_WING_INIT
	public mMsgDefUpdateEquip = MessageDef.ROLE_WING_UPDATE_EQUIP

	public constructor() {
		super(UserTemplate.TYPE_WING);
		this.mRedPoint = new UserWingRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.WingBaseConfig
		this.LvproConfig = GameGlobal.Config.WingLvproConfig
		this.SkillConfig = GameGlobal.Config.WingSkillConfig
		this.AttrsConfig = GameGlobal.Config.WingAttrsConfig
		this.ProgressConfig = GameGlobal.Config.WingProgressConfig
		this.SkinConfig = GameGlobal.Config.WingSkinConfig

		super.Init()
	}

	public mRedPoint: UserWingRedPoint
}


class UserWingRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_WING_EQUIP_UP
	protected mEquipType: number = ItemType.WING

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_WING_EQUIP_UP, MessageDef.ROLE_WING_INIT, MessageDef.ROLE_WING_UPDATE_EQUIP]
	// }
}