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
var GangPantaoYuanPanel = (function (_super) {
    __extends(GangPantaoYuanPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangPantaoYuanPanel() {
        return _super.call(this) || this;
    }
    GangPantaoYuanPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = GangPanTaoHuiListItem;
    };
    GangPantaoYuanPanel.prototype.UpdateContent = function () {
        UIHelper.ShowRedPoint(this.bnt0, GameGlobal.GangModel.HasPantao());
        UIHelper.ShowRedPoint(this.bnt1, GameGlobal.GangModel.HasPantao());
        UIHelper.ShowRedPoint(this.bnt2, GameGlobal.GangModel.HasPantao());
        for (var i = 0; i < 3; i++) {
            this["redPoint" + i].visible = GameGlobal.GangModel.getPanTaoRed(i + 1) == 2;
            this["baoXian" + i].filters = GameGlobal.GangModel.getPanTaoRed(i + 1) == 1 ? Color.GetFilter() : null;
        }
        for (var i = 0; i < 3; i++) {
            var config = GlobalConfig.ins().GuildPeachConfig[i + 1];
            this["PriceIcon" + i].setType(config.cost.id);
            this["PriceIcon" + i].setPrice(config.cost.count);
            this["qd" + i].visible = !BitUtil.Has(GameGlobal.GangModel.rewardMark, i);
            this["attr" + i].text = "+" + config.exp + "帮会资金 \n+" + config.reward.count + "" + MoneyConstToName[config.reward.id] + " \n+" + config.peachvalue + "蟠桃值";
        }
        this.exp.text = "今日进度： " + GameGlobal.GangModel.panTaoHuiExp + "/60";
        this.pro.maximum = 60;
        this.pro.value = GameGlobal.GangModel.panTaoHuiExp;
        for (var i = 0; i < 3; i++) {
            GameGlobal.GangModel.getPantao ? this['bnt' + i].currentState = "disabled" : this['bnt' + i].currentState = "up";
        }
        this.updateList();
    };
    GangPantaoYuanPanel.prototype.updateList = function () {
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.GangModel.panTaoHuiList.reverse());
    };
    GangPantaoYuanPanel.prototype.OnOpen = function () {
        GameGlobal.GangModel.SendGetPanTaoHuiInfo();
        for (var i = 0; i < 3; i++) {
            this.AddClick(this["bnt" + i], this._OnClick);
            this.AddClick(this["baoXian" + i], this._OnClick);
        }
        // this.pro.maximum = 300; 
        this.observe(MessageDef.GANG_UPDATE_PANTAOINFO, this.UpdateContent);
    };
    GangPantaoYuanPanel.prototype.OnClose = function () {
    };
    GangPantaoYuanPanel.prototype._OnClick = function (e) {
        var src = "蟠桃会奖励";
        var config = GlobalConfig.ins().GuildPeachRewardConfig;
        switch (e.currentTarget) {
            case this.bnt0:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.gold);
                break;
            case this.bnt1:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.yuanbao);
                break;
            case this.bnt2:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.byb);
                break;
            case this.baoXian0:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, function () {
                    GameGlobal.GangModel.panTaoBoxPeach(1);
                });
                break;
            case this.baoXian1:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, function () {
                    GameGlobal.GangModel.panTaoBoxPeach(2);
                });
                break;
            case this.baoXian2:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, function () {
                    GameGlobal.GangModel.panTaoBoxPeach(3);
                });
                break;
        }
    };
    GangPantaoYuanPanel.NAME = "蟠桃会";
    return GangPantaoYuanPanel;
}(BaseView));
__reflect(GangPantaoYuanPanel.prototype, "GangPantaoYuanPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=GangPantaoYuanPanel.js.map