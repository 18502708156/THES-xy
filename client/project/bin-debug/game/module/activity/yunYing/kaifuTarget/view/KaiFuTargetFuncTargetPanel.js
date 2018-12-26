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
var KaiFuTargetFuncTargetPanel = (function (_super) {
    __extends(KaiFuTargetFuncTargetPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuTargetFuncTargetPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuTargetFuncTargetSkin";
        _this.activityType = ActivityKaiFuFuncType.ACT_17_ArenaTarget;
        return _this;
    }
    KaiFuTargetFuncTargetPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuTargetFuncTargetItem;
    };
    KaiFuTargetFuncTargetPanel.prototype.OnOpen = function () {
        this.UpdateContent();
        this.AddLoopTimer(1000, this.updateTime);
    };
    KaiFuTargetFuncTargetPanel.prototype.updateTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(this.getRemindTimeString());
        }
        else {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow("活动未开启");
        }
    };
    KaiFuTargetFuncTargetPanel.prototype.getRemindTimeString = function () {
        var time = GameServer.serverTimeMilli;
        var date = new Date(time);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 1);
        return "\u5012\u8BA1\u65F6\uFF1A|C:0x2dff42&T:" + DateUtils.format_1(date.getTime() - time) + "|";
    };
    KaiFuTargetFuncTargetPanel.prototype.getReward = function () {
        var openDay = Math.min(GameServer.serverOpenDay, 7);
        var idsArr = ActivityConst.GetQiTianActivityIds(openDay, 1);
        var arr = [];
        var i;
        var len = idsArr.length;
        var show = false;
        for (i = 0; i < len; i++) {
            var cfgObj = ActivityConst.GetCfgObjByValue(idsArr[i]);
            if (!show) {
                this.ShowDesc(cfgObj);
                show = true;
            }
            var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
            var o = {};
            o.cfg = cfgObj;
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
    KaiFuTargetFuncTargetPanel.prototype.ShowDesc = function (cfgObj) {
        var type = cfgObj.type;
        var arr = [];
        switch (type) {
            case "arenarank":
                arr = ["竞技场排名：", GameGlobal.Arena.getMyRank()];
                break;
            case "wildgeese":
                arr = ["玲珑宝塔层数：", GameGlobal.UserFb.GetLinglongLayer()];
                break;
            case "chapter":
                arr = ["关卡关数：", (GameGlobal.UserFb.guanqiaID || 0)];
                break;
            case "heaven":
                arr = ["勇闯天庭：", (GameGlobal.UserFb.tFbTiantingServerData ? GameGlobal.UserFb.tFbTiantingServerData.todayLayer : 0)];
                break;
            case "treasuremap":
                arr = ["藏宝图层数：", Math.max(FbCbtPanel.GetLastNum() - 1, 1)];
                break;
            case "petcount":
                arr = ["宠物数量：", GameGlobal.PetModel.GetActiveCount()];
                break;
        }
        var str = "";
        if (arr.length && cfgObj.info && cfgObj.info.text) {
            // str = `${arr[0]}|C:0x2dff42&T:${arr[1]}|`
            str = cfgObj.info.text.replace("%s", "|C:0x2dff42&T:" + arr[1] + "|");
            this.value_txt.textFlow = TextFlowMaker.generateTextFlow(str);
        }
        else {
            this.value_txt.text = "";
        }
    };
    KaiFuTargetFuncTargetPanel.prototype.OnClose = function () {
    };
    KaiFuTargetFuncTargetPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
    };
    KaiFuTargetFuncTargetPanel.RedPoint = function (day) {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(15);
        if (activityData) {
            var config = activityData.GetConfig();
            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    var cfgobj = config[key];
                    if (cfgobj.day != day) {
                        continue;
                    }
                    if (activityData.canGetRecordByIndex(cfgobj.index)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    KaiFuTargetFuncTargetPanel.prototype._OnClick = function (e) {
    };
    return KaiFuTargetFuncTargetPanel;
}(BaseView));
__reflect(KaiFuTargetFuncTargetPanel.prototype, "KaiFuTargetFuncTargetPanel");
var KaiFuTargetFuncTargetItem = (function (_super) {
    __extends(KaiFuTargetFuncTargetItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuTargetFuncTargetItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuQiTianAwardItemSkin";
        return _this;
    }
    KaiFuTargetFuncTargetItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    KaiFuTargetFuncTargetItem.prototype.onClick = function (e) {
        var config = this.data.cfg;
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.sendReward(config.Id, config.index);
        }
        else if (this.btn.label == "前 往") {
            if (config.gainway) {
                GameGlobal.ViewManager.Guide(config.gainway[0][1][0]);
            }
        }
    };
    KaiFuTargetFuncTargetItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var weight = this.data.weight;
        var actType = this.data.actType;
        this.tipsTxt.text = cfgObj.des.replace("%s", cfgObj.value);
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);
        // let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        var openDay = Math.min(GameServer.serverOpenDay, 7);
        if (openDay > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7) {
            this.tip2.text = "明日开启";
            this.getted_img.visible = false;
            this.btn.visible = false;
        }
        else {
            this.tip2.text = "";
            this.btn.visible = weight < 100;
            this.btn.label = (weight > 0 && weight < 100) ? (cfgObj.gainway ? "前 往" : "未达成") : "领 取";
            UIHelper.ShowRedPoint(this.btn, weight < 0);
            this.getted_img.visible = !this.btn.visible;
            // if (weight > 0 && weight < 100 && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay)
            // {
            //     this.btn.visible = false;
            //     this.tip2.text = "已过期"
            // }
        }
    };
    return KaiFuTargetFuncTargetItem;
}(eui.ItemRenderer));
__reflect(KaiFuTargetFuncTargetItem.prototype, "KaiFuTargetFuncTargetItem");
//# sourceMappingURL=KaiFuTargetFuncTargetPanel.js.map