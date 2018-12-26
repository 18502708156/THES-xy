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
var YuanfenModel = (function (_super) {
    __extends(YuanfenModel, _super);
    function YuanfenModel() {
        var _this = _super.call(this) || this;
        _this.actMap = {};
        _this.mRedPoint = new YuanfenModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_brother_info, _this._DoInitInfo);
        return _this;
    }
    YuanfenModel.prototype.Init = function () {
    };
    YuanfenModel.prototype._DoInitInfo = function (rsp) {
        for (var _i = 0, _a = rsp.data || []; _i < _a.length; _i++) {
            var id = _a[_i];
            this.actMap[id] = true;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_INIT);
    };
    YuanfenModel.prototype.SendActCombo = function (id) {
        var _this = this;
        var req = new Sproto.cs_brother_activation_request;
        req.no = id;
        this.Rpc(C2sProtocol.cs_brother_activation, req, function (rsp) {
            if (rsp.ret) {
                _this.actMap[rsp.no] = true;
                GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_UPDATE_LIST);
            }
        }, this);
    };
    YuanfenModel.prototype.GetDataList = function (type) {
        var _this = this;
        var dataList = [];
        for (var key in GameGlobal.Config.FateConfig) {
            var config = GameGlobal.Config.FateConfig[key];
            if (config.type == type) {
                dataList.push(config);
            }
        }
        var getWeight = function (config) {
            var confId = config.id;
            if (_this.CanYuanfenAct(confId)) {
                return confId - 100000;
            }
            if (_this.HasAct(confId)) {
                return confId - 10000;
            }
            return confId;
        };
        dataList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        return dataList;
    };
    YuanfenModel.prototype.HasAct = function (id) {
        return this.actMap[id];
    };
    YuanfenModel.prototype.CanYuanfenAct = function (id) {
        if (this.actMap[id])
            return false;
        var config = GameGlobal.Config.FateConfig[id];
        for (var _i = 0, _a = config.group; _i < _a.length; _i++) {
            var info = _a[_i];
            if (!this._HasOne(info.type, info.id))
                return false;
        }
        return true;
    };
    YuanfenModel.prototype.GetAllPower = function () {
        var power = 0;
        for (var id in this.actMap) {
            var confId = parseInt(id);
            var config = GameGlobal.Config.FateConfig[confId];
            if (!config) {
                continue;
            }
            power += ItemConfig.CalcAttrScoreValue(config.attrs);
        }
        return power;
    };
    YuanfenModel.prototype._HasOne = function (type, id) {
        var hasFlag;
        switch (type) {
            case 1:
                hasFlag = GameGlobal.PetModel.HasPet(id);
                break;
            case 2:
                hasFlag = GameGlobal.TianShenModel.HasTianShen(id);
                break;
            case 3:
                hasFlag = GameGlobal.XianlvModel.HasXianlv(id);
                break;
        }
        return hasFlag;
    };
    YuanfenModel.prototype.CanActInList = function (type) {
        if (type && !Deblocking.Check(type + 89, true))
            return false;
        for (var key in GameGlobal.Config.FateConfig) {
            var config = GameGlobal.Config.FateConfig[key];
            if ((config.type == type || type == null) && this.CanYuanfenAct(config.id)) {
                return true;
            }
        }
        return false;
    };
    YuanfenModel.prototype.IsRedPointYuanfen = function (type) {
        return this.mRedPoint.IsRedAct(type);
    };
    YuanfenModel.prototype.IsRedPoint = function () {
        return this.mRedPoint.IsRedPoint();
    };
    return YuanfenModel;
}(BaseSystem));
__reflect(YuanfenModel.prototype, "YuanfenModel");
var YuanfenModelRedPoint = (function (_super) {
    __extends(YuanfenModelRedPoint, _super);
    function YuanfenModelRedPoint(model) {
        var _this = _super.call(this) || this;
        //////////////////////////////////////////
        _this.mRedPointMap = {};
        _this.mModel = model;
        return _this;
    }
    YuanfenModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.YUANFEN_INIT, MessageDef.YUANFEN_UPDATE_LIST,
            MessageDef.PET_ACTIVE, MessageDef.XIANLV_ACTIVE,
            MessageDef.TIANSHEN_ACTIVE];
    };
    YuanfenModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[YuanfenModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a;
        var _a;
    };
    YuanfenModelRedPoint.prototype.OnChange = function (index) {
        if (index == YuanfenModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.YUANFEN_ALL_NOTICE);
        }
    };
    YuanfenModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mRedPointMap) {
            if (this.mRedPointMap[key]) {
                return true;
            }
        }
        return false;
    };
    YuanfenModelRedPoint.prototype.DoActive = function () {
        this.mRedPointMap[YuanfenModelRedPoint.TYPE_1] = this.mModel.CanActInList(1);
        this.mRedPointMap[YuanfenModelRedPoint.TYPE_2] = this.mModel.CanActInList(2);
        this.mRedPointMap[YuanfenModelRedPoint.TYPE_3] = this.mModel.CanActInList(3);
        this.mRedPointMap[YuanfenModelRedPoint.TYPE_4] = this.mModel.CanActInList(4);
    };
    YuanfenModelRedPoint.prototype.IsRedAct = function (type) {
        this.Get(YuanfenModelRedPoint.INDEX_ACT);
        return this.mRedPointMap[type];
    };
    YuanfenModelRedPoint.INDEX_ACT = 0;
    /** 红点通知类型 */
    //////////////////////////////////////////
    YuanfenModelRedPoint.TYPE_1 = 1;
    YuanfenModelRedPoint.TYPE_2 = 2;
    YuanfenModelRedPoint.TYPE_3 = 3;
    YuanfenModelRedPoint.TYPE_4 = 4;
    return YuanfenModelRedPoint;
}(IRedPoint));
__reflect(YuanfenModelRedPoint.prototype, "YuanfenModelRedPoint");
//# sourceMappingURL=YuanfenModel.js.map