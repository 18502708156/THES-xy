class HouseConst {
	public static GetHouseShowConfig(grade) {
		return GameGlobal.Config.BasisConfig[grade]
	}

	public static GetHouseConfig(grade, level) {
		return GameGlobal.Config.HouseConfig[grade][level-1]
	}

	public static GetHouseTotalAttr(grade, level, upNum) {
		let config = GameGlobal.Config.HouseConfig[grade][level-1]
		let increaseAttr = config.increase

		let attrs = []
		// for (let attr of increaseAttr)
		// {
		// 	let tempAttr = {
		// 		type: attr.type,
		// 		value: attr.value * upNum,
		// 	}
		// 	attrs.push(tempAttr)
		// }

		return AttributeData.AttrAddition(attrs, this.GetHouseLevelAttr(grade, level))
	}

	public static GetHouseLevelAttr(grade, level) {
		let config = GameGlobal.Config.HouseConfig[grade][level-1]
		if (!config)
		{
			return []
		}

		return config.attrpower
	}

	public static GetPower(grade, level, upNum) {
		let attrs = this.GetHouseTotalAttr(grade, level, upNum)
		return ItemConfig.CalcAttrScoreValue(attrs)
	}

	public static IsMaxLevel(grade, level) {
		let config = GameGlobal.Config.HouseConfig[grade][level]
		return config == null
	}
	
	public static GetBuildList(grade) {
		let buildList = []
		for (let key in GameGlobal.Config.BasisConfig)
		{
			let config = GameGlobal.Config.BasisConfig[key]
			if (config.house > grade)
			{
				buildList.push(config)
			}
		}

		return buildList
	}
}

