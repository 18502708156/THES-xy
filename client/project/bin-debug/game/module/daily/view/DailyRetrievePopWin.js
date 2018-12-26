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
var DailyRetrievePopWin = (function (_super) {
    __extends(DailyRetrievePopWin, _super);
    function DailyRetrievePopWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "DailyRetrieveCountSkin";
        _this._AddClick(_this.btnRetrieve, _this._OnClick);
        _this._AddClick(_this.btnMinues, _this._OnClick);
        _this._AddClick(_this.btnAdd, _this._OnClick);
        _this.sliderRetrieve.addEventListener(egret.Event.CHANGE, _this._OnSliderChange, _this);
        return _this;
    }
    DailyRetrievePopWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.mTaskInfo = param[0];
        this.mCostType = param[1];
        this.mRetrieveType = param[2];
        this.commonDialog.title = this.mRetrieveType == DailyConst.TASK_RETRIEVE_TYPE_RES ? "找回资源" : "找回历练";
        var config = GameGlobal.Config.DailyProgressConfig[this.mTaskInfo.mTaskId];
        this.labNameTip.textFlow = TextFlowMaker.generateTextFlow("|C:0x6e330b&T:" + config.name + " \uFF08\u53EF\u627E\u56DE|C:0x019704&T:" + this.mTaskInfo.mCount + "|C:0x6e330b&T:\u6B21\uFF09|");
        this.sliderRetrieve.maximum = this.mTaskInfo.mCount;
        var retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType);
        var curNum = GameGlobal.actorModel.GetNum(retrieveConfig.cost[0].id);
        var canBuyNum = Math.floor(curNum / retrieveConfig.cost[0].count);
        this.sliderRetrieve.value = Math.min(this.mTaskInfo.mCount, canBuyNum);
        this.SetCostInfo();
    };
    DailyRetrievePopWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    DailyRetrievePopWin.prototype._OnSliderChange = function () {
        this.SetCostInfo();
    };
    DailyRetrievePopWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRetrieve:
                var count = this.sliderRetrieve.value;
                if (count > 0) {
                    var retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType);
                    if (Checker.Money(retrieveConfig.cost[0].id, retrieveConfig.cost[0].count * count))
                        GameGlobal.DailyModel.SendRetrieve(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType, count);
                }
                ViewManager.ins().close(DailyRetrievePopWin);
                break;
            case this.btnMinues:
                this.changeSlider(-1);
                break;
            case this.btnAdd:
                this.changeSlider(1);
                break;
        }
    };
    DailyRetrievePopWin.prototype.SetCostInfo = function () {
        var count = this.sliderRetrieve.value;
        var retrieveConfig = DailyConst.GetRetrieveConfig(this.mTaskInfo.mTaskId, this.mCostType, this.mRetrieveType);
        var costName = this.mCostType == DailyConst.TASK_RETRIEVE_COST_BINDGOD ? "绑定元宝" : "元宝";
        var text = "|C:0x6e330b&T:\u603B\u4EF7\uFF1A|C:0x019704&T:" + count * retrieveConfig.cost[0].count + "|C:0x6e330b&T:" + costName + "\uFF08\u627E\u56DE|C:0x019704&T:" + count + "|C:0x6e330b&T:\u6B21\uFF09|";
        this.labCostTip.textFlow = TextFlowMaker.generateTextFlow(text);
    };
    DailyRetrievePopWin.prototype.changeSlider = function (delta) {
        var curCount = this.sliderRetrieve.value;
        var count = Math.min(Math.max(curCount + delta, 0), this.mTaskInfo.mCount);
        this.sliderRetrieve.value = count;
        this.SetCostInfo();
    };
    DailyRetrievePopWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return DailyRetrievePopWin;
}(BaseEuiView));
__reflect(DailyRetrievePopWin.prototype, "DailyRetrievePopWin");
//# sourceMappingURL=DailyRetrievePopWin.js.map