var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ForgeViewHelper = (function () {
    function ForgeViewHelper() {
    }
    ForgeViewHelper.InitItemGroup = function (equipList) {
        for (var i = 0; i < equipList.itemGroup.numChildren; i++) {
            var child = equipList.itemGroup.getChildAt(i);
            child.imgIcon.source = ResDataPath.GetEquipDefaultIcon(i);
        }
    };
    ForgeViewHelper.UpdateMasterBtn = function (forgeType, masterBtn) {
        var config = GameGlobal.ForgeModel.GetMasterConfig(forgeType);
        var role = GameGlobal.SubRoles.GetRoleData();
        var _a = role.GetMinEquipIndexAndLevel(forgeType), index = _a[0], min = _a[1];
        var curKey;
        for (var k in config) {
            if (min >= config[k].level) {
                curKey = k;
            }
        }
        var configData;
        if (curKey) {
            configData = config[curKey];
        }
        var curLevel = 0;
        if (configData) {
            masterBtn.rankLabel.visible = true;
            masterBtn.rankLabel.text = configData.suitLv + "阶";
            curLevel = configData.suitLv;
            if (config[configData.suitLv + 1]) {
                masterBtn.masterLabel.text = "(" + min + "/" + config[configData.suitLv + 1].level + ")";
            }
            else {
                masterBtn.masterLabel.text = "";
            }
            masterBtn.masterBtn.iconDisplay.filters = null;
        }
        else {
            masterBtn.masterBtn.iconDisplay.filters = Color.GetFilter();
            masterBtn.rankLabel.visible = false;
            masterBtn.masterLabel.text = "(" + min + "/" + config[1].level + ")";
        }
        var icon = "";
        if (forgeType == ForgeType.BOOST) {
            icon = "ui_bt_qhds";
        }
        else if (forgeType == ForgeType.REFINE) {
            icon = "ui_bt_jlds";
        }
        else if (forgeType == ForgeType.EXERCISE) {
            icon = "ui_bt_dlds";
        }
        else {
            icon = "ui_bt_bsds";
        }
        masterBtn.masterBtn.icon = icon;
        return curLevel;
    };
    return ForgeViewHelper;
}());
__reflect(ForgeViewHelper.prototype, "ForgeViewHelper");
//# sourceMappingURL=ForgeViewHelper.js.map