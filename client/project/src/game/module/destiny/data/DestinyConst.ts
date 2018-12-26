class DestinyConst {

	private static LOCK: {[key: number]: number}

	public static GetLockLevel(index: number): number {
		if (!this.LOCK) {
			let lock = this.LOCK = {}
			let config = GameGlobal.Config.DestinyBaseConfig.openlevel1
			for (let key in config) {
				let level = Number(key)
				let equipIndex = config[level]
				if (!lock[equipIndex]) {
					lock[equipIndex] = level
				} else {
					if (level < lock[equipIndex]) {
						lock[equipIndex] = level
					}
				}
			}
		}
		return this.LOCK[index + 1] + 1
	}
}