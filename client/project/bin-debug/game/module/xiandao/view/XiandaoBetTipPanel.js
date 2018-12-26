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
var XiandaoBetTipPanel = (function (_super) {
    __extends(XiandaoBetTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XiandaoBetTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XiandaoBetTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    XiandaoBetTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var type = param[0];
        var config = GameGlobal.Config.XianDuMatchStakeBaseConfig[type + 1];
        if (!config) {
            return;
        }
        this.winDesc.textFlow = TextFlowMaker.generateTextFlow(this.GetStr(config.rewardwin, config.pointswin));
        this.loseDesc.textFlow = TextFlowMaker.generateTextFlow(this.GetStr(config.rewardlose, config.pointslose));
    };
    XiandaoBetTipPanel.prototype.GetItemStr = function (data) {
        if (data.type == 0) {
            return MoneyConstToName[data.id] + "*" + data.count;
        }
        var config = GameGlobal.Config.ItemConfig[data.id];
        return "|C:" + Color.GetStr(ItemBase.QUALITY_COLOR[config.quality]) + "&T:" + config.name + "*" + data.count + "|";
    };
    XiandaoBetTipPanel.prototype.GetStr = function (items, point) {
        var list = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var data = items_1[_i];
            list.push(this.GetItemStr(data));
        }
        // return `可获得|C:${Color.GetStr(ItemBase.QUALITY_COLOR[4])}&T:天下第一积分*${point}|、${list.join('、')}`
        return "\u53EF\u83B7\u5F97" + list.join('、');
    };
    XiandaoBetTipPanel.prototype.OnClose = function () {
    };
    XiandaoBetTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XiandaoBetTipPanel;
}(BaseEuiView));
__reflect(XiandaoBetTipPanel.prototype, "XiandaoBetTipPanel");
//# sourceMappingURL=XiandaoBetTipPanel.js.map