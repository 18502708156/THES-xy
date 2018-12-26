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
var DailyExpRetrieveWin = (function (_super) {
    __extends(DailyExpRetrieveWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DailyExpRetrieveWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "DailyExpRetrieveSkin";
        _this.commonWindowBg.SetTitle("历练找回");
        _this._AddClick(_this.btnOneKey, _this._OnClick);
        return _this;
    }
    DailyExpRetrieveWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = ExpRetrieveItem;
    };
    DailyExpRetrieveWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
        this.UpdateContent();
    };
    DailyExpRetrieveWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    DailyExpRetrieveWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnOneKey:
                var cost_1 = GameGlobal.DailyModel.GetRetrieveExpCost();
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost_1.count + "\u5143\u5B9D\u627E\u56DE" + cost_1.exp + "\u70B9\u5386\u7EC3\u7ECF\u9A8C", function () {
                    if (Checker.Money(cost_1.id, cost_1.count))
                        GameGlobal.DailyModel.SendRetrieveExp();
                }, this);
                break;
        }
    };
    DailyExpRetrieveWin.prototype.UpdateContent = function () {
        var expRetrieveList = GameGlobal.DailyModel.GetRetrieveExpList();
        this.list.dataProvider = new eui.ArrayCollection(expRetrieveList);
        this.btnOneKey.visible = expRetrieveList.length > 0;
    };
    DailyExpRetrieveWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DailyExpRetrieveWin;
}(BaseEuiView));
__reflect(DailyExpRetrieveWin.prototype, "DailyExpRetrieveWin", ["ICommonWindow"]);
var ExpRetrieveItem = (function (_super) {
    __extends(ExpRetrieveItem, _super);
    function ExpRetrieveItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ExpRetrieveItem.prototype.childrenCreated = function () {
        this.btnRetrieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRetrieveBtnClick, this);
    };
    ExpRetrieveItem.prototype.dataChanged = function () {
        var taskInfo = this.data;
        this.imgBg.visible = this.itemIndex % 2 == 0;
        var config = GameGlobal.Config.DailyProgressConfig[taskInfo.mTaskId];
        this.labName.text = config.name;
        this.labCount.text = "\u53EF\u627E\u56DE" + taskInfo.mCount + "\u6B21";
        this.labPerTip.text = config.exp + "\u70B9";
        var retrieveConfig = DailyConst.GetRetrieveConfig(this.data.mTaskId, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP);
        var costId = retrieveConfig.cost[0].id;
        var costName = GameGlobal.actorModel.GetCurrencyName(costId);
        this.labCost.text = "" + retrieveConfig.cost[0].count + costName;
    };
    ExpRetrieveItem.prototype._OnRetrieveBtnClick = function () {
        ViewManager.ins().open(DailyRetrievePopWin, this.data, DailyConst.TASK_RETRIEVE_COST_GOD, DailyConst.TASK_RETRIEVE_TYPE_EXP);
    };
    return ExpRetrieveItem;
}(eui.ItemRenderer));
__reflect(ExpRetrieveItem.prototype, "ExpRetrieveItem");
//# sourceMappingURL=DailyExpRetrieveWin.js.map