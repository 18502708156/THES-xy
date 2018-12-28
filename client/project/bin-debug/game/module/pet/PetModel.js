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
var PetModel = (function (_super) {
    __extends(PetModel, _super);
    function PetModel() {
        var _this = _super.call(this) || this;
        _this.MAX_ZIZHI_LEVEL = 5;
        _this.MAX_LEVEL = 100;
        _this.mPetList = {};
        _this.mBattleList = [];
        _this.mRedPoint = new PetModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_pet_init, _this._DoInitInfo);
        return _this;
    }
    PetModel.prototype.GetShowId = function () {
        for (var _i = 0, _a = this.mBattleList; _i < _a.length; _i++) {
            var id = _a[_i];
            if (id) {
                return id;
            }
        }
        return 0;
    };
    PetModel.prototype.Init = function () {
        for (var k in GameGlobal.Config.petBiographyConfig) {
            var petInfo = new PetInfo;
            petInfo.mPetId = parseInt(k);
            this.mPetList[k] = petInfo;
            var data = GameGlobal.Config.petBiographyConfig[k];
            GameGlobal.UserBag.AddListenerItem(data.material.id, MessageDef.BAG_PET_ACT_ITEM);
        }
        for (var k in GameGlobal.Config.petGiftproConfig) {
            var data = GameGlobal.Config.petGiftproConfig[k];
            this.MAX_ZIZHI_LEVEL = CommonUtils.getObjectLength(data);
            break;
        }
        for (var k in GameGlobal.Config.petLvproConfig) {
            var data = GameGlobal.Config.petLvproConfig[k];
            this.MAX_LEVEL = CommonUtils.getObjectLength(data);
            GameGlobal.UserBag.AddListenerItem(data[0].cost[1].id, MessageDef.BAG_PET_LEVEL_ITEM);
            break;
        }
        for (var _i = 0, _a = GameGlobal.Config.petbaseConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.BAG_PET_SKILL_ITEM);
        }
    };
    PetModel.prototype._DoInitInfo = function (rsp) {
        for (var _i = 0, _a = rsp.list; _i < _a.length; _i++) {
            var data = _a[_i];
            var petInfo = this.mPetList[data.petid];
            if (!petInfo) {
                petInfo = new PetInfo;
                petInfo.mPetId = data.petid;
                this.mPetList[petInfo.mPetId] = petInfo;
            }
            petInfo.UpdateInfo(data);
        }
        this.mBattleList = rsp.outbound || [];
        // this.mShowId = rsp.showid
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_INIT_INFO);
        if (this.GetShowId()) {
            this.OnActive();
        }
    };
    PetModel.prototype.OnActive = function () {
        GameGlobal.RaidMgr.UpdateRolePet(this.GetShowId());
    };
    PetModel.prototype.SetShowId = function (showId) {
        var tList = [];
        var tObj = { type: 1, value: showId };
        tList.push(tObj);
        GameGlobal.Chat.chatShareInfo(1, tList);
        // UserTips.ins().showTips("展示成功")
    };
    PetModel.prototype.SendActive = function (petId) {
        var _this = this;
        var req = new Sproto.cs_pet_active_request;
        req.id = petId;
        this.Rpc(C2sProtocol.cs_pet_active, req, function (rsp) {
            if (rsp.ret) {
                if (_this.mPetList[petId]) {
                    _this.mPetList[petId].Active();
                    var has = false;
                    for (var _i = 0, _a = _this.mBattleList; _i < _a.length; _i++) {
                        var id = _a[_i];
                        if (id) {
                            has = true;
                            break;
                        }
                    }
                    if (!has) {
                        _this.SendBattle(petId, 0);
                        GameGlobal.RaidMgr.UpdateRolePet(petId);
                    }
                    // if (!this.mShowId) {
                    // 	this.mShowId = petId
                    // 	GameGlobal.RaidMgr.GetCurRaid().UpdateRolePet(petId)
                    // }
                }
                else {
                    console.error("not active pet => petid " + petId);
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.PET_ACTIVE);
                GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
            }
        }, this);
    };
    PetModel.prototype.SendDress = function (petId) {
    };
    PetModel.prototype.SendBattle = function (petId, index) {
        var list = CommonUtils.copyDataHandler(this.mBattleList);
        list[index] = petId;
        var req = new Sproto.cs_pet_outbound_request;
        req.first = list[0] || 0;
        req.second = list[1] || 0;
        req.third = list[2] || 0;
        req.four = list[3] || 0;
        if (CommonUtils.ArrayEqual(this.mBattleList, list)) {
            return;
        }
        this.mBattleList = list;
        this.Rpc(C2sProtocol.cs_pet_outbound, req);
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_BATTLE);
        GameGlobal.RaidMgr.UpdateRolePet(this.GetShowId());
    };
    PetModel.prototype.SendUnBattle = function (petId) {
        var list = this.mBattleList;
        for (var i = 0; i < list.length; i++) {
            var id = list[i];
            if (id == petId) {
                this.SendBattle(0, i);
                break;
            }
        }
    };
    PetModel.prototype.SendUpZizhi = function (petId) {
        var _this = this;
        var req = new Sproto.cs_pet_addgift_request;
        req.id = petId;
        this.Rpc(C2sProtocol.cs_pet_addgift, req, function (rsp) {
            var info = _this.mPetList[petId];
            if (info) {
                if (rsp.ret) {
                    info.mZizhiExp = rsp.exp;
                    info.mZizhiLevel = rsp.level;
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_ZIZHI);
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
                }
            }
            else {
                console.error("not upzizhi petid => " + petId);
            }
        }, this);
    };
    PetModel.prototype.SendUpLevel = function (petId, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_pet_addexp_request;
        req.id = petId;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_pet_addexp, req, function (rsp) {
            var info = _this.mPetList[petId];
            if (info) {
                if (rsp.ret) {
                    info.mExp = rsp.exp;
                    info.mLevel = rsp.level;
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_EXP);
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
                }
                else {
                    // UserTips.ErrorTip("升级失败")
                }
            }
            else {
                console.error("not upzizhi petid => " + petId);
            }
        }, this);
    };
    PetModel.prototype.SendRename = function (petId, petName) {
        var _this = this;
        var req = new Sproto.cs_pet_rename_request;
        req.id = petId;
        req.name = petName;
        this.Rpc(C2sProtocol.cs_pet_rename, req, function (rsp) {
            var info = _this.mPetList[petId];
            if (info) {
                if (rsp.ret) {
                    info.mName = rsp.name;
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
                }
                else
                    GameGlobal.UserTips.showTips("输入的名称含有敏感字");
            }
            else {
                console.error("not SendRename petid => " + petId);
            }
        }, this);
    };
    PetModel.prototype.SendXilian = function (petId, lockList, type, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_pet_refreshskill_request;
        req.id = petId;
        req.locklist = lockList;
        req.type = type;
        req.autoBuy = autoBuy ? 2 : 0;
        this.Rpc(C2sProtocol.cs_pet_refreshskill, req, function (rsp) {
            if (rsp.ret) {
                var info = _this.mPetList[petId];
                if (info) {
                    info.mXilian = rsp.xilian;
                    info.mXilianSkill = rsp.xilianSkills;
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
                }
            }
        }, this);
    };
    PetModel.prototype.SendSetXilian = function (petId) {
        var _this = this;
        var req = new Sproto.cs_pet_setskillin_request;
        req.id = petId;
        this.Rpc(C2sProtocol.cs_pet_setskillin, req, function (rsp) {
            if (rsp.ret) {
                var info = _this.mPetList[petId];
                if (info) {
                    info.mBuffSkill = rsp.buffs;
                    info.mXilianSkill = [];
                    GameGlobal.MessageCenter.dispatch(MessageDef.PET_UPATE_INFO);
                }
            }
        }, this);
    };
    PetModel.prototype.HasPet = function (petId) {
        if (!petId) {
            return false;
        }
        return (this.mPetList[petId] && this.mPetList[petId].mLevel) ? true : false;
    };
    PetModel.prototype.HasBattle = function (petId) {
        return this.mBattleList.indexOf(petId) != -1;
    };
    PetModel.prototype.GetBattlePos = function (petId) {
        return this.mBattleList.indexOf(petId);
    };
    PetModel.prototype.GetPetInfo = function (petId) {
        return this.mPetList[petId];
    };
    PetModel.prototype.GetLevel = function (petId) {
        if (!petId) {
            return 0;
        }
        return this.mPetList[petId].mLevel || 0;
    };
    PetModel.prototype.GetBiggestLevel = function () {
        var level = 0;
        for (var k in this.mPetList) {
            if (this.mPetList[k].mLevel > level) {
                level = this.mPetList[k].mLevel;
            }
        }
        return level;
    };
    PetModel.prototype.GetAllPower = function () {
        var power = 0;
        for (var k in this.mPetList) {
            if (this.HasPet(parseInt(k))) {
                var petInfo = this.mPetList[k];
                power += petInfo.GetPower();
            }
        }
        return power;
    };
    PetModel.prototype.GetAllAttrsByType = function (funcName) {
        var allAttr = [];
        for (var k in this.mPetList) {
            var petInfo = this.mPetList[k];
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
    PetModel.prototype.GetAllAttrs = function () {
        var allAttr = this.GetAllAttrsByType("GetAttrs");
        if (allAttr.length == 0) {
            return PetConst.GetBaseAttrs();
        }
        return allAttr;
    };
    PetModel.prototype.GetAllZizhiAttrs = function () {
        return this.GetAllAttrsByType("GetZizhiAttrs");
    };
    PetModel.prototype.GetAllFeisAttrs = function () {
        var allAttr = this.GetAllAttrsByType("GetFeisAttrs");
        if (allAttr.length == 0) {
            return PetConst.GetFeisBaseAttrs();
        }
        return allAttr;
    };
    PetModel.prototype.GetActiveCount = function () {
        var count = 0;
        for (var k in this.mPetList) {
            var petInfo = this.mPetList[k];
            if (petInfo.mLevel) {
                ++count;
            }
        }
        return count;
    };
    PetModel.prototype.IsRedPointPet = function (petId) {
        if (this.mRedPoint.IsRedAct(petId)) {
            return true;
        }
        if (this.mRedPoint.IsRedZizhi(petId)) {
            return true;
        }
        return false;
    };
    PetModel.SKILL_COUNT = 6;
    return PetModel;
}(BaseSystem));
__reflect(PetModel.prototype, "PetModel");
//# sourceMappingURL=PetModel.js.map