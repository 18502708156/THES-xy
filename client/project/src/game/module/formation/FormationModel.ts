class FormationModel extends BaseSystem {

	private MAX_LEVEL = 10
	private MAX_SOUL_LEVEL = 10

	private mUsedFormationId: number
	private mUseDrugNum: number

	public mFormationMap: {[key: number]: FormationInfo} = {}
	
	public mRedPoint: FormationModelRedPoint

	public constructor() {
		super()
		
		this.mRedPoint = new FormationModelRedPoint(this)

		this.regNetMsg(S2cProtocol.sc_formation_info, this._DoInitInfo)
	}

	public Init() {
		
	}

	public get useDrugNum() {
		return this.mUseDrugNum
	}

	public get usedFomationId() {
		return this.mUsedFormationId 
	}

	private _DoInitInfo(rsp: Sproto.sc_formation_info_request) {
		this.mUsedFormationId = rsp.use
		this.mUseDrugNum = rsp.drugNum
		for (let data of rsp.infoList)
		{
			let formationInfo = this.mFormationMap[data.no]
			if (!formationInfo)
			{
				formationInfo = new FormationInfo
				this.mFormationMap[data.no] = formationInfo
			}

			formationInfo.UpdateInfo(data)
		}
	}

	public SendActiveFormation(formationId: number) {
		let req = new Sproto.cs_formation_activation_request
		req.no = formationId

		this.Rpc(C2sProtocol.cs_formation_activation, req, (rsp: Sproto.cs_formation_activation_response) => {
			let formationInfo = new FormationInfo
			formationInfo.UpdateInfo(rsp)
			this.mFormationMap[rsp.no] = formationInfo

			GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_ACTIVE)
			GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_INFO)
		}, this)
	}

	public SendUseDrug(drugNum: number) {
		let req = new Sproto.cs_formation_drug_request
		req.useNum = drugNum

		this.Rpc(C2sProtocol.cs_formation_drug, req, (rsp: Sproto.cs_formation_drug_response) => {
			if (rsp.ret)
			{
				this.mUseDrugNum = rsp.drugNum
				GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_USE_DRUG)
			}
		}, this)
	}

	public SendUpgradeFormation(formationId: number, autoBuy: number) {
		let req = new Sproto.cs_formation_add_exp_request
		req.no = formationId
		req.autoBuy = autoBuy

		this.Rpc(C2sProtocol.cs_formation_add_exp, req, (rsp:Sproto.cs_formation_add_exp_response) => {
			if (rsp.ret)
			{
				let formationInfo = this.mFormationMap[rsp.no]
				formationInfo.UpdateExp(rsp)
				GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_EXP)
			}
		}, this)
	}

	public SendUpgradeFormationSoul(formationId: number, autoBuy: number) {
		let req = new Sproto.cs_formation_soul_add_exp_request
		req.no = formationId
		req.autoBuy = autoBuy

		this.Rpc(C2sProtocol.cs_formation_soul_add_exp, req, (rsp: Sproto.cs_formation_soul_add_exp_response) => {
			if (rsp.ret)
			{
				let formationInfo = this.mFormationMap[rsp.no]
				formationInfo.UpdateSoulExp(rsp)
				GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_SOUL_EXP)
			}
		}, this)
	}

	public SendUseFormation(formationId: number) {
		let req = new Sproto.cs_formation_use_request
		req.no = formationId

		this.Rpc(C2sProtocol.cs_formation_use, req, (rsp:Sproto.cs_formation_use_response) => {
			if (rsp.ret)
			{
				this.mUsedFormationId = rsp.use
				GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_INFO)
			}
		}, this)
	}

	public SendUpgradeSkill(formationId: number) {
		let req = new Sproto.cs_formation_skill_up_request
		req.no = formationId

		this.Rpc(C2sProtocol.cs_formation_skill_up, req, (rsp:Sproto.cs_formation_skill_up_response) => {
			if (rsp.ret)
			{
				let formationInfo = this.mFormationMap[formationId]
				formationInfo.mSkillId = rsp.skillNo
				GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_SKILL_INFO)
			}
		}, this)
	}

	public GetFormationInfo(formationId: number) {
		return this.mFormationMap[formationId]
	}

	public GetSkillId(formationId: number) {
		let formationInfo = this.mFormationMap[formationId]
		if (!formationInfo)
		{
			return FormationConst.GetSkillId(formationId)
		}

		return formationInfo.mSkillId
	} 

	public HasFormation(formationId: number) {
		return this.mFormationMap[formationId] != null
	}

	public IsUsed(formationId: number) {
		return this.mUsedFormationId == formationId
	}

	public IsMaxLv(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		if (!formationInfo)
			return false

		return formationInfo.mLevel >= this.MAX_LEVEL
	}

	public IsMaxSoulLv(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		if (!formationInfo)
			return false

		return formationInfo.mSoulLv >= this.MAX_SOUL_LEVEL
	}

	public GetCurDrugAttr() {
		let attr = CommonUtils.copyDataHandler(GameGlobal.Config.FormationBaseConfig.attredata)
		let drugNum = this.mUseDrugNum
		for (let k in attr) {
			attr[k].value *= drugNum
		}
		return attr
	}

	public GetCurSoulAttr(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		if (!formationInfo)
			return FormationConst.GetFormationSoulAttr(formationId, 1, 0)
		return FormationConst.GetFormationSoulAttr(formationId, formationInfo.mSoulLv, formationInfo.mSoulUpNum)
	}

	public GetCurAttr(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		if (!formationInfo)
			return FormationConst.GetFormationBaseAttr(formationId, 1)

		return FormationConst.GetFormationAttr(formationId, formationInfo.mLevel, formationInfo.mUpNum)
	}

	public GetAllAttr() {
		let attrMap: {[key: number]: number} = {}
		for (let formationId in this.mFormationMap) {
			let id = parseInt(formationId)
			let attrs = this.GetCurAttr(id)
			for (let attr of attrs)
			{
				attrMap[attr.type] = attrMap[attr.type] || 0
				attrMap[attr.type] += attr.value
			}
		}

		let attrs = []
		for (let attrType in attrMap)
		{
			attrs.push({type:parseInt(attrType), value:attrMap[attrType]})
		}

		return attrs
	}

	public GetAllSoulAttr() {
		let attrMap: {[key: number]: number} = {}
		for (let formationId in this.mFormationMap) {
			let id = parseInt(formationId)
			let attrs = this.GetCurSoulAttr(id)
			for (let attr of attrs)
			{
				attrMap[attr.type] = attrMap[attr.type] || 0
				attrMap[attr.type] += attr.value
			}
		}

		let attrs = []
		for (let attrType in attrMap)
		{
			attrs.push({type:parseInt(attrType), value:attrMap[attrType]})
		}

		return attrs
	}

	public GetAllPower() {
		let power = 0
		for (let id in this.mFormationMap)
		{
			power += this.GetPower(parseInt(id))
		}

		power += ItemConfig.CalcAttrScoreValue(this.GetCurDrugAttr())
		
		return power
	}

	public GetPower(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		if (!formationInfo)
			return FormationConst.GetPower(formationId)

		let power = 0
		power += ItemConfig.CalcAttrScoreValue(this.GetCurAttr(formationId))
		power += ItemConfig.CalcAttrScoreValue(this.GetCurSoulAttr(formationId))

		let skillId = formationInfo.mSkillId
		if (skillId && skillId != 0)
		{
			let config = GameGlobal.Config.EffectsConfig[skillId]
			if (config)
				power += config[GameGlobal.Config.EffectsConfig_keys.skillpower] || 0
		}

		return power
	}

	public CanFormationUpgrade(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		let levelConfig = FormationConst.GetFormationLevelConfig(formationId, formationInfo.mLevel)
		if (!levelConfig)
			return false

		for (let data of levelConfig.cost)
		{
			if (!Checker.Data(data, false))
			{
				return false
			}
		}

		return true
	}

	public CanFormationSoulUpgrade(formationId: number) {
		let formationInfo = this.GetFormationInfo(formationId)
		let soulConfig = FormationConst.GetFormationSoulConfig(formationId, formationInfo.mSoulLv)
		if (!soulConfig)
			return false

		return Checker.Data(soulConfig.cost, false)
	}

	public CanSkillUpgrade(skillId: number) {
		let cost = FormationConst.GetSkillUpgradeCost(skillId)
		if (!cost)
			return false

		return Checker.Data(cost, false)
	}
}