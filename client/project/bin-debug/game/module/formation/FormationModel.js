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
var FormationModel = (function (_super) {
    __extends(FormationModel, _super);
    function FormationModel() {
        var _this = _super.call(this) || this;
        _this.MAX_LEVEL = 10;
        _this.MAX_SOUL_LEVEL = 10;
        _this.mFormationMap = {};
        _this.mRedPoint = new FormationModelRedPoint(_this);
        _this.regNetMsg(S2cProtocol.sc_formation_info, _this._DoInitInfo);
        return _this;
    }
    FormationModel.prototype.Init = function () {
    };
    Object.defineProperty(FormationModel.prototype, "useDrugNum", {
        get: function () {
            return this.mUseDrugNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormationModel.prototype, "usedFomationId", {
        get: function () {
            return this.mUsedFormationId;
        },
        enumerable: true,
        configurable: true
    });
    FormationModel.prototype._DoInitInfo = function (rsp) {
        this.mUsedFormationId = rsp.use;
        this.mUseDrugNum = rsp.drugNum;
        for (var _i = 0, _a = rsp.infoList; _i < _a.length; _i++) {
            var data = _a[_i];
            var formationInfo = this.mFormationMap[data.no];
            if (!formationInfo) {
                formationInfo = new FormationInfo;
                this.mFormationMap[data.no] = formationInfo;
            }
            formationInfo.UpdateInfo(data);
        }
    };
    FormationModel.prototype.SendActiveFormation = function (formationId) {
        var _this = this;
        var req = new Sproto.cs_formation_activation_request;
        req.no = formationId;
        this.Rpc(C2sProtocol.cs_formation_activation, req, function (rsp) {
            var formationInfo = new FormationInfo;
            formationInfo.UpdateInfo(rsp);
            _this.mFormationMap[rsp.no] = formationInfo;
            GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_ACTIVE);
            GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_INFO);
        }, this);
    };
    FormationModel.prototype.SendUseDrug = function (drugNum) {
        var _this = this;
        var req = new Sproto.cs_formation_drug_request;
        req.useNum = drugNum;
        this.Rpc(C2sProtocol.cs_formation_drug, req, function (rsp) {
            if (rsp.ret) {
                _this.mUseDrugNum = rsp.drugNum;
                GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_USE_DRUG);
            }
        }, this);
    };
    FormationModel.prototype.SendUpgradeFormation = function (formationId, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_formation_add_exp_request;
        req.no = formationId;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_formation_add_exp, req, function (rsp) {
            if (rsp.ret) {
                var formationInfo = _this.mFormationMap[rsp.no];
                formationInfo.UpdateExp(rsp);
                GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_EXP);
            }
        }, this);
    };
    FormationModel.prototype.SendUpgradeFormationSoul = function (formationId, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_formation_soul_add_exp_request;
        req.no = formationId;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_formation_soul_add_exp, req, function (rsp) {
            if (rsp.ret) {
                var formationInfo = _this.mFormationMap[rsp.no];
                formationInfo.UpdateSoulExp(rsp);
                GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_SOUL_EXP);
            }
        }, this);
    };
    FormationModel.prototype.SendUseFormation = function (formationId) {
        var _this = this;
        var req = new Sproto.cs_formation_use_request;
        req.no = formationId;
        this.Rpc(C2sProtocol.cs_formation_use, req, function (rsp) {
            if (rsp.ret) {
                _this.mUsedFormationId = rsp.use;
                GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_INFO);
            }
        }, this);
    };
    FormationModel.prototype.SendUpgradeSkill = function (formationId) {
        var _this = this;
        var req = new Sproto.cs_formation_skill_up_request;
        req.no = formationId;
        this.Rpc(C2sProtocol.cs_formation_skill_up, req, function (rsp) {
            if (rsp.ret) {
                var formationInfo = _this.mFormationMap[formationId];
                formationInfo.mSkillId = rsp.skillNo;
                GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_UPDATE_SKILL_INFO);
            }
        }, this);
    };
    FormationModel.prototype.GetFormationInfo = function (formationId) {
        return this.mFormationMap[formationId];
    };
    FormationModel.prototype.GetSkillId = function (formationId) {
        var formationInfo = this.mFormationMap[formationId];
        if (!formationInfo) {
            return FormationConst.GetSkillId(formationId);
        }
        return formationInfo.mSkillId;
    };
    FormationModel.prototype.HasFormation = function (formationId) {
        return this.mFormationMap[formationId] != null;
    };
    FormationModel.prototype.IsUsed = function (formationId) {
        return this.mUsedFormationId == formationId;
    };
    FormationModel.prototype.IsMaxLv = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        if (!formationInfo)
            return false;
        return formationInfo.mLevel >= this.MAX_LEVEL;
    };
    FormationModel.prototype.IsMaxSoulLv = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        if (!formationInfo)
            return false;
        return formationInfo.mSoulLv >= this.MAX_SOUL_LEVEL;
    };
    FormationModel.prototype.GetCurDrugAttr = function () {
        var attr = CommonUtils.copyDataHandler(GameGlobal.Config.FormationBaseConfig.attredata);
        var drugNum = this.mUseDrugNum;
        for (var k in attr) {
            attr[k].value *= drugNum;
        }
        return attr;
    };
    FormationModel.prototype.GetCurSoulAttr = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        if (!formationInfo)
            return FormationConst.GetFormationSoulAttr(formationId, 1, 0);
        return FormationConst.GetFormationSoulAttr(formationId, formationInfo.mSoulLv, formationInfo.mSoulUpNum);
    };
    FormationModel.prototype.GetCurAttr = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        if (!formationInfo)
            return FormationConst.GetFormationBaseAttr(formationId, 1);
        return FormationConst.GetFormationAttr(formationId, formationInfo.mLevel, formationInfo.mUpNum);
    };
    FormationModel.prototype.GetAllAttr = function () {
        var attrMap = {};
        for (var formationId in this.mFormationMap) {
            var id = parseInt(formationId);
            var attrs_1 = this.GetCurAttr(id);
            for (var _i = 0, attrs_2 = attrs_1; _i < attrs_2.length; _i++) {
                var attr = attrs_2[_i];
                attrMap[attr.type] = attrMap[attr.type] || 0;
                attrMap[attr.type] += attr.value;
            }
        }
        var attrs = [];
        for (var attrType in attrMap) {
            attrs.push({ type: parseInt(attrType), value: attrMap[attrType] });
        }
        return attrs;
    };
    FormationModel.prototype.GetAllSoulAttr = function () {
        var attrMap = {};
        for (var formationId in this.mFormationMap) {
            var id = parseInt(formationId);
            var attrs_3 = this.GetCurSoulAttr(id);
            for (var _i = 0, attrs_4 = attrs_3; _i < attrs_4.length; _i++) {
                var attr = attrs_4[_i];
                attrMap[attr.type] = attrMap[attr.type] || 0;
                attrMap[attr.type] += attr.value;
            }
        }
        var attrs = [];
        for (var attrType in attrMap) {
            attrs.push({ type: parseInt(attrType), value: attrMap[attrType] });
        }
        return attrs;
    };
    FormationModel.prototype.GetAllPower = function () {
        var power = 0;
        for (var id in this.mFormationMap) {
            power += this.GetPower(parseInt(id));
        }
        power += ItemConfig.CalcAttrScoreValue(this.GetCurDrugAttr());
        return power;
    };
    FormationModel.prototype.GetPower = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        if (!formationInfo)
            return FormationConst.GetPower(formationId);
        var power = 0;
        power += ItemConfig.CalcAttrScoreValue(this.GetCurAttr(formationId));
        power += ItemConfig.CalcAttrScoreValue(this.GetCurSoulAttr(formationId));
        var skillId = formationInfo.mSkillId;
        if (skillId && skillId != 0) {
            var config = GameGlobal.Config.EffectsConfig[skillId];
            if (config)
                power += config[GameGlobal.Config.EffectsConfig_keys.skillpower] || 0;
        }
        return power;
    };
    FormationModel.prototype.CanFormationUpgrade = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        var levelConfig = FormationConst.GetFormationLevelConfig(formationId, formationInfo.mLevel);
        if (!levelConfig)
            return false;
        for (var _i = 0, _a = levelConfig.cost; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!Checker.Data(data, false)) {
                return false;
            }
        }
        return true;
    };
    FormationModel.prototype.CanFormationSoulUpgrade = function (formationId) {
        var formationInfo = this.GetFormationInfo(formationId);
        var soulConfig = FormationConst.GetFormationSoulConfig(formationId, formationInfo.mSoulLv);
        if (!soulConfig)
            return false;
        return Checker.Data(soulConfig.cost, false);
    };
    FormationModel.prototype.CanSkillUpgrade = function (skillId) {
        var cost = FormationConst.GetSkillUpgradeCost(skillId);
        if (!cost)
            return false;
        return Checker.Data(cost, false);
    };
    return FormationModel;
}(BaseSystem));
__reflect(FormationModel.prototype, "FormationModel");
//# sourceMappingURL=FormationModel.js.map