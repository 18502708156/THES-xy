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
/**
 * 图腾Model
 */
var TotemsModel = (function (_super) {
    __extends(TotemsModel, _super);
    //public isNotUp=false;
    function TotemsModel() {
        var _this = _super.call(this) || this;
        // public id:number;//编号
        // public lv:number;//等級
        // public upNum:number;//升级次数
        // public todayNum:number;//当天强化暴击阶段次数，配置num减当前参数则为下次必定暴击次数
        // public todayId:number;//当天强化暴击阶段编号，在哪个暴击阶段
        // public breach:number;//是否要突破，不需要为0，需要的话则为当前等级;
        // public date=[];
        _this.totemsDic = {};
        _this.clickIndex = 0;
        _this.mRedPoint = new TotemsModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_totems_info, _this._DoInitInfo);
        return _this;
    }
    TotemsModel.prototype._DoInitInfo = function (rsp) {
        // this.date=rsp.data;
        for (var i = 0; i < rsp.data.length; i++) {
            this.totemsDic[rsp.data[i].id] = rsp.data[i];
        }
        // this.totemsDic
        // this.id=rsp.data["id"];
        // this.lv=rsp.data["lv"];
        // this.upNum=rsp.data["upNum"];
        // this.todayNum=rsp.data["todayNum"];
        // this.todayId=rsp.data["todayId"];
        // this.breach=rsp.data["breach"];
        GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_INFO);
    };
    //激活
    TotemsModel.prototype.activationTotems = function (totemsID) {
        var _this = this;
        var req = new Sproto.cs_totems_open_request;
        req.id = totemsID;
        this.Rpc(C2sProtocol.cs_totems_open, req, function (rsp) {
            //GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
            //console.log( rsp)
            if (rsp.ret == true) {
                var dic = {};
                dic = _this.rspDate(totemsID, rsp);
                // if(JSON.stringify(dic)!="{}")
                // {
                _this.totemsDic[totemsID] = dic;
                GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
                _this.mRedPoint.mRedPointMap[totemsID] = false;
                // }
                //this.isNotUp=false;
            }
        }, this);
    };
    TotemsModel.prototype.rspDate = function (id, rsp) {
        var dic = {};
        if (rsp != undefined) {
            if (rsp.ret == true) {
                dic["id"] = id;
                dic["lv"] = rsp.lv;
                dic["upNum"] = rsp.upNum;
                dic["todayNum"] = rsp.todayNum;
                dic["todayId"] = rsp.todayId;
                dic["breach"] = rsp.breach;
            }
        }
        return dic;
    };
    //升級
    TotemsModel.prototype.upTotems = function (totemsID, count, isAuto) {
        var _this = this;
        var req = new Sproto.cs_totems_add_exp_request;
        req.id = totemsID;
        req.num = count;
        req.autobuy = isAuto;
        this.Rpc(C2sProtocol.cs_totems_add_exp, req, function (rsp) {
            //GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
            //console.log( rsp);
            if (rsp.ret == true) {
                var dic = {};
                dic = _this.rspDate(totemsID, rsp);
                // if(JSON.stringify(dic)!="{}")
                // {
                _this.totemsDic[totemsID] = dic;
                GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
                // }
                //this.isNotUp=false;
            }
        }, this);
    };
    //突破
    TotemsModel.prototype.breachTotems = function (totemsID) {
        var _this = this;
        var req = new Sproto.cs_totems_breach_request;
        req.id = totemsID;
        this.Rpc(C2sProtocol.cs_totems_breach, req, function (rsp) {
            //GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
            //console.log( rsp);
            if (rsp.ret == true) {
                var dic = {};
                dic = _this.rspDate(totemsID, rsp);
                // if(JSON.stringify(dic)!="{}")
                // {
                _this.totemsDic[totemsID] = dic;
                GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
                // }
                //this.isNotUp=false;
                _this.mRedPoint.mRedPointMap[totemsID] = false;
            }
        }, this);
    };
    //獲取ID數組
    TotemsModel.prototype.tabIDArr = function () {
        var arr = [];
        var tab = GameGlobal.Config.TotemsActConfig;
        for (var key in tab) {
            var row = tab[key];
            arr.push(row.id);
        }
        return arr;
    };
    TotemsModel.prototype.DicIndex = function (key, IDArr) {
        var index = -1;
        if (IDArr == undefined)
            IDArr = this.tabIDArr();
        for (var i = 0; i < IDArr.length; i++) {
            if (Number(key) == IDArr[i])
                return i;
        }
        return index;
    };
    return TotemsModel;
}(BaseSystem));
__reflect(TotemsModel.prototype, "TotemsModel");
var TotemsModelRedPoint = (function (_super) {
    __extends(TotemsModelRedPoint, _super);
    function TotemsModelRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.mRedPointMap = {};
        _this.mModel = model;
        return _this;
    }
    TotemsModelRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.TOTEMS_INFO,
            MessageDef.TOTEMS_UPDATEACTIVATION,
        ];
    };
    TotemsModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[TotemsModelRedPoint.TOTEMS_ACTIVATION] = this.showRedPoint,
            _a;
        var _a;
    };
    TotemsModelRedPoint.prototype.showRedPoint = function () {
        var bool = false;
        var IDArr = this.mModel.tabIDArr();
        var tabAct = GameGlobal.Config.TotemsActConfig;
        var tabUp = GameGlobal.Config.TotemsAttrsConfig;
        for (var i = 0; i < IDArr.length; i++) {
            var ID = IDArr[i];
            if (this.mModel.totemsDic[ID] != undefined) {
                var id = this.mModel.totemsDic[IDArr[i]].id;
                var lv = this.mModel.totemsDic[IDArr[i]].lv;
                //let lv=this.mModel.totemsDic[ID].breach;
                if (lv <= tabUp[id].length) {
                    //if(tabUp[id][lv-1].tpcost!=undefined)//需要突破
                    var breachLv = this.mModel.totemsDic[ID].breach;
                    if (breachLv != 0) {
                        //let breachLv=this.mModel.totemsDic[ID].breach;
                        if (tabUp[id][breachLv].tpcost != undefined) {
                            if (Checker.Data(tabUp[id][breachLv].tpcost[0], false) == true) {
                                this.mRedPointMap[id] = true;
                                bool = true;
                            }
                        }
                    }
                    if (lv < tabUp[id].length) {
                        if (tabUp[id][lv].cost != undefined) {
                            if (Checker.Data(tabUp[id][lv].cost[0], false) == true) {
                                //this.mRedPointMap[id]=true;
                                bool = true;
                            }
                        }
                    }
                }
            }
            else {
                var item = tabAct[ID].cost[0];
                if (Checker.Data(item, false) == true) {
                    this.mRedPointMap[ID] = true;
                    bool = true;
                }
            }
            //Checker.Data()
        }
        return bool;
    };
    TotemsModelRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_REDPOINT_NOTICE);
    };
    // private GetIndexAct(): boolean 
    // {
    // }
    TotemsModelRedPoint.prototype.DoActive = function () {
    };
    //public static readonly INDEX_UP_SIGN = 0
    TotemsModelRedPoint.TOTEMS_ACTIVATION = 0;
    return TotemsModelRedPoint;
}(IRedPoint));
__reflect(TotemsModelRedPoint.prototype, "TotemsModelRedPoint");
//# sourceMappingURL=TotemsModel.js.map