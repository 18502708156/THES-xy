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
var PetXilianTipPanel = (function (_super) {
    __extends(PetXilianTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetXilianTipPanel() {
        var _this = _super.call(this) || this;
        _this.SetSkinName();
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    PetXilianTipPanel.prototype.SetSkinName = function () {
        // this.skinName = "PetXilianTipSkin"
        this.skinName = "PetXilianTip2Skin";
    };
    // 0 名字， 1 描述， 2 次数， 3 名字颜色
    PetXilianTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.descTxt.text = param[1];
        this.refreshCount.text = param[2];
        this.petName.text = param[0];
        this.petName.textColor = param[3];
        var configList = param[4];
        var item1 = "";
        var item2 = "";
        if (configList) {
            var data1 = configList[0].itemId;
            var data2 = configList[1].itemId;
            item1 = GameGlobal.Config.ItemConfig[data1].name;
            item2 = GameGlobal.Config.ItemConfig[data2].name;
        }
        this.tipLabel.text = "\u5237\u65B0\u7684\u6B21\u6570\u8D8A\u591A\uFF0C\u83B7\u5F97\u9AD8\u54C1\u8D28\u6280\u80FD\u6982\u7387\u8D8A\u5927\n\u4F7F\u7528\u3010" + item1 + "\u3011\u6D17\u7EC3\uFF0C\u6D17\u7EC3\u6B21\u6570\u53EF\u589E\u52A01\u6B21\n\u4F7F\u7528\u3010" + item2 + "\u3011\u6D17\u7EC3\uFF0C\u6D17\u7EC3\u6B21\u6570\u53EF\u589E\u52A010\u6B21";
    };
    PetXilianTipPanel.prototype.OnClose = function () {
    };
    PetXilianTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetXilianTipPanel;
}(BaseEuiView));
__reflect(PetXilianTipPanel.prototype, "PetXilianTipPanel");
// class LingtongXilianTipPanel extends PetXilianTipPanel {
// 	protected SetSkinName() {
// 		this.skinName = "PetXilianTip2Skin"
// 	}
// } 
//# sourceMappingURL=PetXilianTipPanel.js.map