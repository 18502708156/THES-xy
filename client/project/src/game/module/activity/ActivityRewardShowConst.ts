class ActivityRewardShowConst {
	private static _GetAwardList(type) {
		let config = GameGlobal.Config.ActivityPreviewConfig[type]
		if (!config || !config.tablename || !config.showrewards_1)
			return []

		let list = []
		let table = GameGlobal.Config[config.tablename]
		for (let key in config.showrewards_1) {
			let idx = parseInt(key)
			let keyStr = config.showrewards_1[key]
			let data = {
				name: config.des_1[idx],
				showitem: table[keyStr]
			}

			list.push(data)
		}

		return list
	}

	private static _GetRankAwardList(type) {
		let config = GameGlobal.Config.ActivityPreviewConfig[type]
		if (!config || !config.rankname)
			return []

		let list = []
		let table = GameGlobal.Config[config.rankname] || []
		for (let key in table) {
			list.push(table[key])
		}

		return list
	}

	private static _GetDragonRankAwardList(type) {
		let config = GameGlobal.Config.ActivityPreviewConfig[type]
		if (!config || !config.rankname_2)
			return []

		let list = []
		let table = GameGlobal.Config[config.rankname_2] || []
		for (let key in table) {
			list.push(table[key])
		}

		return list
	}

	public static GetAwardListByActivityType(type) {
		let curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type]
		if (curType == null)
			return []

		return this._GetAwardList(curType)
	}

	public static GetRankAwardListByActivityType(type) {
		let curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type]
		if (curType == null)
			return []

		return this._GetRankAwardList(curType)
	}

	public static GetDragonRankAwardListByActivityType(type) {
		let curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type]
		if (curType == null)
			return []

		return this._GetDragonRankAwardList(curType)
	}

	public static GetImageSourceByActivityType(type) {
		let curType = this.ACTIVITY_TYPE_EXCHANGETO_MAP[type]
		if (curType == null)
			return ""

		let config = GameGlobal.Config.ActivityPreviewConfig[curType]
		if (!config || !config.icon)
			return ""

		return config.icon
	}

	// 活动大厅的ID转换成活动预告表的ID
	private static ACTIVITY_TYPE_EXCHANGETO_MAP = {
		[3] : 1,
		[5] : 2,
		[6] : 3,
		[101] : 5, //跨服BOSS 不在活动大厅列表里
	}
}
