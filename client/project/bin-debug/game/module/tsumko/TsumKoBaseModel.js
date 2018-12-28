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
var TsumKoBaseModel = (function (_super) {
    __extends(TsumKoBaseModel, _super);
    function TsumKoBaseModel() {
        var _this = _super.call(this) || this;
        _this.info_helpReward = 0; //已协助次数
        _this.info_buy = {}; //购买宝箱数据
        _this.info_todayClearlist = {}; //今天通关数据
        //选择小关
        _this.recordId = 0;
        //选择章节Id
        _this.chapterid = 0;
        //對話选择的ID
        _this.chatXiD = 0;
        //是否當前購買
        _this.isCurBuy = false;
        //是否當前清理關卡
        _this.isCurClear = false;
        _this.regNetMsg(S2cProtocol.sc_fuben_eightyOneHard_info, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_fuben_eightyOneHard_info_update, _this._DoUpdate);
        return _this;
    }
    TsumKoBaseModel.prototype.changeId = function () {
        if (this.chatXiD != 0) {
            this.chapterid = Math.ceil(this.chatXiD / 9);
            this.recordId = this.chatXiD;
        }
    };
    TsumKoBaseModel.prototype._DoInitInfo = function (rsp) {
        this.info_clear = rsp.clear;
        this.info_helpReward = rsp.helpReward;
        for (var _i = 0, _a = rsp.buy || []; _i < _a.length; _i++) {
            var info = _a[_i];
            this.info_buy[info["key1"]] = info;
        }
        for (var _b = 0, _c = rsp.todayClearlist || []; _b < _c.length; _b++) {
            var info = _c[_b];
            this.info_todayClearlist[info["key1"]] = info;
        }
    };
    TsumKoBaseModel.prototype._DoUpdate = function (rsp) {
        if (rsp.clear != undefined)
            this.info_clear = rsp.clear;
        if (rsp.clear != undefined)
            this.info_helpReward = rsp.helpReward;
        for (var _i = 0, _a = (rsp.buy || []); _i < _a.length; _i++) {
            var info = _a[_i];
            this.info_buy[info["key1"]] = info;
            this.isCurBuy = true;
        }
        for (var _b = 0, _c = rsp.todayClearlist || []; _b < _c.length; _b++) {
            var info = _c[_b];
            this.info_todayClearlist[info["key1"]] = info;
            this.isCurClear = true;
        }
        MessageCenter.ins().dispatch(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST);
        MessageCenter.ins().dispatch(MessageDef.TSUMKO_UPDATE_LIST);
        MessageCenter.ins().dispatch(MessageDef.ClOSETSUMKOBASEBAGITEMPLANEL);
    };
    //扫荡
    TsumKoBaseModel.prototype.SendSweep = function (id) {
        var req = new Sproto.cs_eightyOneHard_sweep_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_eightyOneHard_sweep, req);
    };
    //一键扫荡
    TsumKoBaseModel.prototype.SendSweepAll = function () {
        var req = new Sproto.cs_eightyOneHard_sweep_all_request;
        this.Rpc(C2sProtocol.cs_eightyOneHard_sweep_all, req);
    };
    //购买宝箱
    TsumKoBaseModel.prototype.SendBuy = function (id) {
        var req = new Sproto.cs_eightyOneHard_buy_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_eightyOneHard_buy, req);
    };
    //是否购买
    TsumKoBaseModel.prototype.IsGatePass = function (chaperId, gateId) {
        var info = this.info_buy[chaperId];
        if (info != undefined)
            return (info["key2"] & Math.pow(2, gateId)) > 0;
        return false;
    };
    //是否通过
    TsumKoBaseModel.prototype.IsClearance = function (chaperId, gateId) {
        var info = this.info_todayClearlist[chaperId];
        if (info != undefined)
            return (info["key2"] & Math.pow(2, gateId)) > 0;
        return false;
    };
    //这章是否通关
    TsumKoBaseModel.prototype.IsAllClearance = function (chaperId) {
        var info = this.info_todayClearlist[chaperId];
        if (info != undefined)
            return (info["key2"] & 1022) == 1022;
        return false;
    };
    //查看记录
    TsumKoBaseModel.prototype.Record = function (id) {
        var req = new Sproto.cs_eightyOneHard_record_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_eightyOneHard_record, req, function (rsp) {
            GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
        }, this);
    };
    //是否能打开小章节View
    TsumKoBaseModel.prototype.IsOpenView = function () {
        var bool = true;
        if (GameGlobal.actorModel.level < GameGlobal.Config.DisasterFbBaseConfig.openid) {
            UserTips.ins().showTips(GameGlobal.Config.DisasterFbBaseConfig.openid + "级开启");
            bool = false;
            return bool;
        }
        if (this.info_clear + 1 < this.chatXiD) {
            UserTips.ins().showTips("请先通关前置关卡");
            bool = false;
            return bool;
        }
        if (GameGlobal.TsumKoModel.mTeamInfo.HasTeam() == true) {
            //UserTips.ins().showTips("已有组队");
            bool = false;
            return bool;
        }
        return bool;
    };
    return TsumKoBaseModel;
}(BaseSystem));
__reflect(TsumKoBaseModel.prototype, "TsumKoBaseModel");
var TsumKoBaseRedPoint = (function (_super) {
    __extends(TsumKoBaseRedPoint, _super);
    function TsumKoBaseRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.mModel = model;
        return _this;
    }
    TsumKoBaseRedPoint.prototype.GetMessageDef = function () {
        return [];
    };
    TsumKoBaseRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[TotemsModelRedPoint.TOTEMS_ACTIVATION] = this.showRedPoint,
            _a;
        var _a;
    };
    TsumKoBaseRedPoint.prototype.showRedPoint = function () {
        var bool = false;
        // let id=0;
        // if(this.mModel.IsAllClearance(id)==true) //是否全部通关
        // {
        // }
        // if(this.mModel.IsClearance(1,1))//
        // {
        // }
        var chapter = this.mModel.info_clear / 9;
        for (var i = 0; i < 9; i++) {
        }
        return bool;
    };
    TsumKoBaseRedPoint.prototype.OnChange = function (index) {
        //GameGlobal.MessageCenter.dispatch(MessageDef.TsumKoBase_REDPOINT_NOTICE);
    };
    return TsumKoBaseRedPoint;
}(IRedPoint));
__reflect(TsumKoBaseRedPoint.prototype, "TsumKoBaseRedPoint");
//# sourceMappingURL=TsumKoBaseModel.js.map