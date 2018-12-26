var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LingtongViewHelper = (function () {
    function LingtongViewHelper() {
    }
    LingtongViewHelper.SetRole = function (roleShowPanel, id, dressId) {
        if (id === void 0) { id = null; }
        if (dressId === void 0) { dressId = null; }
        roleShowPanel.SetBodyId(id);
    };
    return LingtongViewHelper;
}());
__reflect(LingtongViewHelper.prototype, "LingtongViewHelper");
//# sourceMappingURL=LingtongViewHelper.js.map