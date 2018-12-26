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
var LingtongAttrModel = (function (_super) {
    __extends(LingtongAttrModel, _super);
    function LingtongAttrModel() {
        var _this = _super.call(this) || this;
        _this.mRedPoint = new LingtongAttrRedPoint;
        return _this;
    }
    LingtongAttrModel.prototype.Init = function () {
        _super.prototype.Init.call(this);
        for (var key in GameGlobal.Config.BabyActivationConfig) {
            var configData = GameGlobal.Config.BabyActivationConfig[key];
            var data = configData.material;
            GameGlobal.UserBag.AddListenerItem(data.id, MessageDef.LINGTONG_ACT_ITEM);
            GameGlobal.UserBag.AddListenerItem(configData.compose.id, MessageDef.LINGTONG_ACT_ITEM);
        }
        for (var key in GameGlobal.Config.BabyLvproConfig) {
            var data = GameGlobal.Config.BabyLvproConfig[key].cost[0];
            GameGlobal.UserBag.AddListenerItem(data.id, MessageDef.LINGTONG_LEVEL_ITEM);
            break;
        }
        var dict = {};
        for (var key in GameGlobal.Config.BabyHunActConfig) {
            for (var key2 in GameGlobal.Config.BabyHunActConfig[key]) {
                var id = GameGlobal.Config.BabyHunActConfig[key][key2].hunAct.id;
                if (!dict[id]) {
                    dict[id] = true;
                    GameGlobal.UserBag.AddListenerItem(id, MessageDef.LINGTONG_YU_HUN_ITEM);
                }
            }
            break;
        }
        for (var key in GameGlobal.Config.BabyHunLvConfig) {
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.BabyHunLvConfig[key][0].promotepiece.id, MessageDef.LINGTONG_YU_HUN_ITEM);
        }
        for (var key in GameGlobal.Config.BabyTalentConfig) {
            var data = GameGlobal.Config.BabyTalentConfig[key][0];
            GameGlobal.UserBag.AddListenerItem(data.cost[0].id, MessageDef.LINGTONG_RANK_ITEM);
        }
        for (var _i = 0, _a = GameGlobal.Config.BabyBasisConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.LINGTONG_SKILL_ITEM);
        }
    };
    LingtongAttrModel.prototype.SendAddGift = function (id) {
        var req = new Sproto.cs_baby_addgift_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_baby_addgift, req, function (rsp) {
            if (rsp.ret) {
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_GIFT_INFO);
            }
        });
    };
    LingtongAttrModel.prototype.SendRename = function (id, name) {
        var req = new Sproto.cs_baby_rename_request;
        req.id = id;
        req.name = name;
        this.Rpc(C2sProtocol.cs_baby_rename, req, function (rsp) {
            if (rsp.ret) {
                var info = GameGlobal.LingtongPetModel.GetInfo(rsp.id);
                if (info) {
                    info.mName = rsp.name;
                    GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
                }
            }
            else
                GameGlobal.UserTips.showTips("输入的名称含有敏感字");
        });
    };
    LingtongAttrModel.prototype.SendRefreshSkill = function (id, lockList, type, autoBuy) {
        var req = new Sproto.cs_baby_refreshskill_request;
        req.id = id;
        req.locklist = lockList;
        req.type = type;
        req.autoBuy = autoBuy ? 2 : 0;
        this.Rpc(C2sProtocol.cs_baby_refreshskill, req, function (rsp) {
            if (rsp.ret) {
                var info = GameGlobal.LingtongPetModel.GetInfo(rsp.id);
                if (info) {
                    info.mXilian = rsp.xilian;
                    info.mXilianSkills = rsp.xilianSkills;
                    GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
                }
            }
        }, this);
    };
    LingtongAttrModel.prototype.SendSetSkill = function (id) {
        var req = new Sproto.cs_baby_setskillin_request;
        req.id = id;
        this.Rpc(C2sProtocol.cs_baby_setskillin, req, function (rsp) {
            if (rsp.ret) {
                var info = GameGlobal.LingtongPetModel.GetInfo(rsp.id);
                if (info) {
                    info.mBuffs = rsp.buffs;
                    info.mXilianSkills = [];
                    GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
                }
            }
        }, this);
    };
    LingtongAttrModel.prototype.GetSkillId = function (id, giftlv) {
        if (giftlv) {
            var config_1 = GameGlobal.Config.BabyTalentConfig[id][giftlv - 1];
            if (config_1) {
                return config_1.skill;
            }
        }
        var config = GameGlobal.Config.BabyActivationConfig[id];
        if (config) {
            return config.skill[0];
        }
        return 0;
    };
    LingtongAttrModel.prototype.GetNextSkillId = function (id, giftlv) {
        if (giftlv) {
            var config_2 = GameGlobal.Config.BabyTalentConfig[id][giftlv];
            if (config_2) {
                return config_2.skill;
            }
        }
        var config = GameGlobal.Config.BabyActivationConfig[id];
        if (config) {
            return config.skill[0];
        }
        return 0;
    };
    LingtongAttrModel.prototype.GetCurSkill = function (id) {
        var config = GameGlobal.Config.BabyActivationConfig[id];
        if (config) {
            return config.skill;
        }
        return [];
    };
    LingtongAttrModel.prototype.IsRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_116, true)) {
            return false;
        }
        return GameGlobal.LingtongModel.mRedPoint.IsRedPoint() || this.mRedPoint.IsRedPoint();
    };
    LingtongAttrModel.prototype.getTianFuAllAttr = function (id, giftlv, giftExp) {
        var exp = giftExp;
        var lv = giftlv;
        if (!lv) {
            return [];
        }
        var cfgArr = GameGlobal.Config.BabyTalentConfig[id];
        if (!cfgArr) {
            return [];
        }
        var i;
        var len = Math.min(cfgArr.length, lv);
        var attrs = [];
        for (i = 0; i < len; i++) {
            var cfgObj = cfgArr[i];
            var j = void 0;
            var jLen = void 0;
            if (cfgObj.level < lv) {
                jLen = cfgObj.upnum || (cfgObj.proexp / cfgObj.exp);
            }
            else if (cfgObj.level == lv) {
                jLen = exp;
            }
            for (j = 0; j < jLen; j++) {
                attrs = AttributeData.AttrAddition(attrs, cfgObj.attrs);
            }
        }
        if (attrs.length == 0) {
            attrs = CommonUtils.copyDataHandler(cfgArr[0].attrs);
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var data = attrs_1[_i];
                data.value = 0;
            }
        }
        return attrs;
    };
    return LingtongAttrModel;
}(BaseSystem));
__reflect(LingtongAttrModel.prototype, "LingtongAttrModel");
//# sourceMappingURL=LingtongAttrModel.js.map