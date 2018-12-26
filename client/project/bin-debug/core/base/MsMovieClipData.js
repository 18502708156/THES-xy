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
var MsMovieClipData = (function (_super) {
    __extends(MsMovieClipData, _super);
    function MsMovieClipData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$mcData = null;
        _this.numFrames = 1;
        _this.frames = [];
        _this.frameRate = 0;
        return _this;
    }
    MsMovieClipData.prototype.$init = function (mcData, jsonData) {
        this.m_JsonData = jsonData;
        this.setMCData(mcData);
    };
    MsMovieClipData.prototype.getKeyFrameData = function (frame) {
        var outputFrameData = this.frames[frame - 1];
        if (outputFrameData.frame) {
            outputFrameData = this.frames[outputFrameData.frame - 1];
        }
        return outputFrameData;
    };
    MsMovieClipData.prototype.getTextureByFrame = function (frame) {
        var frameData = this.getKeyFrameData(frame);
        if (frameData.res) {
            return this.getTextureByResName(frameData.res);
        }
        return null;
    };
    MsMovieClipData.prototype.$getOffsetByFrame = function (frame, point) {
        var frameData = this.getKeyFrameData(frame);
        if (frameData.res) {
            point.setTo(frameData.x | 0, frameData.y | 0);
        }
    };
    MsMovieClipData.prototype.getTextureByResName = function (resName) {
        return this.m_JsonData.res[resName];
    };
    MsMovieClipData.prototype.$isDataValid = function () {
        return this.frames.length > 0;
    };
    MsMovieClipData.prototype.$isTextureValid = function () {
        return this.$mcData != null;
    };
    MsMovieClipData.prototype.$fillMCData = function (mcData) {
        this.frameRate = mcData["frameRate"] || 24;
        this.fillFramesData(mcData.frames);
    };
    MsMovieClipData.prototype.fillFramesData = function (framesData) {
        var frames = this.frames;
        var length = framesData ? framesData.length : 0;
        var keyFramePosition;
        for (var i = 0; i < length; i++) {
            var frameData = framesData[i];
            frames.push(frameData);
            if (frameData.duration) {
                var duration = parseInt(frameData.duration);
                if (duration > 1) {
                    keyFramePosition = frames.length;
                    for (var j = 1; j < duration; j++) {
                        frames.push({ "frame": keyFramePosition });
                    }
                }
            }
        }
        this.numFrames = frames.length;
    };
    Object.defineProperty(MsMovieClipData.prototype, "mcData", {
        get: function () {
            return this.$mcData;
        },
        set: function (value) {
            this.setMCData(value);
        },
        enumerable: true,
        configurable: true
    });
    MsMovieClipData.prototype.setMCData = function (value) {
        if (this.$mcData == value) {
            return;
        }
        this.$mcData = value;
        if (value) {
            this.$fillMCData(value);
        }
    };
    return MsMovieClipData;
}(egret.HashObject));
__reflect(MsMovieClipData.prototype, "MsMovieClipData");
//# sourceMappingURL=MsMovieClipData.js.map