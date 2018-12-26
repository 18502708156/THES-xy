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
var RewardsPanel = (function (_super) {
    __extends(RewardsPanel, _super);
    function RewardsPanel() {
        var _this = _super.call(this) || this;
        _this.funObj = {};
        return _this;
    }
    RewardsPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "RewardsWinSkin";
        this.validateNow();
    };
    RewardsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.returnBtn, this.onTap);
        this.AddClick(this.closeBtn, this.onTap);
        this.AddClick(this.lqBtn, this.onTap);
        if (param)
            this.updateData(param[0]);
    };
    RewardsPanel.prototype.OnClose = function () {
        this.removeEvents();
    };
    RewardsPanel.prototype.updateData = function (data) {
        this.titleName.text = data.title;
        this.tipsTxt.textFlow = TextFlowMaker.generateTextFlow(data.txt);
        this.rewardList.dataProvider = new eui.ArrayCollection(data.itemData);
        this.index = data.index;
        //	this.funObj.fun = data.fun;
        //	this.funObj.thisObj = data.thisObj;
    };
    RewardsPanel.prototype.onTap = function (e) {
        switch (e.target) {
            case this.closeBtn:
            case this.returnBtn:
            case this.lqBtn:
                this.CloseSelf();
                if (e.target == this.lqBtn)
                    GameGlobal.UserFb.getCbtReward(this.index, 1);
                // if(this.funObj.fun) 
                // 	this.funObj.call(this.funObj.fun, this.funObj.thisObj);
                break;
        }
    };
    RewardsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RewardsPanel;
}(BaseEuiView));
__reflect(RewardsPanel.prototype, "RewardsPanel");
RewardsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=RewardsPanel.js.map