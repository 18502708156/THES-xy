class MapViewBg extends egret.DisplayObjectContainer {

	// _shape: egret.Shape;
	lastUpdateX: number;
	lastUpdateY: number;

	thumbnail: eui.Image;

	_imageList: {[key: number]: eui.Image} = {}

	isThumbnailComplete: boolean;
	mapName: string
	maxImagXCount: number;
	maxImagYCount: number;

	private m_ThumbList: string[] = []

	private mGroup: egret.DisplayObjectContainer
	private chunkPos = 512

	public constructor() {
		super();

		this.mGroup = new egret.DisplayObjectContainer
		this.mGroup.touchEnabled = false
		this.mGroup.touchChildren = false
		this.addChild(this.mGroup)

		this.lastUpdateX = 0;
		this.lastUpdateY = 0;
		this.touchChildren = false;
		this.touchEnabled = false;
		var s = new eui.Image();
		this.mGroup.addChild(s);
		this.thumbnail = s;
	}

	public onThumbnailComplete() {
		this.isThumbnailComplete = true;
		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
	}

	private m_MapUrl: string = null

	public initThumbnail(w, h, fName) {
		if (this.mapName == fName) {
			return
		}
		this.mGroup.scaleX = this.mGroup.scaleY = GameMap.scale ? 1 / (GameMap.scale * 0.01) : 1
		this.chunkPos = GameMap.scalechunk
		this.isThumbnailComplete = false;
		for (let key in this._imageList) {
			this.SetImage(this._imageList[key])
		}
		this._imageList = {}
		this.mapName = fName;
		var imgSize = GameMap.chunkw;
        this.maxImagXCount = Math.ceil(w / imgSize)
        this.maxImagYCount = Math.ceil(h / imgSize)
		this.thumbnail.width = w;
		this.thumbnail.height = h;

		if (this.m_MapUrl) {
			for (let i = 0, len = this.m_ThumbList.length; i < len; i++) {
				if (this.m_ThumbList[i] == this.m_MapUrl) {
					this.m_ThumbList.splice(i, 1)
					break
				}
			}
			this.m_ThumbList.unshift(this.m_MapUrl)
			for (let i = this.m_ThumbList.length - 1; i >= 3; --i) {
				RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).destroyRes(this.m_ThumbList[i])
			}
			this.m_MapUrl = null
		}
		let url = ResDataPath.GetMapPreviewPath(this.mapName)
		this.m_MapUrl = url
		let analyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE)
		let resItem: RES.ResourceItem = new RES.ResourceItem(url,url,RES.ResourceItem.TYPE_IMAGE);
		analyzer.loadFile(resItem, this._Finish, this)
	}

	private _Finish(resItem: RES.ResourceItem): void {
		if (resItem.name == this.m_MapUrl) {
			this.thumbnail.source = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).getRes(resItem.name)
			this.onThumbnailComplete()
		} else {
			console.error("MapViewBg._Finish resItem.name != this.m_MapUrl", resItem.name, this.m_MapUrl)
		}
	}

	public updateHDMap(point: any, force: boolean = false) {
		var IMG_SIZE = GameMap.chunkw
		// if (force || Math.abs(this.lastUpdateX - point.x) > IMG_SIZE / 4 || Math.abs(this.lastUpdateY - point.y) > IMG_SIZE / 4 || this.lastUpdateX == 0) {
		if (force || Math.abs(this.lastUpdateX - point.x) > 60 || Math.abs(this.lastUpdateY - point.y) > 60 || this.lastUpdateX == 0) {
			this.lastUpdateX = point.x;
			this.lastUpdateY = point.y;
			if (!this.isThumbnailComplete)
				return;
			var ww = GameGlobal.StageUtils.GetWidth();
			var hh = GameGlobal.StageUtils.GetHeight();
			var imgX = Math.max(Math.floor(-point.x / IMG_SIZE), 0);
			var imgY = Math.max(Math.floor(-point.y / IMG_SIZE), 0);
            var xCount = Math.min(imgX + Math.ceil(ww / IMG_SIZE) + 1, this.maxImagXCount);
            var yCount = Math.min(imgY + Math.ceil(hh / IMG_SIZE) + 1, this.maxImagYCount);
			// let refresh = false
			for (var i = imgX; i < xCount; i++) {
				for (var j = imgY; j < yCount; j++) {
					let index = this.maxImagXCount * j + i
					if (this._imageList[index]) {
						continue
					}
					// refresh = true
					this._imageList[index] = this.GetImage(i, j, ResDataPath.GetMapPath(this.mapName, i, j))
				}
			}
			// if (refresh && !WindowData.IsFullScreen() ) {
			// 	let count = 0
			// 	for (let key in this._imageList) {
			// 		let index = Number(key)
			// 		let j = Math.floor(index / this.maxImagXCount)
			// 		let i = index % this.maxImagXCount
			// 		if (i < imgX || i >= xCount || j < imgY || j >= yCount) {
			// 			this.SetImage(this._imageList[key])
			// 			delete this._imageList[key]
			// 		} else {
			// 			++count
			// 		}
			// 	}
			// }
		}
	}

	private m_ImageList: eui.Image[] = []

	private GetImage(x: number, y: number, source: string): eui.Image {
		let img = this.m_ImageList.pop() || new eui.Image
		img.name = x + "_" + y
		// if (this.mIsScale) {
		// 	img.x = x >> 1
		// 	img.y = y >> 1
		// } else {
		// 	img.x = x
		// 	img.y = y
		// }
		img.x = this.chunkPos * x
		img.y = this.chunkPos * y

		img.source = source
		ResMgr.Ref(source)
		if (!img.parent) {
			this.mGroup.addChild(img)
		}
		// console.log("load map => ", img.name)
		return img
	}

	private SetImage(image: eui.Image) {
		if (!image) {
			return
		}
		if (!StringUtils.IsNullOrEmpty(image.source)) {
			ResMgr.Unref(image.source as string)
			image.source = ""
			if (!image.$stage) {
				image.$setBitmapData(null)
			}
		}
		this.m_ImageList.push(image)
	}
}