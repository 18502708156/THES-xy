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
var KaiFuQiTianFuLiPanel = (function (_super) {
    __extends(KaiFuQiTianFuLiPanel, _super);
    function KaiFuQiTianFuLiPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuQiTianFuLiPanelSkin";
        return _this;
    }
    KaiFuQiTianFuLiPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = QiTianFuLiAwardItem;
    };
    KaiFuQiTianFuLiPanel.prototype.OnOpen = function () {
        this.UpdateContent();
    };
    KaiFuQiTianFuLiPanel.prototype.getReward = function () {
        var arr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY, 0);
        return arr;
    };
    KaiFuQiTianFuLiPanel.prototype.OnClose = function () {
    };
    KaiFuQiTianFuLiPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
    };
    KaiFuQiTianFuLiPanel.RedPoint = function (day) {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(7);
        if (activityData && activityData.canGetRecordByIndex(day)) {
            return true;
        }
        activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(8);
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
    KaiFuQiTianFuLiPanel.prototype._OnClick = function (e) {
    };
    return KaiFuQiTianFuLiPanel;
}(BaseEuiView));
__reflect(KaiFuQiTianFuLiPanel.prototype, "KaiFuQiTianFuLiPanel");
var QiTianFuLiAwardItem = (function (_super) {
    __extends(QiTianFuLiAwardItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QiTianFuLiAwardItem() {
        return _super.call(this) || this;
    }
    QiTianFuLiAwardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    QiTianFuLiAwardItem.prototype.onClick = function (e) {
        var config = ActivityConst.GetCfgObjByValue(this.data);
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.sendReward(config.Id, config.index);
        }
        else if (this.btn.label == "前 往") {
            if (config.gainway) {
                GameGlobal.ViewManager.Guide(config.gainway[0][1][0]);
            }
        }
    };
    QiTianFuLiAwardItem.prototype.dataChanged = function () {
        var config = ActivityConst.GetCfgObjByValue(this.data);
        this.tipsTxt.text = config.des.replace("%s", config.value);
        this.list.dataProvider = new eui.ArrayCollection(config.rewards);
        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7) {
            this.tip2.text = "明日开启";
            this.getted_img.visible = false;
            this.btn.visible = false;
        }
        else {
            this.tip2.text = "";
            this.getted_img.visible = false;
            this.btn.visible = true;
            this.btn.label = config.gainway ? "前 往" : "未达成";
            var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(config.Id);
            if (activityData) {
                var canReward = activityData.canGetRecordByIndex(config.index);
                var getted = activityData.GetRecordByIndex(config.index);
                if (canReward) {
                    if (!getted) {
                        this.btn.label = "领 取";
                    }
                }
                this.getted_img.visible = getted;
                UIHelper.ShowRedPoint(this.btn, canReward);
                this.btn.visible = !this.getted_img.visible;
                if (!canReward && KaiFuQiTianActivityPanel.OPEN_SHOW_DAY < GameServer.serverOpenDay) {
                    this.btn.visible = false;
                    this.tip2.text = "已过期";
                }
            }
        }
    };
    return QiTianFuLiAwardItem;
}(eui.ItemRenderer));
__reflect(QiTianFuLiAwardItem.prototype, "QiTianFuLiAwardItem");
//# sourceMappingURL=KaiFuQiTianFuLiPanel.js.map