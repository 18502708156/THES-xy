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
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovieClip.prototype.loadFile = function (fileName, autoPlay, playCount, comp) {
        this.LoadByUrl(fileName, playCount, autoPlay, comp);
    };
    MovieClip.prototype.loadUrl = function (fileName, autoPlay, playCount, comp, compFuncTagret) {
        this.LoadByUrl(fileName, playCount, autoPlay, comp, compFuncTagret);
    };
    MovieClip.prototype.clearCache = function () {
        this.ClearCache();
    };
    return MovieClip;
}(MovieObject));
__reflect(MovieClip.prototype, "MovieClip");
//# sourceMappingURL=MovieClip.js.map