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
var FormationModelRedPoint = (function (_super) {
    __extends(FormationModelRedPoint, _super);
    function FormationModelRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.mActiveMap = {};
        _this.mLevelMap = {};
        _this.mSoulMap = {};
        _this.mSkillMap = {};
        _this.mModel = model;
        return _this;
    }
    FormationModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[FormationModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a[FormationModelRedPoint.INDEX_LEVEL] = this.GetIndexLevel,
            _a[FormationModelRedPoint.INDEX_SOUL] = this.GetIndexSoul,
            _a[FormationModelRedPoint.INDEX_SKILL] = this.GetIndexSkill,
            _a[FormationModelRedPoint.INDEX_DRUG] = this.GetIndexDrug,
            _a;
        var _a;
    };
    FormationModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.FORMATION_ACTIVE, MessageDef.FORMATION_UPDATE_INFO,
            MessageDef.FORMATION_UPDATE_EXP, MessageDef.FORMATION_UPDATE_SOUL_EXP,
            MessageDef.FORMATION_USE_DRUG, MessageDef.FORMATION_UPDATE_SKILL_INFO];
    };
    FormationModelRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.FORMATION_ALL_NOTICE);
    };
    FormationModelRedPoint.prototype.GetIndexLevel = function () {
        this.mLevelMap = {};
        for (var key in GameGlobal.Config.FormationListConfig) {
            var formationId = parseInt(key);
            if (this.mModel.IsMaxLv(formationId))
                continue;
            if (this.mModel.HasFormation(formationId) && this.mModel.CanFormationUpgrade(formationId))
                this.mLevelMap[formationId] = true;
        }
        for (var key in this.mLevelMap)
            return true;
        return false;
    };
    FormationModelRedPoint.prototype.GetIndexSoul = function () {
        this.mSoulMap = {};
        for (var key in GameGlobal.Config.FormationListConfig) {
            var formationId = parseInt(key);
            if (this.mModel.IsMaxSoulLv(formationId))
                continue;
            if (this.mModel.HasFormation(formationId) && this.mModel.CanFormationSoulUpgrade(formationId))
                this.mSoulMap[formationId] = true;
        }
        for (var key in this.mSoulMap)
            return true;
        return false;
    };
    FormationModelRedPoint.prototype.GetIndexSkill = function () {
        this.mSkillMap = {};
        for (var key in GameGlobal.Config.FormationListConfig) {
            var formationId = parseInt(key);
            if (!FormationConst.HasBuffSkill(formationId))
                continue;
            var skillId = FormationConst.GetSkillId(formationId);
            if (FormationConst.IsMaxSkillLv(skillId))
                continue;
            if (this.mModel.HasFormation(formationId) && this.mModel.CanSkillUpgrade(skillId))
                this.mSkillMap[formationId] = true;
        }
        for (var key in this.mSkillMap)
            return true;
        return false;
    };
    FormationModelRedPoint.prototype.GetIndexDrug = function () {
        var drugId = GameGlobal.Config.FormationBaseConfig.attreitemid;
        this.mDrug = GameGlobal.UserBag.GetCount(drugId) > 0;
        return this.mDrug;
    };
    FormationModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.mActiveMap) {
            return true;
        }
        return false;
    };
    FormationModelRedPoint.prototype.DoActive = function () {
        this.mActiveMap = {};
        for (var key in GameGlobal.Config.FormationListConfig) {
            var formationId = parseInt(key);
            if (this.mModel.HasFormation(formationId))
                continue;
            var config = GameGlobal.Config.FormationListConfig[formationId];
            if (GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count)
                this.mActiveMap[formationId] = true;
        }
    };
    FormationModelRedPoint.prototype.IsRedAct = function (formationId) {
        this.Get(FormationModelRedPoint.INDEX_ACT);
        return this.mActiveMap[formationId] == true;
    };
    FormationModelRedPoint.prototype.IsRedLevel = function (formationId) {
        this.Get(FormationModelRedPoint.INDEX_LEVEL);
        return this.mLevelMap[formationId] == true;
    };
    FormationModelRedPoint.prototype.IsRedSoul = function (formationId) {
        this.Get(FormationModelRedPoint.INDEX_SOUL);
        return this.mSoulMap[formationId] == true;
    };
    FormationModelRedPoint.prototype.IsRedSkill = function (formationId) {
        this.Get(FormationModelRedPoint.INDEX_SKILL);
        return this.mSkillMap[formationId] == true;
    };
    FormationModelRedPoint.prototype.IsRedDrug = function (formationId) {
        this.Get(FormationModelRedPoint.INDEX_DRUG);
        return this.mDrug;
    };
    FormationModelRedPoint.INDEX_ACT = 0;
    FormationModelRedPoint.INDEX_LEVEL = 1;
    FormationModelRedPoint.INDEX_SOUL = 2;
    FormationModelRedPoint.INDEX_SKILL = 3;
    FormationModelRedPoint.INDEX_DRUG = 4;
    return FormationModelRedPoint;
}(IRedPoint));
__reflect(FormationModelRedPoint.prototype, "FormationModelRedPoint");
//# sourceMappingURL=FormationModelRedPoint.js.map