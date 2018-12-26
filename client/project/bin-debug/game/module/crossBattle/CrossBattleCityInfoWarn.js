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
var CrossBattleCityInfoWarn = (function (_super) {
    __extends(CrossBattleCityInfoWarn, _super);
    function CrossBattleCityInfoWarn() {
        return _super.call(this) || this;
    }
    CrossBattleCityInfoWarn.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "CrossBattleCityInfoSkin";
        this.list.itemRenderer = RoleHeadItem;
        this.GwHeadItem.itemRenderer = GwHeadItem;
    };
    CrossBattleCityInfoWarn.prototype.OnOpen = function () {
        this.commonDialog.OnAdded(this);
        this.commonDialog.setBgVisible(true);
        this.observe(MessageDef.KFZB_ONECITY_INFO, this.UpdateContent);
        this.AddClick(this.sureBtn, this.onTap);
        this.AddClick(this.bloom, this.bloomTap);
    };
    CrossBattleCityInfoWarn.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeEvents();
    };
    CrossBattleCityInfoWarn.prototype.UpdateContent = function () {
        var data = GameGlobal.CrossBattleModel.oneCity;
        // this.text.text = "边城"  //GameGlobal.CrossBattleModel.CITYNAME[data.currcamp]
        this.text.text = data.camp == 0 ? "王城" : "边城";
        //CrossBattleCityInfoWarn.NAME = GameGlobal.CrossBattleModel.ZHENGNAME[data.currcamp]
        if (data.currcamp == GameGlobal.CrossBattleModel.camp) {
            this.currentState = "shou";
            this.all.visible = data.guards.length == 3;
            this.sureBtn.visible = data.guards.length != 3;
        }
        else {
            this.currentState = "gong";
        }
        for (var i = data.guards.length; i < 3; i++) {
            data.guards.push(null);
        }
        var rolenum = 0;
        for (var i = 0; i < data.guards.length; i++) {
            if (data.guards[i] != null) {
                rolenum++;
            }
        }
        if (rolenum == 0) {
            this.list.visible = false;
            this.GwHeadItem.visible = true;
        }
        else {
            this.list.visible = true;
            this.GwHeadItem.visible = false;
        }
        //GameGlobal.Config.KingCityConfig[data.camp]
        var Config = GameGlobal.Config.KingCityConfig[data.camp + 1][10];
        var boos = {
            bossicon: "",
            name: ""
        };
        var booss = [];
        for (var i = 0; i < Config.bossicon.length; i++) {
            boos.bossicon = Config.bossicon[i];
            boos.name = Config.name[i];
            booss.push(boos);
        }
        this.list.dataProvider = new eui.ArrayCollection(data.guards);
        this.GwHeadItem.dataProvider = new eui.ArrayCollection(booss);
        this.pro.maximum = data.maxhp;
        this.pro.value = data.currhp;
        this.typeBuff.source = GameGlobal.CrossBattleModel.BUFFTYPE[data.currcamp];
        this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[data.currcamp];
        this.typeName.text = GameGlobal.CrossBattleModel.ZHENGNAME[data.currcamp];
    };
    CrossBattleCityInfoWarn.prototype.bloomTap = function () {
        ViewManager.ins().open(CrossBattleTipPanel, 4);
    };
    CrossBattleCityInfoWarn.prototype.onTap = function () {
        var data = GameGlobal.CrossBattleModel.oneCity;
        if (this.currentState == "gong") {
            if (GameGlobal.CrossBattleModel.status == 1) {
                UserTips.ErrorTip("无法攻击，处于准备状态");
                return;
            }
            if (GameGlobal.CrossBattleModel.status == 3) {
                UserTips.ErrorTip("无法攻击，处于死亡状态");
                return;
            }
            if (GameGlobal.CrossBattleModel.status == 4) {
                UserTips.ErrorTip("无法攻击，处于守城状态");
                return;
            }
            GameGlobal.CrossBattleModel.attackCity(data.camp); //请求战斗
        }
        else {
            if (GameGlobal.CrossBattleModel.status == 1) {
                UserTips.ErrorTip("无法守城，处于准备状态");
                return;
            }
            if (GameGlobal.CrossBattleModel.status == 3) {
                UserTips.ErrorTip("无法守城，处于死亡状态");
                return;
            }
            if (GameGlobal.CrossBattleModel.status == 4) {
                UserTips.ErrorTip("无法守城，处于守城状态");
                return;
            }
            GameGlobal.CrossBattleModel.fangShouCity(data.camp);
        }
    };
    CrossBattleCityInfoWarn.prototype.buffShow = function () {
    };
    CrossBattleCityInfoWarn.LAYER_LEVEL = LayerManager.UI_Main_2;
    return CrossBattleCityInfoWarn;
}(BaseEuiView));
__reflect(CrossBattleCityInfoWarn.prototype, "CrossBattleCityInfoWarn");
//# sourceMappingURL=CrossBattleCityInfoWarn.js.map