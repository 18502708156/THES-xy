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
var XianlvModel = (function (_super) {
    __extends(XianlvModel, _super);
    function XianlvModel() {
        var _this = _super.call(this) || this;
        _this.MAX_LEVEL = 10;
        _this.MAX_STAR = 10;
        _this.MAX_QY_LEVEL = 20;
        _this.mXianlvList = {};
        _this.mBattleList = [];
        _this.mRedPoint = new XianlvModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_xianlv_init, _this._DoInitInfo);
        return _this;
    }
    XianlvModel.prototype.Init = function () {
        var partnerBiographyConfig = GameGlobal.Config.partnerBiographyConfig;
        for (var k in partnerBiographyConfig) {
            var petInfo = new XianlvInfo;
            petInfo.mXianlvId = parseInt(k);
            this.mXianlvList[k] = petInfo;
            var id = partnerBiographyConfig[k].material.id;
            XianlvModel.MATERIAL_ID[id] = Number(k);
            GameGlobal.UserBag.AddListenerItem(id, MessageDef.BAG_XIANLV_ACT_ITEM);
        }
        for (var k in GameGlobal.Config.partnerLvproConfig) {
            this.MAX_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.partnerLvproConfig[k]);
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.partnerLvproConfig[k][0].cost[1].id, MessageDef.BAG_XIANLV_RANK_ITEM);
            break;
        }
        for (var k in GameGlobal.Config.partnerAttrsConfig) {
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.partnerAttrsConfig[k][0].cost[0].id, MessageDef.BAG_XIANLV_STAR_ITEM);
        }
        for (var k in GameGlobal.Config.partnerAttrsConfig) {
            this.MAX_STAR = CommonUtils.getObjectLength(GameGlobal.Config.partnerAttrsConfig[k]);
            break;
        }
        this.MAX_QY_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.partnerFreshSkillConfig);
    };
    XianlvModel.prototype._DoInitInfo = function (rsp) {
        for (var _i = 0, _a = rsp.list; _i < _a.length; _i++) {
            var data = _a[_i];
            var info = this.mXianlvList[data.id];
            if (info) {
                info.UpdateInfo(data);
            }
        }
        this.mBattleList = rsp.outbound;
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_INIT_INFO);
    };
    XianlvModel.prototype.GetXianlvId = function () {
        for (var _i = 0, _a = this.mBattleList; _i < _a.length; _i++) {
            var id = _a[_i];
            if (id) {
                return id;
            }
        }
        // for (let key in this.mXianlvList) {
        // 	let data = this.mXianlvList[key]
        // 	if (data && data.mLevel) {
        // 		return data.mXianlvId
        // 	}
        // }
        return 0;
    };
    XianlvModel.prototype.SendActive = function (xianlvId) {
        var _this = this;
        var req = new Sproto.cs_xianlv_active_request;
        req.id = xianlvId;
        this.Rpc(C2sProtocol.cs_xianlv_active, req, function (rsp) {
            if (rsp.ret) {
                if (_this.mXianlvList[xianlvId]) {
                    _this.mXianlvList[xianlvId].Active();
                    var has = false;
                    for (var _i = 0, _a = _this.mBattleList; _i < _a.length; _i++) {
                        var id = _a[_i];
                        if (id) {
                            has = true;
                            break;
                        }
                    }
                    if (!has) {
                        _this.SendBattle(xianlvId, 0);
                        GameGlobal.RaidMgr.UpdateRoleXianlv(_this.GetXianlvId());
                    }
                }
                else {
                    console.error("not active pet => petid " + xianlvId);
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_ACTIVE);
                GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO);
            }
        }, this);
    };
    XianlvModel.prototype.SendDress = function (xianlvId) {
    };
    XianlvModel.prototype.SendBattle = function (xianlvId, index) {
        var list = CommonUtils.copyDataHandler(this.mBattleList);
        list[index] = xianlvId;
        var req = new Sproto.cs_xianlv_outbound_request;
        req.first = list[0] || 0;
        req.second = list[1] || 0;
        if (CommonUtils.ArrayEqual(this.mBattleList, list)) {
            return;
        }
        this.mBattleList = list;
        this.Rpc(C2sProtocol.cs_xianlv_outbound, req);
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_BATTLE);
        GameGlobal.RaidMgr.UpdateRoleXianlv(this.GetXianlvId());
    };
    XianlvModel.prototype.SendUnBattle = function (xianlvId) {
        var list = this.mBattleList;
        for (var i = 0; i < list.length; i++) {
            var id = list[i];
            if (id == xianlvId) {
                this.SendBattle(0, i);
                break;
            }
        }
    };
    XianlvModel.prototype.SendUpLevel = function (xianlvId, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_xianlv_addexp_request;
        req.id = xianlvId;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_xianlv_addexp, req, function (rsp) {
            var info = _this.mXianlvList[xianlvId];
            if (info) {
                if (rsp.ret) {
                    info.mExp = rsp.exp;
                    info.mLevel = rsp.level;
                    GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_EXP);
                    GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO);
                }
            }
            else {
                console.error("not SendUpLevel petid => " + xianlvId);
            }
        }, this);
    };
    XianlvModel.prototype.SendUpStar = function (xianlvId) {
        var _this = this;
        var req = new Sproto.cs_xianlv_upstar_request;
        req.id = xianlvId;
        this.Rpc(C2sProtocol.cs_xianlv_upstar, req, function (rsp) {
            var info = _this.mXianlvList[xianlvId];
            if (info) {
                if (rsp.ret) {
                    info.mStar = rsp.star;
                    GameGlobal.MessageCenter.dispatch(MessageDef.XIANLV_UPATE_INFO);
                }
            }
            else {
                console.error("not SendUpLevel petid => " + xianlvId);
            }
        }, this);
    };
    XianlvModel.prototype.HasXianlv = function (xianlvId) {
        if (!xianlvId) {
            return false;
        }
        return (this.mXianlvList[xianlvId] && this.mXianlvList[xianlvId].mLevel) ? true : false;
    };
    XianlvModel.prototype.HasBattle = function (xianlvId) {
        return this.mBattleList.indexOf(xianlvId) != -1;
    };
    XianlvModel.prototype.GetBattlePos = function (xianlvId) {
        return this.mBattleList.indexOf(xianlvId);
    };
    XianlvModel.prototype.getBattledXianlv = function () {
        return this.mBattleList[0];
    };
    XianlvModel.prototype.GetXianlvInfo = function (xianlvId) {
        return this.mXianlvList[xianlvId];
    };
    XianlvModel.prototype.GetLevel = function (xianlvId) {
        if (!xianlvId) {
            return 0;
        }
        return this.mXianlvList[xianlvId].mLevel || 0;
    };
    XianlvModel.prototype.GetAllPower = function () {
        var power = 0;
        for (var k in this.mXianlvList) {
            var petInfo = this.mXianlvList[k];
            power += petInfo.GetPower();
        }
        return power;
    };
    XianlvModel.prototype.GetAllAttrsByType = function (funcName) {
        var allAttr = [];
        for (var k in this.mXianlvList) {
            var petInfo = this.mXianlvList[k];
            if (!petInfo.mLevel) {
                continue;
            }
            var attr = petInfo[funcName].call(petInfo);
            if (!attr) {
                continue;
            }
            for (var i = 0; i < attr.length; i++) {
                var data = attr[i];
                if (!allAttr[i]) {
                    allAttr[i] = { type: data.type, value: data.value };
                }
                else {
                    allAttr[i].value += data.value;
                }
            }
        }
        return allAttr;
    };
    XianlvModel.prototype.GetAllAttrs = function () {
        var allAttr = this.GetAllAttrsByType("GetAttrs");
        if (allAttr.length == 0) {
            return XianlvConst.GetBaseAttrs();
        }
        return allAttr;
    };
    XianlvModel.prototype.GetAllQyAttr = function () {
        var level = this.GetQyLevel();
        if (level) {
            return GameGlobal.Config.partnerFreshSkillConfig[level].attrs;
        }
        return XianlvConst.GetQyAttrs();
    };
    XianlvModel.prototype.GetQyLevel = function () {
        var allLevel = this.GetAllLevel();
        var config = GameGlobal.Config.partnerFreshSkillConfig;
        var level = 0;
        for (var i = 1; i < 99; i++) {
            var configData = config[i];
            if (!configData) {
                break;
            }
            if (allLevel < configData.lv) {
                break;
            }
            level = i;
        }
        return level;
    };
    XianlvModel.prototype.GetBattleCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.mBattleList; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data) {
                ++count;
            }
        }
        return count;
    };
    XianlvModel.prototype.GetActiveCount = function () {
        var count = 0;
        for (var k in this.mXianlvList) {
            var petInfo = this.mXianlvList[k];
            if (petInfo.mLevel) {
                ++count;
            }
        }
        return count;
    };
    XianlvModel.prototype.GetAllLevel = function () {
        var count = 0;
        for (var k in this.mXianlvList) {
            var petInfo = this.mXianlvList[k];
            if (petInfo.mLevel) {
                count += petInfo.mLevel;
            }
        }
        return count;
    };
    XianlvModel.prototype.IsRedPointXianlv = function (xianlvId) {
        if (this.mRedPoint.IsRedAct(xianlvId)) {
            return true;
        }
        if (this.mRedPoint.IsRedStar(xianlvId)) {
            return true;
        }
        return false;
    };
    XianlvModel.prototype.SetShowId = function (showId) {
        var tList = [];
        var tObj = { type: 6, value: showId };
        tList.push(tObj);
        GameGlobal.Chat.chatShareInfo(12, tList);
        // UserTips.ins().showTips("展示成功")
    };
    XianlvModel.MATERIAL_ID = {};
    return XianlvModel;
}(BaseSystem));
__reflect(XianlvModel.prototype, "XianlvModel");
//# sourceMappingURL=XianlvModel.js.map