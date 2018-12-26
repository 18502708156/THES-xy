
class RoleShowData {

	job
	sex

	clothID
	swordID
	rideId: number = 0
	wingId: number = 0
	tianxId: number = 0
	titleId: number = 0

	public shows: number[]

	public GetSwordId(): number {
		if (this.swordID) {
			return this.swordID
		}
		return RoleShowData.GetSwordAppId(this.shows? this.shows[RoleShowDataType.ROLE_SWORD]: 0, this.job, this.sex)
	}

	public GetWingId(): number {
		if (this.wingId) {
			return this.wingId
		}
		return RoleShowData.GetWingAppId(this.shows? this.shows[RoleShowDataType.ROLE_WING]: 0)
	}

	public GetRideId(): number {
		if (this.rideId) {
			return this.rideId
		}
		return RoleShowData.GetRideAppId(this.shows? this.shows[RoleShowDataType.ROLE_RIDE]: 0)
	}

	public GetTianx(): number {
		if (this.tianxId) {
			return this.tianxId
		}
		return RoleShowData.GetTianxAppId(this.shows? this.shows[RoleShowDataType.ROLE_TIANXIAN]: 0)
	}

	public GetBodyId(): number {
		if (this.clothID) {
			return this.clothID
		}
		return RoleShowData.GetBodyAppId(this.shows? this.shows[RoleShowDataType.ROLE_SKIN]: 0, this.job, this.sex)
	}

	public GetTitleId(): number {
		if (this.titleId) {
			return this.titleId
		}
		return this.shows ? (this.shows[RoleShowDataType.ROLE_TITLE] || 0): 0
	}

	public static GetSwordAppId(showId: number, job: number, sex: number): number {
		let weaponConfig = GameGlobal.Config.WeaponSkinConfig[showId]
		if (weaponConfig) {
			return weaponConfig.pid
		}
		return 11000
	}

	public static GetWingAppId(showId: number): number {
		let wingConfig = GameGlobal.Config.WingSkinConfig[showId]
		if (wingConfig) {
			return wingConfig.pid
		}
		return 0
	}

	public static GetRideAppId(showId: number): number {
		let rideConfig = GameGlobal.Config.RideSkinConfig[showId]
		if (rideConfig) {
			return rideConfig.pid
		}
		return 0
	}

	public static GetTianxAppId(showId: number): number {
		let rideConfig = GameGlobal.Config.FairySkinConfig[showId]
		if (rideConfig) {
			return rideConfig.pid
		}
		return 0
	}

	public static GetBodyAppId(showId: number, job: number, sex: number): number {
		let config = GameGlobal.Config.FashionSkinConfig[showId]
		if (config) {
			config = config[sex]
			if (config) {
				return config.pid
			}
		}
		return 1001
	}
}

/**
 	shows类型
  	角色： 1. 坐骑 2.翅膀 3.守护 4.神兵 5.时装 6.称号
	仙侣： 1. 法阵 2.仙位
	宠物： 1. 通灵 2.兽魂
 */
class RoleShowDataType {
	public static ROLE_RIDE = 0
	public static ROLE_WING = 1
	public static ROLE_TIANXIAN = 2
	public static ROLE_SWORD = 3
	public static ROLE_SKIN = 4
	public static ROLE_TITLE = 5

	public static XIANLV_FZ = 0
	public static XIANLV_XW = 1

	public static PET_TL = 0
	public static PET_SH = 1

	public static TIANNV_LQ = 1
	public static TIANNV_HUA = 2
}

enum RoleShowDressType {
	ROLE = 1,
	ARM = 2,
	WING = 3,
	RIDE = 4,
	TIANX = 5
}