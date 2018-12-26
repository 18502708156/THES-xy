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
var CrossBattleCityInfomaTion = (function (_super) {
    __extends(CrossBattleCityInfomaTion, _super);
    function CrossBattleCityInfomaTion() {
        return _super.call(this) || this;
    }
    CrossBattleCityInfomaTion.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CrossBattleCityInfomaTionSkin";
        this.list.itemRenderer = RoleHeadItem;
        this.jilulist.itemRenderer = jiLuItem;
    };
    CrossBattleCityInfomaTion.prototype.OnOpen = function () {
        this.CommonWindowBg.OnAdded(this);
        this.observe(MessageDef.KFZB_ONECITY_INFO, this.UpdateContent);
        this._AddClick(this.bloom, this.bloomOnTop);
        UIHelper.SetLinkStyleLabel(this.lvse);
        this._AddClick(this.lvse, this.lvseOntop);
        GameGlobal.MessageCenter.dispatch(MessageDef.UP_GROUP_SHOW, false);
        this.AddLoopTimer(1000, this.Update);
    };
    CrossBattleCityInfomaTion.prototype.bloomOnTop = function () {
        ViewManager.ins().open(CrossBattleTipPanel, 4);
    };
    CrossBattleCityInfomaTion.prototype.lvseOntop = function () {
        CrossBattleWin.SendGetPoint();
    };
    CrossBattleCityInfomaTion.prototype.OnClose = function () {
        this.removeObserve();
        this.removeEvents();
        this.CommonWindowBg.OnRemoved();
        GameGlobal.MessageCenter.dispatch(MessageDef.UP_GROUP_SHOW, true);
        // TimerManager.ins().remove(this.startTimer, this);
    };
    ;
    CrossBattleCityInfomaTion.prototype.Update = function () {
        if (!GameGlobal.CrossBattleModel.oneCity) {
            return;
        }
        var time = GameServer.serverTime - GameGlobal.CrossBattleModel.oneCity.guardtime;
        this.scsjText.text = "守城时间：" + Math.max(time, 0) + "秒";
    };
    CrossBattleCityInfomaTion.prototype.UpdateContent = function () {
        var data = GameGlobal.CrossBattleModel.oneCity;
        if (!data) {
            return;
        }
        for (var i = data.guards.length; i < 3; i++) {
            data.guards.push(null);
        }
        this.list.dataProvider = new eui.ArrayCollection(data.guards);
        this.pro.maximum = data.maxhp;
        this.pro.value = data.currhp;
        // let time2 = GameServer.serverTime + GameGlobal.CrossBattleModel.oneCity.pointtime
        this.wcljText.text = "累计王城积分：" + data.point + "分（5/分）" /*+在坚持 GameServer.GetPkTime(time2) + "后可获得"*/;
        // GameGlobal.CrossBattleModel.oneCity.pointtime--
        this.jilulist.dataProvider = new eui.ArrayCollection(data.record);
    };
    CrossBattleCityInfomaTion.LAYER_LEVEL = LayerManager.UI_Main_2;
    return CrossBattleCityInfomaTion;
}(BaseEuiView));
__reflect(CrossBattleCityInfomaTion.prototype, "CrossBattleCityInfomaTion");
var jiLuItem = (function (_super) {
    __extends(jiLuItem, _super);
    function jiLuItem() {
        var _this = _super.call(this) || this;
        _this.TYPECOLOR = [
            "#019704",
            "#DB0000",
            "#F77C67"
        ];
        _this.skinName = "jiLuitemSkin";
        return _this;
    }
    jiLuItem.prototype.childrenCreated = function () {
    };
    jiLuItem.prototype.dataChanged = function () {
        var data = this.data;
        var str = GameServer.PanTaoHui(data.time) + "";
        str += '<font color = "' + this.TYPECOLOR[data.camp - 1] + '">' + GameGlobal.CrossBattleModel.CITYNAME[data.camp] + '</font>';
        for (var i = 0; i < data.names.length; i++) {
            str += data.names[i] + " ";
        }
        str += "队伍攻城，被我方在3个回合击败，城池受到了" + data.changhp + "点伤害";
        this.text.textFlow = (new egret.HtmlTextParser()).parser(str);
    };
    return jiLuItem;
}(eui.ItemRenderer));
__reflect(jiLuItem.prototype, "jiLuItem");
//# sourceMappingURL=CrossBattleCityInfomaTion.js.map