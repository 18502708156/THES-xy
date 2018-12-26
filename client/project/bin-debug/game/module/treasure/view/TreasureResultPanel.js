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
var TreasureResultPanel = (function (_super) {
    __extends(TreasureResultPanel, _super);
    // private mTime: number
    function TreasureResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TreasureResultSkin";
        _this.group.itemRenderer = ItemBase;
        _this._AddClick(_this.bg, _this.CloseSelf);
        _this._AddClick(_this.btn0, _this.CloseSelf);
        _this._AddClick(_this.btn1, _this._OnClick);
        return _this;
    }
    TreasureResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    TreasureResultPanel.prototype.OnResume = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var data = param[0];
        this.data = data;
        var config = GameGlobal.Config.LuckConfig[data.index][0];
        this.priceIcon.type = config.cost.id;
        this.priceIcon.price = config.cost.count;
        this.btn1.label = "购买" + config.count + "个";
        this.group.dataProvider = new eui.ArrayCollection(data.rewards);
        for (var _a = 0, _b = data.rewards; _a < _b.length; _a++) {
            var item = _b[_a];
            UserBag.ShowItemTips(item.id, item.count);
        }
        // this.mTime = 4
        // this.AddTimer(1000, this.mTime, this.UpdateTime)
        this.UpdateTime();
    };
    TreasureResultPanel.prototype._OnClick = function () {
        var config = GameGlobal.Config.LuckConfig[this.data.index][0];
        if (Checker.Money(config.cost.id, config.cost.count)) {
            GameGlobal.TreasureHuntModel.SendTreasure(this.data.type, this.data.index);
        }
    };
    TreasureResultPanel.prototype.UpdateTime = function () {
        this.timeLabel.textFlow = TextFlowMaker.generateTextFlow("\u70B9\u51FB\u4EFB\u610F\u533A\u57DF\u5173\u95ED");
        // this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(`点击任意区域关闭|C:0x019704&T:(${--this.mTime}s)`)
        // if (this.mTime < 0) {
        // 	this.CloseSelf()
        // }
    };
    TreasureResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return TreasureResultPanel;
}(BaseEuiView));
__reflect(TreasureResultPanel.prototype, "TreasureResultPanel");
//# sourceMappingURL=TreasureResultPanel.js.map