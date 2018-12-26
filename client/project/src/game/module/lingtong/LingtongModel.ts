class LingtongModel extends UserTemplate {

	public mMsgDefUpdateExp = MessageDef.ROLE_LINGTONG_UPDATE_EXP
	public mMsgDefUpdateDrug = MessageDef.ROLE_LINGTONG_UPDATE_DRUG
	public mMsgDefUpdate = MessageDef.ROLE_LINGTONG_UPDATE

	public mMsgDefInit = MessageDef.ROLE_LINGTONG_INIT
	public mMsgDefUpdateEquip = MessageDef.ROLE_LINGTONG_UPDATE_EQUIP
	public mMsgDefEquipRedPoint = MessageDef.RP_BAG_LINGTONG_EQUIP_UP

	public constructor() {
		super(UserTemplate.TYPE_LINGTONG)
		this.mRedPoint = new LingtongModelRedPoint(this)
	}

	public Init() {
		this.BaseConfig = GameGlobal.Config.BabyBasisConfig
		this.LvproConfig = GameGlobal.Config.BabyLvproConfig
		this.AttrsConfig = GameGlobal.Config.BabyAttrsConfig
		this.ProgressConfig = GameGlobal.Config.BabyProgressConfig
		this.SkinConfig = GameGlobal.Config.BabySkinConfig


		super.Init()
	}

	public GetDescPower(): number {
		let power = super.GetDescPower()
		power += ItemConfig.CalcAttrScoreValue(GameGlobal.LingtongAttrModel.getTianFuAllAttr())
		return power
	}

	// 装备属性为空
	public GetCurEquipAttr() {
		return []
	}

}

class LingtongModelRedPoint extends UserTemplateRedPoint {

}