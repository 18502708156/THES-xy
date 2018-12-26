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
var EntityXianlv = (function (_super) {
    __extends(EntityXianlv, _super);
    function EntityXianlv() {
        var _this = _super.call(this) || this;
        _this.mFazId = 0;
        _this.mXianwId = 0;
        return _this;
    }
    EntityXianlv.prototype.parserBase = function (baseData) {
        _super.prototype.parserBase.call(this, baseData);
        this.configID = baseData.shows.id;
        if (baseData.shows && baseData.shows.shows) {
            this.mFazId = UserTemplate.GetAppaId(GameGlobal.XianlvFzModel.SkinConfig, baseData.shows.shows[RoleShowDataType.XIANLV_FZ]);
            this.mXianwId = UserTemplate.GetAppaId(GameGlobal.XianlvXwModel.SkinConfig, baseData.shows.shows[RoleShowDataType.XIANLV_XW]);
        }
    };
    EntityXianlv.prototype.GetSkillIDs = function () {
        return this.skillsData;
    };
    EntityXianlv.prototype.GetBodyId = function () {
        return this.configID;
    };
    return EntityXianlv;
}(EntityData));
__reflect(EntityXianlv.prototype, "EntityXianlv");
//# sourceMappingURL=EntityXianlv.js.map