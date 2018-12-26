var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MapViewBg = (function (_super) {
    __extends(MapViewBg, _super);
    function MapViewBg() {
        var _this = _super.call(this) || this;
        _this._imageList = {};
        _this.m_ThumbList = [];
        _this.chunkPos = 512;
        _this.m_MapUrl = null;
        _this.m_ImageList = [];
        _this.mGroup = new egret.DisplayObjectContainer;
        _this.mGroup.touchEnabled = false;
        _this.mGroup.touchChildren = false;
        _this.addChild(_this.mGroup);
        _this.lastUpdateX = 0;
        _this.lastUpdateY = 0;
        _this.touchChildren = false;
        _this.touchEnabled = false;
        var s = new eui.Image();
        _this.mGroup.addChild(s);
        _this.thumbnail = s;
        return _this;
    }
    MapViewBg.prototype.onThumbnailComplete = function () {
        this.isThumbnailComplete = true;
        this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
    };
    MapViewBg.prototype.initThumbnail = function (w, h, fName) {
        if (this.mapName == fName) {
            return;
        }
        this.mGroup.scaleX = this.mGroup.scaleY = GameMap.scale ? 1 / (GameMap.scale * 0.01) : 1;
        this.chunkPos = GameMap.scalechunk;
        this.isThumbnailComplete = false;
        for (var key in this._imageList) {
            this.SetImage(this._imageList[key]);
        }
        this._imageList = {};
        this.mapName = fName;
        var imgSize = GameMap.chunkw;
        this.maxImagXCount = Math.ceil(w / imgSize);
        this.maxImagYCount = Math.ceil(h / imgSize);
        this.thumbnail.width = w;
        this.thumbnail.height = h;
        if (this.m_MapUrl) {
            for (var i = 0, len = this.m_ThumbList.length; i < len; i++) {
                if (this.m_ThumbList[i] == this.m_MapUrl) {
                    this.m_ThumbList.splice(i, 1);
                    break;
                }
            }
            this.m_ThumbList.unshift(this.m_MapUrl);
            for (var i = this.m_ThumbList.length - 1; i >= 3; --i) {
                RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).destroyRes(this.m_ThumbList[i]);
            }
            this.m_MapUrl = null;
        }
        var url = ResDataPath.GetMapPreviewPath(this.mapName);
        this.m_MapUrl = url;
        var analyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        var resItem = new RES.ResourceItem(url, url, RES.ResourceItem.TYPE_IMAGE);
        analyzer.loadFile(resItem, this._Finish, this);
    };
    MapViewBg.prototype._Finish = function (resItem) {
        if (resItem.name == this.m_MapUrl) {
            this.thumbnail.source = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).getRes(resItem.name);
            this.onThumbnailComplete();
        }
        else {
            console.error("MapViewBg._Finish resItem.name != this.m_MapUrl", resItem.name, this.m_MapUrl);
        }
    };
    MapViewBg.prototype.updateHDMap = function (point, force) {
        if (force === void 0) { force = false; }
        var IMG_SIZE = GameMap.chunkw;
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
                    var index = this.maxImagXCount * j + i;
                    if (this._imageList[index]) {
                        continue;
                    }
                    // refresh = true
                    this._imageList[index] = this.GetImage(i, j, ResDataPath.GetMapPath(this.mapName, i, j));
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
    };
    MapViewBg.prototype.GetImage = function (x, y, source) {
        var img = this.m_ImageList.pop() || new eui.Image;
        img.name = x + "_" + y;
        // if (this.mIsScale) {
        // 	img.x = x >> 1
        // 	img.y = y >> 1
        // } else {
        // 	img.x = x
        // 	img.y = y
        // }
        img.x = this.chunkPos * x;
        img.y = this.chunkPos * y;
        img.source = source;
        ResMgr.Ref(source);
        if (!img.parent) {
            this.mGroup.addChild(img);
        }
        // console.log("load map => ", img.name)
        return img;
    };
    MapViewBg.prototype.SetImage = function (image) {
        if (!image) {
            return;
        }
        if (!StringUtils.IsNullOrEmpty(image.source)) {
            ResMgr.Unref(image.source);
            image.source = "";
            if (!image.$stage) {
                image.$setBitmapData(null);
            }
        }
        this.m_ImageList.push(image);
    };
    return MapViewBg;
}(egret.DisplayObjectContainer));
__reflect(MapViewBg.prototype, "MapViewBg");
//# sourceMappingURL=MapViewBg.js.map