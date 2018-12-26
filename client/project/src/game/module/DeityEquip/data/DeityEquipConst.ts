class DeityEquipConst {

	public static IsDeityEquip(id) {
		if (!id)
			return false
			
		let config = GameGlobal.Config.ItemConfig[id]
		if (!config)
			return false

		return config.quality >= 5
	}

	public static GetNextDeityEquipId(id, pos) {
		if (this.IsDeityEquip(id))
		{
			let awakeConfig = GameGlobal.Config.DeityAwakeConfig[id]
			return awakeConfig ? awakeConfig.attrpower : -1
		}

		let composeConf = GameGlobal.Config.DeityComposeConfig[pos]
		return composeConf ? composeConf.id : -1
	}

	public static GetAwakeCost(id, pos) {
		if (this.IsDeityEquip(id))
		{
			let awakeConfig = GameGlobal.Config.DeityAwakeConfig[id]
			return awakeConfig ? awakeConfig.cost[0] : null
		}

		let composeConf = GameGlobal.Config.DeityComposeConfig[pos]
		return composeConf ? composeConf.cost[0] : null
	}

	public static GetEquipAttrText(id) {
		let attrTextList = []
		let config = GameGlobal.Config.EquipConfig[id]
		if (!config)
			return attrTextList
			
		for (let attr of config.attrs || [])
		{
			attrTextList.push(`${AttributeData.getAttrStrByType(attr.type)}+${attr.value}`)
		}

		return attrTextList
	}

	public static GetInjectCost(pos, level) {
		let config = GameGlobal.Config.DeitySpiritConfig[pos][level-1]
		return config ? config.cost[0] : null
	}

	public static GetInjectProgInfo(pos, level) {
		let config = GameGlobal.Config.DeitySpiritConfig[pos][level-1]
		if (!config)
			return [0, 1]

		return [config.exp, config.proexp]
	}

	public static GetInjectAttrText(pos, level) {
		let attrTextList = []
		let specialAttrText
		let config = GameGlobal.Config.DeitySpiritConfig[pos][level-1]
		if (!config)
			return [attrTextList, specialAttrText]

		for (let idx in config.attrpower || [])
		{
			let i = parseInt(idx)
			let attr = config.attrpower[i]
			if (i < 3)
				attrTextList.push(`${AttributeData.getAttrStrByType(attr.type)}+${attr.value}`)
			else
				specialAttrText = `${AttributeData.getAttrStrByType(attr.type)}+${attr.value}`
		}

		return [attrTextList, specialAttrText]
	}

	public static GetRateText(injectNum) {
		let values = GameGlobal.Config.DeityBaseConfig.value
		let des = GameGlobal.Config.DeityBaseConfig.des
		
		let curKey
		for (let key in values)
		{
			let val = values[key]
			if (injectNum >= val)
				curKey = parseInt(key)
			else
				break
		}


		return des[curKey]
	}

	public static IsMaxInjectLevel(pos, level)
	{
		if (level == 0)
			return false

		let config = GameGlobal.Config.DeitySpiritConfig[pos][level]
		return config == null
	}

	public static IsMaxAwakeLevel(id)
	{
		if (!id)
			return false

		let config = GameGlobal.Config.DeityAwakeConfig[id]
		if (!config)
			return false

		return config.attrpower == null
	}

	public static GetCurInjectConfig(level) {
		let injectConfig = GameGlobal.Config.DeityResonateConfig[1]
		for (let key in GameGlobal.Config.DeityResonateConfig)
		{
			let config = GameGlobal.Config.DeityResonateConfig[key]
			if (level >= config.level)
				injectConfig = config
			else
				break
		}

		return injectConfig
	}

	public static GetNextInjectConfig(level) {
		for (let key in GameGlobal.Config.DeityResonateConfig)
		{
			let config = GameGlobal.Config.DeityResonateConfig[key]
			if (level < config.level)
				return parseInt(key) == 1 ? null: config
		}
	}

	public static GetDeityEquipActTextList(num) {
		let textList = []
		for (let key in GameGlobal.Config.DeityActConfig)
		{
			let config = GameGlobal.Config.DeityActConfig[key]
			let color = num >= config.level ? Color.Green : Color.White
			let text = ""
			for (let attr of config.attrpower)
			{
				text = `${text}${AttributeData.getAttrStrByType(attr.type)}: |C:${color}&T:${attr.value}| `
			}
			text = text + (num < config.level ? `(需${config.level}件)` : "")
			textList.push(text)
		}

		return textList
	}

	public static GetDeltaNum(pos, preInjectNum, preInjectLevel, curInjectNum, curINjectLevel) {
		let config = GameGlobal.Config.DeitySpiritConfig[pos][preInjectLevel]
		let curExp = curInjectNum * config.exp
		if (preInjectLevel < curINjectLevel)
		{
			curExp = config.proexp
		}

		return curExp - preInjectNum * config.exp
	}
}