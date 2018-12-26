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
var FormationDrugPanel = (function (_super) {
    __extends(FormationDrugPanel, _super);
    function FormationDrugPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.useNum = 0;
        _this.skinName = "RoleRideDrugSkin";
        return _this;
    }
    FormationDrugPanel.prototype.childrenCreated = function () {
        this.numLabel.text = this.useNum + "";
        this.numLabel.inputType = egret.TextFieldInputType.TEL;
        this.numLabel.restrict = "0-9";
        var drugId = GameGlobal.Config.FormationBaseConfig.attreitemid;
        this.numLabel.text = GameGlobal.UserBag.GetCount(drugId).toString();
        this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
        this._AddClick(this.minBtn, this._OnClick);
        this._AddClick(this.maxBtn, this._OnClick);
        this._AddClick(this.btnLessTen, this._OnClick);
        this._AddClick(this.btnAddTen, this._OnClick);
        this._AddClick(this.getwayLabel, this._OnClick);
        this._AddClick(this.useBtn, this._OnClick);
        UIHelper.SetLinkStyleLabel(this.getwayLabel);
    };
    FormationDrugPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.minBtn:
                this.ChangeCount(-1);
                break;
            case this.maxBtn:
                this.ChangeCount(+1);
                break;
            case this.btnLessTen:
                this.ChangeCount(-10);
                break;
            case this.btnAddTen:
                this.ChangeCount(+10);
                break;
            case this.getwayLabel:
                break;
            case this.useBtn:
                var drugId = GameGlobal.Config.FormationBaseConfig.attreitemid;
                var curCount = GameGlobal.UserBag.GetCount(drugId);
                if (curCount > 0)
                    this.mModel.SendUseDrug(this.useNum);
                else
                    UserTips.ins().showTips("|C:0xff0000&T:属性丹数量不足，无法使用|");
                break;
        }
    };
    FormationDrugPanel.prototype.onTxtChange = function (e) {
        var num = parseInt(this.numLabel.text);
        this.useNum = 0;
        this.ChangeCount(num);
    };
    ;
    FormationDrugPanel.prototype.ChangeCount = function (count) {
        var drugId = GameGlobal.Config.FormationBaseConfig.attreitemid;
        this.useNum = MathUtils.Clamp(this.useNum + count, 0, GameGlobal.UserBag.GetCount(drugId));
        this.numLabel.text = this.useNum + "";
    };
    FormationDrugPanel.prototype.UpdateContent = function () {
        var drugId = GameGlobal.Config.FormationBaseConfig.attreitemid;
        var config = GameGlobal.Config.ItemConfig[drugId];
        this.item.setData(config);
        this.matLabel.text = config.name;
        var drugNum = this.mModel.useDrugNum;
        UIHelper.SetLabelText(this.countLabel, "当前背包拥有：", GameGlobal.UserBag.GetCount(drugId) + "个");
        UIHelper.SetLabelText(this.useCountLabel, "已使用：", drugNum + "个");
        var attr = this.mModel.GetCurDrugAttr();
        this.attrLabel.textFlow = AttributeData.GetAttrTabString(attr);
    };
    FormationDrugPanel.prototype.UpdateDrug = function () {
        this.useNum = 0;
        this.ChangeCount(0);
    };
    FormationDrugPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.observe(MessageDef.FORMATION_USE_DRUG, this.UpdateContent);
        this.observe(MessageDef.FORMATION_USE_DRUG, this.UpdateDrug);
        this.UpdateContent();
        this.commonDialog.OnAdded(this);
    };
    FormationDrugPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    FormationDrugPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FormationDrugPanel;
}(BaseEuiView));
__reflect(FormationDrugPanel.prototype, "FormationDrugPanel");
//# sourceMappingURL=FormationDrugPanel.js.map