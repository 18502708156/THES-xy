class TiannvBattleEntity extends BattleEntity {

	private _hua = new BattleMvData(this, false)
	private _xw: eui.Image

	public constructor() {
		super()
		this._hua.SetParent(this, CharMcOrder.OTHER_TYPE)
		this._hua.SetNotState()
	
		this._xw = new eui.Image
		this._xw.y = -94 + BattleEntity.POS
		this._xw.x = -90
		this.addChildAt(this._xw, CharMcOrder.TITLE_TYPE);
	}

	public GetTopPos(): number {
		return -84 + BattleEntity.POS + 60
	}

	public UpdateSetting(settingId: number) {
		super.UpdateSetting(settingId)
	}

	public Dispose(): void {
		super.Dispose()
		this._hua.ClearCache()
		this._xw.source = ""
	}

	public UpdateInfo(model: EntityTiannv): void {
		this._hua.SetId( model.mHua)
		if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_XW)) {
			if (model.mLq) {
				let sourcePath = AppearanceConfig.GetAppe(model.mLq)
				this._xw.source = sourcePath.substring(sourcePath.lastIndexOf("/") + 1)
			} else {
				this._xw.source = ""
			}
		}

		super.UpdateInfo(model)
	}


	protected _BodyLoaded(): void {
		super._BodyLoaded()
		this._hua.Load()
	}
}