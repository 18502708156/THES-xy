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
var EntityPet = (function (_super) {
    __extends(EntityPet, _super);
    function EntityPet() {
        var _this = _super.call(this) || this;
        _this.mTlId = 0;
        _this.mShId = 0;
        return _this;
    }
    EntityPet.prototype.parserBase = function (baseData) {
        _super.prototype.parserBase.call(this, baseData);
        this.configID = baseData.shows.id;
        if (baseData.shows && baseData.shows.shows) {
            this.mTlId = UserTemplate.GetAppaId(GameGlobal.PetTonglModel.SkinConfig, baseData.shows.shows[RoleShowDataType.PET_TL]);
            this.mShId = UserTemplate.GetAppaId(GameGlobal.PetShouhModel.SkinConfig, baseData.shows.shows[RoleShowDataType.PET_SH]);
        }
    };
    EntityPet.prototype.GetSkillIDs = function () {
        var config = GameGlobal.Config.petBiographyConfig[this.configID];
        if (config) {
            return config.skill;
        }
        return _super.prototype.GetSkillIDs.call(this);
    };
    EntityPet.prototype.GetBodyId = function () {
        return this.configID;
    };
    EntityPet.prototype.GetName = function () {
        return this.entityName || "";
    };
    return EntityPet;
}(EntityData));
__reflect(EntityPet.prototype, "EntityPet");
//# sourceMappingURL=EntityPet.js.map