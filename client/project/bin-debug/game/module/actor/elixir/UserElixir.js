/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/23 18:15
 * @meaning: 丹药管理类
 *
 **/
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
var UserElixir = (function (_super) {
    __extends(UserElixir, _super);
    function UserElixir() {
        var _this = _super.call(this) || this;
        _this.mMsgDefUpdate = MessageDef.ROLE_ELIXIR_UPDATE;
        // this.mRedPoint = new UserWingRedPoint(this)
        _this.regNetMsg(S2cProtocol.sc_panacea_update, _this.doWaveData);
        return _this;
    }
    ///////////////协议部分////////////////////
    //posid 丹药id
    UserElixir.prototype.useElixir = function (posid) {
        var req;
        req = new Sproto.cs_panacea_use_request;
        req.posid = posid;
        this.Rpc(C2sProtocol.cs_panacea_use, req);
    };
    UserElixir.prototype.doWaveData = function (rsp) {
        this.tElixirData = [];
        for (var item in rsp.lvlist) {
            for (var index in this.tConfig) {
                if (this.tConfig[index].posId == item) {
                    this.tElixirData[item] = this.tConfig[index];
                    this.tElixirData[item].level = rsp.lvlist[item];
                }
            }
        }
        this.tElixirArr = rsp.attrs; //丹药属性
        GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_ELIXIR_UPDATE);
    };
    ///////////////协议部分////////////////////
    UserElixir.prototype.getElixirData = function () {
        return this.tElixirData;
    };
    UserElixir.prototype.getElixirArr = function () {
        return this.tElixirArr;
    };
    UserElixir.prototype.Init = function () {
        this.tConfig = GameGlobal.Config.PanaceaConfig;
        _super.prototype.Init.call(this);
    };
    return UserElixir;
}(BaseSystem));
__reflect(UserElixir.prototype, "UserElixir");
//# sourceMappingURL=UserElixir.js.map