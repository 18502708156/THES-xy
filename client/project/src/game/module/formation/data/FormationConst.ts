class FormationConst {
	public static GetSkin(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return ""

		let pId = config.pid
		return AppearanceConfig.GetUIPath(pId)
	}

	public static GetPower(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return 0

		return ItemConfig.CalcAttrScoreValue(config.attrs)
	}

	public static HasBuffSkill(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return false

		return config.buffskill != null
	}

	public static GetSkillId(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return 0

		return config.buffskill
	}

	public static GetFormationName(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return ""

		return config.name
	}

	public static GetFormationUpgradeMaterial(formationId: number) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return

		return config.material
	}

	public static GetNextSkillId(skillId: number) {
		let config = GameGlobal.Config.FormationSkillConfig[skillId]
		if (!config)
			return 0

		return config.nextid
	}

	public static IsMaxSkillLv(skillId: number) {
		return !this.GetNextSkillId(skillId)
	}

	public static GetSkillUpgradeCost(skillId: number) {
		let config = GameGlobal.Config.FormationSkillConfig[skillId]
		if (!config)
			return

		return config.cost
	}

	public static GetFormationSoulConfig(formationId, soulLv) {
		return GameGlobal.Config.FormationSoulConfig[formationId][soulLv-1]
	}

	public static GetFormationLevelConfig(formationId, formationLv) {
		let config = GameGlobal.Config.FormationListConfig[formationId]
		if (!config)
			return
		
		return GameGlobal.Config.FormationLvproConfig[config.quality][formationLv - 1]
	}

	public static GetFormationBaseAttr(formationId, level) {
		let progressConfig = GameGlobal.Config.FormationProgressConfig[formationId][level-1]
		if (!progressConfig)
			return

		return progressConfig.attrs
	}

	public static GetFormationUpgradeAttr(formationId, level, upNum) {
		let config = GameGlobal.Config.FormationListConfig[formationId]

		return this._GetAddAttr(GameGlobal.Config.FormationLvproConfig, config.quality, level, upNum)
	}

	public static GetFormationSoulAttr(formationId, soulLv, upNum) {
		return this._GetAddAttr(GameGlobal.Config.FormationSoulConfig, formationId, soulLv, upNum)
	}

	public static GetFormationAttr(formationId, level, upNum) {
		let baseAttr = this.GetFormationBaseAttr(formationId, level)
		let upgradeAttr = this.GetFormationUpgradeAttr(formationId, level, upNum)

		let getValue = (props, attrType) =>
		{
			for (let elem of props) 
			{
				if (elem.type == attrType)
					return elem.value
			}

			return 0
		}

		var initAttrArr = new Array()
		baseAttr.forEach(elem => {
			let attrInfo = {type:elem.type, value:elem.value}
			initAttrArr.push(attrInfo)
		})

		initAttrArr.forEach(elem => {	
			elem.value = elem.value + getValue(upgradeAttr, elem.type)	
		})

		return initAttrArr
	}

	public static _GetAddAttr(sheetConfig, mainKey, level, upNum) {
		let config = sheetConfig[mainKey][0]
		var initAttrArr = new Array()
		config.attrs.forEach(elem => {
			let attrInfo = {type:elem.type, value:0}
			initAttrArr.push(attrInfo)
		})

		let getValue = (props, attrType) =>
		{
			for (let elem of props) 
			{
				if (elem.type == attrType)
					return elem.value
			}

			return 0
		}

		for (var i=1; i<=level; ++i)
		{
			let tempConf = sheetConfig[mainKey][i-1]
			let attrs = tempConf.attrs
			
			let multiple = (i == level ? upNum : tempConf.proexp / tempConf.exp)
			initAttrArr.forEach(elem => {	
				elem.value = elem.value + getValue(attrs, elem.type) * multiple	
			})
		}

		return initAttrArr
	}
}

