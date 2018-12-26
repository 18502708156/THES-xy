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
var CrossBattleWin = (function (_super) {
    __extends(CrossBattleWin, _super);
    function CrossBattleWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "CrossBattleMainSkin";
        _this.list.itemRenderer = CityTypeItem;
        return _this;
    }
    CrossBattleWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.MINI_MAP_UPDATE_LIST, this.UpdateMiniMap);
        this.observe(MessageDef.KFZB_MAINJNFEN_INFO, this.kingPointInfo);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.TEAM_UPDATE_MAP_LIST, this.TeamInfo);
        this.observe(MessageDef.JF_UPDATE_INFO, this.taskTraceBtnUpdate);
        this.observe(MessageDef.MOVE_UPDATE_INFO, this.showBnt);
        this.observe(MessageDef.CITYTYPE_UPDATE_INFO, this.UpdateMiniCity);
        this.observe(MessageDef.UP_GROUP_SHOW, this.upGroupShow);
        this.observe(MessageDef.SHOUCITY_UPDATE_INFO, this.ShowShouCity);
        this.observe(MessageDef.SEND_CITY, this.SendShouCity);
        this.observe(MessageDef.JF_UPDATE_INFO, this.taskTraceBtnUpdate);
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.clickList, this);
        this._AddClick(this.fuhuoBnt, this._click);
        this._AddClick(this.change, this._click);
        this._AddClick(this.taskTraceBtn, this._click);
        this._AddClick(this.team, this._click);
        this._AddClick(this.shouChen, this._click);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this.groupAdaptation.touchEnabled = false;
        GameGlobal.CrossBattleModel.getJfModel(); //请求数据
        for (var i = 1; i < 4; i++) {
            this._AddClick(this["buf" + i], this._bufclick);
        }
        GameGlobal.CrossBattleModel.addfightingIcon();
        this.UpdateContent();
        this.ShowShouCity();
        this.mapCityData();
    };
    CrossBattleWin.prototype.mapCityData = function () {
        for (var i = 0; i < 4; i++) {
            var data = GameGlobal.CrossBattleModel.getCityInfo(i);
            GameMap.GetMap().MainCityView.setRoleHead(i, data);
        }
    };
    CrossBattleWin.prototype.clickList = function () {
        GameGlobal.CrossBattleModel.listMoveMap(this.list.selectedIndex);
    };
    CrossBattleWin.prototype.ShowShouCity = function () {
        this.shouChen.visible = GameGlobal.CrossBattleModel.status == 4;
    };
    CrossBattleWin.prototype._bufclick = function (e) {
        switch (e.currentTarget) {
            case this.buf1:
                ViewManager.ins().open(CrossBattleTipPanel, 1);
                break;
            case this.buf2:
                ViewManager.ins().open(CrossBattleTipPanel, 2);
                break;
            case this.buf3:
                ViewManager.ins().open(CrossBattleTipPanel, 3);
                break;
        }
    };
    CrossBattleWin.prototype.showBnt = function (x, y) {
        var camp = GameGlobal.CrossBattleModel.camp;
        var config;
        switch (camp) {
            case 1:
                config = GameGlobal.Config.KingBaseConfig.rbronpos;
                break;
            case 2:
                config = GameGlobal.Config.KingBaseConfig.xcitypos;
                break;
            case 3:
                config = GameGlobal.Config.KingBaseConfig.mcitypos;
                break;
        }
        if (!config) {
            return;
        }
        if (x > config[0][0] && x < config[1][0] && y > config[0][1] && y < config[1][1]) {
            this.change.visible = true;
            this.team.visible = false;
        }
        else {
            this.change.visible = false;
            this.team.visible = true;
        }
        if (GameGlobal.CrossBattleModel.transform.indexOf(GameGlobal.actorModel.actorID) != -1) {
            this.team.visible = false;
            this.change.visible = false;
        }
    };
    CrossBattleWin.prototype._click = function (e) {
        switch (e.currentTarget) {
            case this.change:
                ViewManager.ins().open(CrossBattleChargeWarn);
                break;
            case this.fuhuoBnt:
                var config = GameGlobal.Config.KingBaseConfig;
                if (Checker.Money(config.revivecost.id, config.revivecost.count, Checker.YUNBAO_FRAME)) {
                    GameGlobal.CrossBattleModel.fuHuo();
                }
                break;
            case this.taskTraceBtn:
                // ViewManager.ins().open(CrossBattleJfWin);
                CrossBattleWin.SendGetPoint();
                break;
            case this.team:
                if (GameGlobal.CrossBattleTeamModel.mTeamInfo.HasTeam()) {
                    ViewManager.ins().open(CrossBattleTeamPanel);
                }
                else
                    ViewManager.ins().open(CrossBattleTeamWin);
                break;
            case this.shouChen:
                GameGlobal.CrossBattleModel.myGuardCityCs();
                break;
        }
    };
    CrossBattleWin.prototype.SendShouCity = function () {
        if (GameGlobal.CrossBattleModel.MyShouCity == 99) {
            return;
        }
        GameGlobal.CrossBattleModel.sendKingCityData(GameGlobal.CrossBattleModel.MyShouCity);
    };
    CrossBattleWin.prototype.TeamInfo = function () {
        var Raid = GameGlobal.RaidMgr.mMapRaid;
        if (egret.is(Raid, "MapRaidCrossBattle")) {
            Raid.DelayUpdateTeam();
        }
    };
    CrossBattleWin.prototype.upGroupShow = function (bool) {
        this.groupAdaptation.visible = bool;
    };
    CrossBattleWin.prototype.OnClose = function () {
        this.removeObserve();
    };
    CrossBattleWin.prototype.UpdateContent = function () {
        this.list.dataProvider = new eui.ArrayCollection([1, 2, 3, 4]);
        this.UpdateMiniMap();
        this.kingPointInfo();
        //this.fuHuoUpData()
        this.buffShow();
        this.UpdateMiniCity();
        this.AdaptationGroup();
        this.taskTraceBtnUpdate();
        this.buffShow();
        GameGlobal.CrossBattleModel.addfightingIcon();
        GameGlobal.CrossBattleModel.bianShen();
        this.mapCityData();
    };
    CrossBattleWin.prototype.taskTraceBtnUpdate = function () {
        var id = CrossBattleWin.GetPointIndex();
        if (!id) {
            this.taskTraceText.text = "全部领取";
        }
        else {
            this.taskTraceText.textFlow = ConsumeLabel.GetValueColor2(GameGlobal.CrossBattleModel.citypoint, GameGlobal.Config.KingWPointsRewardConfig[id].citypoints, Color.GREEN_LIGHT);
        }
    };
    CrossBattleWin.SendGetPoint = function () {
        var id = this.GetPointIndex();
        if (!id) {
            return;
        }
        if (GameGlobal.CrossBattleModel.citypoint < GameGlobal.Config.KingWPointsRewardConfig[id].citypoints) {
            UserTips.InfoTip("积分不足");
            return;
        }
        GameGlobal.CrossBattleModel.huoQuJiangLi(1, id);
    };
    CrossBattleWin.GetPointIndex = function () {
        var config = CommonUtils.GetArray(GameGlobal.Config.KingWPointsRewardConfig, "id");
        var cityPoint = GameGlobal.CrossBattleModel.citypoint;
        for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
            var data = config_1[_i];
            var id = data.id;
            if (GameGlobal.CrossBattleModel.cityreward.indexOf(id) == -1) {
                return id;
            }
        }
        return null;
    };
    CrossBattleWin.prototype.kingPointInfo = function () {
        this.startTimer = TimerManager.ins().doTimer(1000, 0, this.kingPointInfo, this);
        var data = GameGlobal.CrossBattleModel.camppoint;
        for (var i = 0; i < data.length; i++) {
            //this["title" + data[i].camp].text = GameGlobal.CrossBattleModel.CITYNAME[data[i].camp] + "阵营   王城积分 ：" + data[i].point;
            /*if(data[i].camp == GameGlobal.CrossBattleModel.camp){
                this["title" + data[i].camp].textColor = 0xE87E27
            }*/
            this["title" + (i + 1)].text = GameGlobal.CrossBattleModel.CITYNAME[data[i].camp] + "阵营   王城积分 ：" + data[i].point;
        }
        this["title1"].textColor = 0xE87E27;
        this.mydata.text = "我的王城积分：" + GameGlobal.CrossBattleModel.citypoint;
        if (GameGlobal.CrossBattleModel.actcountdown > 0) {
            if (GameGlobal.CrossBattleModel.status == 1) {
                this.time.text = "活动开始倒计时" + (GameGlobal.CrossBattleModel.actcountdown - GameServer.serverTime) + "秒";
            }
            else {
                this.time.text = "活动结束倒计时" + (GameGlobal.CrossBattleModel.actcountdown - GameServer.serverTime) + "秒";
            }
        }
    };
    CrossBattleWin.prototype.UpdateMiniMap = function () {
        var raid = GameGlobal.RaidMgr.mMapRaid;
        this.miniMap._setBg("resource/assets/map/map311/pk_preview.jpg");
        this.miniMap._removeAll();
        for (var key in raid.cTeam) {
            this.miniMap._setRole(raid.cTeam[key]);
        }
    };
    CrossBattleWin.prototype.UpdateMiniCity = function () {
        for (var i = 0; i < 4; i++) {
            this.miniMap.citySet(i);
        }
    };
    CrossBattleWin.prototype.AdaptationGroup = function () {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 211;
    };
    CrossBattleWin.prototype.buffShow = function () {
        var buf = GameGlobal.CrossBattleModel.getBuff();
        for (var i = 1; i < 4; i++) {
            //this["buf"+i].visible = false     
            this["buf" + i].filters = Color.GetFilter();
        }
        for (var n = 0; n < buf.length; n++) {
            //this["buf"+buf[n]].visible = true
            this["buf" + buf[n]].filters = [];
        }
    };
    CrossBattleWin.NAME = "跨服争霸";
    CrossBattleWin.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    CrossBattleWin.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return CrossBattleWin;
}(BaseEuiView));
__reflect(CrossBattleWin.prototype, "CrossBattleWin");
var CityTypeItem = (function (_super) {
    __extends(CityTypeItem, _super);
    function CityTypeItem() {
        var _this = _super.call(this) || this;
        _this.CITYNAME = [
            "王城",
            "人族边城",
            "仙族边城",
            "魔族边城"
        ];
        _this.skinName = "CityTypeSkin";
        return _this;
    }
    CityTypeItem.prototype.childrenCreated = function () {
    };
    CityTypeItem.prototype.dataChanged = function () {
        var data = this.data;
        var Config = GameGlobal.Config.KingCityConfig[data][10];
        this.cityName.text = this.CITYNAME[Config.id - 1];
        // if (Config.type == 0) {
        this.title.text = "每分钟 + " + Config.citypoints + "积分";
        // } else {
        // 	this.title.text = "每分钟 + " + Config.guardpoints + "积分";
        // }
        if (Config.type == GameGlobal.CrossBattleModel.camp) {
            this.title0.textColor = 0x019704;
            this.title0.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>前往守卫</u></a>");
        }
        else {
            this.title0.textColor = 0xFF0000;
            this.title0.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>前往攻击</u></a>");
        }
    };
    return CityTypeItem;
}(eui.ItemRenderer));
__reflect(CityTypeItem.prototype, "CityTypeItem");
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Chest.prototype, "_boxName", {
        set: function (str) {
            this.boxName.text = str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chest.prototype, "_title", {
        set: function (str) {
            this.title.text = str;
        },
        enumerable: true,
        configurable: true
    });
    return Chest;
}(eui.Component));
__reflect(Chest.prototype, "Chest", ["eui.UIComponent", "egret.DisplayObject"]);
var RoleHeadItem = (function (_super) {
    __extends(RoleHeadItem, _super);
    function RoleHeadItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RoleHeadSkin";
        return _this;
    }
    RoleHeadItem.prototype.childrenCreated = function () {
    };
    RoleHeadItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            return;
        }
        this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[GameGlobal.CrossBattleModel.oneCity.currcamp];
        this.typeName.text = GameGlobal.CrossBattleModel.ZHENGNAME[GameGlobal.CrossBattleModel.oneCity.currcamp];
        this.username.text = data.name;
        this.deal.visible = data.isdead;
        this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex);
    };
    return RoleHeadItem;
}(eui.ItemRenderer));
__reflect(RoleHeadItem.prototype, "RoleHeadItem");
var GwHeadItem = (function (_super) {
    __extends(GwHeadItem, _super);
    function GwHeadItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GwHeadSkin";
        return _this;
    }
    GwHeadItem.prototype.childrenCreated = function () {
    };
    GwHeadItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            return;
        }
        // this.head.source = "resource/assets/atlas/image/head/pet/" + data.bossicon + ".png";
        this.head.source = data.bossicon;
        this.username.text = data.name;
    };
    return GwHeadItem;
}(eui.ItemRenderer));
__reflect(GwHeadItem.prototype, "GwHeadItem");
var HeadItem = (function (_super) {
    __extends(HeadItem, _super);
    function HeadItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GwHeadSkin";
        return _this;
    }
    HeadItem.prototype.childrenCreated = function () {
    };
    HeadItem.prototype.dataChanged = function () {
        var data = this.data;
        if (!data) {
            return;
        }
        // this.head.source = "resource/assets/atlas/image/head/pet/" + data.bossicon + ".png";
        this.head.source = ResDataPath.GetHeadImgName(data.job, data.sex);
        this.username.text = data.name;
    };
    return HeadItem;
}(eui.ItemRenderer));
__reflect(HeadItem.prototype, "HeadItem");
//# sourceMappingURL=CrossBattleWin.js.map