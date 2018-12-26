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
/**
 * 福利_月卡
 */
var FuliMonthlyCardPanel = (function (_super) {
    __extends(FuliMonthlyCardPanel, _super);
    function FuliMonthlyCardPanel() {
        var _this = _super.call(this) || this;
        //labArr
        _this.labArr = [];
        _this.comArr = [];
        _this.skinName = "FuliMonthlyCardSkin";
        return _this;
    }
    FuliMonthlyCardPanel.prototype.childrenCreated = function () {
        this.tab = GameGlobal.Config.WelfareBaseConfig;
        this.labArr = [this.lab0, this.lab1, this.lab2, this.lab3, this.lab4, this.lab5, this.lab6];
        this.comArr = [this.l0, this.l1, this.l2, this.l3];
        this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE, this.updateBtnTOLabel);
        this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE, this.updateListShow);
        this._AddClick(this.buyBtn, this._OnClick);
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
    };
    FuliMonthlyCardPanel.prototype.OnOpen = function () {
        for (var i = 0; i < 7; i++) {
            var text = this.tab["tips0" + (i + 1)];
            this.labArr[i].textFlow = TextFlowMaker.generateTextFlow(text);
        }
        var month = GameGlobal.FuliModel.FuliData.month;
        if (month != undefined && month != null) {
            this.dayLabel.textFlow = (new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + month + "天</a>");
            //this.dayLabel.textFlow=TextFlowMaker.generateTextFlow("剩余有效期|C:0x019704 &T:" + month + "天|")
            if (month == 0) {
                this.buyBtn.visible = true;
                this.dayLabel.visible = false;
            }
            else {
                this.buyBtn.visible = false;
                this.dayLabel.visible = true;
            }
        }
        this.updateListShow();
    };
    FuliMonthlyCardPanel.prototype.updateListShow = function () {
        var firstMonth = GameGlobal.FuliModel.FuliData.firstMonth;
        var firstreward = GameGlobal.Config.CardConfig[1].firstreward;
        if (firstMonth != 0 && firstreward != undefined) {
            this.comArr[3].visible = false;
            this.comArr[0].y = -21;
            this.comArr[1].y = 164;
            this.comArr[2].y = 349;
            //this.comArr[3].y=537;
        }
        else {
            this.comArr[3].visible = true;
            //this.itemList.itemRenderer=ItemBase;
            this.itemList.dataProvider = new eui.ArrayCollection(firstreward);
            this.comArr[3].y = -21;
            this.comArr[0].y = 164;
            this.comArr[1].y = 349;
            this.comArr[2].y = 534;
        }
    };
    FuliMonthlyCardPanel.prototype.updateBtnTOLabel = function () {
        var month = GameGlobal.FuliModel.FuliData.month;
        if (month > 0) {
            this.buyBtn.visible = false;
            this.dayLabel.visible = true;
            this.dayLabel.textFlow = (new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + month + "天</a>");
        }
    };
    FuliMonthlyCardPanel.prototype.UpdateContent = function () {
    };
    FuliMonthlyCardPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.buyBtn:
                RechargeWin.OpenMonthCard();
                break;
        }
    };
    FuliMonthlyCardPanel.prototype.OnClose = function () {
    };
    //skinName
    //FuliMonthlyCardSkin.exml
    FuliMonthlyCardPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliMonthlyCardPanel;
}(BaseEuiView));
__reflect(FuliMonthlyCardPanel.prototype, "FuliMonthlyCardPanel");
//# sourceMappingURL=FuliMonthlyCardPanel.js.map