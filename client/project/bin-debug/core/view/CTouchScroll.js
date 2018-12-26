var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ceui;
(function (ceui) {
    var MAX_VELOCITY_COUNT = 4;
    var VELOCITY_WEIGHTS = [1, 1.33, 1.66, 2];
    var CURRENT_VELOCITY_WEIGHT = 2.33;
    var MINIMUM_VELOCITY = 0.02;
    var FRICTION = 0.998;
    var EXTRA_FRICTION = 0.95;
    var FRICTION_LOG = Math.log(FRICTION);
    function easeOut(ratio) {
        var invRatio = ratio - 1.0;
        return invRatio * invRatio * invRatio + 1;
    }
    var CTouchScroll = (function () {
        /**
         * @private
         * 创建一个 TouchScroll 实例
         * @param updateFunction 滚动位置更新回调函数
         */
        function CTouchScroll(updateFunction, endFunction, target) {
            this.$scrollFactor = 1.0;
            this.previousTime = 0;
            this.velocity = 0;
            this.previousVelocity = [];
            this.currentPosition = 0;
            this.previousPosition = 0;
            this.currentScrollPos = 0;
            this.maxScrollPos = 0;
            this.offsetPoint = 0;
            this.$bounces = true;
            this.started = true;
            if (true && !updateFunction) {
                egret.$error(1003, "updateFunction");
            }
            this.updateFunction = updateFunction;
            this.endFunction = endFunction;
            this.target = target;
            this.animation = new eui.sys.Animation(this.onScrollingUpdate, this);
            this.animation.endFunction = this.finishScrolling;
            this.animation.easerFunction = easeOut;
        }
        CTouchScroll.prototype.isPlaying = function () {
            return this.animation.isPlaying;
        };
        CTouchScroll.prototype.stop = function () {
            this.animation.stop();
            egret.stopTick(this.onTick, this);
            this.started = false;
        };
        CTouchScroll.prototype.isStarted = function () {
            return this.started;
        };
        CTouchScroll.prototype.start = function (touchPoint) {
            this.started = true;
            this.velocity = 0;
            this.previousVelocity.length = 0;
            this.previousTime = egret.getTimer();
            this.previousPosition = this.currentPosition = touchPoint;
            this.offsetPoint = touchPoint;
            egret.startTick(this.onTick, this);
        };
        CTouchScroll.prototype.update = function (touchPoint, maxScrollValue, scrollValue) {
            maxScrollValue = Math.min(-maxScrollValue, 0);
            this.currentPosition = touchPoint;
            this.maxScrollPos = maxScrollValue;
            var disMove = this.offsetPoint - touchPoint;
            var scrollPos = disMove + scrollValue;
            this.offsetPoint = touchPoint;
            if (scrollPos > 0) {
                if (!this.$bounces) {
                    scrollPos = 0;
                }
                else {
                    scrollPos -= disMove * 0.5;
                }
            }
            if (scrollPos < maxScrollValue) {
                if (!this.$bounces) {
                    scrollPos = maxScrollValue;
                }
                else {
                    scrollPos -= disMove * 0.5;
                }
            }
            this.currentScrollPos = scrollPos;
            this.updateFunction.call(this.target, scrollPos);
        };
        CTouchScroll.prototype.finish = function (currentScrollPos, maxScrollPos) {
            maxScrollPos = -maxScrollPos;
            egret.stopTick(this.onTick, this);
            this.started = false;
            var sum = this.velocity * CURRENT_VELOCITY_WEIGHT;
            var previousVelocityX = this.previousVelocity;
            var length = previousVelocityX.length;
            var totalWeight = CURRENT_VELOCITY_WEIGHT;
            for (var i = 0; i < length; i++) {
                var weight = VELOCITY_WEIGHTS[i];
                sum += previousVelocityX[0] * weight;
                totalWeight += weight;
            }
            var pixelsPerMS = sum / totalWeight;
            var absPixelsPerMS = Math.abs(pixelsPerMS);
            var duration = 0;
            var posTo = 0;
            if (absPixelsPerMS > MINIMUM_VELOCITY) {
                posTo = currentScrollPos + (pixelsPerMS - MINIMUM_VELOCITY) / FRICTION_LOG * 2 * this.$scrollFactor;
                if (posTo > 0 || posTo < maxScrollPos) {
                    posTo = currentScrollPos;
                    while (Math.abs(pixelsPerMS) > MINIMUM_VELOCITY) {
                        posTo -= pixelsPerMS;
                        if (posTo > 0 || posTo < maxScrollPos) {
                            pixelsPerMS *= FRICTION * EXTRA_FRICTION;
                        }
                        else {
                            pixelsPerMS *= FRICTION;
                        }
                        duration++;
                    }
                }
                else {
                    duration = Math.log(MINIMUM_VELOCITY / absPixelsPerMS) / FRICTION_LOG;
                }
            }
            else {
                posTo = currentScrollPos;
            }
            if (this.target["$getThrowInfo"]) {
                var event_1 = this.target["$getThrowInfo"](currentScrollPos, posTo);
                posTo = event_1.toPos;
            }
            if (duration > 0) {
                //如果取消了回弹,保证动画之后不会超出边界
                if (!this.$bounces) {
                    if (posTo > 0) {
                        posTo = 0;
                    }
                    else if (posTo < maxScrollPos) {
                        posTo = maxScrollPos;
                    }
                }
                this.throwTo(posTo, duration);
            }
            else {
                this.finishScrolling();
            }
        };
        CTouchScroll.prototype.onTick = function (timeStamp) {
            var timeOffset = timeStamp - this.previousTime;
            if (timeOffset > 10) {
                var previousVelocity = this.previousVelocity;
                if (previousVelocity.length >= MAX_VELOCITY_COUNT) {
                    previousVelocity.shift();
                }
                this.velocity = (this.currentPosition - this.previousPosition) / timeOffset;
                previousVelocity.push(this.velocity);
                this.previousTime = timeStamp;
                this.previousPosition = this.currentPosition;
            }
            return true;
        };
        CTouchScroll.prototype.finishScrolling = function (animation) {
            var hsp = this.currentScrollPos;
            var maxHsp = this.maxScrollPos;
            var hspTo = hsp;
            if (hsp > 0) {
                hspTo = 0;
            }
            if (hsp < maxHsp) {
                hspTo = maxHsp;
            }
            this.throwTo(hspTo, 300);
        };
        CTouchScroll.prototype.throwTo = function (hspTo, duration) {
            if (duration === void 0) { duration = 500; }
            var hsp = this.currentScrollPos;
            if (hsp == hspTo) {
                this.endFunction.call(this.target);
                return;
            }
            var animation = this.animation;
            animation.duration = duration;
            animation.from = hsp;
            animation.to = hspTo;
            animation.play();
        };
        CTouchScroll.prototype.onScrollingUpdate = function (animation) {
            this.currentScrollPos = animation.currentValue;
            this.updateFunction.call(this.target, animation.currentValue);
        };
        return CTouchScroll;
    }());
    ceui.CTouchScroll = CTouchScroll;
    __reflect(CTouchScroll.prototype, "ceui.CTouchScroll");
})(ceui || (ceui = {}));
//# sourceMappingURL=CTouchScroll.js.map