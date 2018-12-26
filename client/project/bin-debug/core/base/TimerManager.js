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
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    function TimerManager() {
        var _this = _super.call(this) || this;
        _this._haveremove = false;
        _this._handlers = new Array();
        _this._currTime = egret.getTimer();
        _this._currFrame = 0;
        _this._timeScale = 1;
        egret.Ticker.getInstance().register(_this.onEnterFrame, _this);
        return _this;
    }
    TimerManager.ins = function () {
        return _super.ins.call(this);
    };
    TimerManager.prototype.getFrameId = function () {
        return this._currFrame;
    };
    ;
    /**
     * 设置时间参数
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
    ;
    /**
     * 每帧执行函数
     * @param frameTime
     */
    TimerManager.prototype.onEnterFrame = function () {
        this._currFrame++;
        this._currTime = egret.getTimer();
        // DebugUtils.start("TimerManager:");
        for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            if (handler.remove) {
                this._haveremove = true;
                continue;
            }
            var t = handler.userFrame ? this._currFrame : this._currTime;
            if (t >= handler.exeTime) {
                // DebugUtils.start(handler.method.toString());
                handler.method.call(handler.methodObj, (this._currTime - handler.dealTime) * this._timeScale);
                // DebugUtils.stop(handler.method.toString());
                handler.dealTime = this._currTime;
                handler.exeTime += handler.delay;
                if (!handler.repeat) {
                    if (handler.repeatCount > 1) {
                        handler.repeatCount--;
                    }
                    else {
                        if (handler.complateMethod) {
                            handler.complateMethod.apply(handler.complateMethodObj);
                        }
                        handler.remove = true;
                        this._haveremove = true;
                    }
                }
            }
        }
        if (this._haveremove) {
            for (var i = this._handlers.length - 1; i >= 0; --i) {
                var handler = this._handlers[i];
                if (handler.remove) {
                    handler.clear();
                    this._handlers.splice(i, 1);
                    ObjectPool.push(handler);
                }
            }
        }
        this._haveremove = false;
        // DebugUtils.stop("TimerManager:");
    };
    ;
    TimerManager.prototype.create = function (useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        //参数监测
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        //先删除相同函数的计时
        this.remove(method, methodObj);
        //创建
        var handler = ObjectPool.pop("TimerHandler");
        handler.userFrame = useFrame;
        handler.repeat = repeatCount == 0;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.complateMethod = complateMethod;
        handler.complateMethodObj = complateMethodObj;
        handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
        handler.dealTime = this._currTime;
        handler.remove = false;
        this._handlers.push(handler);
    };
    ;
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    ;
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    ;
    // 下一帧执行，且只执行一次
    TimerManager.prototype.doNext = function (mothod, methodObj) {
        this.create(true, 1, 1, mothod, methodObj, null, null);
    };
    ;
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.remove = function (method, methodObj) {
        for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            if (!handler.remove && handler.method == method && handler.methodObj == methodObj) {
                handler.remove = true;
                this._haveremove = true;
            }
        }
    };
    ;
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.removeAll = function (methodObj) {
        for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            if (handler.methodObj == methodObj) {
                handler.remove = true;
                this._haveremove = true;
            }
        }
    };
    ;
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    TimerManager.prototype.isExists = function (method, methodObj) {
        for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            if (!handler.remove && handler.method == method && handler.methodObj == methodObj) {
                return true;
            }
        }
        return false;
    };
    ;
    return TimerManager;
}(BaseClass));
__reflect(TimerManager.prototype, "TimerManager");
var TimerHandler = (function () {
    function TimerHandler() {
        /**执行间隔*/
        this.delay = 0;
        /**重复执行次数*/
        this.repeatCount = 0;
        /**执行时间*/
        this.exeTime = 0;
        /**上次的执行时间*/
        this.dealTime = 0;
        this.remove = false;
    }
    TimerHandler.prototype.clear = function () {
        this.method = null;
        this.methodObj = null;
        this.complateMethod = null;
        this.complateMethodObj = null;
        this.remove = false;
    };
    return TimerHandler;
}());
__reflect(TimerHandler.prototype, "TimerHandler");
//# sourceMappingURL=TimerManager.js.map