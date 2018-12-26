class AppearanceConfig {

	private static GetAppeName(appe: string, isUI: boolean, isHead: boolean, isRide = false): string {
		if (!appe) {
			return ""
		}
		if (isHead) {
			if (isUI) {
				appe += "_h"
			} else {
				if (GameGlobal.Config.AppearancePosConfig[appe].downRes) {
					appe = appe.replace("_s", "_h_s")
				} else {
					appe = null
				}
			}
		}
		if (isUI) {
			// 场面模型用在ui上需要添加后缀
			appe += "_3" + EntityClipTypeToName[isRide ? EntityClipType.RIDE_STAND : EntityClipType.STAND][0]
		}
		return appe
	}

	public static GetAppe(id: number, job = null, sex = null, isHead = false, isRide = false): string {
		let config = GameGlobal.Config.AppearanceConfig[id]
		if (config) {
			let path
			if (job != null && sex != null) {
				path = config["job" + job + sex]
			}
			if (!path) {
				path = config.appearance
			}
			if (path) {
				path = this.GetAppeName(path, false, isHead, isRide)
			}
			return path || ""
		}
		return ""
	}

	public static GetUIAppe(id: number, job = null, sex = null, isHead = false, isRide = false): string {
		let config = GameGlobal.Config.AppearanceConfig[id]
		if (config) {
			let path
			if (job != null && sex != null) {
				if (isRide)
				{
					path = config["job" + job + sex + "show"]
				} else {
					path = config["job" + job + sex + "showa"]
				}
				
			}
			if (!path) {
				path = config.uishow
			}
			if (path) {
				path = this.GetAppeName(path, false, isHead, isRide)
			} else {
				if (!path) {
					path = config.appearance
				}
				if (path) {
					let isWay = true
					// 如果是没有方向
					if (config.way) {
						isWay = false
					}
					path = this.GetAppeName(path, isWay, isHead, isRide)
				}
			}
			return path || ""
		}
		return ""
	}

	public static GetScale(id: number): number {
		let config = GameGlobal.Config.AppearanceConfig[id]
		if (config) {
			if (config.scale) {
				return 1 / (config.scale * 0.01)
			}
			return 1
		}
		return 1
	}

	public static GetUIPath(id: number, job = null, sex = null, isHead = false, isRide = false): string {
		let path = this.GetUIAppe(id, job, sex, isHead, isRide)
		if (path) {
			return ResDataPath.GetMovieStandPath(path)
		}
		return ""
	}

	private static TMP_DATA = {x: 0, y: 0}

	public static GetRideOffset(rideId: number, isUI = false): any {
		let config = GameGlobal.Config.AppearanceConfig[rideId]
		if (!config) {
			return AppearanceConfig.TMP_DATA
		}
		let name = null
		if (isUI) {
			name = config.uishow
		}
		if (!name) {
			name = config.appearance
		}
		config = GameGlobal.Config.AppearancePosConfig[name]
		if (!config) {
			return AppearanceConfig.TMP_DATA	
		}
		return config.offset || AppearanceConfig.TMP_DATA
	}
}