class XianlvXwModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.XIANLV_XW_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.XIANLV_XW_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.XIANLV_XW_UPDATE

	public mMsgDefInit = MessageDef.XIANLV_XW_INIT
	public mMsgDefUpdateEquip = MessageDef.XIANLV_XW_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_XIANLV_XW_EQUIP_UP


	public mRedPoint: XianlvXwRedPoint

	public constructor() {
		super(UserTemplate.TYPE_XIANLV_XW);
		this.mRedPoint = new XianlvXwRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.PositionBaseConfig
		this.LvproConfig = GameGlobal.Config.PositionLvproConfig
		this.SkillConfig = GameGlobal.Config.PositionSkillConfig
		this.AttrsConfig = GameGlobal.Config.PositionAttrsConfig
		this.ProgressConfig = GameGlobal.Config.PositionProgressConfig
		this.SkinConfig = GameGlobal.Config.PositionSkinConfig

		super.Init()
	}

	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRoleXianlvXw(this.mDressId)
	}
}

class XianlvXwRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_XIANLV_XW_EQUIP_UP
	protected mEquipType: number = ItemType.XIAN_XW

	public IsRedPoint(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_18, true)) {
			return false
		}
		return super.IsRedPoint()
	}

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_XIANLV_XW_EQUIP_UP, MessageDef.XIANLV_XW_INIT, MessageDef.XIANLV_XW_UPDATE_EQUIP]
	// }
}