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
var FormationSoulPanel = (function (_super) {
    __extends(FormationSoulPanel, _super);
    function FormationSoulPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FormationSoulSkin";
        return _this;
    }
    FormationSoulPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTitle("阵魂");
        this._AddClick(this.btnInjection, this._OnCkick);
    };
    FormationSoulPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.FORMATION_UPDATE_SOUL_EXP, this.UpdateExpInfo);
        this.mFormationId = param[0];
        this.UpdateContent();
    };
    FormationSoulPanel.prototype._OnCkick = function (e) {
        this._SendUpgrade();
    };
    FormationSoulPanel.prototype._SendUpgrade = function () {
        var model = GameGlobal.FormationModel;
        var formationInfo = model.GetFormationInfo(this.mFormationId);
        var soulLevel = formationInfo.mSoulLv;
        var soulConfig = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel);
        var cost = soulConfig.cost;
        if (Checker.CheckItem(cost.id, cost.count, false))
            GameGlobal.FormationModel.SendUpgradeFormationSoul(this.mFormationId, 0);
    };
    FormationSoulPanel.prototype.UpdateExpInfo = function () {
        this.SetUpgradeInfo();
        this.SetPropInfo();
    };
    FormationSoulPanel.prototype.UpdateContent = function () {
        this.showPanel.SetBody(FormationConst.GetSkin(this.mFormationId));
        this.soulName.text = FormationConst.GetFormationName(this.mFormationId) + "阵魂属性";
        this.UpdateExpInfo();
    };
    FormationSoulPanel.prototype.SetPropInfo = function () {
        var model = GameGlobal.FormationModel;
        this.upPropGroup.visible = !model.IsMaxSoulLv(this.mFormationId);
        this.maxProp.visible = model.IsMaxSoulLv(this.mFormationId);
        var formationInfo = model.GetFormationInfo(this.mFormationId);
        var curAttr = FormationConst.GetFormationSoulAttr(this.mFormationId, formationInfo.mSoulLv, formationInfo.mSoulUpNum);
        if (model.IsMaxSoulLv(this.mFormationId)) {
            this.maxProp.textFlow = AttributeData.GetAttrTabString(curAttr, "\n\n");
        }
        else {
            this.curProp.textFlow = AttributeData.GetAttrTabString(curAttr, "\n\n");
            var nextAttr = FormationConst.GetFormationSoulAttr(this.mFormationId, formationInfo.mSoulLv + 1, 0);
            this.nextProp.textFlow = AttributeData.GetAttrTabString(nextAttr, "\n\n");
        }
    };
    FormationSoulPanel.prototype.SetUpgradeInfo = function () {
        var model = GameGlobal.FormationModel;
        this.powerLabel.text = model.GetPower(this.mFormationId);
        this.groupUpLv.visible = !model.IsMaxSoulLv(this.mFormationId);
        this.groupMaxLv.visible = model.IsMaxSoulLv(this.mFormationId);
        if (model.IsMaxSoulLv(this.mFormationId))
            return;
        var formationInfo = model.GetFormationInfo(this.mFormationId);
        var soulLevel = formationInfo.mSoulLv;
        var soulConfig = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel);
        var cost = soulConfig.cost;
        this.needItemView.SetItemId(cost.id, cost.count);
        this.UpdateExp();
    };
    FormationSoulPanel.prototype.UpdateExp = function () {
        var model = GameGlobal.FormationModel;
        var formationInfo = model.GetFormationInfo(this.mFormationId);
        var soulLevel = formationInfo.mSoulLv;
        var config = FormationConst.GetFormationSoulConfig(this.mFormationId, soulLevel);
        this.lbLev.text = soulLevel.toString() + "级";
        this.bar.maximum = config.proexp;
        this.bar.value = formationInfo.mSoulUpNum * config.exp;
    };
    FormationSoulPanel.prototype.OnClose = function () {
    };
    FormationSoulPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FormationSoulPanel;
}(BaseEuiView));
__reflect(FormationSoulPanel.prototype, "FormationSoulPanel", ["ICommonWindow"]);
//# sourceMappingURL=FormationSoulPanel.js.map