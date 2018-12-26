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
var KaiFuQiTianOtherPanel = (function (_super) {
    __extends(KaiFuQiTianOtherPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuQiTianOtherPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuQiTianOtherPanelSkin";
        return _this;
    }
    KaiFuQiTianOtherPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = QiTianOtherAwardItem;
    };
    KaiFuQiTianOtherPanel.prototype.OnOpen = function () {
        this.UpdateContent();
    };
    KaiFuQiTianOtherPanel.prototype.getReward = function () {
        var idsArr = ActivityConst.GetQiTianActivityIds(KaiFuQiTianActivityPanel.OPEN_SHOW_DAY, 1);
        var arr = [];
        var i;
        var len = idsArr.length;
        for (i = 0; i < len; i++) {
            var cfgObj = ActivityConst.GetCfgObjByValue(idsArr[i]);
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
    KaiFuQiTianOtherPanel.prototype.OnClose = function () {
    };
    KaiFuQiTianOtherPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
    };
    KaiFuQiTianOtherPanel.RedPoint = function (day) {
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
    KaiFuQiTianOtherPanel.prototype._OnClick = function (e) {
    };
    return KaiFuQiTianOtherPanel;
}(BaseEuiView));
__reflect(KaiFuQiTianOtherPanel.prototype, "KaiFuQiTianOtherPanel");
var QiTianOtherAwardItem = (function (_super) {
    __extends(QiTianOtherAwardItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QiTianOtherAwardItem() {
        return _super.call(this) || this;
    }
    QiTianOtherAwardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    QiTianOtherAwardItem.prototype.onClick = function (e) {
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
    QiTianOtherAwardItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var weight = this.data.weight;
        var actType = this.data.actType;
        this.tipsTxt.text = cfgObj.des.replace("%s", cfgObj.value);
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.rewards);
        // let activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY > GameServer.serverOpenDay && GameServer.serverOpenDay <= 7) {
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
    return QiTianOtherAwardItem;
}(eui.ItemRenderer));
__reflect(QiTianOtherAwardItem.prototype, "QiTianOtherAwardItem");
//# sourceMappingURL=KaiFuQiTianOtherPanel.js.map