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
var LingtongPetModel = (function (_super) {
    __extends(LingtongPetModel, _super);
    function LingtongPetModel() {
        var _this = _super.call(this) || this;
        _this.MAX_GIFT_LEVEL = 5;
        _this.mInfo = {};
        _this.mBattleList = [];
        _this.regNetMsg(S2cProtocol.sc_baby_init, _this._DoInitInfo);
        _this.regNetMsg(S2cProtocol.sc_baby_list, _this._DoInitInfoList);
        return _this;
    }
    LingtongPetModel.prototype.GetShowId = function () {
        for (var _i = 0, _a = this.mBattleList; _i < _a.length; _i++) {
            var id = _a[_i];
            if (id) {
                return id;
            }
        }
        return 0;
    };
    LingtongPetModel.prototype.GetYulCount = function () {
        var count = 0;
        for (var key in this.mInfo) {
            var info = this.mInfo[key];
            if (info && info.mLevel) {
                count += info.GetYulCount();
            }
        }
        return count;
    };
    LingtongPetModel.prototype.GetYulPower = function () {
        var power = 0;
        for (var key in this.mInfo) {
            var info = this.mInfo[key];
            if (info && info.mLevel) {
                power += info.GetYulPower();
            }
        }
        return power;
    };
    LingtongPetModel.prototype.GetMaxPetLevel = function () {
        var lv = 0;
        for (var key in this.mInfo) {
            var info = this.mInfo[key];
            if (info && info.mLevel) {
                if (info.mLevel > lv) {
                    lv = info.mLevel;
                }
            }
        }
        return lv;
    };
    LingtongPetModel.prototype._DoInitInfo = function (rsp) {
        var info = this.mInfo[rsp.id];
        if (!info) {
            this.mInfo[rsp.id] = info = new LingtongInfo;
        }
        info.UpdateInfo(rsp);
        GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_YU_UPDATE_INFO);
    };
    LingtongPetModel.prototype._DoInitInfoList = function (rsp) {
        LingtongPetModel.INIT_INFO = true;
        for (var _i = 0, _a = rsp.list; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!this.mInfo[data.id]) {
                this.mInfo[data.id] = new LingtongInfo;
            }
            this.mInfo[data.id].UpdateInfo(data);
        }
        this.mBattleList = rsp.outbound || [];
        GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_YU_UPDATE_INFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_INIT_LIST_INFO);
    };
    LingtongPetModel.prototype.SetShowId = function (showId) {
        var tList = [];
        var tObj = { type: 7, value: showId };
        tList.push(tObj);
        GameGlobal.Chat.chatShareInfo(50, tList);
    };
    LingtongPetModel.prototype.SendActive = function (id) {
        var _this = this;
        var req = new Sproto.cs_baby_active_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_baby_active, req, function (rsp) {
            if (rsp.ret) {
                var has = false;
                for (var _i = 0, _a = _this.mBattleList; _i < _a.length; _i++) {
                    var id_1 = _a[_i];
                    if (id_1) {
                        has = true;
                        break;
                    }
                }
                if (!has) {
                    _this.SendBattle(id, 0);
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_ACTIVE);
                UserTips.InfoTip("激活成功");
            }
        });
    };
    LingtongPetModel.prototype.SendSuitUpgrade = function (petId) {
        var req = new Sproto.cs_baby_hunsuit_up_request;
        req.id = petId;
        this.Rpc(C2sProtocol.cs_baby_hunsuit_up, req, function (rsp) {
            if (rsp.ret) {
                UserTips.InfoTip("套装激活成功");
            }
        });
    };
    LingtongPetModel.prototype.SendAddExp = function (petId, autoBuy) {
        var req = new Sproto.cs_baby_addexp_request;
        req.id = petId;
        req.autobuy = autoBuy;
        this.Rpc(C2sProtocol.cs_baby_addexp, req, function (rsp) {
            if (rsp.ret) {
            }
        });
    };
    LingtongPetModel.prototype.SendComposition = function (petId) {
        var req = new Sproto.cs_baby_merge_request;
        req.id = petId;
        this.Rpc(C2sProtocol.cs_baby_merge, req, function (req) {
            if (req.ret) {
                UserTips.InfoTip("合成成功");
            }
        });
    };
    LingtongPetModel.prototype.SendLingUpgrade = function (petId, index) {
        var req = new Sproto.cs_baby_up_ling_request;
        req.id = petId;
        req.lingid = index;
        this.Rpc(C2sProtocol.cs_baby_up_ling, req, function (req) {
        });
    };
    LingtongPetModel.prototype.SendLingActive = function (petId, index) {
        this.SendLingUpgrade(petId, index);
    };
    LingtongPetModel.prototype.SendHunUpgrade = function (petId, index) {
        var req = new Sproto.cs_baby_up_hun_request;
        req.id = petId;
        req.hunid = index;
        this.Rpc(C2sProtocol.cs_baby_up_hun, req, function (req) {
        });
    };
    LingtongPetModel.prototype.SendHunActive = function (petId, index) {
        this.SendHunUpgrade(petId, index);
    };
    LingtongPetModel.prototype.SendBattle = function (petId, index) {
        var list = CommonUtils.copyDataHandler(this.mBattleList);
        list[index] = petId;
        var req = new Sproto.cs_baby_outbound_request;
        req.first = list[0] || 0;
        req.second = list[1] || 0;
        req.third = list[2] || 0;
        req.four = list[3] || 0;
        if (CommonUtils.ArrayEqual(this.mBattleList, list)) {
            return;
        }
        this.mBattleList = list;
        this.Rpc(C2sProtocol.cs_baby_outbound, req);
        GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_BATTLE);
        // GameGlobal.RaidMgr.UpdateRoleLingtong(this.GetShowId())
    };
    LingtongPetModel.prototype.SendUnBattle = function (petId) {
        var list = this.mBattleList;
        for (var i = 0; i < list.length; i++) {
            var id = list[i];
            if (id == petId) {
                this.SendBattle(0, i);
                break;
            }
        }
    };
    LingtongPetModel.prototype.HasBattle = function (petId) {
        return this.mBattleList.indexOf(petId) != -1;
    };
    LingtongPetModel.prototype.GetBattlePos = function (petId) {
        return this.mBattleList.indexOf(petId);
    };
    LingtongPetModel.prototype.GetInfo = function (id) {
        return this.mInfo[id];
    };
    LingtongPetModel.prototype.HasActive = function () {
        for (var key in this.mInfo) {
            if (this.mInfo[key].mLevel) {
                return true;
            }
        }
        return false;
    };
    LingtongPetModel.prototype.IsActive = function (id) {
        return this.mInfo[id] && this.mInfo[id] ? true : false;
    };
    LingtongPetModel.prototype.openLingConditionStr = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return "";
        }
        var cfg = GameGlobal.Config.BabyLingLvConfig[petinfo.getQuality()][index - 1];
        var needLv = cfg.unlockquality ? cfg.unlockquality : 0;
        if (needLv > 0) {
            return (index - 1) + "颗" + (LingtongConst.GetYulQuality(needLv));
        }
        return "";
    };
    /**是否能开启第几个御灵，此方法 不计算物品够不够 */
    LingtongPetModel.prototype.canOpenLingByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return false;
        }
        var cfg = GameGlobal.Config.BabyLingLvConfig[petinfo.getQuality()][index - 1];
        var needQuality = cfg.unlockquality ? cfg.unlockquality : 0;
        if (needQuality > 0) {
            var i = void 0;
            var len = index - 1;
            for (i = 0; i < len; i++) {
                if (petinfo.getLings()[i] < needQuality) {
                    return false;
                }
            }
        }
        return true;
    };
    LingtongPetModel.prototype.getLingNextAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = petinfo.getLingByIndex(index);
        if (lv == LingtongPetModel.MAX_Ling_LEVEL) {
            return null;
        }
        var attrList = [];
        attrList.push(LingtongConst.GetLingAttr(petid, index, lv + 1));
        return attrList;
    };
    LingtongPetModel.prototype.getLingTopAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = LingtongPetModel.MAX_Ling_LEVEL;
        var attrList = [];
        attrList.push(LingtongConst.GetLingAttr(petid, index, lv));
        return attrList;
    };
    LingtongPetModel.prototype.getLingAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = petinfo.getLingByIndex(index);
        if (lv == 0) {
            return null;
        }
        var attrList = [];
        attrList.push(LingtongConst.GetLingAttr(petid, index, lv));
        return attrList;
    };
    LingtongPetModel.prototype.IsRedPointUpLings = function (petInfo, index) {
        if (!petInfo) {
            return false;
        }
        var lings = petInfo.getLings();
        var i = index ? index - 1 : 0;
        var len = index ? index : lings.length;
        for (i; i < len; i++) {
            if (this.canUpgradeLingByIndex(petInfo.getId(), i + 1))
                return true;
        }
        return false;
    };
    LingtongPetModel.prototype.canUpgradeLingByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return false;
        }
        var lingLv = petinfo.getLingByIndex(index);
        if (lingLv == 0) {
            if (this.canOpenLingByIndex(petid, index) == false) {
                return false;
            }
        }
        var need = this.getUpGradeLingNeedPetCount(petinfo.getQuality(), index, lingLv);
        if (need <= 0) {
            return false;
        }
        var count = GameGlobal.UserBag.GetCount(LingtongConst.GetActiveItemId(petinfo.getId()));
        if (count >= need) {
            return true;
        }
        return false;
    };
    LingtongPetModel.prototype.getUpGradeLingNeedPetCount = function (quality, index, lv) {
        var cfg = GameGlobal.Config.BabyLingLvConfig[quality][index - 1];
        var cost = cfg.cost[lv];
        if (cost) {
            return cost.count;
        }
        return 9999999;
    };
    LingtongPetModel.prototype.IsRedPointSuit = function (petInfo) {
        if (!petInfo) {
            return false;
        }
        var nextPetHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo ? petInfo.getSuitId() : 0];
        if (nextPetHunSuitObj) {
            if (petInfo.getActiveHunCount(nextPetHunSuitObj.level) >= LingtongPetModel.MAX_HUN_NUM) {
                return true;
            }
        }
        return false;
    };
    LingtongPetModel.prototype.canActionHunByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return false;
        }
        var cfg = GameGlobal.Config.BabyHunActConfig[petinfo.suitConfigId][index - 1];
        var count = GameGlobal.UserBag.GetCount(cfg.hunAct.id);
        if (count >= cfg.hunAct.count) {
            return true;
        }
        return false;
    };
    LingtongPetModel.prototype.canUpgradeHunByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return false;
        }
        var hunLv = petinfo.getHunByIndex(index);
        if (hunLv == 0) {
            if (this.canActionHunByIndex(petid, index) == true) {
                return true;
            }
            return false;
        }
        var cfg = GameGlobal.Config.BabyHunLvConfig[petinfo.suitConfigId][hunLv - 1];
        if (!cfg || !cfg.promotepiece) {
            return false;
        }
        if (cfg.promotepiece.count <= 0) {
            return false;
        }
        var id = cfg.promotepiece.id;
        var count = GameGlobal.UserBag.GetCount(id);
        if (count >= cfg.promotepiece.count) {
            return true;
        }
        return false;
    };
    LingtongPetModel.prototype.getCurrentHunAllAttr = function (petid) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var index;
        var len = LingtongPetModel.MAX_HUN_NUM;
        var attrs = [];
        for (index = 1; index <= len; index++) {
            var lv = petinfo.getHunByIndex(index);
            if (lv == 0) {
                var data = LingtongConst.GetHunAttr(petinfo.suitConfigId, index, 1);
                attrs.push({ type: data.type, value: 0 });
                continue;
            }
            attrs.push(LingtongConst.GetHunAttr(petinfo.suitConfigId, index, lv));
        }
        return attrs;
    };
    LingtongPetModel.prototype.IsRedPointUpHuns = function (petInfo, index) {
        if (!petInfo) {
            return false;
        }
        var huns = petInfo.mHun;
        var i = index ? index - 1 : 0;
        var len = index ? index : huns.length;
        for (i; i < len; i++) {
            // let lv = huns[i];
            if (this.canUpgradeHunByIndex(petInfo.getId(), i + 1))
                return true;
        }
        return false;
    };
    LingtongPetModel.prototype.IsRedPointSmelt = function () {
        return false;
    };
    LingtongPetModel.prototype.getHunAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = petinfo.getHunByIndex(index);
        if (lv == 0) {
            return null;
        }
        var attrList = [];
        attrList.push(LingtongConst.GetHunAttr(petinfo.suitConfigId, index, lv));
        return attrList;
    };
    LingtongPetModel.prototype.getHunNextAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = petinfo.getHunByIndex(index);
        if (lv == LingtongPetModel.MAX_HUN_LEVEL) {
            return null;
        }
        var attrList = [];
        attrList.push(LingtongConst.GetHunAttr(petinfo.suitConfigId, index, lv + 1));
        return attrList;
    };
    LingtongPetModel.prototype.getHunTopAttrByIndex = function (petid, index) {
        var petinfo = this.GetInfo(petid);
        if (petinfo == null) {
            return null;
        }
        var lv = LingtongPetModel.MAX_HUN_LEVEL;
        var attrList = [];
        attrList.push(LingtongConst.GetHunAttr(petinfo.suitConfigId, index, lv));
        return attrList;
    };
    LingtongPetModel.prototype.GetList = function () {
        var list = [];
        for (var key in this.mInfo) {
            list.push(this.mInfo[key]);
        }
        return list;
    };
    LingtongPetModel.MAX_LEVEL = 20;
    LingtongPetModel.MAX_Ling_LEVEL = 5;
    LingtongPetModel.MAX_SUIT_LEVEL_ID = 6;
    LingtongPetModel.MAX_HUN_NUM = 6;
    LingtongPetModel.MAX_HUN_LEVEL = 50;
    LingtongPetModel.HUN_ATTR_NAME = ["hp", "atk", "def", "res", "critharm", "touchhurt"];
    LingtongPetModel.INIT_INFO = false;
    return LingtongPetModel;
}(BaseSystem));
__reflect(LingtongPetModel.prototype, "LingtongPetModel");
// class LingtongPetRedPoint extends IRedPoint {
// 	protected OnChange(index: number) {
//         GameGlobal.MessageCenter.dispatch(MessageDef.RP_LINGTONG)
// 	}
// } 
//# sourceMappingURL=LingtongPetModel.js.map