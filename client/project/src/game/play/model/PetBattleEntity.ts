class PetBattleEntity extends BattleEntity {

	private _tl = new BattleMvData(this, false)
	private _sh = new BattleMvData(this, false)

	public constructor() {
		super()
		this._tl.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_TL
		this._tl.SetNotState()
		this._tl.SetParent(this, CharMcOrder.OTHER_TYPE)
		
		this._sh.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_SH
		this._sh.SetNotState()
		this._sh.SetParent(this, CharMcOrder.TITLE_TYPE)
	}

	public Init(entity: EntityData): void {
		this._tl.Init()
		this._sh.Init()
		super.Init(entity)
	}

	public UpdateSetting(settingId: number) {
		super.UpdateSetting(settingId)
		if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TL) {
			this._tl.UpdateSetting(settingId)
		} else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_SH) {
			this._sh.UpdateSetting(settingId)
			// if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)) {
			// 	if (this._sh) {
			// 		this._sh.source = ""
			// 	}
			// }
		}
	}

	public Dispose(): void {
		super.Dispose()
		this._tl.ClearCache()
		this._sh.ClearCache()
		// this._sh.source = ""
	}

	public UpdateInfo(model: EntityPet): void {
		this._tl.SetId( model.mTlId)
		this._sh.SetId( model.mShId)

		// if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SH)) {
		// 	if (model.mShId) {
		// 		let sourcePath = AppearanceConfig.GetAppe(model.mShId)
		// 		this._sh.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1)
		// 	} else {
		// 		this._sh.source = ""
		// 	}
		// }

		
		
		super.UpdateInfo(model)
	}


	protected _BodyLoaded(): void {
		super._BodyLoaded()
		this._tl.Load()
		this._sh.Load()

		this._sh.UpdateWayTween()
	}
}