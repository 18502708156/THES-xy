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
 * 福利_周卡
 */
var FuliWeeklyCardPanel = (function (_super) {
    __extends(FuliWeeklyCardPanel, _super);
    function FuliWeeklyCardPanel() {
        var _this = _super.call(this) || this;
        //labArr
        _this.labArr = [];
        _this.skinName = "FuliWeeklyCardSkin";
        return _this;
    }
    FuliWeeklyCardPanel.prototype.childrenCreated = function () {
        this.tab = GameGlobal.Config.WelfareBaseConfig;
        this.labArr = [this.lab0, this.lab1, this.lab2, this.lab3];
        this._AddClick(this.buyBtn, this._OnClick);
        this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE, this.updateBtnTOLabel);
    };
    FuliWeeklyCardPanel.prototype.OnOpen = function () {
        for (var i = 0; i < 4; i++) {
            var text = "";
            if (i < 2) {
                text = this.tab["tips0" + (i + 8)];
            }
            else {
                text = this.tab["tips" + (i + 8)];
            }
            this.labArr[i].textFlow = TextFlowMaker.generateTextFlow(text);
            this.labArr[i].parent.visible = this.labArr[i].text != "";
        }
        //this.lab0.textFlow = TextFlowMaker.generateTextFlow(this.tab.tips08);
        var week = GameGlobal.FuliModel.FuliData.week;
        this.dayLabel.textFlow = (new egret.HtmlTextParser).parser("<font>剩余有效期<a color=0x019704>" + week + "</a>天</font>");
        //this.dayLabel.text="剩余有效期"+week+"天";
        if (week != undefined && week != null) {
            //this.dayLabel.text=week;
            if (week == 0) {
                this.buyBtn.visible = true;
                this.dayLabel.visible = false;
            }
            else {
                this.buyBtn.visible = false;
                this.dayLabel.visible = true;
            }
        }
    };
    FuliWeeklyCardPanel.prototype.UpdateContent = function () {
    };
    FuliWeeklyCardPanel.prototype.updateBtnTOLabel = function () {
        var week = GameGlobal.FuliModel.FuliData.week;
        if (week > 0) {
            this.buyBtn.visible = false;
            this.dayLabel.visible = true;
            this.dayLabel.textFlow = (new egret.HtmlTextParser).parser("剩余有效期<a color=0x019704>" + week + "天</a>");
        }
    };
    FuliWeeklyCardPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.buyBtn:
                RechargeWin.OpenMonthCard();
                break;
        }
    };
    FuliWeeklyCardPanel.prototype.OnClose = function () {
    };
    //skinName
    //FuliWeeklyCardSkin.exml
    FuliWeeklyCardPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliWeeklyCardPanel;
}(BaseEuiView));
__reflect(FuliWeeklyCardPanel.prototype, "FuliWeeklyCardPanel");
//# sourceMappingURL=FuliWeeklyCardPanel.js.map