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
var CloudNineRankPanel = (function (_super) {
    __extends(CloudNineRankPanel, _super);
    function CloudNineRankPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tab = [
            { type: CloudNineRankType.local, name: "排行" },
            { type: CloudNineRankType.legendOfEmpire, name: "周排行" }
        ];
        return _this;
    }
    CloudNineRankPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CloudNineRankSkin";
    };
    ;
    CloudNineRankPanel.prototype.initData = function () {
        GameGlobal.MessageCenter.addListener(MessageDef.CLOUD_NINE_RANK, this.UpdateContent, this);
        this.list.itemRenderer = CloudNineRankItem;
        this.list.dataProvider = null;
        this.tabList.itemRenderer = WindowTabBarItem;
    };
    CloudNineRankPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.AddItemClick(this.tabList, this.itemClick);
        //args[0] 排行榜类型 本次活动/跨服排行
        if (args[0] == CloudNineRankType.local) {
            this.currentState = "local";
            this.commonWindowBg.SetTitle('排名');
            GameGlobal.CloudNineModel.sendLocalRank();
        }
        else if (args[0] == CloudNineRankType.legendOfEmpire) {
            this.currentState = "legendOfEmpire";
            this.commonWindowBg.SetTitle('跨服排名');
            GameGlobal.CloudNineModel.sendLocalRank();
            this.topTipsTxt.text = "每周一根据区服排名累计积分，发放排名奖励";
        }
        else
            UserTips.ins().showTips("未定义类型");
        CommonUtils.addLableStrokeColor(this.topTipsTxt, 0x460009, 3);
        this.tabList.dataProvider = new eui.ArrayCollection(this.tab);
        this.tabList.validateNow();
        this.tabList.selectedIndex = 0;
    };
    CloudNineRankPanel.prototype.UpdateContent = function (req) {
        if (GameGlobal.CloudNineModel.rankType == CloudNineRankType.legendOfEmpire) {
            if (req.ranklist.length != 0)
                this.roleShowpanel.SetShowImage(req);
        }
        this.dataArray = new eui.ArrayCollection();
        var rankList = [];
        var config = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType];
        for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
            var val = config_1[_i];
            if (val.min <= req.ranklist.length)
                rankList.push(req.ranklist[val.min - 1]);
            else
                break;
        }
        for (var i = 0; i < rankList.length; i++) {
            var _date = {};
            _date = rankList[i];
            _date["king"] = req.king;
            this.dataArray.addItem(_date);
        }
        this.list.dataProvider = this.dataArray;
        var isMe = false;
        for (var key in req.ranklist) {
            if (req.ranklist[key].name == GameGlobal.actorModel.name) {
                this.trank.text = req.ranklist[key].rank + '';
                isMe = true;
                break;
            }
        }
        if (!isMe)
            this.trank.text = '未上榜';
    };
    CloudNineRankPanel.prototype.itemClick = function (e) {
        this.roleShowpanel.ClearCache();
        this.roleShowpanel.SetTitle("");
        if (this.tabList.selectedItem.type == CloudNineRankType.local) {
            this.commonWindowBg.SetTitle('排名');
            GameGlobal.CloudNineModel.sendLocalRank();
            this.topTipsTxt.text = "根据活动累计积分排名，发放排名奖励";
        }
        else if (this.tabList.selectedItem.type == CloudNineRankType.legendOfEmpire) {
            this.commonWindowBg.SetTitle('跨服排名');
            GameGlobal.CloudNineModel.sendAllRank();
            this.topTipsTxt.text = "每周一根据区服排名累计积分，发放排名奖励";
        }
        this.list.dataProvider = null;
    };
    CloudNineRankPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    CloudNineRankPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return CloudNineRankPanel;
}(BaseEuiView));
__reflect(CloudNineRankPanel.prototype, "CloudNineRankPanel");
var CloudNineRankItem = (function (_super) {
    __extends(CloudNineRankItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CloudNineRankItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'CloudNineRankItemSkin';
        return _this;
    }
    CloudNineRankItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = null;
    };
    CloudNineRankItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        this.tname.text = this.data.name + '.S' + this.data.serverid;
        this.tscore.text = this.data.score + '分';
        this.trank.text = '第' + this.data.rank + '名';
        this.chenghaoImg.visible = this.data.dbid == this.data.king;
        var config = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType]; //[this.data.rank - 1];
        var itemConfig = GameGlobal.Config.ClimbTowerRewardConfig[GameGlobal.CloudNineModel.rankType][this.data.rank - 1];
        for (var key in config) {
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
    };
    return CloudNineRankItem;
}(eui.ItemRenderer));
__reflect(CloudNineRankItem.prototype, "CloudNineRankItem");
//# sourceMappingURL=CloudNineRankPanel.js.map