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
var PetExpeditionView = (function (_super) {
    __extends(PetExpeditionView, _super);
    function PetExpeditionView() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionViewSkin";
        _this.commonWindowBg.SetTitle("探险");
        return _this;
    }
    PetExpeditionView.prototype.childrenCreated = function () {
        this.list1.itemRenderer = PetExpeditionitem;
        this.list2.itemRenderer = PetExpeditionitem2;
    };
    PetExpeditionView.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = args[0];
        this.commonWindowBg.OnAdded(this, index);
        this.observe(MessageDef.PET_ADVENTURE_INFO, this.UpdateContent);
        this.observe(MessageDef.PET_UPDATE_DOTASK_STATE, this.UpdateContent);
        UIHelper.SetLinkStyleLabel(this.buyTimes);
        UIHelper.SetLinkStyleLabel(this.refreshLabel);
        this.labNoOpenTip.text = "\u63A2\u9669\u4EFB\u52A1\u53EA\u5728\u6BCF\u5929" + GameGlobal.Config.ExploreBaseConfig.openTime[0] + "-" + GameGlobal.Config.ExploreBaseConfig.openTime[1] + "\u5F00\u653E";
        this._AddClick(this.refreshLabel, this._OnClicked);
        this._AddClick(this.buyTimes, this._OnClicked);
        this._AddClick(this.btnTask, this._OnClicked);
        this._AddClick(this.btnDoing, this._OnClicked);
        this.mCurIdx = 0;
        this.UpdateContent();
        this.AddLoopTimer(1000, this.UpdateTime);
    };
    PetExpeditionView.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    PetExpeditionView.prototype.ChangeTab = function (idx) {
        this.mCurIdx = idx;
        this.UpdateContent();
    };
    PetExpeditionView.prototype.UpdateContent = function () {
        this.btnTask.enabled = this.mCurIdx != 0;
        this.btnDoing.enabled = this.mCurIdx != 1;
        this.tabView0.visible = !this.btnTask.enabled;
        this.tabView1.visible = !this.btnDoing.enabled;
        this.labNum.text = "" + GameGlobal.ExpeditionModel.GetFreeList().length;
        if (this.mCurIdx == 1) {
            this.list2.dataProvider = new eui.ArrayCollection(GameGlobal.ExpeditionModel.taskAdventureList || []);
            return;
        }
        this.labNoOpenTip.visible = GameGlobal.ExpeditionModel.checkTaskOpenTime() == false;
        this.taskGroup.visible = !this.labNoOpenTip.visible;
        if (!this.taskGroup.visible)
            return;
        var config = GameGlobal.ExpeditionModel.GetNextOpenConfig();
        this.info_txt.visible = config != null;
        if (this.info_txt.visible) {
            var curNum = GameGlobal.ExpeditionModel.GetLingTongCount(config.level);
            this.info_txt.text = "\u6FC0\u6D3B" + config.petnum + "\u53EALv" + config.level + "\u7075\u7AE5\u89E3\u9501\u65B0\u63A2\u9669\u5217\u961F\uFF08" + curNum + "/" + config.petnum + "\uFF09";
        }
        this.list1.dataProvider = new eui.ArrayCollection(GameGlobal.ExpeditionModel.taskTaskIds || []);
        var times = GameGlobal.ExpeditionModel.taskRefreshTimes;
        var taskRefreshConfig = GameGlobal.Config.ExploreTaskRefreshConfig[times + 1];
        while (!taskRefreshConfig) {
            times--;
            taskRefreshConfig = GameGlobal.Config.ExploreTaskRefreshConfig[times];
        }
        var cost = taskRefreshConfig.coin;
        this.p1.type = cost.id;
        this.p1.price = cost.count;
        var currentTimes = GameGlobal.ExpeditionModel.taskUsedTimes;
        this.txt1.text = currentTimes + "/" + GameGlobal.Config.ExploreBaseConfig.maxtime;
    };
    PetExpeditionView.prototype.UpdateTime = function () {
        var _a = GameGlobal.ExpeditionModel.GetFinishTaskCount(), finishCount = _a[0], maxCount = _a[1];
        this.btnDoing.label = "\u63A2\u9669\u4E2D(" + finishCount + "/" + maxCount + ")";
        var t = (GameGlobal.ExpeditionModel.taskRestoreTime - GameServer.serverTime) * 1000;
        this.txt3.text = "";
        if (t <= 0) {
            if (GameGlobal.ExpeditionModel.taskRestoreTime != -1)
                GameGlobal.ExpeditionModel.SendGetExpeditionInfo();
            return;
        }
        else {
            var timeStr = "";
            if (t < DateUtils.MS_PER_DAY)
                timeStr = DateUtils.format_5(t, 3);
            else
                timeStr = DateUtils.format_12(t, 4);
            this.txt3.text = "(" + timeStr + "\u540E\u6062\u590D1\u6B21)";
        }
        for (var _i = 0, _b = this.list2.$children; _i < _b.length; _i++) {
            var child = _b[_i];
            var item = child;
            item.UpdateTime();
        }
    };
    PetExpeditionView.prototype._OnClicked = function (e) {
        var _this = this;
        switch (e.currentTarget) {
            case this.btnTask:
                this.ChangeTab(0);
                break;
            case this.btnDoing:
                this.ChangeTab(1);
                break;
            case this.refreshLabel:
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + this.p1.price + GameGlobal.actorModel.GetCurrencyName(this.p1.getType()) + "\u8FDB\u884C\u5237\u65B0", function () {
                    if (Checker.Money(_this.p1.getType(), _this.p1.price))
                        GameGlobal.ExpeditionModel.SendExpeditionRefresh();
                }, this);
                break;
            case this.buyTimes:
                var buyTime = GameGlobal.ExpeditionModel.taskBuyTimes;
                var config_1 = GameGlobal.Config.ExploreTaskBuyTimeConfig[buyTime + 1];
                while (!config_1) {
                    buyTime--;
                    config_1 = GameGlobal.Config.ExploreTaskBuyTimeConfig[buyTime + 1];
                }
                WarnWin.show("\u662F\u5426\u82B1\u8D39" + config_1.cost.count + GameGlobal.actorModel.GetCurrencyName(config_1.cost.id) + "\u8D2D\u4E70\u6B21\u6570", function () {
                    if (Checker.Money(config_1.cost.id, config_1.cost.count))
                        GameGlobal.ExpeditionModel.SendExpeditionBuyCount();
                }, this);
                break;
        }
    };
    PetExpeditionView.LAYER_LEVEL = LayerManager.UI_Main;
    return PetExpeditionView;
}(BaseEuiView));
__reflect(PetExpeditionView.prototype, "PetExpeditionView");
var PetExpeditionitem = (function (_super) {
    __extends(PetExpeditionitem, _super);
    function PetExpeditionitem() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._ItemTap, _this);
        return _this;
    }
    PetExpeditionitem.prototype._ItemTap = function (e) {
        if (egret.is(e.target, "ItemIcon") || egret.is(e.target.parent, "ItemIcon")) {
            return;
        }
        ViewManager.ins().open(PetExpeditionDetailsPanel, this.data);
    };
    PetExpeditionitem.prototype.dataChanged = function () {
        var taskId = this.data;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        this.lv_img.source = ExpeditionConst.GetQualitySource(taskConfig.quality);
        this.name_txt.text = taskConfig.name;
        this.type_txt.text = ExpeditionConst.GetTaskTypeName(taskConfig.type);
        this.item0.data = taskConfig.reward1[0];
        this.item1.data = taskConfig.reward2[0];
        this.lv_txt.text = taskConfig.levellimit;
        this.time_txt.text = DateUtils.format_12(taskConfig.lasttime * DateUtils.MS_PER_MINUTE, 2);
        this.need_txt.text = "" + taskConfig.petnum;
    };
    return PetExpeditionitem;
}(eui.ItemRenderer));
__reflect(PetExpeditionitem.prototype, "PetExpeditionitem");
var PetExpeditionitem2 = (function (_super) {
    __extends(PetExpeditionitem2, _super);
    function PetExpeditionitem2() {
        return _super.call(this) || this;
    }
    PetExpeditionitem2.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.quick_txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTap, this);
        UIHelper.SetLinkStyleLabel(this.quick_txt);
    };
    PetExpeditionitem2.prototype._onTap = function (e) {
        var taskId = this.data.taskId;
        if (e.currentTarget == this.quick_txt) {
            var petTaskItemObj = GameGlobal.Config.ExploreTaskItemConfig[taskId];
            var t = (this.data.timestamp - GameServer.serverTime);
            var needYB_1 = Math.ceil(GameGlobal.Config.ExploreBaseConfig.custper[petTaskItemObj.quality - 1] * Math.ceil(t / 60));
            var tips = "\u786E\u5B9A\u82B1\u8D39" + needYB_1 + "\u5143\u5B9D\u5FEB\u901F\u5B8C\u6210\u8BE5\u4EFB\u52A1\uFF1F";
            WarnWin.show(tips, function () {
                if (Checker.Money(MoneyConst.yuanbao, needYB_1)) {
                    GameGlobal.ExpeditionModel.SendExpedtionQuilkFinish(taskId);
                }
            }, this);
        }
        else if (e.currentTarget == this) {
            if (this.complete.visible == true) {
                GameGlobal.ExpeditionModel.SendExpedtionEnd(taskId);
            }
        }
    };
    PetExpeditionitem2.prototype.dataChanged = function () {
        var data = this.data;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[data.taskId];
        this.lv_img.source = ExpeditionConst.GetQualitySource(taskConfig.quality);
        this.name_txt.text = taskConfig.name;
        this.ratio_txt.text = GameGlobal.ExpeditionModel.CalcuAllRate(data.taskId, data.petIds) + "%";
        var len = 3;
        for (var i = 0; i < len; i++) {
            this["icon" + i].visible = data.petIds[i];
            if (this["icon" + i].visible)
                this["icon" + i].data = data.petIds[i];
        }
        this.item0.data = taskConfig.reward1[0];
        this.item1.data = taskConfig.reward2[0];
        this.UpdateTime();
    };
    PetExpeditionitem2.prototype.UpdateTime = function () {
        var t = (this.data.timestamp - GameServer.serverTime) * 1000;
        if (t <= 0) {
            this.complete.visible = true;
        }
        else {
            this.complete.visible = false;
            this.time_txt.text = DateUtils.format_5(t, 3);
        }
        this.timeLabel.visible = this.time_txt.visible = this.quick_txt.visible = !this.complete.visible;
        this.quick_txt.text = this.complete.visible ? "领取奖励" : "快速完成";
    };
    return PetExpeditionitem2;
}(eui.ItemRenderer));
__reflect(PetExpeditionitem2.prototype, "PetExpeditionitem2");
//# sourceMappingURL=PetExpeditionView.js.map