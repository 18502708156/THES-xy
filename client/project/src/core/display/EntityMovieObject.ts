class EntityMovieObject extends egret.MovieClip {

	private _mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory();
	private _playCount: number;
	private _fileName: string;
	private _autoPlay: boolean

	// private m_FileSet: {[key: string]: boolean} = {}
	private m_FileName: string
	private m_CurPath: string

	private m_State: boolean = false

	// 再次load是否需要重新播放动画
	public m_LoadAndPlay: boolean = true

	private m_FrameRateMul: number 

	public constructor() {
		super();
		this.touchEnabled = false;
	}

	public SetFrameRate(mul: number) {
		this.m_FrameRateMul = mul
	}

	public LoadByUrl(actionName: string, stateName: string, frameName: string, playCount: number, autoPlay = true) {
		let filePath = actionName
		if (stateName) {
			filePath += "_" + stateName
		}

		if (this.m_FileName != actionName) {
			this.ClearCache()
			this.m_FileName = actionName

			EntityMovieObject.Ref(this.m_FileName)
		}
		if (frameName) {
			this._fileName = frameName
		} else {
			let splitIndex = filePath.lastIndexOf("/")
			if (splitIndex != -1) {
				this._fileName = filePath.substring(splitIndex + 1)
			} else {
				this._fileName = filePath
			}
		}
		this._playCount = playCount || -1;
		this._autoPlay = autoPlay
		if (this.m_CurPath == filePath) {
			if (this.m_State && this.m_LoadAndPlay) {
				this._Play()
			}
			return
		}

		this.m_CurPath = filePath

		EntityMovieObject.SetRefFile(this.m_FileName, filePath)
		
		let obj01 = this._Load(filePath + ".png", RES.ResourceItem.TYPE_IMAGE)
		let obj02 = this._Load(filePath + ".json", RES.ResourceItem.TYPE_JSON)
		if (obj01 && obj02) {
			this._OnCreateBody(obj02, obj01)
		}
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
		this._mcFactory.mcDataSet = null
        this._mcFactory.texture = null
        this._mcFactory.clearCache();
        this.$bitmapData = null
        this.movieClipData = null;
		this.visible = false;
		this.stop();
		this.m_State = false
		EntityMovieObject.Unref(this.m_FileName)
		this.m_FileName = null
		this.m_CurPath = null

		// for (let key in this.m_FileSet) {
		// 	ResMgr.Unref(key + ".png")
		// }
		// this.m_FileSet = {}

	}

	private _CreateBodyByUrl(data: any, url: string): void {
		let json = this.m_CurPath + ".json"
		let img = this.m_CurPath + ".png"
		if (url) {
			if (json != url && img != url)
				return;
		}
		this._OnCreateBody(this._GetRes(json, RES.ResourceItem.TYPE_JSON), this._GetRes(img, RES.ResourceItem.TYPE_IMAGE))
	}

	private _OnCreateBody(mcJson: any, mcTexture: any): void {
		if (!mcJson || !mcTexture) {
			return;
		}
		this.visible = true;
		this._mcFactory.mcDataSet = mcJson;
		this._mcFactory.texture = mcTexture;
		this.m_State = true
		this._Play()
	}

	private _Play(): void {
		this.movieClipData = this._mcFactory.generateMovieClipData(this._fileName);
		if (!this.movieClipData) {
			return
		}
		if (this._autoPlay) {
			if (this.m_FrameRateMul && this.m_FrameRateMul > 1) {
				this.frameRate = this.movieClipData.frameRate * this.m_FrameRateMul
			}
			if (this.movieClipData.$isDataValid()) {
				this.gotoAndPlay(1, this._playCount);
			}
		}
		this.dispatchEventWith(egret.Event.CHANGE)
	}


	private static FILE_SET: {[key: string]: {[key: string]: boolean}} = {}
	private static FILE_REF: {[key: string]: number} = {}

	public static SetRefFile(actionName: string, fileName: string) {
		fileName += ".png"
		if (this.FILE_SET[actionName]) {
			if (!this.FILE_SET[actionName][fileName]) {
				ResMgr.Ref(fileName)
				this.FILE_SET[actionName][fileName] = true
			}
		} else {
			ResMgr.Ref(fileName)
			this.FILE_SET[actionName] = {
				[fileName]: true
			}
		}
	}

	public static Ref(actionName: string) {
		if (!this.FILE_REF[actionName]) {
			this.FILE_REF[actionName] = 1
		} else {
			++this.FILE_REF[actionName]
		}
	}

	public static Unref(actionName: string) {
		if (!this.FILE_REF[actionName]) {
			return
		}
		if ((--this.FILE_REF[actionName]) < 1) {
			let list = this.FILE_SET[actionName] || {}
			for (let key in list) {
				ResMgr.Unref(key)
			}
			delete this.FILE_REF[actionName]
			delete this.FILE_SET[actionName]
		}
	}
}