class ActivityConfig {
	
	public static GetActTypeById(actId: number) {
		let config = GameGlobal.Config.ActivityConfig[actId]
		if (config) {
			return config.activityType
		}
		return 0
	}
}