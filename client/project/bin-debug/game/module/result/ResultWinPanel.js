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
var ResultWinPanel = (function (_super) {
    __extends(ResultWinPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ResultWinPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ResultWinSkin";
        _this.list.itemRenderer = ItemBase;
        return _this;
    }
    /** 货币排序 */
    ResultWinPanel.prototype.sortFunc = function (a, b) {
        if (a.type == 1 && b.type == 1) {
            var aItem = GlobalConfig.ins().ItemConfig[a.id];
            var bItem = GlobalConfig.ins().ItemConfig[b.id];
            if (aItem.quality > bItem.quality)
                return -1;
            else if (aItem.quality < bItem.quality)
                return 1;
            else {
                if (aItem.level > bItem.level)
                    return -1;
                else if (aItem.level < bItem.level)
                    return 1;
            }
        }
        else {
            if (a.type < b.type)
                return -1;
            else if (a.type > b.type)
                return 1;
        }
        return 0;
    };
    ;
    ResultWinPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("领取奖励");
        this.SetTitleLabel("获得奖励");
        this.SetCloseFunc(param[1]);
        _super.prototype.OnOpen.call(this);
        var rewards = param[0];
        var star = param[2];
        var state = param[3];
        if (rewards) {
            rewards.sort(this.sortFunc);
        }
        this.list.dataProvider = new eui.ArrayCollection(rewards);
        this.list.validateNow();
        if (state == 3)
            this.imgTitle.source = "ui_js_bm_tiaozhanjieshu";
        if (star == null || star == 0) {
            this.bmStar0.visible = false;
            this.bmStar1.visible = false;
            this.bmStar2.visible = false;
            return;
        }
        this.bmStar1.filters = star > 1 ? null : Color.GetFilter();
        this.bmStar2.filters = star > 2 ? null : Color.GetFilter();
    };
    return ResultWinPanel;
}(ResultBasePanel));
__reflect(ResultWinPanel.prototype, "ResultWinPanel");
//# sourceMappingURL=ResultWinPanel.js.map