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
var ActivityRewardPanel = (function (_super) {
    __extends(ActivityRewardPanel, _super);
    function ActivityRewardPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ActivityRewardShowPanel";
        _this.mIdx = 0;
        return _this;
    }
    ActivityRewardPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = ActivityAwardShowItem;
    };
    ActivityRewardPanel.prototype.UpdateContent = function () {
        this.imgShow.source = this.mContext.GetImgSource();
        var list = this.mContext.GetAwardList(this.mIdx);
        this.list.dataProvider = new eui.ArrayCollection(list);
    };
    ActivityRewardPanel.prototype.OnOpen = function () {
        this.UpdateContent();
    };
    ActivityRewardPanel.prototype.OnClose = function () {
    };
    ActivityRewardPanel.NAME = "奖励预览";
    return ActivityRewardPanel;
}(BaseView));
__reflect(ActivityRewardPanel.prototype, "ActivityRewardPanel", ["ICommonWindowTitle"]);
var ActivityAwardShowItem = (function (_super) {
    __extends(ActivityAwardShowItem, _super);
    function ActivityAwardShowItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ActivityAwardShowItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
    };
    ActivityAwardShowItem.prototype.dataChanged = function () {
        var data = this.data;
        this.labText.text = data.name;
        this.list.dataProvider = new eui.ArrayCollection(data.showitem);
    };
    return ActivityAwardShowItem;
}(eui.ItemRenderer));
__reflect(ActivityAwardShowItem.prototype, "ActivityAwardShowItem");
var ActivityRankRewardPanel = (function (_super) {
    __extends(ActivityRankRewardPanel, _super);
    function ActivityRankRewardPanel() {
        var _this = _super.call(this) || this;
        _this.mIdx = 1;
        return _this;
    }
    ActivityRankRewardPanel.NAME = "排名奖励";
    return ActivityRankRewardPanel;
}(ActivityRewardPanel));
__reflect(ActivityRankRewardPanel.prototype, "ActivityRankRewardPanel");
var ActivityDragonRankPanel = (function (_super) {
    __extends(ActivityDragonRankPanel, _super);
    function ActivityDragonRankPanel() {
        var _this = _super.call(this) || this;
        _this.mIdx = 2;
        return _this;
    }
    ActivityDragonRankPanel.NAME = "神龙奖励";
    return ActivityDragonRankPanel;
}(ActivityRewardPanel));
__reflect(ActivityDragonRankPanel.prototype, "ActivityDragonRankPanel");
//# sourceMappingURL=ActivityRewardPanel.js.map