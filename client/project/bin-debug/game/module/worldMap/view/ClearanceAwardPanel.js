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
var ClearanceAwardPanel = (function (_super) {
    __extends(ClearanceAwardPanel, _super);
    function ClearanceAwardPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ClearanceAwardSkin";
        _this._AddClick(_this, _this.CloseSelf);
        _this._AddClick(_this.btnGain, _this._onClick);
        return _this;
    }
    ClearanceAwardPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "奖励";
        var mapId = param[0];
        this.chapterId = param[1];
        var config = GameGlobal.Config.ChaptersMapConfig[mapId];
        if (!config)
            return;
        this.tips.text = config.name;
        var chapterRewardConfig = GameGlobal.Config.ChaptersRewardConfig[this.chapterId];
        var rewards = chapterRewardConfig.rewards;
        this.gchapreward.data = rewards[0];
        var itemConfig = GlobalConfig.ins().ItemConfig[rewards[0].id];
        this.goodsName.text = itemConfig.name;
        this.goodsCount.text = "数量*" + rewards[0].count;
    };
    ClearanceAwardPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    ClearanceAwardPanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.btnGain:
                GameGlobal.UserFb.gainChapterReward(this.chapterId);
                break;
        }
    };
    ClearanceAwardPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ClearanceAwardPanel;
}(BaseEuiView));
__reflect(ClearanceAwardPanel.prototype, "ClearanceAwardPanel");
//# sourceMappingURL=ClearanceAwardPanel.js.map