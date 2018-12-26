class GainItemConfig {
	public static GetGainName(itemId: number): string {
		let config = GameGlobal.Config.GainItemConfig[itemId]
		if (!config) {
			return ""
		}
		if (!config.gainWay) {
			return ""
		}
		if (config.gainWay[0]) {
			return config.gainWay[0][0] || ""
		}
		return ""
	}

	public static Guide(itemId: number, index: number = 0) {
		let config = GameGlobal.Config.GainItemConfig[itemId]
		if (!config) {
			return false
		}
		if (!config.gainWay) {
			return false
		}
		if (config.gainWay[index]) {
			GameGlobal.ViewManager.Guide(config.gainWay[index][1][0])
			return true
		}
		return false
	}
}