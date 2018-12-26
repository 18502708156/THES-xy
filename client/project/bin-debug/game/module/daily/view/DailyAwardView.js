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
var DailyAwardView = (function (_super) {
    __extends(DailyAwardView, _super);
    function DailyAwardView() {
        var _this = _super.call(this) || this;
        _this.skinName = "DailyAwardSkin";
        return _this;
    }
    DailyAwardView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "奖励展示";
        var rewards = param[0];
        var target = param[1];
        this.labText.text = "\u6D3B\u8DC3\u5EA6\u8FBE\u5230" + target + "\u7684\u5956\u52B1";
        var idx = 1;
        for (var _a = 0, rewards_1 = rewards; _a < rewards_1.length; _a++) {
            var reward = rewards_1[_a];
            if (this["item" + idx]) {
                this["item" + idx].visible = true;
                this["item" + idx].setItemAward(reward.type, reward.id, reward.count);
            }
            idx++;
        }
    };
    DailyAwardView.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    DailyAwardView.LAYER_LEVEL = LayerManager.UI_Popup;
    return DailyAwardView;
}(BaseEuiView));
__reflect(DailyAwardView.prototype, "DailyAwardView");
//# sourceMappingURL=DailyAwardView.js.map