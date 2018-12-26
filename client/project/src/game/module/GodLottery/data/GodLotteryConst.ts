class GodLotteryConst {
	public static TYPE_BINDGOLD_TEN = 1
	public static TYPE_GOLD_TEN = 3
	public static TYPE_GOLD_ONE = 2

	public static GetCost(type) {
		let configList = GameGlobal.Config.TianShenLuckConfig[type]
		for (let key in configList)
		{
			let config = configList[key]
			return config.cost[0]
		}
	}

	public static GetNextSpecailAward(curNum) {
		let specialAwardList = GameGlobal.Config.TianShenLuckBaseConfig.speciallyitem
		for (let key in specialAwardList)
		{
			let num = parseInt(key)
			if (curNum < num)
				return [num, specialAwardList[key]]
		}

		return [null, null]
	}
}

