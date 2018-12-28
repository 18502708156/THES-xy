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
var ActivityWin = (function (_super) {
    __extends(ActivityWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ActivityWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "ActivityWinSkin";
        _this.commonWindowBg.SetTitle('活动大厅');
        return _this;
    }
    ActivityWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = ActivityItem;
        var activityList = CommonUtils.GetArray(GameGlobal.Config.ActivityListConfig, "orderpos");
        for (var i = activityList.length - 1; i >= 0; --i) {
            if (GameGlobal.actorModel.level < activityList[i].showlv) {
                activityList.splice(i, 1);
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(activityList);
    };
    ActivityWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGBATTLE_OPEN_GATEVIEW, this.CloseSelf);
        this.observe(MessageDef.ACTIVITY_LIST_INFO, this.UpdateList);
        GameGlobal.ActivityModel.sendActivityList();
        GameGlobal.ActivityModel.sendActivityInfoReq();
    };
    ActivityWin.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    ActivityWin.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    ActivityWin.openCheck = function () {
        return Deblocking.Check(DeblockingType.TYPE_121);
    };
    ActivityWin.LAYER_LEVEL = LayerManager.UI_Main;
    return ActivityWin;
}(BaseEuiView));
__reflect(ActivityWin.prototype, "ActivityWin", ["ICommonWindow"]);
var ActivityItem = (function (_super) {
    __extends(ActivityItem, _super);
    function ActivityItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityItem.prototype.childrenCreated = function () {
        this.tipTxt.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>说明</u></a>");
        this.goTxt.textFlow = (new egret.HtmlTextParser).parser("<a href='event:go'><u>马上前往</u></a>");
        this.tipTxt.addEventListener(egret.TextEvent.LINK, this.showTip, this);
        this.goTxt.addEventListener(egret.TextEvent.LINK, this.gotoHandler, this);
        this.ranKBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
        this.list.itemRenderer = ItemBaseNotName;
        this.list.dataProvider = null;
    };
    ActivityItem.prototype.showTip = function (e) {
        ViewManager.ins().open(ActivityDescPanel, this.descID);
    };
    ActivityItem.prototype.gotoHandler = function (e) {
        if (!Deblocking.Check(this.openID)) {
            return;
        }
        var isopen = GameGlobal.ActivityModel.activityList[this.type];
        //帮会战和帮会BOSS无论开启与否。都可以点击进入里面的界面
        if (!isopen && this.type != ActivityModel.TYPE_GANG_BATTLE && this.type != ActivityModel.TYPE_GANG_BOSS) {
            GameGlobal.UserTips.showTips('活动未开启');
            return;
        }
        switch (this.type) {
            case ActivityModel.TYPE_ANSWER:
                // if(GameGlobal.AnswerManage.openAnswer())
                if (GameGlobal.AnswerController.bOpenAnswer()) {
                    ViewManager.ins().open(AnswerLayer);
                }
                else {
                    GameGlobal.UserTips.showTips('活动未开启');
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
                break;
            case ActivityModel.TYPE_QUJING:
                ViewManager.ins().open(QujingMainWin);
                break;
            case ActivityModel.TYPE_GANG_BOSS:
                if (!GameGlobal.actorModel.HasGuild()) {
                    GameGlobal.UserTips.showTips('请先加入帮派');
                    return;
                }
                ViewManager.ins().open(GangBossPanel);
                break;
            case ActivityModel.TYPE_GANGMINE:
                if (!GameGlobal.actorModel.HasGuild()) {
                    GameGlobal.UserTips.showTips('请先加入帮派');
                    return;
                }
                ViewManager.ins().open(GangMinePanel);
                break;
            case ActivityModel.TYPE_CROSS_BATTLE:
                GameGlobal.ActivityModel.sendActivityEnter(this.type);
                // ViewManager.ins().open(CrossBattleWin);
                break;
            case ActivityModel.TYPE_GANG_BATTLE:
                if (!Deblocking.Check(DeblockingType.TYPE_56))
                    return;
                if (!GameGlobal.actorModel.HasGuild()) {
                    GameGlobal.UserTips.showTips('请先加入帮派');
                    return;
                }
                GameGlobal.GangBattleModel.SendEnterBattle();
                break;
            case ActivityModel.TYPE_WULIN_ZHENGBA:
                break;
            case ActivityModel.TYPE_CLOUD_NINE:
                GameGlobal.CloudNineModel.sendLeaveTime();
                break;
        }
    };
    ActivityItem.prototype.rankHandler = function (e) {
        switch (this.type) {
            case ActivityModel.TYPE_ANSWER:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_DATI]);
                break;
            case ActivityModel.TYPE_QUJING:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_QUJING]);
                break;
            case ActivityModel.TYPE_GANGMINE:
                ViewManager.ins().open(GangMineCrossRankPanel);
                break;
            case ActivityModel.TYPE_CLOUD_NINE:
                ViewManager.ins().open(CloudNineRankPanel, CloudNineRankType.legendOfEmpire);
                break;
            case ActivityModel.TYPE_GANG_BOSS:
            case ActivityModel.TYPE_GANG_BATTLE:
            case ActivityModel.TYPE_CROSS_BATTLE:
                ActivityRewardShowWin.Open(this.type);
                break;
            case ActivityModel.TYPE_WULIN_ZHENGBA:
                break;
        }
    };
    ActivityItem.prototype.dataChanged = function () {
        var config = this.data;
        this.descID = config.illustrate;
        this.type = config.type;
        this.openID = config.openlv;
        this.descGroup.visible = config.illustrate > 0;
        this.typeImg.source = config.icon;
        this.titleImg.source = config.nameicon;
        this.list.dataProvider = new eui.ArrayCollection(config.rewardshow);
        var iconPath = ActivityModel.ICONSOURCE_MAP[config.type];
        this.ranKBtn.icon = iconPath;
        var _a = this._GetDesc(config), strDes = _a[0], descText = _a[1];
        this.timeDesc1.textFlow = TextFlowMaker.generateTextFlow(strDes);
        this.timeDesc0.text = descText;
    };
    ActivityItem.prototype._GetDesc = function (config) {
        var strDes = config.acday;
        var descText = config.actime;
        switch (config.type) {
            case ActivityModel.TYPE_ANSWER:
                strDes = "|C:0xe6f1f4&T:" + config.acday + ":|C:0x019704&T:" + (GameGlobal.ActivityKaiFuModel.answerFisrstNe || "") + "|";
                break;
            case ActivityModel.TYPE_QUJING:
                var baseInfo = GameGlobal.QujingModel.baseInfo;
                var escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum;
                strDes = "|C:0xe6f1f4&T:" + config.acday + " |C:0x019704&T:" + (escortMaxCount - baseInfo.mEscortCount) + "/" + escortMaxCount + "|";
                descText = GameGlobal.QujingModel.GetDoubleTimeDesc();
                break;
            case ActivityModel.TYPE_GANG_BOSS:
                break;
            case ActivityModel.TYPE_GANGMINE:
                break;
            case ActivityModel.TYPE_CROSS_BATTLE:
                break;
            case ActivityModel.TYPE_GANG_BATTLE:
                break;
            case ActivityModel.TYPE_WULIN_ZHENGBA:
                break;
            case ActivityModel.TYPE_CLOUD_NINE:
                break;
        }
        return [strDes, descText];
    };
    return ActivityItem;
}(eui.ItemRenderer));
__reflect(ActivityItem.prototype, "ActivityItem");
//# sourceMappingURL=ActivityWin.js.map