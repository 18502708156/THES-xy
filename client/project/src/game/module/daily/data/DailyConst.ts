class DailyConst {
	public static TYPE_PEACE = 2 //平定安邦
	public static TYPE_TEAM = 3 //组队历练

	public static TASK_TYPE_PERSONALBOSS = 1
	public static TASK_TYPE_PUBLICBOSS = 2
	public static TASK_TYPE_EQUIPSMELT = 3
	public static TASK_TYPE_ARENA = 4
	public static TASK_TYPE_MATERIALCOPY = 5
	public static TASK_TYPE_ESCORT = 6
	public static TASK_TYPE_TEAMCOPY = 7
	public static TASK_TYPE_PERLOGIN = 8
	public static TASK_TYPE_PERCHARGE = 9

	public static TASK_RETRIEVE_COST_GOD = 2
	public static TASK_RETRIEVE_COST_BINDGOD = 3

	public static TASK_RETRIEVE_TYPE_RES = 1
	public static TASK_RETRIEVE_TYPE_EXP = 2


	public static GetPeaceList() {
		let list = []
		let peaceLists = GameGlobal.Config.DailyBonusConfig[DailyConst.TYPE_PEACE]
		for (let key in peaceLists)
		{
			let peaceList = peaceLists[key]
			let config = this._GetConfig(peaceList)
			if (config)
				list.push(config)
		}
		return list
	}

	public static GetTeamConfig() {
		let configList =  GameGlobal.Config.DailyBonusConfig[DailyConst.TYPE_TEAM][0]
		return this._GetConfig(configList)
	}

	private static _GetConfig(configList) {
		let curPlayerLevel = GameGlobal.actorModel.level
		for (let key in configList)
		{
			let config = configList[key]
			if (curPlayerLevel >= config.level[0] && curPlayerLevel <= (config.level[1] || 999))
				return config
		}
	}

	public static GetMedalId(level) {
		let medalId
		for (let id in GameGlobal.Config.DailyMedalConfig)
		{
			let config = GameGlobal.Config.DailyMedalConfig[id]
			if (config.level > level)
				return medalId

			medalId = config.id
		}

		return medalId
	}
	
	public static HasPrevMedal(medalId) {
		let config = GameGlobal.Config.DailyMedalConfig[medalId-1]
		return config != null
	}

	public static HasNextMedal(medalId) {
		let config = GameGlobal.Config.DailyMedalConfig[medalId+1]
		return config != null
	}

	public static GetMaxExpPerDay() {
		let exp = 0
		for (let id in GameGlobal.Config.DailyProgressConfig)
		{
			let config = GameGlobal.Config.DailyProgressConfig[id]
			exp += config.exp * config.maxtimes
		}

		return exp
	}

	public static GetRetrieveConfig(taskId, costType, findType) {
		let config = this._GetRetrieveConfig(taskId, costType, findType)
		if (!config)
			return
			
		let curPlayerLevel = GameGlobal.actorModel.level
		let confList = GameGlobal.Config.DailyLevelRetrieveConfig[config.index]
		for (let key in confList)
		{
			let retrieveConfig = confList[key]
			if (curPlayerLevel >= retrieveConfig.level[0] && curPlayerLevel <= (retrieveConfig.level[1] || 999))
			{
				return retrieveConfig
			}
		}
	}

	public static CanMedalUpgrade(level, exp) {
		let nextConfig = GameGlobal.Config.DailyAttrsConfig[level + 1]
		if (!nextConfig)
		{
			return false
		}

		return nextConfig.proexp <= exp
	}

	public static GetMonsterId(taskId) {
		let config = GameGlobal.Config.DailyExpDungeonStar[taskId]
		if (!config)
		{
			return 0
		}

		return config.showid
	}

	private static _GetRetrieveConfig(taskId, costType, findType) {
		let configList = GameGlobal.Config.DailyRetrieveConfig[taskId][costType]
		for (let key in configList)
		{
			let config = configList[key]
			if (config.restype == findType)
				return config
		}
	}
}

