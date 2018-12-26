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
var DeityEquipDetailWin = (function (_super) {
    __extends(DeityEquipDetailWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DeityEquipDetailWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "DeityEquipDetailSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    DeityEquipDetailWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetInjectInfo();
        this.SetNextInjectInfo();
        this.SetDeityEquipNumInfo();
    };
    DeityEquipDetailWin.prototype.OnClose = function () {
    };
    DeityEquipDetailWin.prototype.SetInjectInfo = function () {
        var curInjectLv = GameGlobal.UserEquip.GetDeityEquipInjectLevel();
        var injectConfig = DeityEquipConst.GetCurInjectConfig(curInjectLv);
        var totalText = "\u6CE8\u7075\u603B\u7B49\u7EA7\uFF1A" + curInjectLv + "/" + injectConfig.level + "\u7EA7";
        totalText = totalText + (curInjectLv >= injectConfig.level ? "(\u5DF2\u6FC0\u6D3B)" : "(\u672A\u6FC0\u6D3B)");
        this.labAttrTotal.text = totalText;
        var injectAttrs = injectConfig.attrpower;
        for (var idx = 0; idx < 4; idx++) {
            var attr = injectAttrs[idx];
            this["labInjectAttr" + idx].visible = attr != null;
            if (attr) {
                this["labInjectAttr" + idx].text = AttributeData.getAttrStrByType(attr.type) + ": " + attr.value;
            }
        }
    };
    DeityEquipDetailWin.prototype.SetNextInjectInfo = function () {
        var curInjectLv = GameGlobal.UserEquip.GetDeityEquipInjectLevel();
        var nextInjectConfig = DeityEquipConst.GetNextInjectConfig(curInjectLv);
        if (!nextInjectConfig) {
            this.groupNext.visible = false;
            this.groupNum.y = this.groupNext.y + 15;
            return;
        }
        this.labNextTotalAttr.text = "\u4E0B\u4E00\u7EA7: \u9700" + nextInjectConfig.level + "\u7EA7";
        var injectAttrs = nextInjectConfig.attrpower;
        for (var idx = 0; idx < 4; idx++) {
            var attr = injectAttrs[idx];
            this["labInjectNextAttr" + idx].visible = attr != null;
            if (attr) {
                this["labInjectNextAttr" + idx].text = AttributeData.getAttrStrByType(attr.type) + ": " + attr.value;
            }
        }
    };
    DeityEquipDetailWin.prototype.SetDeityEquipNumInfo = function () {
        var deityEquipNum = GameGlobal.UserEquip.GetDeityEquipNum();
        var textList = DeityEquipConst.GetDeityEquipActTextList(deityEquipNum);
        for (var idx = 0; idx < 10; idx++) {
            var text = textList[idx];
            this["labAwake" + idx].visible = text != null;
            if (text) {
                this["labAwake" + idx].textFlow = TextFlowMaker.generateTextFlow(text);
            }
        }
    };
    DeityEquipDetailWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return DeityEquipDetailWin;
}(BaseEuiView));
__reflect(DeityEquipDetailWin.prototype, "DeityEquipDetailWin");
//# sourceMappingURL=DeityEquipDetailWin.js.map