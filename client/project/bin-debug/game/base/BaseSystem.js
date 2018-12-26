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
var BaseSystem = (function (_super) {
    __extends(BaseSystem, _super);
    function BaseSystem() {
        var _this = _super.call(this) || this;
        _this.m_Init = false;
        GameGlobal.AllModule.push(_this);
        return _this;
    }
    BaseSystem.prototype.InitConfig = function () {
        if (this.m_Init) {
            return;
        }
        this.m_Init = true;
        this.Init();
    };
    BaseSystem.prototype.Init = function () {
    };
    /**
     * 注册协议，不能重复注册，新注册的会覆盖旧的
     */
    BaseSystem.prototype.regNetMsg = function (msgId, fun) {
        Sproto.SprotoReceiver.AddHandler(msgId, fun, this);
    };
    /**
     * 可重复注册协议方法
     */
    BaseSystem.prototype.RegNetMsgs = function (msgId, fun) {
        Sproto.SprotoReceiver.AddHandlers(msgId, fun, this);
    };
    BaseSystem.prototype.Rpc = function (tag, rpcReq, rpcRspHandler, thisObj) {
        if (rpcReq === void 0) { rpcReq = null; }
        if (rpcRspHandler === void 0) { rpcRspHandler = null; }
        if (thisObj === void 0) { thisObj = null; }
        GameSocket.ins().Rpc(tag, rpcReq, rpcRspHandler, this);
    };
    BaseSystem.prototype.OnDayTimer = function () {
    };
    BaseSystem.prototype.OnSocketClose = function () {
    };
    return BaseSystem;
}(BaseClass));
__reflect(BaseSystem.prototype, "BaseSystem");
var BaseSystem2 = (function () {
    function BaseSystem2() {
        this.m_Init = false;
        GameGlobal.AllModule.push(this);
    }
    BaseSystem2.prototype.InitConfig = function () {
        if (this.m_Init) {
            return;
        }
        this.m_Init = true;
        this.Init();
    };
    BaseSystem2.prototype.Init = function () {
    };
    /**
     * 注册协议，不能重复注册，新注册的会覆盖旧的
     */
    BaseSystem2.prototype.regNetMsg = function (msgId, fun) {
        Sproto.SprotoReceiver.AddHandler(msgId, fun, this);
    };
    /**
     * 可重复注册协议方法
     */
    BaseSystem2.prototype.RegNetMsgs = function (msgId, fun) {
        Sproto.SprotoReceiver.AddHandlers(msgId, fun, this);
    };
    BaseSystem2.prototype.Rpc = function (tag, rpcReq, rpcRspHandler, thisObj) {
        if (rpcReq === void 0) { rpcReq = null; }
        if (rpcRspHandler === void 0) { rpcRspHandler = null; }
        if (thisObj === void 0) { thisObj = null; }
        GameSocket.ins().Rpc(tag, rpcReq, rpcRspHandler, this);
    };
    BaseSystem2.prototype.OnDayTimer = function () {
    };
    BaseSystem2.prototype.OnSocketClose = function () {
    };
    return BaseSystem2;
}());
__reflect(BaseSystem2.prototype, "BaseSystem2");
//# sourceMappingURL=BaseSystem.js.map