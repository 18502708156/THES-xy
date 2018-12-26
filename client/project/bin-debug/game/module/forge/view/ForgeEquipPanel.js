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
var ForgeEquipPanel = (function (_super) {
    __extends(ForgeEquipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ForgeEquipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ForgeEquipSkin";
        return _this;
    }
    // 引导对象
    ForgeEquipPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.mContext.equipComp.onKeyBtn,
            _a;
        var _a;
    };
    ForgeEquipPanel.prototype.UpdateSel = function (index) {
        _super.prototype.UpdateSel.call(this, index);
        var role = GameGlobal.SubRoles.GetRoleData();
        var equipData = role.getEquipByIndex(index);
        var val = this.GetForgeValue(equipData);
        if (val) {
            var config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgeType);
            this.text_1.textFlow = AttributeData.GetAttrTabString(config.attr, "\n");
        }
        else {
            this.text_1.text = "未激活";
        }
        var nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgeType);
        if (nextConfig) {
            this.text_2.textFlow = AttributeData.GetAttrTabString(nextConfig.attr, "\n");
        }
        var isFull = !nextConfig ? true : false;
        UIHelper.SetVisible(this.arrowImg, !isFull);
        UIHelper.SetVisible(this.text_2, !isFull);
    };
    return ForgeEquipPanel;
}(ForgePanel));
__reflect(ForgeEquipPanel.prototype, "ForgeEquipPanel");
var ForgeqhPanel = (function (_super) {
    __extends(ForgeqhPanel, _super);
    function ForgeqhPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mForgeType = ForgeType.BOOST;
        return _this;
    }
    ForgeqhPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.equipComp.onKeyBtn.label = "一键强化";
        this.equipComp.masterBtn.masterBtn.icon = "ui_bt_qhds";
        UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel, "获取银两");
    };
    ForgeqhPanel.prototype.GetForgeValue = function (data) {
        return data.strengthen;
    };
    ForgeqhPanel.RedPointCheck = function () {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_BOOST);
    };
    ForgeqhPanel.NAME = "强化";
    return ForgeqhPanel;
}(ForgeEquipPanel));
__reflect(ForgeqhPanel.prototype, "ForgeqhPanel");
var ForgejlPanel = (function (_super) {
    __extends(ForgejlPanel, _super);
    function ForgejlPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mForgeType = ForgeType.REFINE;
        return _this;
    }
    ForgejlPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.equipComp.onKeyBtn.label = "一键精炼";
        this.equipComp.masterBtn.masterBtn.icon = "ui_bt_jlds";
    };
    ForgejlPanel.prototype.GetForgeValue = function (data) {
        return data.refine;
    };
    ForgejlPanel.RedPointCheck = function () {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_REFINE);
    };
    ForgejlPanel.NAME = "精炼";
    return ForgejlPanel;
}(ForgeEquipPanel));
__reflect(ForgejlPanel.prototype, "ForgejlPanel");
var ForgedlPanel = (function (_super) {
    __extends(ForgedlPanel, _super);
    function ForgedlPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mForgeType = ForgeType.EXERCISE;
        return _this;
    }
    ForgedlPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.equipComp.onKeyBtn.label = "一键锻炼";
        this.equipComp.masterBtn.masterBtn.icon = "ui_bt_dlds";
    };
    ForgedlPanel.prototype.GetForgeValue = function (data) {
        return data.exercise;
    };
    ForgedlPanel.prototype.GetConsumeTypeId = function () {
        return 200002;
    };
    ForgedlPanel.RedPointCheck = function () {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_EXERCISE);
    };
    ForgedlPanel.NAME = "锻炼";
    return ForgedlPanel;
}(ForgeEquipPanel));
__reflect(ForgedlPanel.prototype, "ForgedlPanel");
//# sourceMappingURL=ForgeEquipPanel.js.map