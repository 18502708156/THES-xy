class XianlvFzModel  extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.XIANLV_FZ_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.XIANLV_FZ_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.XIANLV_FZ_UPDATE

	public mMsgDefInit = MessageDef.XIANLV_FZ_INIT
	public mMsgDefUpdateEquip = MessageDef.XIANLV_FZ_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_XIANLV_FZ_EQUIP_UP


	public mRedPoint: XianlvFzRedPoint

	public constructor() {
		super(UserTemplate.TYPE_XIANLV_FZ);
		this.mRedPoint = new XianlvFzRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.CircleBaseConfig
		this.LvproConfig = GameGlobal.Config.CircleLvproConfig
		this.SkillConfig = GameGlobal.Config.CircleSkillConfig
		this.AttrsConfig = GameGlobal.Config.CircleAttrsConfig
		this.ProgressConfig = GameGlobal.Config.CircleProgressConfig
		this.SkinConfig = GameGlobal.Config.CircleSkinConfig

		super.Init()
	}


	protected UpdateDress() {
		super.UpdateDress()
		GameGlobal.RaidMgr.UpdateRoleXianlvFz(this.mDressId)
	}
}

class XianlvFzRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_XIANLV_FZ_EQUIP_UP
	protected mEquipType: number = ItemType.XIAN_FZ

	public IsRedPoint(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_17, true)) {
			return false
		}
		return super.IsRedPoint()
	}

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.BAG_XIANLV_FZ_EQUIP_UP, MessageDef.XIANLV_FZ_INIT, MessageDef.XIANLV_FZ_UPDATE_EQUIP]
	// }
}