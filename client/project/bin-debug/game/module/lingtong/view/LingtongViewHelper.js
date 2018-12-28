var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LingtongViewHelper = (function () {
    function LingtongViewHelper() {
    }
    LingtongViewHelper.SetRole = function (roleShowPanel, sex, dressId) {
        if (sex === void 0) { sex = null; }
        if (dressId === void 0) { dressId = null; }
        var role = new RoleShowData;
        role.job = 1;
        if (sex == null) {
            sex = GameGlobal.LingtongAttrModel.mSex;
        }
        role.sex = sex - 1;
        if (dressId == null) {
            dressId = GameGlobal.LingtongModel.mDressId;
        }
        if (!dressId) {
            dressId = 1;
        }
        role.clothID = GameGlobal.LingtongModel.SkinConfig[dressId].pid;
        roleShowPanel.Set(RoleShowDressType.ROLE, role);
    };
    return LingtongViewHelper;
}());
__reflect(LingtongViewHelper.prototype, "LingtongViewHelper");
//# sourceMappingURL=LingtongViewHelper.js.map