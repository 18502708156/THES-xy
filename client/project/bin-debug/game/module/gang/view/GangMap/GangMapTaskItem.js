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
var GangMapTaskItem = (function (_super) {
    __extends(GangMapTaskItem, _super);
    function GangMapTaskItem() {
        return _super.call(this) || this;
    }
    GangMapTaskItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this);
    };
    GangMapTaskItem.prototype.SetTaskInfo = function (idx, config) {
        this.mConfig = config;
        this.groupType1.visible = idx == 1;
        this.groupType2.visible = idx == 2;
        var taskInfo = GameGlobal.GangMapModel.GetTaskInfo(config.id);
        this.labName.text = (config.type == 0 ? "帮会怪物" : "帮会采集") + "(" + Math.min(taskInfo.mCount, config.number) + "/" + config.number + ")";
        this.list.dataProvider = new eui.ArrayCollection(config.reward);
        this.priceicon.setColor(Color.White);
        if (GameGlobal.GangMapModel.IsTaskDone(config.id)) {
            this.btnGain.label = GameGlobal.GangMapModel.HasGainTaskReward(config.id) ? "重置" : "领取";
            this.priceicon.type = config.resetcost.id;
            this.priceicon.price = config.resetcost.count;
            this.priceicon.visible = GameGlobal.GangMapModel.HasGainTaskReward(config.id);
        }
        else {
            this.priceicon.type = config.onekeycost.id;
            this.priceicon.price = config.onekeycost.count;
            this.priceicon.visible = true;
            this.btnGain.label = "一键完成";
        }
    };
    GangMapTaskItem.prototype._OnBtnClicked = function (e) {
        var _this = this;
        if (!this.mConfig) {
            return;
        }
        if (!GameGlobal.GangMapModel.IsTaskDone(this.mConfig.id)) {
            var oneKeyCost_1 = this.mConfig.onekeycost;
            WarnWin.show("\u662F\u5426\u82B1\u8D39" + oneKeyCost_1.count + GameGlobal.actorModel.GetCurrencyName(oneKeyCost_1.id) + "\u76F4\u63A5\u5B8C\u6210\u4EFB\u52A1\uFF1F", function () {
                Checker.Money(oneKeyCost_1.id, oneKeyCost_1.count, true, null, function () {
                    GameGlobal.GangMapModel.SendOneKeyFinish(_this.mConfig.id);
                });
            }, this);
            return;
        }
        if (!GameGlobal.GangMapModel.HasGainTaskReward(this.mConfig.id)) {
            GameGlobal.GangMapModel.SendGainReward(this.mConfig.id);
            return;
        }
        if (!GameGlobal.GangMapModel.CanResetTask(this.mConfig.id)) {
            UserTips.ins().showTips("重置次数不足");
            return;
        }
        ViewManager.ins().open(GangMapResetTipWin, this.mConfig);
    };
    return GangMapTaskItem;
}(eui.Component));
__reflect(GangMapTaskItem.prototype, "GangMapTaskItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GangMapTaskItem.js.map