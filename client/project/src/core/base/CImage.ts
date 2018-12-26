
class CImage extends eui.Image {

	private m_Url: string
	private m_Cache: string

	public set source(source: string | egret.Texture) {
		this.source2(source)
	}

	private source2(source): void {
		let newUrl = <string>source;
		if (this.m_Url == newUrl) {
			return;
		}
		if (this.m_Url) {
			ResMgr.Unref(ResMgr.GetName(this.m_Url), ResMgr.IMG_LIFT_TIME)
		}
		this.m_Url = newUrl
		if (this.m_Url) {
			ResMgr.Ref(ResMgr.GetName(this.m_Url));
		}
		egret.superSetter(CImage, this, 'source', source);
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		if (this.m_Cache) {
			this.source2(this.m_Cache)
			this.m_Cache = null
		}
	}

	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		if (this.m_Url) {
			this.m_Cache = this.m_Url
			this.source2(null)
		}
	}
}
