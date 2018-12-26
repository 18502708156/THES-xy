/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/26 21:15
 * @meaning: 灵童命格管理类
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
var DestinyManage = (function (_super) {
    __extends(DestinyManage, _super);
    function DestinyManage() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_baby_star_init, _this.doBabyStar);
        return _this;
    }
    DestinyManage.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    // #逆命
    DestinyManage.prototype.babyStartGet = function (num) {
        var req = new Sproto.cs_baby_start_get_request;
        req.num = num;
        this.Rpc(C2sProtocol.cs_baby_start_get, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                GameGlobal.DestinyController.babyStarGet(rspData);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_GET_REWARD, rspData);
            }
        });
    };
    ;
    //#使用
    // id 		0 : integer #道具id
    // pos 	1 : integer #装到第几个位置
    DestinyManage.prototype.babyStartUse = function (id, pos) {
        var req = new Sproto.cs_baby_start_use_request;
        req.id = id;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_baby_start_use, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                GameGlobal.DestinyController.babyStartUse(rspData);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
                UserTips.InfoTip("装备成功");
            }
            else {
                UserTips.InfoTip("装备失败");
            }
        });
    };
    ;
    //#升级
    // pos 	1 : integer #升级第几个位置上的
    DestinyManage.prototype.babyStartUpLv = function (pos) {
        var req = new Sproto.cs_baby_start_up_lv_request;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_baby_start_up_lv, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                GameGlobal.DestinyController.babyStartUpLv(rspData);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
            }
        });
    };
    ;
    //分解
    // idList 	1 : *integer #需要分解的列表
    DestinyManage.prototype.babyStartSmelt = function (idList) {
        var req = new Sproto.cs_baby_start_smelt_request;
        req.idList = idList;
        this.Rpc(C2sProtocol.cs_baby_start_smelt, req, this.DoStarSmelt, this);
    };
    ;
    DestinyManage.prototype.DoStarSmelt = function (rsp) {
        if (rsp.ret) {
            MessageCenter.ins().dispatch(MessageDef.DESTINY_SMELT);
        }
        else {
            UserTips.InfoTip("分解失败");
        }
    };
    //点亮混元
    DestinyManage.prototype.babyStartLight = function () {
        var req = new Sproto.cs_baby_start_light_request;
        this.Rpc(C2sProtocol.cs_baby_start_light, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                GameGlobal.DestinyController.babyStartLight(rspData);
                MessageCenter.ins().dispatch(MessageDef.DESTINY_CHANGE);
            }
        });
    };
    ;
    //灵童命格数据初始化
    DestinyManage.prototype.doBabyStar = function (rsp) {
        GameGlobal.DestinyController.doBabyStar(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_CHANGE);
    };
    return DestinyManage;
}(BaseSystem));
__reflect(DestinyManage.prototype, "DestinyManage");
//# sourceMappingURL=DestinyManage.js.map