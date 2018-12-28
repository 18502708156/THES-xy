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
var EntityLingtong = (function (_super) {
    __extends(EntityLingtong, _super);
    function EntityLingtong() {
        return _super.call(this) || this;
    }
    EntityLingtong.prototype.parserBase = function (baseData) {
        _super.prototype.parserBase.call(this, baseData);
        this.configID = this.mSex = baseData.shows.id;
    };
    EntityLingtong.prototype.GetSkillIDs = function () {
        return this.skillsData;
    };
    EntityLingtong.prototype.GetBodyId = function () {
        if (this.mSex) {
            var config = GameGlobal.Config.BabySkinConfig[1];
            if (config) {
                return config.pid;
            }
        }
        return 0;
    };
    EntityLingtong.prototype.GetName = function () {
        var config = GameGlobal.Config.BabyActivationConfig[this.mSex];
        if (config) {
            return config.name;
        }
        return "";
    };
    EntityLingtong.prototype.GetBodyResPath = function () {
        return AppearanceConfig.GetAppe(this.GetBodyId(), 1, this.mSex - 1);
    };
    return EntityLingtong;
}(EntityData));
__reflect(EntityLingtong.prototype, "EntityLingtong");
//# sourceMappingURL=EntityLingtong.js.map