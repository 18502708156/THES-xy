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
var VipModel = (function (_super) {
    __extends(VipModel, _super);
    function VipModel() {
        var _this = _super.call(this) || this;
        // public getVipInfo(rsp: Sproto.sc_vip_update_data_request) {
        // 	// GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS, rsp);
        // 	// GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP, rsp);
        // }
        // public sendVipLv(lv): void {
        // 	let req = new Sproto.cs_vip_get_awards_request;
        // 	req.lv = lv;
        // 	this.Rpc(C2sProtocol.cs_vip_get_awards, req);
        // }
        _this.configData = [];
        return _this;
        // this.regNetMsg(S2cProtocol.sc_vip_update_data, this.getVipInfo);
    }
    //获取vip配置
    VipModel.prototype.getVipConfig = function () {
        this.configData = [];
        for (var item in GameGlobal.Config.VipConfig) {
            this.configData.push(GameGlobal.Config.VipConfig[item]);
        }
        return this.configData;
    };
    //获取vip重要特权
    VipModel.prototype.getVipsDes = function (id) {
        var vipconfig = GameGlobal.Config.VipConfig[id];
        return vipconfig.des;
    };
    //获取vip等级奖励
    VipModel.prototype.getVipAward = function (id) {
        var vipconfig = GameGlobal.Config.VipConfig[id];
        return vipconfig.rewards;
    };
    //获取vip等级描述
    VipModel.prototype.getVipDes = function (id) {
        var vipconfig = GameGlobal.Config.VipConfig[id];
        return vipconfig.description;
    };
    return VipModel;
}(BaseSystem));
__reflect(VipModel.prototype, "VipModel");
//# sourceMappingURL=VipModel.js.map