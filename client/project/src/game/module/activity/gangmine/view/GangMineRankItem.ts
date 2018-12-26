class GangMineRankItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected trank: eui.Label;
    protected tname: eui.Label;
    protected tscore: eui.Label;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////
    public constructor() {
        super()
        this.skinName = 'GangMineRankItemSkin';
    }

    childrenCreated() {
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = null;
    }

    dataChanged() {
        if (!this.data) return;
        let info: GangMineRankInfo = this.data;
        this.tname.text = info.guildName + '.S' + info.serverId;
        this.tscore.text = info.score + '分';
        this.trank.text = '第' + info.rank + '名';
        let reward = info.getRankReward();
        if (reward.length > 0) {
            this.list.dataProvider = new eui.ArrayCollection(reward);
        }
    }
}
