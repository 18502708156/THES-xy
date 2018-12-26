var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FormationInfo = (function () {
    function FormationInfo() {
    }
    FormationInfo.prototype.UpdateInfo = function (info) {
        this.mFormationId = info.no;
        this.mSkillId = info.skillNo;
        this.mLevel = info.lv;
        this.mUpNum = info.upNum;
        this.mSoulLv = info.soulLv;
        this.mSoulUpNum = info.soulUpNum;
    };
    FormationInfo.prototype.UpdateExp = function (info) {
        this.mLevel = info.lv;
        this.mUpNum = info.upNum;
    };
    FormationInfo.prototype.UpdateSoulExp = function (info) {
        this.mSoulLv = info.soulLv;
        this.mSoulUpNum = info.soulUpNum;
    };
    return FormationInfo;
}());
__reflect(FormationInfo.prototype, "FormationInfo");
//# sourceMappingURL=FormationInfo.js.map