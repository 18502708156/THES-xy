class TianxModel extends UserTemplate {
	public mMsgDefUpdateExp = MessageDef.ROLE_TIANX_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.ROLE_TIANX_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.ROLE_TIANX_UPDATE

	public mMsgDefInit = MessageDef.ROLE_TIANX_INIT
	public mMsgDefUpdateEquip = MessageDef.ROLE_TIANX_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_TIANX_EQUIP_UP

	public constructor() {
		super(UserTemplate.TYPE_TIANX);
		this.mRedPoint = new TianxModelRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.FairyBaseConfig
		this.LvproConfig = GameGlobal.Config.FairyLvproConfig
		this.SkillConfig = GameGlobal.Config.FairySkillConfig
		this.AttrsConfig = GameGlobal.Config.FairyAttrsConfig
		this.ProgressConfig = GameGlobal.Config.FairyProgressConfig
		this.SkinConfig = GameGlobal.Config.FairySkinConfig


		super.Init()
	}

	public mRedPoint: TianxModelRedPoint
}


class TianxModelRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_TIANX_EQUIP_UP
	protected mEquipType: number = ItemType.TIANXIAN

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_TIANX_EQUIP_UP, MessageDef.ROLE_TIANX_INIT, MessageDef.ROLE_TIANX_UPDATE_EQUIP]
	// }
}