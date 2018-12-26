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
/**
 * 师门任务
 */
var DailyFomalhautMainPanel = (function (_super) {
    __extends(DailyFomalhautMainPanel, _super);
    function DailyFomalhautMainPanel() {
        var _this = _super.call(this) || this;
        //进入任务读表Id
        // private id=0;
        _this.index = 0;
        // //玩家等级
        _this.playLv = 0;
        // this.skinName = "DailyFomalhautMainSkin";
        _this.playLv = GameGlobal.actorModel.level;
        var tabArr = GameGlobal.Config.DailyBonusConfig[1][0];
        var tabId = 1;
        for (var i = 0; i < tabArr.length; i++) {
            var arr = tabArr[i].level;
            if (arr.length == 2) {
                if (_this.playLv >= arr[0] && _this.playLv <= arr[1]) {
                    tabId = i;
                    break;
                }
            }
            else {
                if (_this.playLv >= arr[0]) {
                    tabId = i;
                    break;
                }
            }
        }
        _this.dailyBonusConfigTab = GameGlobal.Config.DailyBonusConfig[1][0][tabId];
        _this.dailyBaseConfigTab = GameGlobal.Config.DailyBaseConfig;
        _this.monsterInfo = GameGlobal.DailyModel.monsterInfo;
        return _this;
    }
    // 引导对象
    DailyFomalhautMainPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.taskBtn,
            _a;
        var _a;
    };
    DailyFomalhautMainPanel.prototype.childrenCreated = function () {
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.getIndex);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateShow);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateBtn);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateTimeLabel);
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this._AddClick(this.taskBtn, this._OnClick);
        this._AddClick(this.oneKeyBtn, this._OnClick);
        this._AddClick(this.labBtn, this._OnClick);
    };
    DailyFomalhautMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyBonusConfigTab.itemid);
        //this.id=this.monsterInfo.monsterList[0];
        this.labBtn.visible = false;
        this.updateShow();
        this.updateBtn();
        this.updateTimeLabel();
    };
    DailyFomalhautMainPanel.prototype.UpdateContent = function () {
    };
    DailyFomalhautMainPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.oneKeyBtn:
                if (this.monsterInfo.num >= this.dailyBaseConfigTab.monster) {
                    this.oneKeyBtn.label = "领取奖励";
                    GameGlobal.DailyModel.SendGainAward(1, this.dailyBonusConfigTab.reward);
                }
                else {
                    this.oneKeyBtn.label = "一键完成";
                    var item_1 = this.dailyBaseConfigTab.monstercost[0];
                    var lostCount = this.dailyBaseConfigTab.monster - this.monsterInfo.num;
                    var needGold_1 = item_1.count * lostCount;
                    WarnWin.show("是否花费" + needGold_1 + " 元宝快速完成？", function () {
                        if (Checker.Money(item_1.id, needGold_1)) {
                            GameGlobal.DailyModel.SendQuilkDone(1);
                        }
                    }, this);
                }
                break;
            case this.taskBtn:
                ViewManager.ins().open(DailyFomalhautTaskPanel, this.index);
                break;
            case this.labBtn:
                UserTips.ins().showTips("目前地图已无妖魔,请等待下次刷新");
                break;
        }
    };
    DailyFomalhautMainPanel.prototype.getIndex = function () {
        return 0;
    };
    DailyFomalhautMainPanel.prototype.updateShow = function () {
        //进度条
        this.progressBar.value = this.monsterInfo.num;
        this.progressBar.maximum = this.dailyBaseConfigTab.monster;
        this.tabLab.text = "完成次数:" + this.monsterInfo.num + "/" + this.dailyBaseConfigTab.monster;
        this.monstersCountLabel.text = GameGlobal.DailyModel.monsterInfo.monsterList.length + "/" + this.dailyBaseConfigTab.monlimit;
        //this.refreshTimeLabel.text=DateUtils.format_1(this.monsterInfo.timeout*1000);
    };
    DailyFomalhautMainPanel.prototype.updateBtn = function () {
        if (this.monsterInfo.num >= this.dailyBaseConfigTab.monster) {
            this.oneKeyBtn.label = "领取奖励";
            if (GameGlobal.DailyModel.IsGetItem() == true) {
                this.oneKeyBtn.enabled = false;
            }
        }
        else {
            this.oneKeyBtn.label = "一键完成";
        }
        if (GameGlobal.DailyModel.monsterInfo.monsterList.length == 0) {
            this.taskBtn.enabled = false;
            this.labBtn.visible = true;
        }
        else {
            this.taskBtn.enabled = true;
            this.labBtn.visible = false;
        }
    };
    //
    DailyFomalhautMainPanel.prototype.updateTimeLabel = function () {
        var _this = this;
        if (GameGlobal.DailyModel.monsterInfo.monsterList.length != this.dailyBaseConfigTab.monlimit) {
            var time_1 = this.monsterInfo.timeout - GameServer.serverTime;
            if (time_1 <= 0)
                this.refreshTimeLabel.text = DateUtils.format_1(0);
            else
                this.refreshTimeLabel.text = DateUtils.format_1(time_1 * 1000);
            TimerManager.ins().doTimer(1000, 0, function () {
                time_1 = _this.monsterInfo.timeout - GameServer.serverTime;
                if (time_1 <= 0)
                    _this.refreshTimeLabel.text = DateUtils.format_1(0);
                else
                    _this.refreshTimeLabel.text = DateUtils.format_1(time_1 * 1000);
                if (GameServer.serverTime >= _this.monsterInfo.timeout) {
                    TimerManager.ins().removeAll(_this);
                    return;
                }
            }, this);
        }
        else {
            this.refreshTimeLabel.text = DateUtils.format_1(0);
        }
    };
    //SkinName
    //
    //DailyFomalhautMainSkin.exml
    //
    DailyFomalhautMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    DailyFomalhautMainPanel.NAME = "师门任务";
    return DailyFomalhautMainPanel;
}(BaseView));
__reflect(DailyFomalhautMainPanel.prototype, "DailyFomalhautMainPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DailyFomalhautMainPanel.js.map