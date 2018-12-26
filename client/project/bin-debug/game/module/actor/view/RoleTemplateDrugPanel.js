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
var RoleTemplateDrugPanel = (function (_super) {
    __extends(RoleTemplateDrugPanel, _super);
    function RoleTemplateDrugPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.useNum = 0;
        _this.skinName = "RoleRideDrugSkin";
        return _this;
    }
    RoleTemplateDrugPanel.prototype.childrenCreated = function () {
        this.numLabel.text = this.useNum + "";
        this.numLabel.inputType = egret.TextFieldInputType.TEL;
        this.numLabel.restrict = "0-9";
        this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
        this._AddClick(this.minBtn, this._OnClick);
        this._AddClick(this.maxBtn, this._OnClick);
        this._AddClick(this.btnLessTen, this._OnClick);
        this._AddClick(this.btnAddTen, this._OnClick);
        this._AddClick(this.getwayLabel, this._OnClick);
        this._AddClick(this.useBtn, this._OnClick);
        // UIHelper.SetLinkStyleLabel(this.getwayLabel)
    };
    RoleTemplateDrugPanel.prototype._OnClick = function (e) {
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
            // case this.getwayLabel:
            // 	break
            case this.useBtn:
                var curCount = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
                if (curCount > 0)
                    this.mModel.SendDrug(this.useNum);
                else
                    UserTips.ins().showTips("|C:0xff0000&T:属性丹数量不足，无法使用|");
                break;
        }
    };
    RoleTemplateDrugPanel.prototype.onTxtChange = function (e) {
        var num = parseInt(this.numLabel.text);
        this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
        this.ChangeCount(num);
    };
    ;
    RoleTemplateDrugPanel.prototype.ChangeCount = function (count) {
        this.useNum = MathUtils.Clamp(this.useNum + count, 0, GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid));
        this.numLabel.text = this.useNum + "";
    };
    RoleTemplateDrugPanel.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.ItemConfig[this.mModel.BaseConfig.attreitemid];
        this.item.data = this.mModel.BaseConfig.attreitemid;
        this.matLabel.text = config.name;
        var drugNum = this.mModel.mDrugNum;
        UIHelper.SetLabelText(this.countLabel, "当前背包拥有：", GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid) + "个");
        UIHelper.SetLabelText(this.useCountLabel, "已使用：", drugNum + "个");
        // let attr = CommonUtils.copyDataHandler(this.mModel.BaseConfig.attredata)
        // for (let k in attr) {
        // 	attr[k].value *= drugNum
        // }
        var attr = this.mModel.GetCurDrugAttr();
        this.attrLabel.textFlow = AttributeData.GetAttrTabString(attr);
    };
    RoleTemplateDrugPanel.prototype.UpdateDrug = function () {
        this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
        this.ChangeCount(0);
    };
    RoleTemplateDrugPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.observe(this.mModel.mMsgDefUpdateDrug, this.UpdateDrug);
        this.UpdateContent();
        this.commonDialog.OnAdded(this);
        this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
        this.numLabel.text = this.useNum + "";
        this.getwayLabel.SetId(this.mModel.BaseConfig.attreitemid);
    };
    RoleTemplateDrugPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    RoleTemplateDrugPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RoleTemplateDrugPanel;
}(BaseEuiView));
__reflect(RoleTemplateDrugPanel.prototype, "RoleTemplateDrugPanel");
//# sourceMappingURL=RoleTemplateDrugPanel.js.map