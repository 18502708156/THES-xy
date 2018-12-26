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
var EntityTiannv = (function (_super) {
    __extends(EntityTiannv, _super);
    function EntityTiannv() {
        return _super.call(this) || this;
    }
    EntityTiannv.prototype.parserBase = function (baseData) {
        _super.prototype.parserBase.call(this, baseData);
        if (!baseData.shows.shows) {
            return;
        }
        this.mBodyId = baseData.shows.shows[0];
        if (baseData.shows && baseData.shows.shows) {
            this.mLq = UserTemplate.GetAppaId(GameGlobal.HavingLingqModel.SkinConfig, baseData.shows.shows[RoleShowDataType.TIANNV_LQ]);
            this.mHua = UserTemplate.GetAppaId(GameGlobal.HavingHuanModel.SkinConfig, baseData.shows.shows[RoleShowDataType.TIANNV_HUA]);
        }
    };
    EntityTiannv.prototype.GetSkillIDs = function () {
        return this.skillsData;
    };
    EntityTiannv.prototype.GetBodyId = function () {
        if (this.mBodyId) {
            var config = GameGlobal.Config.FemaleDevaSkinConfig[this.mBodyId];
            if (config) {
                return config.pid;
            }
        }
        return 0;
    };
    EntityTiannv.prototype.GetName = function () {
        return GameGlobal.Config.FemaleDevaBaseConfig.name || "";
    };
    return EntityTiannv;
}(EntityData));
__reflect(EntityTiannv.prototype, "EntityTiannv");
//# sourceMappingURL=EntityTiannv.js.map