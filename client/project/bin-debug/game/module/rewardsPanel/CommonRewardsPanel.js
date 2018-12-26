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
var CommonRewardsPanel = (function (_super) {
    __extends(CommonRewardsPanel, _super);
    function CommonRewardsPanel() {
        var _this = _super.call(this) || this;
        _this.funObj = {};
        return _this;
    }
    CommonRewardsPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CommonRewardsWin";
        this.rewardList.itemRenderer = ItemBase;
        this.validateNow();
    };
    CommonRewardsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.returnBtn, this.onTap);
        this.AddClick(this.closeBtn, this.onTap);
        this.AddClick(this.lqBtn, this.onTap);
        if (param)
            this.updateData(param);
    };
    CommonRewardsPanel.prototype.OnClose = function () {
        this.removeEvents();
    };
    CommonRewardsPanel.prototype.updateData = function (data) {
        this.titleName.text = data[0];
        this.rewardList.dataProvider = new eui.ArrayCollection([data[1]]);
        this.funObj = data[2];
    };
    CommonRewardsPanel.prototype.onTap = function (e) {
        switch (e.target) {
            case this.closeBtn:
            case this.returnBtn:
            case this.lqBtn:
                this.CloseSelf();
                if (e.target == this.lqBtn)
                    if (this.funObj)
                        this.funObj();
                break;
        }
    };
    CommonRewardsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return CommonRewardsPanel;
}(BaseEuiView));
__reflect(CommonRewardsPanel.prototype, "CommonRewardsPanel");
CommonRewardsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=CommonRewardsPanel.js.map