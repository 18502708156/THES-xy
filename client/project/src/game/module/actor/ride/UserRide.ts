class UserRide extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.ROLE_RIDE_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.ROLE_RIDE_UPDATE_DRUG
	public mMsgDefInit = MessageDef.ROLE_RIDE_INIT
	public mMsgDefUpdate = MessageDef.ROLE_RIDE_UPDATE
	public mMsgDefUpdateEquip = MessageDef.ROLE_RIDE_UPDATE_EQUIP
	// public mMsgDefEquipRedPoint = MessageDef.RP_BAG_RIDE_EQUIP_UP

	public mMaxLevel: number = 10
	// public mRideSkills: number[] = []

	public constructor() {
		super(UserTemplate.TYPE_RIDE);
		this.mRedPoint = new UserRideRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.RideBaseConfig
		this.LvproConfig = GameGlobal.Config.RideLvproConfig
		this.SkillConfig = GameGlobal.Config.RideSkillConfig
		this.AttrsConfig = GameGlobal.Config.RideAttrsConfig
		this.ProgressConfig = GameGlobal.Config.RideProgressConfig
		this.SkinConfig = GameGlobal.Config.RideSkinConfig

		super.Init()
	}

}

class UserRideRedPoint extends UserTemplateRedPoint {

	// protected mDispMsg: string = MessageDef.RP_BAG_RIDE_EQUIP_UP
	protected mEquipType: number = ItemType.RIDE

	// public GetMessageDef(): string[] {
	// 	return [MessageDef.ROLE_RIDE_INIT, MessageDef.ROLE_RIDE_UPDATE_EQUIP]
	// }
}