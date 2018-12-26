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
var ZhuangPanResultPanel = (function (_super) {
    __extends(ZhuangPanResultPanel, _super);
    function ZhuangPanResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "zhuangPanResultSkin";
        _this.group.itemRenderer = ItemBase;
        _this._AddClick(_this.bg, _this.CloseSelf);
        _this._AddClick(_this.btn0, _this.CloseSelf);
        return _this;
    }
    ZhuangPanResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    ZhuangPanResultPanel.prototype.OnResume = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var data = param[0];
        this.data = data;
        this.group.dataProvider = new eui.ArrayCollection(data.rewards);
        for (var _a = 0, _b = data.rewards; _a < _b.length; _a++) {
            var item = _b[_a];
            UserBag.ShowItemTips(item.id, item.count);
        }
        this.mTime = 4;
        this.AddTimer(1000, this.mTime, this.UpdateTime);
        this.UpdateTime();
    };
    ZhuangPanResultPanel.prototype.UpdateTime = function () {
        this.timeLabel.textFlow = TextFlowMaker.generateTextFlow("\u70B9\u51FB\u4EFB\u610F\u533A\u57DF\u5173\u95ED|C:0x019704&T:(" + --this.mTime + "s)");
        if (this.mTime < 0) {
            this.CloseSelf();
        }
    };
    ZhuangPanResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ZhuangPanResultPanel;
}(BaseEuiView));
__reflect(ZhuangPanResultPanel.prototype, "ZhuangPanResultPanel");
//# sourceMappingURL=ZhuangPanResultPanel.js.map