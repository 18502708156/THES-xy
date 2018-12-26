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
var RoleSuitTipPanel = (function (_super) {
    __extends(RoleSuitTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RoleSuitTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "RoleSuitTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    RoleSuitTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var config = GameGlobal.Config.RoleSuitConfig;
        var curLevel = this.getSuitLevel(config);
        var addPower = null;
        if (curLevel) {
            this.activeLabel2.visible = false;
            this.curTipLabel.text = config[curLevel].des;
            this.curLabel.text = AttributeData.getAttStr(config[curLevel].attrs, 0);
            if (config[curLevel + 1]) {
                this.currentState = "active";
                this.nextTipLabel.text = config[curLevel + 1].des;
                this.nextLabel.text = AttributeData.getAttStr(config[curLevel + 1].attrs, 0);
                addPower = ItemConfig.CalcAttrScoreValue(config[curLevel + 1].attrs) - ItemConfig.CalcAttrScoreValue(config[curLevel].attrs);
            }
            else {
                this.currentState = "full";
            }
        }
        else {
            this.activeLabel2.visible = true;
            this.nextTipLabel.text = config[1].des;
            this.currentState = "none";
            this.nextLabel.text = AttributeData.getAttStr(config[1].attrs, 0);
            addPower = ItemConfig.CalcAttrScoreValue(config[1].attrs);
        }
        if (addPower != null) {
            this.effLabel.text = "可提升" + addPower + "战力";
        }
        else {
            this.effLabel.text = "";
        }
    };
    RoleSuitTipPanel.prototype.getSuitLevel = function (config) {
        var role = SubRoles.ins().GetRoleData();
        var len = role.getEquipLen();
        var num, curLevel = 0;
        var equipData;
        for (var data in config) {
            num = 0;
            for (var i = 0; i < len; i++) {
                equipData = role.getEquipByIndex(i);
                if (equipData && equipData.item.configID) {
                    if (config[data].quality <= equipData.item.itemConfig.quality && equipData.item.itemConfig.level >= config[data].level) {
                        num++;
                    }
                }
            }
            if (num >= config[data].count) {
                curLevel = config[data].suitLv;
            }
            else
                break;
        }
        this.img.filters = curLevel ? null : Color.GetFilter();
        return curLevel;
    };
    RoleSuitTipPanel.prototype.OnClose = function () {
    };
    RoleSuitTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RoleSuitTipPanel;
}(BaseEuiView));
__reflect(RoleSuitTipPanel.prototype, "RoleSuitTipPanel");
//# sourceMappingURL=RoleSuitTipPanel.js.map