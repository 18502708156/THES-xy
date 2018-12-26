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
var TianShenModel = (function (_super) {
    __extends(TianShenModel, _super);
    function TianShenModel() {
        var _this = _super.call(this) || this;
        _this.MAX_LEVEL = 10;
        /**使用属性丹数量 */
        _this.mDrugNum = 0;
        /**出战天神ID */
        _this.mBattleID = 0;
        /**天神列表 */
        _this.mTianShenList = {};
        _this.mRedPoint = new TianShenModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_tianshen_info, _this._DoTianShenInfo);
        return _this;
    }
    TianShenModel.prototype.getBaseConfig = function () {
        return GameGlobal.Config.AirMarshalBaseConfig;
    };
    TianShenModel.prototype.GetCurDrugAttr = function () {
        var attr = CommonUtils.copyDataHandler(this.getBaseConfig().attredata);
        var drugNum = this.mDrugNum;
        for (var k in attr) {
            attr[k].value *= drugNum;
        }
        return attr;
    };
    TianShenModel.prototype.Init = function () {
        for (var k in GameGlobal.Config.AirMarshalListConfig) {
            var info = new TianShenInfo;
            info.mTianShenId = parseInt(k);
            this.mTianShenList[k] = info;
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AirMarshalListConfig[k].material.id, MessageDef.BAG_TIANSHEN_ACT_ITEM);
        }
        for (var k in GameGlobal.Config.AirMarshalLvproConfig) {
            var data = GameGlobal.Config.AirMarshalLvproConfig[k];
            this.MAX_LEVEL = CommonUtils.getObjectLength(data);
            GameGlobal.UserBag.AddListenerItem(data[0].cost[1].id, MessageDef.BAG_TIANSHEN_LEVEL_ITEM);
            break;
        }
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AirMarshalBaseConfig.attreitemid, MessageDef.BAG_TIANSHEN_ATTR_ITEM);
    };
    TianShenModel.prototype.HasTianShen = function (tianShenId) {
        if (!tianShenId) {
            return false;
        }
        return (this.mTianShenList[tianShenId] && this.mTianShenList[tianShenId].mLevel) ? true : false;
    };
    TianShenModel.prototype.HasBattle = function () {
        return this.mBattleID > 0;
    };
    TianShenModel.prototype.GetLevel = function (id) {
        if (!id) {
            return 0;
        }
        return this.mTianShenList[id].mLevel || 0;
    };
    TianShenModel.prototype.GetBreachLvStr = function (id) {
        if (!id) {
            return "";
        }
        if (this.mTianShenList[id].mBreachLv == 0) {
            return "";
        }
        return "+" + this.mTianShenList[id].mBreachLv || "";
    };
    /**
     * 天神列表数据
     */
    TianShenModel.prototype._DoTianShenInfo = function (rsp) {
        this.mBattleID = rsp.use;
        this.mDrugNum = rsp.drugNum;
        for (var _i = 0, _a = rsp.infoList; _i < _a.length; _i++) {
            var data = _a[_i];
            var info = this.mTianShenList[data.no];
            if (info) {
                info.UpdateInfo(data);
            }
        }
    };
    /**合成 */
    TianShenModel.prototype.SendHeCheng = function (id) {
        var req = new Sproto.cs_tianshen_exchange_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_tianshen_exchange, req);
    };
    /**激活天神 */
    TianShenModel.prototype.SendActive = function (id) {
        var _this = this;
        var req = new Sproto.cs_tianshen_activation_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_tianshen_activation, req, function (rsp) {
            if (rsp.ret) {
                if (_this.mTianShenList[id]) {
                    _this.mTianShenList[id].Active(rsp);
                    if (!_this.mBattleID) {
                        _this.SendBattle(id, 1);
                    }
                }
                else {
                    console.error("not active pet => petid " + id);
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_ACTIVE);
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO);
            }
        }, this);
    };
    /**
     * 出战/休息
     *@ param warType 出战/休息
     */
    TianShenModel.prototype.SendBattle = function (tianShenId, warType) {
        var _this = this;
        var req = new Sproto.cs_tianshen_fight_request;
        req.no = tianShenId;
        req.warType = warType;
        this.Rpc(C2sProtocol.cs_tianshen_fight, req, function (rsp) {
            if (rsp.ret) {
                var bId = _this.mBattleID;
                _this.mBattleID = rsp.use;
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO);
                if (bId != rsp.use) {
                    GameGlobal.RaidMgr.UpdateRoleTianshen(_this.mBattleID);
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BATTLE);
            }
        }, this);
    };
    /**进阶 */
    TianShenModel.prototype.SendUpLevel = function (tianShenId, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_tianshen_up_level_request;
        req.no = tianShenId;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_tianshen_up_level, req, function (rsp) {
            var info = _this.mTianShenList[tianShenId];
            if (info) {
                if (rsp.ret) {
                    info.mLevel = rsp.lv;
                    info.mExpUpNum = rsp.upNum;
                    GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_INFO);
                    GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_EXP);
                }
            }
        }, this);
    };
    /**使用属性丹 */
    TianShenModel.prototype.SendUseDrug = function (useNum) {
        var _this = this;
        var req = new Sproto.cs_tianshen_drug_request;
        req.useNum = useNum;
        this.Rpc(C2sProtocol.cs_tianshen_drug, req, function (rsp) {
            if (rsp.ret) {
                _this.mDrugNum = rsp.drugNum;
                GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_UPDATE_DRUG);
            }
        }, this);
    };
    TianShenModel.prototype.GetSkin = function (id) {
        return AppearanceConfig.GetUIPath(id);
    };
    TianShenModel.prototype.IsRedPointTianShen = function (id) {
        if (this.mRedPoint.IsRedAct(id)) {
            return true;
        }
    };
    return TianShenModel;
}(BaseSystem));
__reflect(TianShenModel.prototype, "TianShenModel");
var TianShenModelRedPoint = (function (_super) {
    __extends(TianShenModelRedPoint, _super);
    function TianShenModelRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.m_ActiveList = {};
        _this.m_LevelList = {};
        _this.m_Model = model;
        return _this;
    }
    TianShenModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[TianShenModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a[TianShenModelRedPoint.INDEX_LEVEL] = this.GetIndexLevel,
            _a[TianShenModelRedPoint.INDEX_BATTLE] = this.GetIndexBattle,
            _a[TianShenModelRedPoint.INDEX_ATTR] = this.GetIndexAttrItem,
            _a;
        var _a;
    };
    TianShenModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.BAG_TIANSHEN_ACT_ITEM, MessageDef.TIANSHEN_ACTIVE, MessageDef.TIANSHEN_UPDATE_INFO,
            MessageDef.BAG_TIANSHEN_LEVEL_ITEM,
            MessageDef.TIANSHEN_BATTLE,
            MessageDef.BAG_TIANSHEN_ATTR_ITEM
        ];
    };
    TianShenModelRedPoint.prototype.OnChange = function (index) {
        if (index == TianShenModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM);
        }
        else {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_TIANSHEN);
        }
    };
    TianShenModelRedPoint.prototype.GetIndexLevel = function () {
        this.m_LevelList = {};
        var list = this.m_Model.mTianShenList;
        for (var k in list) {
            var petInfo = list[k];
            if (petInfo.mLevel > 0 && petInfo.mLevel < this.m_Model.MAX_LEVEL) {
                var config = petInfo.GetLevelConfig();
                var upnum = Math.floor(config.proexp / config.exp);
                upnum = upnum - petInfo.mExpUpNum;
                var enough = true;
                for (var _i = 0, _a = config.cost; _i < _a.length; _i++) {
                    var data = _a[_i];
                    if (!Checker.Data({ type: data.type, id: data.id, count: data.count * upnum }, false)) {
                        enough = false;
                        break;
                    }
                }
                if (enough) {
                    this.m_LevelList[petInfo.mTianShenId] = true;
                }
            }
        }
        for (var k in this.m_LevelList) {
            return true;
        }
        return false;
    };
    TianShenModelRedPoint.prototype.GetIndexBattle = function () {
        if (this.m_Model.mBattleID) {
            return false;
        }
        var list = this.m_Model.mTianShenList;
        for (var k in list) {
            var petInfo = list[k];
            if (petInfo.mLevel > 0) {
                return true;
            }
        }
        return false;
    };
    TianShenModelRedPoint.prototype.GetIndexAttrItem = function () {
        return GameGlobal.UserBag.GetCount(GameGlobal.Config.AirMarshalBaseConfig.attreitemid) > 0;
    };
    TianShenModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.m_ActiveList) {
            if (key) {
                return true;
            }
        }
        return false;
    };
    TianShenModelRedPoint.prototype.DoActive = function () {
        this.m_ActiveList = {};
        var config = GameGlobal.Config.AirMarshalListConfig;
        for (var k in config) {
            if (this.m_Model.HasTianShen(parseInt(k))) {
                continue;
            }
            var data = config[k].material;
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                this.m_ActiveList[k] = true;
            }
        }
    };
    TianShenModelRedPoint.prototype.IsRedAct = function (xianlvId) {
        this.Get(TianShenModelRedPoint.INDEX_ACT);
        return this.m_ActiveList[xianlvId];
    };
    TianShenModelRedPoint.INDEX_ACT = 0;
    TianShenModelRedPoint.INDEX_LEVEL = 1;
    TianShenModelRedPoint.INDEX_BATTLE = 2;
    TianShenModelRedPoint.INDEX_ATTR = 3;
    return TianShenModelRedPoint;
}(IRedPoint));
__reflect(TianShenModelRedPoint.prototype, "TianShenModelRedPoint");
//# sourceMappingURL=TianShenModel.js.map