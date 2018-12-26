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
var HavingMagicModel = (function (_super) {
    __extends(HavingMagicModel, _super);
    function HavingMagicModel() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_tiannv_wash_res, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_tiannv_wash_replace_res, _this._getWashReplaceInfo);
        _this.regNetMsg(S2cProtocol.sc_tiannv_equip, _this._epuipInfo);
        return _this;
    }
    //============================
    //=============处理协议==========
    //============================
    //获取初始装备数据 根据 长度显示解锁
    HavingMagicModel.prototype._epuipInfo = function (rsp) {
        this.skillData = rsp.data;
        for (var i = 0; i < rsp.data.length; i++) {
            var datas = rsp.data[i];
            for (var j = 0; j < datas.attrData.length; j++) {
                var attrData = datas.attrData[j];
                if (attrData.type == 1) {
                    if (!GameGlobal.HavingMagicModel.getAttrsConfigById(attrData.attrs)) {
                        datas.attrData[j] = null;
                    }
                }
                if (datas.washData[j] && datas.washData[j].type == 1) {
                    if (!GameGlobal.HavingMagicModel.getAttrsConfigById(datas.washData[j].attrs)) {
                        datas.washData[j] = null;
                    }
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_UPDATE);
    };
    HavingMagicModel.prototype._DoInitInfo = function (rsp) {
        if (this.skillData[rsp.pos - 1]) {
            this.skillData[rsp.pos - 1].washNum = rsp.washNum;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_WASH_INFO, rsp);
    };
    HavingMagicModel.prototype._getWashReplaceInfo = function (rsp) {
        if (this.skillData[rsp.pos - 1]) {
            this.skillData[rsp.pos - 1].attrData = rsp.attrData;
            this.skillData[rsp.pos - 1].washData = rsp.washData;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.HAVING_WASH_REPLACE_INFO, rsp);
    };
    //============================
    //=============发送协议==========
    //============================
    HavingMagicModel.prototype.sendTiannvWash = function (pos, washtype, lock) {
        var req = new Sproto.cs_tiannv_wash_req_request;
        req.pos = pos;
        req.washType = washtype;
        req.lock = lock;
        this.Rpc(C2sProtocol.cs_tiannv_wash_req, req);
    };
    HavingMagicModel.prototype.sendTiannvWashReplace = function (pos) {
        var req = new Sproto.cs_tiannv_wash_replace_req_request;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_tiannv_wash_replace_req, req);
    };
    /**
     * 获取属性ID对应品质属性
     * @param id
     */
    HavingMagicModel.prototype.getAttrsConfigById = function (id) {
        return GameGlobal.Config.FemaleDevaSkillAttrsConfig[id];
    };
    //获取法器配置表数据
    HavingMagicModel.prototype.getMagicConfig = function () {
        return GameGlobal.Config.FemaleDevaMagicConfig;
    };
    //获取皮肤配置
    HavingMagicModel.prototype.getSkinConfig = function (skinid) {
        return GameGlobal.Config.FemaleDevaSkinConfig[skinid];
    };
    return HavingMagicModel;
}(BaseSystem));
__reflect(HavingMagicModel.prototype, "HavingMagicModel");
//# sourceMappingURL=HavingMagicModel.js.map