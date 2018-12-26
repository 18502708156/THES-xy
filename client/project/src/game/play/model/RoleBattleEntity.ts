class RoleBattleEntity extends BattleEntity {

	private _weapon = new BattleMvData(this, false)
	private _wing = new BattleMvData(this, false)
	private _horse = new BattleMvData(this, false)
	private _horseHead = new BattleMvData(this, false)
	private _ring = new BattleMvData(this, false)

	private _disOrder: { [key: number]: number } = {}

	public constructor() {
		super()

		this._horse.SetParent(this.m_Container, 0)
		this._weapon.SetParent(this.m_Container, 2)
		let animType = {[EntityClipType.STAND]: true, [EntityClipType.RUN]: true}
		this._horse.mAnimType = animType
		this._horseHead.SetParent(this.m_Container, 4)
		this._horseHead.mAnimType = animType
		this._horseHead.mIsHead = true

		this._wing.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_CB
		this._wing.SetParent(this.m_Container, 3)

		this._ring.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_TX
		this._ring.SetParent(this, 1)
		this._ring.mAnimType = {[EntityClipType.STAND]: true}

		this._disOrder = {}
		this._disOrder[this._horse.hashCode] = CharMcOrder.HORSE
		this._disOrder[this.mBody.hashCode] = CharMcOrder.BODY
		this._disOrder[this._weapon.hashCode] = CharMcOrder.WEAPON
		this._disOrder[this._wing.hashCode] = CharMcOrder.WING
		this._disOrder[this._horseHead.hashCode] = CharMcOrder.HORSE_HEAD
	}

	public Init(entity: EntityData): void {
		this._horse.Init()
		this._horseHead.Init()
		this._weapon.Init()
		this._wing.Init()
		this._ring.Init()
		super.Init(entity)
	}

	public UpdateSetting(settingId: number) {
		super.UpdateSetting(settingId)
		if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CB) {
			this._wing.UpdateSetting(settingId)
		} else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TX) {
			this._ring.UpdateSetting(settingId)
		}
	}

	// 替身显示状态
	public IsReplaceShow(show: boolean) {
		let isShow = !show
		this.SetMvState(this._horse, isShow)
		this.SetMvState(this._horseHead, isShow)
		this.SetMvState(this._weapon, isShow)
		this.SetMvState(this._wing, isShow)
		this.SetMvState(this._ring, isShow)
		if (isShow) {
			this.UpdateOrder()
		}
	}

	public Dispose(): void {
		super.Dispose()
		this.mBody.ClearCache()
		this._wing.ClearCache()
		this._weapon.ClearCache()
		this._horse.ClearCache()
		this._horseHead.ClearCache()
		if (this._ring) {
			this._ring.ClearCache()
		}
	}

	public UpdateInfo(model: EntityRole): void {

		let rideId = model.GetRideId()
		this._horse.SetId(rideId)
		this._horseHead.SetId(rideId)
		let animType = null
		if (this.mBody.ride = rideId ? true : false) {
			animType = {[EntityClipType.STAND]: true, [EntityClipType.ATTACK]: true, [EntityClipType.HIT]: true}
		}
		this.mBody.job = model.job
		this.mBody.sex = model.sex
		this.mBody.mAnimType = animType

		this._weapon.ride = rideId ? true : false
		this._weapon.job = model.job
		this._weapon.sex = model.sex
		this._weapon.mAnimType = animType
		this._weapon.SetId(model.GetWeaponId())

		this._wing.ride = rideId ? true : false
		this._wing.SetId(model.GetWingId())
		this._wing.mAnimType = animType

		this._ring.SetId(RoleShowData.GetTianxAppId(model.mTianxianId))

		let offset = AppearanceConfig.GetRideOffset(rideId)
		this.mBody.SetOffset(offset)
		this._weapon.SetOffset(offset)
		this._wing.SetOffset(offset)

		this.mPosY = BattleEntity.POS + (-38) + offset.y

		super.UpdateInfo(model)
	}

	protected UpdateOrder() {
		if (!RoleBattleEntity.FRAME_ODER_DICT) {
			let dict1 = RoleBattleEntity.FRAME_ODER_DICT = {}
			let i = 0
			for (let data1 of RoleBattleEntity.FRAME_ODER) {
				let dict2 = dict1[i] = {}
				let j = 0
				for (let data2 of data1) {
					dict2[data2] = j++
				}
				++i
			}
		}
		var order = RoleBattleEntity.FRAME_ODER_DICT[this.m_Dir];
		let disOrder = this._disOrder
		this.m_Container.$children.sort((lhs, rhs) => {
			let lhsCode = lhs.hashCode
			let rhsCode = rhs.hashCode
			return order[disOrder[lhsCode]] - order[disOrder[rhsCode]]
		})
	}

	protected _BodyLoaded(): void {
		super._BodyLoaded()
		this._horse.Load()
		this._horseHead.Load()
		this._weapon.Load()
		this._wing.Load()
		this._ring.Load()
		this.UpdateOrder()

		if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX) && this._ring.mv) {
			this._ring.UpdateWayTween()
		}
	}

	/**不同方向的身体显示对象显示顺序 */
	public static FRAME_ODER = [
		[CharMcOrder.HORSE, CharMcOrder.WEAPON, CharMcOrder.BODY, CharMcOrder.WING],
		[CharMcOrder.HORSE, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
		[CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],
		[CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
		[CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
		[CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
		[CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],
		[CharMcOrder.HORSE, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
	];

	private static FRAME_ODER_DICT = null
}