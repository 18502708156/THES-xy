class ActivitySumBtnConfig {

	private static BTN_LIST = null

	public static GetOpenList(openType: number) {
		if (!this.BTN_LIST) {
			let list = this.BTN_LIST = {}
			for (let key in GameGlobal.Config.ActivitySumBtnConfig) {
				let data = GameGlobal.Config.ActivitySumBtnConfig[key]
				if (!list[data.openId]) {
					list[data.openId] = {}
				}
				list[data.openId][data.id] = data
			}
		}
		return this.BTN_LIST[openType] || []
	}
}