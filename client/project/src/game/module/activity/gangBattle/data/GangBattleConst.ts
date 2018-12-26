class GangBattleConst {
	private static mLevel: number = 10

	public static set level(level) {
		this.mLevel = Math.max(level, 1)
	}

	public static GetKingList() {
		let list = []
		for (let key in GameGlobal.Config.GuildBattleKingConfig)
		{
			let configList = GameGlobal.Config.GuildBattleKingConfig[key]
			let config = this._GetConfig(configList)
			if (config)
				list.push(config)
		}

		return list
	}

	public static GetKingConfig(kingId) {
		return this._GetConfig(GameGlobal.Config.GuildBattleKingConfig[kingId])
	}

	public static GetScoreList() {
		let list = []
		for (let key in GameGlobal.Config.GuildBattleRewardsConfig)
		{
			let configList = GameGlobal.Config.GuildBattleRewardsConfig[key]
			let config = this._GetConfig(configList)
			if (config)
				list.push(config)
		}

		return list
	}

	public static GetScoreConfig(scoreId) {
		return this._GetConfig(GameGlobal.Config.GuildBattleRewardsConfig[scoreId])
	}

	private static _GetConfig(configList) {
		let config 
		for (let level in configList)
		{
			if (this.mLevel >= parseInt(level))
			{
				config = configList[level]
			}
			else
			{
				break
			}
		}

		return config
	}
}

