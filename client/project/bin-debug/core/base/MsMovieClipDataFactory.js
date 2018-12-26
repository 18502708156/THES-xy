var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MsMovieClipDataFactory = (function () {
    function MsMovieClipDataFactory() {
    }
    MsMovieClipDataFactory.generateMovieClipData = function (movieClipName, mcData) {
        if (movieClipName === void 0) { movieClipName = ""; }
        if (movieClipName == "") {
            if (mcData) {
                for (movieClipName in mcData.mc) {
                    break;
                }
            }
        }
        if (movieClipName == "") {
            return null;
        }
        var output = this.findFromCache(movieClipName);
        if (!output) {
            output = new MsMovieClipData();
            this.fillData(movieClipName, output, mcData);
        }
        return output;
    };
    MsMovieClipDataFactory.findFromCache = function (movieClipName) {
        if (this.m_Cache[movieClipName]) {
            return this.m_Cache[movieClipName];
        }
        return null;
    };
    MsMovieClipDataFactory.fillData = function (movieClipName, movieClip, mcData) {
        if (mcData) {
            if (!mcData["__handle__"]) {
                var _w = mcData["width"];
                var _h = mcData["height"];
                var res = mcData.res;
                for (var key in res) {
                    var m1 = res[key].m1;
                    for (var i = 0, len = m1.length; i < len; ++i) {
                        m1[i] = m1[i] / (i % 2 == 0 ? _w : _h);
                    }
                }
                mcData["__handle__"] = 1;
            }
            var data = mcData.mc[movieClipName];
            if (data) {
                movieClip.$init(data, mcData);
                this.m_Cache[movieClipName] = movieClip;
            }
        }
    };
    MsMovieClipDataFactory.m_Cache = {};
    return MsMovieClipDataFactory;
}());
__reflect(MsMovieClipDataFactory.prototype, "MsMovieClipDataFactory");
//# sourceMappingURL=MsMovieClipDataFactory.js.map