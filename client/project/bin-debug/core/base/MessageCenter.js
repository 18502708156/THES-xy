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
var MessageCenter = (function (_super) {
    __extends(MessageCenter, _super);
    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
     */
    function MessageCenter(type) {
        var _this = _super.call(this) || this;
        _this.flag = 0;
        _this.type = 0;
        _this.dict = {};
        _this.eVec = [];
        _this.lastRunTime = 0;
        _this.m_TempDict = {};
        _this.type = type;
        if (_this.type == 0) {
            TimerManager.ins().doFrame(1, 0, _this.run, _this);
        }
        return _this;
    }
    MessageCenter.ins = function () {
        return _super.ins.call(this, 0);
    };
    /**
     * 清空处理
     */
    MessageCenter.prototype.clear = function () {
        this.dict = {};
        this.eVec.splice(0);
    };
    ;
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
    MessageCenter.prototype.addListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (!arr) {
            this.dict[type] = arr = [];
        }
        else if (this.flag != 0) {
            this.dict[type] = arr = arr.concat();
        }
        //检测是否已经存在
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            if (item[0] == listener && item[1] == listenerObj) {
                return;
            }
        }
        arr.push([listener, listenerObj]);
    };
    ;
    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    MessageCenter.prototype.removeListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (!arr) {
            return;
        }
        if (this.flag != 0) {
            this.dict[type] = arr = arr.concat();
        }
        var len = arr.length;
        for (var i = len - 1; i >= 0; --i) {
            var item = arr[i];
            if (item[0] == listener && item[1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }
        if (arr.length == 0) {
            this.dict[type] = null;
            delete this.dict[type];
        }
    };
    ;
    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    MessageCenter.prototype.removeAll = function (listenerObj) {
        var keys = Object.keys(this.dict);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var type = keys_1[_i];
            var arr = this.dict[type];
            if (this.flag != 0) {
                this.dict[type] = arr = arr.concat();
            }
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }
            if (arr.length == 0) {
                this.dict[type] = null;
                delete this.dict[type];
            }
        }
    };
    ;
    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
    MessageCenter.prototype.dispatch = function (type) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (param == null || param.length == 0) {
            if (this.m_TempDict[type]) {
                return;
            }
            this.m_TempDict[type] = true;
        }
        var vo = ObjectPool.pop("MessageVo");
        vo.type = type;
        vo.param = param;
        if (this.type == 0) {
            this.eVec.push(vo);
        }
        else if (this.type == 1) {
            this.dealMsg(vo);
        }
        else {
            console.log("MessageCenter未实现的类型");
        }
    };
    ;
    MessageCenter.prototype.dispatchImmediate = function (type) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var vo = ObjectPool.pop("MessageVo");
        vo.type = type;
        vo.param = param;
        this.dealMsg(vo);
    };
    ;
    /**
     * 运行
     *
     */
    MessageCenter.prototype.run = function () {
        var currTime = egret.getTimer();
        var inSleep = currTime - this.lastRunTime > 100;
        this.lastRunTime = currTime;
        if (inSleep) {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
            }
        }
        else {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
                if ((egret.getTimer() - currTime) > 5) {
                    break;
                }
            }
        }
    };
    ;
    /**
     * 处理一条消息
     */
    MessageCenter.prototype.dealMsg = function (msgVo) {
        if (this.m_TempDict[msgVo.type]) {
            delete this.m_TempDict[msgVo.type];
        }
        var listeners = this.dict[msgVo.type];
        if (!listeners) {
            return;
        }
        var len = listeners.length;
        if (len == 0)
            return;
        this.flag++;
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener[0].apply(listener[1], msgVo.param);
        }
        this.flag--;
        msgVo.dispose();
        ObjectPool.push(msgVo);
    };
    ;
    return MessageCenter;
}(BaseClass));
__reflect(MessageCenter.prototype, "MessageCenter");
var MessageVo = (function () {
    function MessageVo() {
        this.type = null;
        this.param = null;
    }
    MessageVo.prototype.dispose = function () {
        this.type = null;
        this.param = null;
    };
    return MessageVo;
}());
__reflect(MessageVo.prototype, "MessageVo");
//# sourceMappingURL=MessageCenter.js.map