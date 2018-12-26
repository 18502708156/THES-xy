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
var KaiFuTargetBasePanel = (function (_super) {
    __extends(KaiFuTargetBasePanel, _super);
    function KaiFuTargetBasePanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KaiFuTargetBasePanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuTargetBaseAwardItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    KaiFuTargetBasePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        if (this.getwayLabel) {
            this.AddClick(this.getwayLabel, this._OnClick);
        }
        this.UpdateContent();
        this.AddLoopTimer(1000, this.updateTime);
    };
    // public set activityId(value) {
    //     this._activityId = value;
    //     this.UpdateContent();
    // }
    KaiFuTargetBasePanel.prototype.updateTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString());
        }
        else {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("活动未开启");
        }
    };
    KaiFuTargetBasePanel.prototype.getReward = function () {
        var arr = [];
        var config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        var i;
        var len = config.length;
        for (i = 0; i < len; i++) {
            var cfgObj = config[i];
            if (cfgObj.Id != this._activityId) {
                continue;
            }
            var o = {};
            o.cfg = cfgObj;
            o.actType = this.activityType;
            o.weight = cfgObj.index;
            if (activityData) {
                var canGet = activityData.canGetRecordByIndex(cfgObj.index);
                var getted = activityData.GetRecordByIndex(cfgObj.index);
                if (canGet) {
                    if (getted)
                        o.weight += 1000;
                    else
                        o.weight -= 1000;
                }
                else if (getted)
                    o.weight += 1000;
            }
            arr.push(o);
        }
        return arr;
    };
    KaiFuTargetBasePanel.prototype.OnClose = function () {
    };
    KaiFuTargetBasePanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        if (!this._activityId)
            return;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        if (this.list.dataProvider) {
            this.list.dataProvider.replaceAll(arrlist);
        }
        else {
            this.list.dataProvider = new eui.ArrayCollection(arrlist);
        }
        //this.list.dataProvider = new eui.ArrayCollection(arrlist); 
    };
    KaiFuTargetBasePanel.prototype._OnClick = function (e) {
    };
    return KaiFuTargetBasePanel;
}(BaseView));
__reflect(KaiFuTargetBasePanel.prototype, "KaiFuTargetBasePanel");
var KaiFuTargetBaseAwardItem = (function (_super) {
    __extends(KaiFuTargetBaseAwardItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuTargetBaseAwardItem() {
        return _super.call(this) || this;
    }
    KaiFuTargetBaseAwardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseShowCountNoName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    KaiFuTargetBaseAwardItem.prototype.onClick = function (e) {
        var cfgObj = this.data.cfg;
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.sendReward(cfgObj.Id, cfgObj.index);
        }
        else {
            if (cfgObj.gainway) {
                GameGlobal.ViewManager.Guide(cfgObj.gainway[0][1][0]);
            }
            // switch (this.data.actType)
            // {
            //     case ActivityKaiFuFuncType.ACT_3_RechargeContinue:
            //         break;  
            //     case ActivityKaiFuFuncType.ACT_20_RechargeGroupon:
            //         break; 
            //     case ActivityKaiFuFuncType.ACT_1_Upgrade:
            //         break; 
            //     case ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop:
            //         break; 
            // }
        }
    };
    KaiFuTargetBaseAwardItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var weight = this.data.weight;
        var actType = this.data.actType;
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        this.btn.visible = weight < 100;
        this.btn.label = (weight > 0 && weight < 100) ? (cfgObj.gainway ? "前 往" : "未达成") : "领 取";
        UIHelper.ShowRedPoint(this.btn, weight < 0);
        this.getted_img.visible = !this.btn.visible;
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);
        var str = "";
        switch (actType) {
            case ActivityKaiFuFuncType.ACT_3_RechargeContinue:
                str = "连接充值" + cfgObj.rechargeday + "天（" + (activityData ? activityData.day : 0) + "/" + cfgObj.rechargeday + "）";
                break;
            case ActivityKaiFuFuncType.ACT_20_RechargeGroupon:
                str = "战力达到 " + CommonUtils.overLength(cfgObj.value);
                break;
            case ActivityKaiFuFuncType.ACT_1_Upgrade:
                str = "角色达到 " + cfgObj.value + "级";
                break;
            case ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop:
                str = "今日充值人数达" + cfgObj.type + "人";
                if (cfgObj.value == 1) {
                    str += "且个人充值任意金额";
                }
                else if (cfgObj.value > 1) {
                    str += "且个人充值金额达" + cfgObj.value + "元";
                }
                break;
        }
        this.tipsTxt.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    return KaiFuTargetBaseAwardItem;
}(eui.ItemRenderer));
__reflect(KaiFuTargetBaseAwardItem.prototype, "KaiFuTargetBaseAwardItem");
//# sourceMappingURL=KaiFuTargetBasePanel.js.map