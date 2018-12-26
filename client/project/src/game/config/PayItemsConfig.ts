class PayItemsConfig {

	private static CONFIG
	
	public static GetConfig() {
		if (!this.CONFIG) {
			let id = LocationProperty.GetRechargeId() || 1
			let config = GameGlobal.Config.PayItemsConfig
			let outData = this.CONFIG = {}
			for (let key in config) {
				let data = config[key]
				if (data.plat) {
					if (data.plat == id) {
						outData[data.id] = data
					}
				} else {
					outData[data.id] = data
				}
			}
		}
		return this.CONFIG
	}
}