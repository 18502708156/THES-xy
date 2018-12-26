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
var MovieBaseObject = (function (_super) {
    __extends(MovieBaseObject, _super);
    function MovieBaseObject() {
        var _this = _super.call(this) || this;
        _this._mcFactory = new egret.MovieClipDataFactory();
        _this.m_State = false;
        _this.touchEnabled = false;
        _this.addEventListener(egret.Event.COMPLETE, _this._PlayComp, _this);
        return _this;
    }
    MovieBaseObject.prototype.SetFrameRate = function (mul) {
        this.m_FrameRateMul = mul;
    };
    MovieBaseObject.prototype.$hitTest = function (stageX, stageY) {
        if (this.touchEnabled) {
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        }
        return null;
    };
    MovieBaseObject.prototype.GetLoadUrl = function () {
        return this.m_Url;
    };
    MovieBaseObject.prototype.GetImgUrl = function () {
        return (this.m_Url || "") + ".png";
    };
    MovieBaseObject.prototype.GetJsonUrl = function () {
        return (this.m_Url || "") + ".json";
    };
    MovieBaseObject.prototype._SetUrl = function (url) {
        this.m_Url = url;
    };
    MovieBaseObject.prototype.PlayFrame = function (frameName) {
        if (this._frameName == frameName) {
            return;
        }
        this._frameName = frameName;
        if (this.m_State) {
            this._Play(1);
        }
    };
    /**
     *
     * 文件名
     * 动画名
     * 播放次数
     * 自动播放
     * 完成回调
     * 重新开始播放动画  2、继续播放动画
     */
    MovieBaseObject.prototype.Play = function (fileName, frameName, playCount, autoPlay, comp, compFuncTagret, isReplay) {
        if (autoPlay === void 0) { autoPlay = true; }
        if (isReplay === void 0) { isReplay = null; }
        if (frameName) {
            this._frameName = frameName;
        }
        else {
            var splitIndex = -1;
            if (fileName) {
                splitIndex = fileName.lastIndexOf("/");
            }
            if (splitIndex != -1) {
                this._frameName = fileName.substring(splitIndex + 1);
            }
            else {
                this._frameName = fileName;
            }
        }
        this._playCount = playCount || -1;
        this._autoPlay = autoPlay;
        if (fileName == this.m_Url) {
            if (this.m_State) {
                if (isReplay) {
                    this._Play(isReplay);
                }
                else {
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            return;
        }
        this.ClearCache();
        this.m_Url = fileName;
        if (StringUtils.IsNullOrEmpty(fileName)) {
            return;
        }
        this.Ref();
        this.m_CompFunc = comp;
        this._compFuncTagret = compFuncTagret;
        var obj01 = this._Load(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE);
        var obj02 = this._Load(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON);
        if (obj01 && obj02) {
            this._OnCreateBody(obj02, obj01);
        }
    };
    MovieBaseObject.prototype.LoadByUrl = function (fileName, playCount, autoPlay, comp, compFuncTagret) {
        if (autoPlay === void 0) { autoPlay = true; }
        this.Play(fileName, null, playCount, autoPlay, comp, compFuncTagret);
    };
    MovieBaseObject.prototype._Load = function (url, type) {
        var obj = this._GetRes(url, type);
        if (!obj) {
            RES.getResByUrl(url, this._CreateBodyByUrl, this, type);
            return null;
        }
        return obj;
    };
    MovieBaseObject.prototype._GetRes = function (url, type) {
        var analyzer = RES.getAnalyzer(type);
        return analyzer.getRes(url);
    };
    MovieBaseObject.prototype.ClearCache = function () {
        this.Unref();
        this.visible = false;
        this.stop();
        this.m_State = false;
        this.m_CompFunc = null;
        this._compFuncTagret = null;
        this._mcFactory.mcDataSet = null;
        this._mcFactory.texture = null;
        this._mcFactory.clearCache();
    };
    MovieBaseObject.prototype.Unref = function () {
        this.m_Url = null;
    };
    MovieBaseObject.prototype.Ref = function () {
    };
    MovieBaseObject.prototype._CreateBodyByUrl = function (data, url) {
        if (url) {
            if (this.GetJsonUrl() != url && this.GetImgUrl() != url)
                return;
        }
        this._OnCreateBody(this._GetRes(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON), this._GetRes(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE));
    };
    MovieBaseObject.prototype._OnCreateBody = function (mcJson, mcTexture) {
        if (!mcJson || !mcTexture)
            return;
        this.visible = true;
        if (mcJson && mcJson.scale) {
            var v = 100 / mcJson.scale;
            this.scaleY = v;
            if (this.scaleX < 0) {
                this.scaleX = -v;
            }
            else {
                this.scaleX = v;
            }
        }
        this._mcFactory.mcDataSet = mcJson;
        this._mcFactory.texture = mcTexture;
        this.m_State = true;
        this._Play(1);
    };
    /**
     * 播放动画
     * @param isReplay 1、重新播放， 2、继续播放
     */
    MovieBaseObject.prototype._Play = function (isReplay) {
        this.movieClipData = this._mcFactory.generateMovieClipData(this._frameName);
        if (!this.movieClipData) {
            return;
        }
        if (this.m_FrameRateMul && this.m_FrameRateMul > 1) {
            this.frameRate = this.movieClipData.frameRate * this.m_FrameRateMul;
        }
        if (this._autoPlay) {
            if (isReplay == 2) {
                this.play(this._playCount);
            }
            else {
                this.gotoAndPlay(1, this._playCount);
            }
        }
        this.dispatchEventWith(egret.Event.CHANGE);
    };
    MovieBaseObject.prototype._PlayComp = function () {
        var comp = this.m_CompFunc;
        var target = this._compFuncTagret;
        if (!this.mNotRemove && this.parent) {
            this.parent.removeChild(this);
        }
        if (comp) {
            if (target) {
                comp.call(target, this);
            }
            else {
                comp();
            }
            target = null;
        }
    };
    MovieBaseObject.prototype.DoDispose = function () {
        this.ClearCache();
    };
    return MovieBaseObject;
}(egret.MovieClip));
__reflect(MovieBaseObject.prototype, "MovieBaseObject");
//# sourceMappingURL=MovieBaseObject.js.map