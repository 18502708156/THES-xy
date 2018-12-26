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
var ArenaPKResultPanel = (function (_super) {
    __extends(ArenaPKResultPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ArenaPKResultPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "AreanPKResultSkin";
        _this.list.itemRenderer = ItemBase;
        return _this;
    }
    /** 货币排序 */
    ArenaPKResultPanel.prototype.sortFunc = function (a, b) {
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
    /**
     * @param
     * 0 成功|失败
     * 1 奖励
     * 2 历史最高排名
     * 3 当前排名
     * 4 挑战前排名
     * 5 回调函数
     */
    ArenaPKResultPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.SetBtnLabel("领取奖励");
        this.SetTitleLabel("获得奖励");
        this.SetCloseFunc(param[5]);
        _super.prototype.OnOpen.call(this);
        this.winGroup.visible = param[0];
        this.failGroup.visible = !param[0];
        var rewards = param[1];
        if (rewards) {
            rewards.sort(this.sortFunc);
        }
        this.list.dataProvider = new eui.ArrayCollection(rewards);
        this.list.validateNow();
        this.lastRankTxt.text = param[2] + '';
        this.curRankTxt.text = param[3] + '';
        //排名变化
        var upRank = param[4] - param[3];
        if (upRank > 0) {
            this.upImg.visible = true;
            this.upRankTxt.text = upRank + '';
        }
        else {
            this.upImg.visible = false;
            this.upRankTxt.text = '不变';
        }
        //奖励倍数
        var reward = 0;
        if (param[2] > param[3]) {
            reward = param[2] - param[3];
        }
        this.rewardTxt.text = reward * GameGlobal.Arena.getUpRankReward() + '';
    };
    return ArenaPKResultPanel;
}(ResultBasePanel));
__reflect(ArenaPKResultPanel.prototype, "ArenaPKResultPanel");
//# sourceMappingURL=ArenaPKResultPanel.js.map