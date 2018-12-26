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
var EntityMovieObject = (function (_super) {
    __extends(EntityMovieObject, _super);
    function EntityMovieObject() {
        var _this = _super.call(this) || this;
        _this._mcFactory = new egret.MovieClipDataFactory();
        _this.m_State = false;
        // 再次load是否需要重新播放动画
        _this.m_LoadAndPlay = true;
        _this.touchEnabled = false;
        return _this;
    }
    EntityMovieObject.prototype.SetFrameRate = function (mul) {
        this.m_FrameRateMul = mul;
    };
    EntityMovieObject.prototype.LoadByUrl = function (actionName, stateName, frameName, playCount, autoPlay) {
        if (autoPlay === void 0) { autoPlay = true; }
        var filePath = actionName;
        if (stateName) {
            filePath += "_" + stateName;
        }
        if (this.m_FileName != actionName) {
            this.ClearCache();
            this.m_FileName = actionName;
            EntityMovieObject.Ref(this.m_FileName);
        }
        if (frameName) {
            this._fileName = frameName;
        }
        else {
            var splitIndex = filePath.lastIndexOf("/");
            if (splitIndex != -1) {
                this._fileName = filePath.substring(splitIndex + 1);
            }
            else {
                this._fileName = filePath;
            }
        }
        this._playCount = playCount || -1;
        this._autoPlay = autoPlay;
        if (this.m_CurPath == filePath) {
            if (this.m_State && this.m_LoadAndPlay) {
                this._Play();
            }
            return;
        }
        this.m_CurPath = filePath;
        EntityMovieObject.SetRefFile(this.m_FileName, filePath);
        var obj01 = this._Load(filePath + ".png", RES.ResourceItem.TYPE_IMAGE);
        var obj02 = this._Load(filePath + ".json", RES.ResourceItem.TYPE_JSON);
        if (obj01 && obj02) {
            this._OnCreateBody(obj02, obj01);
        }
    };
    EntityMovieObject.prototype._Load = function (url, type) {
        var obj = this._GetRes(url, type);
        if (!obj) {
            RES.getResByUrl(url, this._CreateBodyByUrl, this, type);
            return null;
        }
        return obj;
    };
    EntityMovieObject.prototype._GetRes = function (url, type) {
        var analyzer = RES.getAnalyzer(type);
        return analyzer.getRes(url);
    };
    EntityMovieObject.prototype.ClearCache = function () {
        this._mcFactory.mcDataSet = null;
        this._mcFactory.texture = null;
        this._mcFactory.clearCache();
        this.$bitmapData = null;
        this.movieClipData = null;
        this.visible = false;
        this.stop();
        this.m_State = false;
        EntityMovieObject.Unref(this.m_FileName);
        this.m_FileName = null;
        this.m_CurPath = null;
        // for (let key in this.m_FileSet) {
        // 	ResMgr.Unref(key + ".png")
        // }
        // this.m_FileSet = {}
    };
    EntityMovieObject.prototype._CreateBodyByUrl = function (data, url) {
        var json = this.m_CurPath + ".json";
        var img = this.m_CurPath + ".png";
        if (url) {
            if (json != url && img != url)
                return;
        }
        this._OnCreateBody(this._GetRes(json, RES.ResourceItem.TYPE_JSON), this._GetRes(img, RES.ResourceItem.TYPE_IMAGE));
    };
    EntityMovieObject.prototype._OnCreateBody = function (mcJson, mcTexture) {
        if (!mcJson || !mcTexture) {
            return;
        }
        this.visible = true;
        this._mcFactory.mcDataSet = mcJson;
        this._mcFactory.texture = mcTexture;
        this.m_State = true;
        this._Play();
    };
    EntityMovieObject.prototype._Play = function () {
        this.movieClipData = this._mcFactory.generateMovieClipData(this._fileName);
        if (!this.movieClipData) {
            return;
        }
        if (this._autoPlay) {
            if (this.m_FrameRateMul && this.m_FrameRateMul > 1) {
                this.frameRate = this.movieClipData.frameRate * this.m_FrameRateMul;
            }
            if (this.movieClipData.$isDataValid()) {
                this.gotoAndPlay(1, this._playCount);
            }
        }
        this.dispatchEventWith(egret.Event.CHANGE);
    };
    EntityMovieObject.SetRefFile = function (actionName, fileName) {
        fileName += ".png";
        if (this.FILE_SET[actionName]) {
            if (!this.FILE_SET[actionName][fileName]) {
                ResMgr.Ref(fileName);
                this.FILE_SET[actionName][fileName] = true;
            }
        }
        else {
            ResMgr.Ref(fileName);
            this.FILE_SET[actionName] = (_a = {},
                _a[fileName] = true,
                _a);
        }
        var _a;
    };
    EntityMovieObject.Ref = function (actionName) {
        if (!this.FILE_REF[actionName]) {
            this.FILE_REF[actionName] = 1;
        }
        else {
            ++this.FILE_REF[actionName];
        }
    };
    EntityMovieObject.Unref = function (actionName) {
        if (!this.FILE_REF[actionName]) {
            return;
        }
        if ((--this.FILE_REF[actionName]) < 1) {
            var list = this.FILE_SET[actionName] || {};
            for (var key in list) {
                ResMgr.Unref(key);
            }
            delete this.FILE_REF[actionName];
            delete this.FILE_SET[actionName];
        }
    };
    EntityMovieObject.FILE_SET = {};
    EntityMovieObject.FILE_REF = {};
    return EntityMovieObject;
}(egret.MovieClip));
__reflect(EntityMovieObject.prototype, "EntityMovieObject");
//# sourceMappingURL=EntityMovieObject.js.map