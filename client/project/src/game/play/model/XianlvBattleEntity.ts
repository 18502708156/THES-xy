class XianlvBattleEntity extends BattleEntity {

	private _fz = new BattleMvData(this, false)
	private _xw: eui.Image

	public constructor() {
		super()
		this._fz.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_FZ
		this._fz.SetParent(this, CharMcOrder.OTHER_TYPE)
		this._fz.SetNotState()
		
		this._xw = new eui.Image
		this._xw.y = -64 + BattleEntity.POS
		this._xw.x = -72
		this.addChildAt(this._xw, CharMcOrder.TITLE_TYPE);
	}

	public UpdateSetting(settingId: number) {
		super.UpdateSetting(settingId)
		if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_FZ) {
			this._fz.UpdateSetting(settingId)
		} else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_XW) {
			if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
				if (this._xw) {
					this._xw.source = ""
				}
			}
		}
	}

	public Dispose(): void {
		super.Dispose()
		this._fz.ClearCache()
		this._xw.source = ""
	}

	public UpdateInfo(model: EntityXianlv): void {
		this._fz.SetId( model.mFazId)

		if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
			if (model.mXianwId) {
				let sourcePath = AppearanceConfig.GetAppe(model.mXianwId)
				this._xw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1)
			} else {
				this._xw.source = ""
			}
		}

		super.UpdateInfo(model)
	}


	protected _BodyLoaded(): void {
		super._BodyLoaded()
		this._fz.Load()
	}
}