class MovieBaseObject extends egret.MovieClip {

	protected _mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory();
	protected _playCount: number;
	private _frameName: string;
	private _autoPlay: boolean

	private m_Url: string
	private m_State: boolean = false

	private m_CompFunc: Function
	private _compFuncTagret:any;

	public mNotRemove: boolean

	private m_FrameRateMul: number

	public constructor() {
		super();
		this.touchEnabled = false;
		this.addEventListener(egret.Event.COMPLETE, this._PlayComp, this)
	}

	public SetFrameRate(mul: number) {
		this.m_FrameRateMul = mul
	}

	$hitTest(stageX: number, stageY: number): egret.DisplayObject {
		if (this.touchEnabled) {
			return super.$hitTest(stageX, stageY)
		}
		return null;
	}

	public GetLoadUrl(): string {
		return this.m_Url
	}

	protected GetImgUrl(): string {
		return (this.m_Url || "") + ".png"
	}

	protected GetJsonUrl(): string {
		return (this.m_Url || "") + ".json"
	}

	protected _SetUrl(url: string): void {
		this.m_Url = url
	}

	public PlayFrame(frameName: string) {
		if (this._frameName == frameName) {
			return
		}
		this._frameName = frameName
		if (this.m_State) {
			this._Play(1)
		}
	}

	/**
	 * 
	 * 文件名
	 * 动画名
	 * 播放次数
	 * 自动播放
	 * 完成回调
	 * 重新开始播放动画  2、继续播放动画
	 */
	public Play(fileName: string, frameName: string, playCount?: number, autoPlay = true, comp?: Function,compFuncTagret?:any, isReplay = null) {
		if (frameName) {
			this._frameName = frameName
		} else {
			let splitIndex = -1
			if (fileName) {
				splitIndex = fileName.lastIndexOf("/")
			}
			if (splitIndex != -1) {
				this._frameName = fileName.substring(splitIndex + 1)
			} else {
				this._frameName = fileName
			}
		}
		this._playCount = playCount || -1;
		this._autoPlay = autoPlay
		if (fileName == this.m_Url) {
			if (this.m_State) {
				if (isReplay) {
					this._Play(isReplay)
				} else {
					this.dispatchEventWith(egret.Event.CHANGE)
				}
			}
			return
		}
		this.ClearCache()
		this.m_Url = fileName
		if (StringUtils.IsNullOrEmpty(fileName)) {
			return
		}
		this.Ref()
		this.m_CompFunc = comp
		this._compFuncTagret = compFuncTagret

		let obj01 = this._Load(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE)
		let obj02 = this._Load(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON)
		if (obj01 && obj02) {
			this._OnCreateBody(obj02, obj01)
		}
	}	

	public LoadByUrl(fileName: string, playCount?: number, autoPlay = true, comp?: Function,compFuncTagret?:any) {
		this.Play(fileName, null, playCount, autoPlay, comp, compFuncTagret)
	}

	private _Load(url: string, type: string): boolean {
		let obj = this._GetRes(url, type)
		if (!obj) {
			RES.getResByUrl(url, this._CreateBodyByUrl, this, type)
			return null
		}
		return obj
	}

	private _GetRes(url: string, type: string): any {
		let analyzer = RES.getAnalyzer(type)
		return analyzer.getRes(url)
	}

	public ClearCache() {
		this.Unref()
		this.visible = false;
		this.stop();
		this.m_State = false
		this.m_CompFunc = null
		this._compFuncTagret = null;
		this._mcFactory.mcDataSet = null
        this._mcFactory.texture = null
        this._mcFactory.clearCache();
	}

	protected Unref() {
		this.m_Url = null
	}

	protected Ref() {
	}

	private _CreateBodyByUrl(data: any, url: string): void {
		if (url) {
			if (this.GetJsonUrl() != url && this.GetImgUrl() != url)
				return;
		}
		this._OnCreateBody(this._GetRes(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON), this._GetRes(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE))
	}

	private _OnCreateBody(mcJson: any, mcTexture: any): void {
		if (!mcJson || !mcTexture)
			return;
		this.visible = true;
		if (mcJson && mcJson.scale) {
			let v = 100 / mcJson.scale
			this.scaleY = v
			if (this.scaleX < 0) {
				this.scaleX = -v
			} else {
				this.scaleX = v
			}
		}
		this._mcFactory.mcDataSet = mcJson;
		this._mcFactory.texture = mcTexture;
		this.m_State = true
		this._Play(1)
	}

	/**
	 * 播放动画
	 * @param isReplay 1、重新播放， 2、继续播放
	 */
	private _Play(isReplay: number): void {
		this.movieClipData = this._mcFactory.generateMovieClipData(this._frameName);
		if (!this.movieClipData) {
			return
		}
		if (this.m_FrameRateMul && this.m_FrameRateMul > 1) {
			this.frameRate = this.movieClipData.frameRate * this.m_FrameRateMul
		}
		if (this._autoPlay) {
			if (isReplay == 2) {
				this.play(this._playCount)
			} else {
				this.gotoAndPlay(1, this._playCount);
			}
		}
		this.dispatchEventWith(egret.Event.CHANGE)
	}

	private _PlayComp(): void {
		let comp = this.m_CompFunc
		let target = this._compFuncTagret;
		if (!this.mNotRemove && this.parent) {
			this.parent.removeChild(this)
		}
		if (comp) {
			if(target)
			{
				comp.call(target, this);
			}else
			{
				comp();
			}
			target = null;
		}
	}

	public DoDispose() {
		this.ClearCache()
	}
}