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
var MsMovieClip = (function (_super) {
    __extends(MsMovieClip, _super);
    function MsMovieClip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offsetPoint = egret.Point.create(0, 0);
        _this.$movieClipData = null;
        _this.frames = null;
        _this.$totalFrames = 0;
        _this.$frameLabelStart = 0;
        _this.$frameLabelEnd = 0;
        _this.frameIntervalTime = 0;
        _this.$eventPool = null;
        _this.$isPlaying = false;
        _this.isStopped = true;
        _this.playTimes = 0;
        _this.$currentFrameNum = 0;
        _this.$nextFrameNum = 1;
        _this.displayedKeyFrameNum = 0;
        _this.passedTime = 0;
        _this.$frameRate = NaN;
        _this.lastTime = 0;
        return _this;
    }
    Object.defineProperty(MsMovieClip.prototype, "smoothing", {
        get: function () {
            return this.$smoothing;
        },
        set: function (value) {
            value = !!value;
            if (value == this.$smoothing) {
                return;
            }
            this.$smoothing = value;
            this.$invalidate();
        },
        enumerable: true,
        configurable: true
    });
    MsMovieClip.prototype.$init = function () {
        this.$reset();
        var movieClipData = this.$movieClipData;
        if (movieClipData && movieClipData.$isDataValid()) {
            this.frames = movieClipData.frames;
            this.$totalFrames = movieClipData.numFrames;
            this.$frameRate = movieClipData.frameRate;
            this.frameIntervalTime = 1000 / this.$frameRate;
            this._initFrame();
        }
    };
    MsMovieClip.prototype.$reset = function () {
        this.frames = null;
        this.playTimes = 0;
        this.$isPlaying = false;
        this.setIsStopped(true);
        this.$currentFrameNum = 0;
        this.$nextFrameNum = 1;
        this.displayedKeyFrameNum = 0;
        this.passedTime = 0;
        this.$eventPool = [];
    };
    MsMovieClip.prototype._initFrame = function () {
        if (this.$movieClipData.$isTextureValid()) {
            this.advanceFrame();
            this.constructFrame();
        }
    };
    MsMovieClip.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this.$isPlaying && this.$totalFrames > 1) {
            this.setIsStopped(false);
        }
    };
    MsMovieClip.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.setIsStopped(true);
    };
    MsMovieClip.prototype.play = function (playTimes) {
        if (playTimes === void 0) { playTimes = 0; }
        this.$isPlaying = true;
        this.setPlayTimes(playTimes);
        if (this.$totalFrames > 1 && this.$stage) {
            this.setIsStopped(false);
        }
    };
    MsMovieClip.prototype.stop = function () {
        this.$isPlaying = false;
        this.setIsStopped(true);
    };
    MsMovieClip.prototype.prevFrame = function () {
        this.gotoAndStop(this.$currentFrameNum - 1);
    };
    MsMovieClip.prototype.nextFrame = function () {
        this.gotoAndStop(this.$currentFrameNum + 1);
    };
    MsMovieClip.prototype.gotoAndPlay = function (frame, playTimes) {
        if (playTimes === void 0) { playTimes = 0; }
        if (arguments.length == 0 || arguments.length > 2) {
            egret.$error(1022, "MovieClip.gotoAndPlay()");
        }
        this.$frameLabelStart = 0;
        this.$frameLabelEnd = 0;
        this.play(playTimes);
        this.gotoFrame(frame);
    };
    MsMovieClip.prototype.gotoAndStop = function (frame) {
        if (arguments.length != 1) {
            egret.$error(1022, "MovieClip.gotoAndStop()");
        }
        this.stop();
        this.gotoFrame(frame);
    };
    MsMovieClip.prototype.gotoFrame = function (frame) {
        var frameNum;
        frameNum = parseInt(frame + '', 10);
        if (frameNum != frame) {
            egret.$error(1022, "Frame Label Not Found");
        }
        if (frameNum < 1) {
            frameNum = 1;
        }
        else if (frameNum > this.$totalFrames) {
            frameNum = this.$totalFrames;
        }
        if (frameNum == this.$nextFrameNum) {
            return;
        }
        this.$nextFrameNum = frameNum;
        this.advanceFrame();
        this.constructFrame();
        this.handlePendingEvent();
    };
    MsMovieClip.prototype.advanceTime = function (timeStamp) {
        var self = this;
        var advancedTime = timeStamp - self.lastTime;
        self.lastTime = timeStamp;
        var frameIntervalTime = self.frameIntervalTime;
        var currentTime = self.passedTime + advancedTime;
        self.passedTime = currentTime % frameIntervalTime;
        var num = currentTime / frameIntervalTime;
        if (num < 1) {
            return false;
        }
        while (num >= 1) {
            num--;
            self.$nextFrameNum++;
            if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart > 0 && self.$nextFrameNum > self.$frameLabelEnd)) {
                if (self.playTimes == -1) {
                    self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                    self.$nextFrameNum = 1;
                }
                else {
                    self.playTimes--;
                    if (self.playTimes > 0) {
                        self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                        self.$nextFrameNum = 1;
                    }
                    else {
                        self.$nextFrameNum = self.$totalFrames;
                        self.$eventPool.push(egret.Event.COMPLETE);
                        self.stop();
                        break;
                    }
                }
            }
            if (self.$currentFrameNum == self.$frameLabelEnd) {
                self.$nextFrameNum = self.$frameLabelStart;
            }
            self.advanceFrame();
        }
        self.constructFrame();
        self.handlePendingEvent();
        return false;
    };
    MsMovieClip.prototype.advanceFrame = function () {
        this.$currentFrameNum = this.$nextFrameNum;
    };
    MsMovieClip.prototype.constructFrame = function () {
        var currentFrameNum = this.$currentFrameNum;
        if (this.displayedKeyFrameNum == currentFrameNum) {
            return;
        }
        var msData = this.$movieClipData.getTextureByFrame(currentFrameNum);
        var node = this.$renderNode;
        node.uvs = msData.m1;
        node.vertices = msData.m2;
        node.indices = msData.m3;
        this.$movieClipData.$getOffsetByFrame(currentFrameNum, this.offsetPoint);
        var offsetX = Math.round(this.offsetPoint.x);
        var offsetY = Math.round(this.offsetPoint.y);
        this.anchorOffsetX = -offsetX;
        this.anchorOffsetY = -offsetY;
        this.$invalidateContentBounds();
        this.displayedKeyFrameNum = currentFrameNum;
    };
    MsMovieClip.prototype.handlePendingEvent = function () {
        if (this.$eventPool.length != 0) {
            this.$eventPool.reverse();
            var eventPool = this.$eventPool;
            var length_1 = eventPool.length;
            var isComplete = false;
            var isLoopComplete = false;
            for (var i = 0; i < length_1; i++) {
                var event_1 = eventPool.pop();
                if (event_1 == egret.Event.LOOP_COMPLETE) {
                    isLoopComplete = true;
                }
                else if (event_1 == egret.Event.COMPLETE) {
                    isComplete = true;
                }
                else {
                    this.dispatchEventWith(event_1);
                }
            }
            if (isLoopComplete) {
                this.dispatchEventWith(egret.Event.LOOP_COMPLETE);
            }
            if (isComplete) {
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
        }
    };
    Object.defineProperty(MsMovieClip.prototype, "totalFrames", {
        get: function () {
            return this.$totalFrames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsMovieClip.prototype, "currentFrame", {
        get: function () {
            return this.$currentFrameNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsMovieClip.prototype, "frameRate", {
        get: function () {
            return this.$frameRate;
        },
        set: function (value) {
            if (value == this.$frameRate) {
                return;
            }
            this.$frameRate = value;
            this.frameIntervalTime = 1000 / this.$frameRate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsMovieClip.prototype, "isPlaying", {
        get: function () {
            return this.$isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MsMovieClip.prototype, "movieClipData", {
        get: function () {
            return this.$movieClipData;
        },
        set: function (value) {
            this.setMovieClipData(value);
        },
        enumerable: true,
        configurable: true
    });
    MsMovieClip.prototype.setMovieClipData = function (value) {
        if (this.$movieClipData == value) {
            return;
        }
        this.$movieClipData = value;
        this.$init();
    };
    MsMovieClip.prototype.setPlayTimes = function (value) {
        if (value < 0 || value >= 1) {
            this.playTimes = value < 0 ? -1 : Math.floor(value);
        }
    };
    MsMovieClip.prototype.setIsStopped = function (value) {
        if (this.isStopped == value) {
            return;
        }
        this.isStopped = value;
        if (value) {
            egret.ticker.$stopTick(this.advanceTime, this);
        }
        else {
            this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
            this.lastTime = egret.getTimer();
            egret.ticker.$startTick(this.advanceTime, this);
        }
    };
    return MsMovieClip;
}(egret.Mesh));
__reflect(MsMovieClip.prototype, "MsMovieClip");
//# sourceMappingURL=MsMovieClip.js.map