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
var FuliForeverCardPanel = (function (_super) {
    __extends(FuliForeverCardPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FuliForeverCardPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliForeverCardSkin";
        return _this;
    }
    FuliForeverCardPanel.prototype.childrenCreated = function () {
        this._AddClick(this.btnBuy, this._OnClick);
        this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.UpdateContent);
    };
    FuliForeverCardPanel.prototype.OnOpen = function () {
        this.labDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips12);
        this.labDesc2.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips13);
        this.labUpDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips14);
        this.labUpDesc2.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips15);
        this.labBagDesc1.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.Config.WelfareBaseConfig.tips16);
        this.UpdateContent();
    };
    FuliForeverCardPanel.prototype.UpdateContent = function () {
        this.btnBuy.visible = !GameGlobal.FuliModel.FuliData.foreverFlag;
        this.labTip.visible = !this.btnBuy.visible;
    };
    FuliForeverCardPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnBuy:
                RechargeWin.OpenMonthCard();
                break;
        }
    };
    FuliForeverCardPanel.prototype.OnClose = function () {
    };
    return FuliForeverCardPanel;
}(BaseEuiView));
__reflect(FuliForeverCardPanel.prototype, "FuliForeverCardPanel");
//# sourceMappingURL=FuliForeverCardPanel.js.map