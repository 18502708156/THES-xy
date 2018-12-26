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
var GangMineRankItem = (function (_super) {
    __extends(GangMineRankItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangMineRankItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GangMineRankItemSkin';
        return _this;
    }
    GangMineRankItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = null;
    };
    GangMineRankItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var info = this.data;
        this.tname.text = info.guildName + '.S' + info.serverId;
        this.tscore.text = info.score + '分';
        this.trank.text = '第' + info.rank + '名';
        var reward = info.getRankReward();
        if (reward.length > 0) {
            this.list.dataProvider = new eui.ArrayCollection(reward);
        }
    };
    return GangMineRankItem;
}(eui.ItemRenderer));
__reflect(GangMineRankItem.prototype, "GangMineRankItem");
//# sourceMappingURL=GangMineRankItem.js.map