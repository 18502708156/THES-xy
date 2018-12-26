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
var MovieObject = (function (_super) {
    __extends(MovieObject, _super);
    function MovieObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovieObject.prototype.Clear = function () {
        this.m_CacheUrl = null;
    };
    MovieObject.prototype.ClearCache = function () {
        // this._mcFactory.mcDataSet = null
        // this._mcFactory.texture = null
        // this._mcFactory.clearCache();
        this.$bitmapData = null;
        this.movieClipData = null;
        _super.prototype.ClearCache.call(this);
    };
    MovieObject.prototype._SetUrl = function (url) {
        _super.prototype._SetUrl.call(this, url);
        this.m_CacheUrl = url;
    };
    MovieObject.prototype.Unref = function () {
        if (!StringUtils.IsNullOrEmpty(this.GetLoadUrl())) {
            ResMgr.Unref(this.GetImgUrl());
            // ResMgr.Unref(this.GetJsonUrl())
        }
        this._SetUrl(null);
    };
    MovieObject.prototype.Ref = function () {
        if (!StringUtils.IsNullOrEmpty(this.GetLoadUrl())) {
            ResMgr.Ref(this.GetImgUrl());
            // ResMgr.Ref(this.GetJsonUrl())
        }
    };
    MovieObject.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this.m_CacheUrl) {
            this.LoadByUrl(this.m_CacheUrl);
            this.m_CacheUrl == null;
        }
    };
    MovieObject.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        // 如果是重复播放类型的，在隐藏的时候清理
        if (this.GetLoadUrl()) {
            if (this._playCount == -1) {
                var url = this.GetLoadUrl();
                this.ClearCache();
                this.m_CacheUrl = url;
            }
            else {
                this.ClearCache();
            }
        }
    };
    return MovieObject;
}(MovieBaseObject));
__reflect(MovieObject.prototype, "MovieObject");
//# sourceMappingURL=MovieObject.js.map