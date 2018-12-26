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
var ActivityAdvance = (function () {
    function ActivityAdvance(component) {
        this.m_component = null;
        this.m_component = component;
        this.show();
    }
    ActivityAdvance.prototype.show = function () {
        var config = GameGlobal.Config.ActivityPreviewConfig;
        for (var key in config) {
            if (Deblocking.Check(config[key].openlv, true)) {
                if (GameGlobal.Config[config[key].tablename] && !this.m_component.getChildByName("advanceBtn" + key)) {
                    var activityData = GameGlobal.Config[config[key].tablename];
                    var opendayData = activityData[config[key].acday];
                    var date = new Date(GameServer.serverTime * 1000);
                    var weekDay = DateUtils.GetDay(date);
                    var _key = config[key].actime;
                    var endtime = activityData[_key][Object.keys(activityData[_key])[1]];
                    var time = DateUtils.FormatTimeString(endtime);
                    var add = true;
                    if (config[key].closetime && config[key].closetime < GameServer.serverOpenDay)
                        add = false;
                    for (var index in opendayData) {
                        if (opendayData[index] == weekDay && date.getTime() <= time && add) {
                            var activityAdvanceBtn = new ActivityAdvanceBtn(activityData);
                            activityAdvanceBtn.type = config[key].type;
                            activityAdvanceBtn.name = "advanceBtn" + key;
                            this.m_component.addChild(activityAdvanceBtn);
                            break;
                        }
                    }
                }
                if (this.m_component.getChildByName("advanceBtn" + key) && config[key].closetime && config[key].closetime < GameServer.serverOpenDay)
                    this.m_component.removeChild(this.m_component.getChildByName("advanceBtn" + key));
            }
        }
    };
    return ActivityAdvance;
}());
__reflect(ActivityAdvance.prototype, "ActivityAdvance");
var ActivityAdvanceBtn = (function (_super) {
    __extends(ActivityAdvanceBtn, _super);
    function ActivityAdvanceBtn(config) {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.type = -1;
        _this.m_BaseConfig = null;
        _this.m_bIsOpen = false;
        _this.m_bOpenTime = 0;
        _this.m_cTipsPanelDate = new TipsPanelDate;
        _this.m_specialId = 0; //需要特殊处理的
        _this.m_BaseConfig = config;
        _this.skinName = "AcitivityAdvanceBtnSkin";
        return _this;
    }
    ActivityAdvanceBtn.prototype.createChildren = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
        this.m_activityConfig = GameGlobal.Config.ActivityPreviewConfig;
        this.iconDisplay.source = this.m_activityConfig[this.type].nameicon;
        var key = this.m_activityConfig[this.type].actime;
        var opentime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[0]];
        var arr = opentime.split(":");
        this.m_bOpenTime = arr[0];
        this.tipsLabel.text = this.m_bOpenTime + "\u70B9\u5F00\u542F";
        this.m_specialId = this.m_activityConfig[this.type].specialId;
    };
    ActivityAdvanceBtn.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        TimerManager.ins().doTimer(1000, 0, this.timer, this);
    };
    ActivityAdvanceBtn.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        TimerManager.ins().removeAll(this);
    };
    ActivityAdvanceBtn.prototype.tap = function () {
        if (this.m_bIsOpen) {
            switch (this.type) {
                case 1:
                    ViewManager.ins().open(GangBossPanel);
                    break;
                case 2:
                    GameGlobal.ActivityModel.sendActivityEnter(ActivityModel.TYPE_CROSS_BATTLE);
                    break;
                case 3:
                    ViewManager.ins().open(GBattleMainWin);
                    break;
                case 4:
                    GameGlobal.CloudNineModel.sendLeaveTime();
                    break;
                case 5:
                    ViewManager.ins().open(CrossMainPanel, 1);
                    break;
                case 6:
                    ViewManager.ins().open(ArenaWin, 1);
                    break;
                default:
                    break;
            }
        }
        else {
            this.showTipsPanel();
        }
    };
    ActivityAdvanceBtn.prototype.showTipsPanel = function () {
        this.m_cTipsPanelDate.iocn = this.m_activityConfig[this.type].nameicon;
        this.m_cTipsPanelDate.tips1Txt = this.m_bOpenTime + "\u70B9";
        var str = "周";
        for (var key in this.m_BaseConfig[this.m_activityConfig[this.type].acday]) {
            str += this.m_BaseConfig[this.m_activityConfig[this.type].acday][key] + "、";
        }
        this.m_cTipsPanelDate.tips2Txt = str;
        this.m_cTipsPanelDate.detailsTxt = this.m_activityConfig[this.type].illustrate;
        var awardDate = this.m_BaseConfig[this.m_activityConfig[this.type].showitem2];
        if (awardDate)
            this.m_cTipsPanelDate.award = awardDate;
        var auctionDate = this.m_BaseConfig[this.m_activityConfig[this.type].showitem1];
        if (auctionDate)
            this.m_cTipsPanelDate.auction = auctionDate;
        ViewManager.ins().open(ActivityAdvanceTispPanel, this.m_cTipsPanelDate);
    };
    ActivityAdvanceBtn.prototype.timer = function () {
        var key = this.m_activityConfig[this.type].actime;
        var opentime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[0]];
        var time = DateUtils.FormatTimeString(opentime);
        if (time <= GameServer.serverTime * 1000) {
            this.m_bIsOpen = true;
            // this.tipsLabel.text = "进行中"
            this.timeGroup.visible = false;
            this.runImg.visible = true;
        }
        var endtime = this.m_BaseConfig[key][Object.keys(this.m_BaseConfig[key])[1]];
        time = DateUtils.FormatTimeString(endtime);
        if (time <= GameServer.serverTime * 1000) {
            this.m_bIsOpen = true;
            TimerManager.ins().remove(this.timer, this);
            DisplayUtils.removeFromParent(this);
        }
        this.special();
    };
    ActivityAdvanceBtn.prototype.special = function () {
        switch (this.m_specialId) {
            case 1:
                if (GameGlobal.GangBossModel.status == 4) {
                    this.tipsLabel.text = DateUtils.getFormatBySecond(GameGlobal.GangBossModel.getBossRebornTime()) + '';
                    this.timeGroup.visible = true;
                    this.runImg.visible = false;
                }
                else if (GameGlobal.GangBossModel.status == 2) {
                    this.timeGroup.visible = false;
                    this.runImg.visible = true;
                }
                break;
            default:
                break;
        }
    };
    return ActivityAdvanceBtn;
}(eui.Component));
__reflect(ActivityAdvanceBtn.prototype, "ActivityAdvanceBtn");
var TipsPanelDate = (function () {
    function TipsPanelDate() {
    }
    return TipsPanelDate;
}());
__reflect(TipsPanelDate.prototype, "TipsPanelDate");
//# sourceMappingURL=ActivityAdvance.js.map