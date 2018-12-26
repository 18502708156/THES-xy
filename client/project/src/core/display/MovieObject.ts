class MovieObject extends MovieBaseObject {

	private m_CacheUrl: string

	public Clear(): void {
		this.m_CacheUrl = null
	}

	public ClearCache() {
		// this._mcFactory.mcDataSet = null
        // this._mcFactory.texture = null
        // this._mcFactory.clearCache();
        this.$bitmapData = null
        this.movieClipData = null;
		super.ClearCache()
	}

	protected _SetUrl(url: string): void {
		super._SetUrl(url)
		this.m_CacheUrl = url
	}

	protected Unref() {
		if (!StringUtils.IsNullOrEmpty(this.GetLoadUrl())) {
			ResMgr.Unref(this.GetImgUrl())
			// ResMgr.Unref(this.GetJsonUrl())
		}
		this._SetUrl(null)
	}

	protected Ref() {
		if (!StringUtils.IsNullOrEmpty(this.GetLoadUrl())) {
			ResMgr.Ref(this.GetImgUrl())
			// ResMgr.Ref(this.GetJsonUrl())
		}
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void
	{
		super.$onAddToStage(stage,nestLevel);
		if (this.m_CacheUrl) {
			this.LoadByUrl(this.m_CacheUrl)
			this.m_CacheUrl == null
		}
	}

	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();
		// 如果是重复播放类型的，在隐藏的时候清理
		if (this.GetLoadUrl()) {
			if (this._playCount == -1) {
				let url = this.GetLoadUrl()
				this.ClearCache()
				this.m_CacheUrl = url
			} else {
				this.ClearCache()
			}
		}
	}
}