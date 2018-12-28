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
        _this.mName = "";
        _this.mBuffSkill = [];
        _this.giftexp = 0;
        _this.giftlv = 0;
        _this.mXilian = 0;
        _this.mXilianSkill = [];
        _this.mSex = 0;
        _this.MAX_GIFT_LEVEL = 5;
        _this.mRedPoint = new LingtongAttrRedPoint;
        _this.regNetMsg(S2cProtocol.sc_baby_init, _this._DoInit);
        return _this;
    }
    LingtongAttrModel.prototype.Init = function () {
        _super.prototype.Init.call(this);
        this.MAX_GIFT_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.BabyTalentConfig[1]);
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.BabyTalentConfig[1][0].cost[0].id, MessageDef.LINGTONG_RANK_ITEM);
        for (var _i = 0, _a = GameGlobal.Config.BabyBasisConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.LINGTONG_SKILL_ITEM);
        }
    };
    LingtongAttrModel.prototype._DoInit = function (rsp) {
        this.mName = rsp.name || "";
        this.mBuffSkill = rsp.buffs || [];
        this.giftexp = rsp.giftexp || 0;
        this.giftlv = rsp.giftlv || 0;
        this.mXilian = rsp.xilian || 0;
        this.mXilianSkill = rsp.xilianSkills || [];
        this.mSex = rsp.sex || 1;
        GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
    };
    LingtongAttrModel.prototype.SendActive = function (sex) {
        var _this = this;
        var req = new Sproto.cs_baby_active_request;
        req.sex = sex;
        this.Rpc(C2sProtocol.cs_baby_active, req, function (rsp) {
            if (rsp.ret) {
                _this.mSex = sex;
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
                UserTips.InfoTip("激活成功");
            }
        });
    };
    LingtongAttrModel.prototype.SendAddGift = function () {
        var _this = this;
        this.Rpc(C2sProtocol.cs_baby_addgift, null, function (rsp) {
            if (rsp.ret) {
                _this.giftexp = rsp.exp;
                _this.giftlv = rsp.level;
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_GIFT_INFO);
            }
        });
    };
    LingtongAttrModel.prototype.SendRename = function (name) {
        var _this = this;
        var req = new Sproto.cs_baby_rename_request;
        req.name = name;
        this.Rpc(C2sProtocol.cs_baby_rename, req, function (rsp) {
            if (rsp.ret) {
                _this.mName = rsp.name;
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
            }
            else
                GameGlobal.UserTips.showTips("输入的名称含有敏感字");
        });
    };
    LingtongAttrModel.prototype.SendRefreshSkill = function (lockList, type, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_baby_refreshskill_request;
        req.locklist = lockList;
        req.type = type;
        req.autoBuy = autoBuy ? 2 : 0;
        this.Rpc(C2sProtocol.cs_baby_refreshskill, req, function (rsp) {
            if (rsp.ret) {
                _this.mXilian = rsp.xilian;
                _this.mXilianSkill = rsp.xilianSkills;
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
            }
        }, this);
    };
    LingtongAttrModel.prototype.SendSetSkill = function () {
        var _this = this;
        var req = new Sproto.cs_baby_setskillin_request;
        this.Rpc(C2sProtocol.cs_baby_setskillin, req, function (rsp) {
            if (rsp.ret) {
                _this.mBuffSkill = rsp.buffs;
                _this.mXilianSkill = [];
                GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO);
            }
        }, this);
    };
    LingtongAttrModel.prototype.GetSkillId = function () {
        if (this.giftlv) {
            var config_1 = GameGlobal.Config.BabyTalentConfig[this.mSex][this.giftlv - 1];
            if (config_1) {
                return config_1.skill;
            }
        }
        var config = GameGlobal.Config.BabyActivationConfig[this.mSex || 1];
        return config.skill[0];
    };
    LingtongAttrModel.prototype.GetNextSkillId = function () {
        if (this.giftlv) {
            var config_2 = GameGlobal.Config.BabyTalentConfig[this.mSex][this.giftlv];
            if (config_2) {
                return config_2.skill;
            }
        }
        var config = GameGlobal.Config.BabyActivationConfig[this.mSex || 1];
        return config.skill[0];
    };
    LingtongAttrModel.prototype.IsActive = function () {
        // return this.giftlv ? true : false
        return this.mSex == 1 || this.mSex == 2;
    };
    LingtongAttrModel.prototype.GetCurSkill = function () {
        var config = GameGlobal.Config.BabyActivationConfig[this.mSex];
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
    LingtongAttrModel.prototype.getTianFuAllAttr = function () {
        var exp = this.giftexp;
        var lv = this.giftlv;
        var cfgArr = GameGlobal.Config.BabyTalentConfig[this.mSex];
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