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
var KaiFuTargetTeamBuyPanel = (function (_super) {
    __extends(KaiFuTargetTeamBuyPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuTargetTeamBuyPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuTargetTeamBuyPanelSkin";
        _this.activityType = ActivityKaiFuFuncType.ACT_21_OutdrawDiscountShop;
        return _this;
    }
    // public set activityId(value)
    // {
    //     this._activityId = value;
    //     this.UpdateContent();
    // }
    KaiFuTargetTeamBuyPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuTargetBaseAwardItem;
        this.tabBar.dataProvider = new eui.ArrayCollection(["团购10人", "团购20人", "团购60人", "团购100人", "团购200人"]);
        this.tabBar.selectedIndex = 0;
        this.tabBar.validateNow();
    };
    KaiFuTargetTeamBuyPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.AddItemClick(this.tabBar, this.changeTab);
    };
    KaiFuTargetTeamBuyPanel.prototype.changeTab = function (e) {
        this.UpdateContent();
    };
    KaiFuTargetTeamBuyPanel.prototype.getReward = function () {
        var config = GameGlobal.Config.ActivityType21Config[this._activityId];
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        var arr = [];
        var parr = [10, 20, 60, 100, 200];
        var redPoint = [false, false, false, false, false];
        var pnum = parr[this.tabBar.selectedIndex];
        var i;
        var len = config.length;
        for (i = 0; i < len; i++) {
            var cfgObj = config[i];
            var canGet = void 0;
            var getted = void 0;
            if (activityData) {
                canGet = activityData.canGetRecordByIndex(cfgObj.index);
                getted = activityData.GetRecordByIndex(cfgObj.index);
            }
            if (canGet && !getted) {
                redPoint[parr.indexOf(cfgObj.type)] = true;
            }
            if (pnum != cfgObj.type) {
                continue;
            }
            var o = {};
            o.cfg = cfgObj;
            o.weight = cfgObj.Id;
            o.actType = this.activityType;
            if (canGet) {
                if (getted)
                    o.weight += 1000;
                else
                    o.weight -= 1000;
            }
            else if (getted)
                o.weight += 1000;
            arr.push(o);
        }
        len = redPoint.length;
        for (i = 0; i < len; i++) {
            if (this.tabBar.getChildAt(i)) {
                this.tabBar.getChildAt(i).getChildAt(1).visible = redPoint[i];
            }
        }
        return arr;
    };
    KaiFuTargetTeamBuyPanel.prototype.OnClose = function () {
    };
    KaiFuTargetTeamBuyPanel.prototype.UpdateContent = function () {
        _super.prototype.UpdateContent.call(this);
        this.allReCharge_label.text = "今日充值：" + 0;
        var activityData = (GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId));
        if (activityData) {
            this.allReCharge_label.text = "今日充值：" + activityData.rechargeNum;
            this.people_txt.text = activityData.people + "人";
            var array = this.tabBar.dataProvider;
            var i = void 0;
            var len = array.length;
            for (i = 0; i < len; i++) {
                this.tabBar.getChildAt(i).redPoint = activityData.canGetRecordByIndex(i + 1);
            }
        }
        else {
            this.people_txt.text = "0人";
        }
    };
    KaiFuTargetTeamBuyPanel.prototype._OnClick = function (e) {
        RechargeWin.Open();
    };
    return KaiFuTargetTeamBuyPanel;
}(KaiFuTargetBasePanel));
__reflect(KaiFuTargetTeamBuyPanel.prototype, "KaiFuTargetTeamBuyPanel");
//# sourceMappingURL=KaiFuTargetTeamBuyPanel.js.map