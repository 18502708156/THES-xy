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
var DailyResRetrievePanel = (function (_super) {
    __extends(DailyResRetrievePanel, _super);
    function DailyResRetrievePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "DailyResRetrieveSkin";
        _this.mType = DailyConst.TASK_RETRIEVE_COST_BINDGOD;
        return _this;
    }
    DailyResRetrievePanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = ResRetrieveItem;
    };
    DailyResRetrievePanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.DAILY_RETRIEVELIST_UPDATE, this.UpdateContent);
    };
    DailyResRetrievePanel.prototype.OnClose = function () {
    };
    DailyResRetrievePanel.prototype.UpdateContent = function () {
        GameGlobal.DailyModel.RecordResRetrieveFlag(this.mType, true);
        GameGlobal.DailyModel.mResRetrieveType = this.mType;
        var resRetrieveList = GameGlobal.DailyModel.GetRetrieveResListByType(GameGlobal.DailyModel.mResRetrieveType);
        this.list.dataProvider = new eui.ArrayCollection(resRetrieveList);
    };
    DailyResRetrievePanel.NAME = "绑元找回";
    return DailyResRetrievePanel;
}(BaseView));
__reflect(DailyResRetrievePanel.prototype, "DailyResRetrievePanel", ["ICommonWindowTitle"]);
var ResRetrieveItem = (function (_super) {
    __extends(ResRetrieveItem, _super);
    function ResRetrieveItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ResRetrieveItem.prototype.childrenCreated = function () {
        this.btnRetrieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRetrieveBtnClick, this);
    };
    ResRetrieveItem.prototype.dataChanged = function () {
        var taskInfo = this.data;
        var config = GameGlobal.Config.DailyProgressConfig[taskInfo.mTaskId];
        this.labText.text = config.name + "\uFF08\u53EF\u627E\u56DE" + taskInfo.mCount + "\u6B21\uFF09";
        var retrieveConfig = DailyConst.GetRetrieveConfig(taskInfo.mTaskId, GameGlobal.DailyModel.mResRetrieveType, DailyConst.TASK_RETRIEVE_TYPE_RES);
        this.priceIcon.type = retrieveConfig.cost[0].id;
        this.priceIcon.price = retrieveConfig.cost[0].count;
        var idx = 1;
        for (var _i = 0, _a = retrieveConfig.res; _i < _a.length; _i++) {
            var reward = _a[_i];
            var itemName = "item" + idx;
            if (this[itemName]) {
                this[itemName].visible = true;
                this[itemName].setItemAward(reward.type, reward.id, reward.count);
            }
            idx++;
        }
    };
    ResRetrieveItem.prototype._OnRetrieveBtnClick = function () {
        ViewManager.ins().open(DailyRetrievePopWin, this.data, GameGlobal.DailyModel.mResRetrieveType, DailyConst.TASK_RETRIEVE_TYPE_RES);
    };
    return ResRetrieveItem;
}(eui.ItemRenderer));
__reflect(ResRetrieveItem.prototype, "ResRetrieveItem");
//# sourceMappingURL=DailyResRetrievePanel.js.map