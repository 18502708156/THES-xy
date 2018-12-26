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
var GodPetActiveResultPanel = (function (_super) {
    __extends(GodPetActiveResultPanel, _super);
    function GodPetActiveResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GodPetActiveResultSkin";
        _this.group.itemRenderer = ItemBase;
        _this._AddClick(_this.bg, _this.CloseSelf);
        _this._AddClick(_this.btn0, _this.CloseSelf);
        _this._AddClick(_this.btn1, _this._OnClick);
        return _this;
    }
    GodPetActiveResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    GodPetActiveResultPanel.prototype.OnResume = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        this.priceIcon.type = cost.id;
        this.priceIcon.price = cost.count;
        this.btn1.label = "\u964D\u670D1\u6B21";
        var awards = GameGlobal.GodPetActiveModel.GetAwards();
        this.group.dataProvider = new eui.ArrayCollection(awards);
        this.mTime = 4;
        this.AddTimer(1000, this.mTime, this.UpdateTime);
        this.UpdateTime();
    };
    GodPetActiveResultPanel.prototype._OnClick = function () {
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        if (Checker.Data(cost)) {
            GameGlobal.GodPetActiveModel.SendLottery();
        }
        this.CloseSelf();
    };
    GodPetActiveResultPanel.prototype.UpdateTime = function () {
        this.timeLabel.textFlow = TextFlowMaker.generateTextFlow("\u70B9\u51FB\u4EFB\u610F\u533A\u57DF\u5173\u95ED|C:0x019704&T:(" + --this.mTime + "s)");
        if (this.mTime < 0) {
            this.CloseSelf();
        }
    };
    GodPetActiveResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return GodPetActiveResultPanel;
}(BaseEuiView));
__reflect(GodPetActiveResultPanel.prototype, "GodPetActiveResultPanel");
//# sourceMappingURL=GodPetActiveResultPanel.js.map