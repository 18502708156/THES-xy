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
var GangBossPanel = (function (_super) {
    __extends(GangBossPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangBossPanel() {
        var _this = _super.call(this) || this;
        ////////
        _this.tPanelData = []; //界面总体数据数据
        _this.nStatus = 0; //boss状态
        _this.nCountTime = 0; //倒计时
        _this.skinName = "GangBossPanelSkin";
        _this.commonWindowBg.SetTitle("帮会BOSS");
        _this.listBoss.itemRenderer = ItemBaseNotName;
        _this.listHave.itemRenderer = ItemBaseNotName;
        return _this;
    }
    GangBossPanel.prototype.childrenCreated = function () {
        this.oConfig = GameGlobal.Config.GuildBossBaseConfig;
    };
    GangBossPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGBOSS_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.GANGBOSS_CHANGE, this.UpdateContent); //boss数据变化
        this.observe(MessageDef.GANGBOSS_RANK_NOW, this.UpdateContent); //boss数据变化
        this._AddClick(this.btnOpen, this.onClick);
        this._AddClick(this.btnInfo, this.showTip);
        this._AddClick(this.btnShowAward, this.showAward);
        this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BOSS];
        //获取排行
        GameGlobal.GangBossModel.sendGetLastRank();
        this.showPanel.SetBodyId(MonstersConfig.GetAppId(this.oConfig.bossid));
        this.AddLoopTimer(1000, this.upTime);
        this.UpdateContent();
    };
    GangBossPanel.prototype.UpdateContent = function () {
        this.setData();
        this.listBoss.dataProvider = new eui.ArrayCollection(this.oConfig.showItem1);
        this.listHave.dataProvider = new eui.ArrayCollection(this.oConfig.showItem2);
        this.upInfo();
    };
    GangBossPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (!GameGlobal.GangModel.HasGang()) {
            UserTips.ins().showTips("您还没有帮会，请先加入帮会");
            return false;
        }
        return Deblocking.Check(DeblockingType.TYPE_50);
    };
    GangBossPanel.prototype.upInfo = function () {
        var tRankLast;
        var strName = "";
        var strId = "";
        if (this.nStatus) {
            this.btnOpen.label = "挑战";
            this.lbShowTitle.text = "当前所属";
            if (GameGlobal.GangBossModel.mCurRank && GameGlobal.GangBossModel.mCurRank.playerranks && GameGlobal.GangBossModel.mCurRank.playerranks[0]) {
                strName = GameGlobal.GangBossModel.mCurRank.playerranks[0].name;
                strId = GameGlobal.GangBossModel.mCurRank.playerranks[0].serverid + "";
            }
        }
        else {
            this.btnOpen.label = "未开始";
            this.lbShowTitle.text = "上次归属";
            if (GameGlobal.GangBossModel.tRankLast && GameGlobal.GangBossModel.tRankLast.firstinfo) {
                strName = GameGlobal.GangBossModel.tRankLast.firstinfo.name;
                strId = GameGlobal.GangBossModel.tRankLast.firstinfo.serverid + "";
            }
        }
        this.lbPlayerName.text = strName || "";
        this.lbUnionName.text = ""; //帮会数据暂时还没有
    };
    GangBossPanel.prototype.setPower = function (str) {
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            str = wNum / 10 + "万";
        }
        return str;
    };
    GangBossPanel.prototype.upTime = function () {
        //时间更新
        if (this.nStatus) {
            var activityTime = this.nStatus == AcrossBossState.REBORNING ? GameGlobal.GangBossModel.getBossRebornTime() : GameGlobal.GangBossModel.getEndTime();
            this.labTimeText.text = this.nStatus == AcrossBossState.REBORNING ? "复活时间:" : "结束时间:";
            this.lbTime.text = DateUtils.getFormatBySecond(activityTime);
        }
        else {
            this.labTimeText.text = "挑战时间:";
            //倒计时显示
            if (this.oConfig.opentime && this.oConfig.opentime.length) {
                this.lbTime.text = this.oConfig.opentime[0] + "~" + this.oConfig.opentime[1];
            }
        }
    };
    GangBossPanel.prototype.setData = function () {
        this.nStatus = GameGlobal.GangBossModel.status; //boss状态
        this.nCountTime = GameGlobal.GangBossModel.changetime; //状态时间
    };
    GangBossPanel.prototype.onClick = function (e) {
        if (this.nStatus) {
            var lv = GlobalConfig.ins().GuildBossBaseConfig.guildlv || 0;
            var unionLv = GameGlobal.GangModel.getGangLv();
            if (unionLv >= lv) {
                GameGlobal.GangBossModel.enterMap();
                ViewManager.ins().close(GangMainWin);
                ViewManager.ins().close(GangBossPanel);
            }
            else {
                UserTips.FormatTip(GameGlobal.Config.GuildBossBaseConfig.kfboss_tips01, lv);
            }
        }
        else {
            UserTips.ins().showTips("未开始");
        }
    };
    GangBossPanel.prototype.showTip = function (e) {
        ViewManager.ins().open(ActivityDescPanel, 31);
    };
    GangBossPanel.prototype.showAward = function () {
        ActivityRewardShowWin.Open(ActivityModel.TYPE_GANG_BOSS);
    };
    GangBossPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return GangBossPanel;
}(BaseEuiView));
__reflect(GangBossPanel.prototype, "GangBossPanel", ["ICommonWindow"]);
//# sourceMappingURL=GangBossPanel.js.map