class CloudNineRankPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup;

    /////////////////////////////////////////////////////////////////////////////
    // CloudNineRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected list: eui.List;
    protected trank: eui.Label;
    protected roleShowpanel: RoleShowPanel;
    protected legendOfEmpirebgImg: eui.Image
    protected rankTypeTxt: eui.Label;
    protected tabList: eui.List;
    protected topTipsTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
    tab = [
        { type: CloudNineRankType.local, name: "排行" },
        { type: CloudNineRankType.legendOfEmpire, name: "周排行" }
    ]
    protected dataArray;
    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "CloudNineRankSkin";
    };

    initData() {
        GameGlobal.MessageCenter.addListener(MessageDef.CLOUD_NINE_RANK, this.UpdateContent, this)
        this.list.itemRenderer = CloudNineRankItem;
        this.list.dataProvider = null;
        this.tabList.itemRenderer = WindowTabBarItem;

    }

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.AddItemClick(this.tabList, this.itemClick)
        //args[0] 排行榜类型 本次活动/跨服排行
        if (args[0] == CloudNineRankType.local) {
            this.currentState = "local"
            this.commonWindowBg.SetTitle('排名');
            GameGlobal.CloudNineModel.sendLocalRank();
        }
        else if (args[0] == CloudNineRankType.legendOfEmpire) {
            this.currentState = "legendOfEmpire"
            this.commonWindowBg.SetTitle('跨服排名');
            GameGlobal.CloudNineModel.sendLocalRank();
            this.topTipsTxt.text = "每周一根据区服排名累计积分，发放排名奖励"
        }
        else
            UserTips.ins().showTips("未定义类型");
        CommonUtils.addLableStrokeColor(this.topTipsTxt, 0x460009, 3);
        this.tabList.dataProvider = new eui.ArrayCollection(this.tab);
        this.tabList.validateNow();
        this.tabList.selectedIndex = 0;
    }

    private UpdateContent(req) {
        if (GameGlobal.CloudNineModel.rankType == CloudNineRankType.legendOfEmpire) {
            if (req.ranklist.length != 0)
                this.roleShowpanel.SetShowImage(req);
        }
        this.dataArray = new eui.ArrayCollection();
        let rankList = [];
        let config = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType];
        for (let val of config) {
            if (val.min <= req.ranklist.length)
                rankList.push(req.ranklist[val.min - 1])
            else
                break;
        }
        for (let i = 0; i < rankList.length; i++) {
            let _date = {};
            _date = rankList[i];
            _date["king"] = req.king;
            this.dataArray.addItem(_date);
        }

        this.list.dataProvider = this.dataArray;
        let isMe: boolean = false;
        for (let key in req.ranklist) {
            if (req.ranklist[key].name == GameGlobal.actorModel.name) {
                this.trank.text = req.ranklist[key].rank + '';
                isMe = true;
                break;
            }
        }
        if (!isMe) this.trank.text = '未上榜';
    }
    itemClick(e) {
        this.roleShowpanel.ClearCache();
        this.roleShowpanel.SetTitle("");
        if (this.tabList.selectedItem.type == CloudNineRankType.local) {
            this.commonWindowBg.SetTitle('排名');
            GameGlobal.CloudNineModel.sendLocalRank();
            this.topTipsTxt.text = "根据活动累计积分排名，发放排名奖励"
        }
        else if (this.tabList.selectedItem.type == CloudNineRankType.legendOfEmpire) {
            this.commonWindowBg.SetTitle('跨服排名');
            GameGlobal.CloudNineModel.sendAllRank();
            this.topTipsTxt.text = "每周一根据区服排名累计积分，发放排名奖励"
        }
        this.list.dataProvider = null;
    }

    OnClose() {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
}
class CloudNineRankItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineRankItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected trank: eui.Label;
    protected tname: eui.Label;
    protected tscore: eui.Label;
    protected list: eui.List;
    protected chenghaoImg: eui.Image

    /////////////////////////////////////////////////////////////////////////////
    public constructor() {
        super()
        this.skinName = 'CloudNineRankItemSkin';
    }

    childrenCreated() {
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = null;
    }

    dataChanged() {
        if (!this.data) return;
        this.tname.text = this.data.name + '.S' + this.data.serverid;
        this.tscore.text = this.data.score + '分';
        this.trank.text = '第' + this.data.rank + '名';
        this.chenghaoImg.visible = this.data.dbid == this.data.king;
        let config = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType]//[this.data.rank - 1];
        let itemConfig = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType][this.data.rank - 1]
        for (let key in config) {
            if (this.data.rank >= config[key].min && this.data.rank < config[key].max) {
                itemConfig = config[key];
                break;
            }
        }

        if (itemConfig) {
            this.list.dataProvider = new eui.ArrayCollection(itemConfig.reward);
        }
        if (itemConfig.min != itemConfig.max) {
            this.tname.text = '第' + itemConfig.min + '-' + itemConfig.max + "名";
            this.tscore.text = '奖励';
            this.trank.text = '第' + itemConfig.min + '-' + itemConfig.max + "名";
        }
    }
}
