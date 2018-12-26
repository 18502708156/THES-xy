/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/24 17:01
 * @meaning: 跨服boss详情
 *
 **/
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
var AcrossBossPanel = (function (_super) {
    __extends(AcrossBossPanel, _super);
    function AcrossBossPanel() {
        var _this = _super.call(this) || this;
        _this.mWindowHelpId = 20;
        _this.tPanelData = []; //界面总体数据数据
        _this.nStatus = 0; //boss状态
        _this.nCountTime = 0; //倒计时
        _this.skinName = "AcrossBossSkin";
        _this.listBoss.itemRenderer = ItemBaseNotName;
        _this.listHave.itemRenderer = ItemBaseNotName;
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    AcrossBossPanel.RedPointCheck = function () {
        return GameGlobal.AcrossBossController.IsAcrossBossAct();
    };
    AcrossBossPanel.prototype.childrenCreated = function () {
        this.oConfig = GlobalConfig.ins().KfBossBaseConfig;
    };
    AcrossBossPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.observe(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.ACROSS_BOSS, this.UpdateContent); //boss数据变化
        this.observe(MessageDef.KF_BOSS_RANK_NOW, this.UpdateContent); //boss数据变化
        this._AddClick(this.btnOpen, this.onClick);
        this._AddClick(this.btnInfo, this.showTip);
        this._AddClick(this.btnShowAward, this.showAward);
        this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BOSS];
        //获取排行
        GameGlobal.AcrossBossManage.sendGetLastRank();
        this.showPanel.SetBodyId(MonstersConfig.GetAppId(GlobalConfig.ins().KfBossBaseConfig.bossid));
        this.AddLoopTimer(1000, this.upTime);
        this.UpdateContent();
    };
    AcrossBossPanel.prototype.UpdateContent = function () {
        this.setData();
        this.listBoss.dataProvider = new eui.ArrayCollection(this.oConfig.showItem1);
        this.listHave.dataProvider = new eui.ArrayCollection(this.oConfig.showItem2);
        this.upInfo();
    };
    AcrossBossPanel.prototype.upInfo = function () {
        var tRankLast;
        var strName = "";
        var strId = "";
        if (this.nStatus) {
            this.btnOpen.label = "挑战";
            this.lbShowTitle.text = "当前所属";
            if (GameGlobal.AcrossBossController.mCurRank && GameGlobal.AcrossBossController.mCurRank.playerranks && GameGlobal.AcrossBossController.mCurRank.playerranks[0]) {
                strName = GameGlobal.AcrossBossController.mCurRank.playerranks[0].name;
                strId = GameGlobal.AcrossBossController.mCurRank.playerranks[0].serverid + "";
            }
        }
        else {
            this.btnOpen.label = "未开始";
            this.lbShowTitle.text = "上次归属";
            if (GameGlobal.AcrossBossController.tRankLast && GameGlobal.AcrossBossController.tRankLast.firstinfo) {
                strName = GameGlobal.AcrossBossController.tRankLast.firstinfo.name;
                strId = GameGlobal.AcrossBossController.tRankLast.firstinfo.serverid + "";
            }
        }
        this.lbPlayerName.text = strName ? (strName + ".S" + strId) : "";
        this.lbUnionName.text = ""; //帮会数据暂时还没有
    };
    AcrossBossPanel.prototype.setPower = function (str) {
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            str = wNum / 10 + "万";
        }
        return str;
    };
    AcrossBossPanel.prototype.upTime = function () {
        //时间更新
        if (this.nStatus) {
            var activityTime = GameGlobal.AcrossBossController.getEndTime();
            this.lbTime.text = DateUtils.getFormatBySecond(activityTime);
        }
        else {
            //倒计时显示
            if (this.oConfig.opentime && this.oConfig.opentime.length) {
                this.lbTime.text = this.oConfig.opentime[0] + "~" + this.oConfig.opentime[1];
            }
        }
    };
    AcrossBossPanel.prototype.setData = function () {
        this.nStatus = GameGlobal.AcrossBossController.status; //boss状态
        this.nCountTime = GameGlobal.AcrossBossController.changetime; //状态时间
    };
    AcrossBossPanel.prototype.onClick = function (e) {
        if (this.nStatus) {
            var lv = GlobalConfig.ins().KfBossBaseConfig.guildlv || 0;
            var unionLv = GameGlobal.GangModel.getGangLv();
            if (unionLv >= lv) {
                GameGlobal.AcrossBossManage.enterMap();
                ViewManager.ins().close(CrossMainPanel);
                // ViewManager.ins().close(GameCityPanel);
            }
            else {
                UserTips.FormatTip(GameGlobal.Config.KfBossBaseConfig.kfboss_tips01, lv);
            }
        }
        else {
            UserTips.ins().showTips("未开始");
        }
    };
    AcrossBossPanel.prototype.showTip = function (e) {
        ViewManager.ins().open(ActivityDescPanel, 28);
    };
    AcrossBossPanel.prototype.showAward = function () {
        ActivityRewardShowWin.Open(101);
    };
    AcrossBossPanel.NAME = "跨服BOSS";
    return AcrossBossPanel;
}(BaseView));
__reflect(AcrossBossPanel.prototype, "AcrossBossPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=AcrossBossPanel.js.map