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
var KaiFuLeiJiReChargePanel = (function (_super) {
    __extends(KaiFuLeiJiReChargePanel, _super);
    function KaiFuLeiJiReChargePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuLeiJiReChargePanelSkin";
        return _this;
    }
    KaiFuLeiJiReChargePanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuLeiJiReChargeItem;
    };
    KaiFuLeiJiReChargePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent);
        this.AddClick(this.getwayLabel, this._OnClick);
        this.AddTimer(1000, 0, this.updateTime);
        this.UpdateContent();
        this.updateTime();
    };
    KaiFuLeiJiReChargePanel.prototype.updateTime = function () {
        var time = KaiFuJiJieRankPanel.GetUpdateTime(this.jijieType);
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow("\u6D3B\u52A8\u5012\u8BA1\u65F6\uFF1A|C:0x2dff42&T:" + time + "|");
    };
    KaiFuLeiJiReChargePanel.prototype.getReward = function () {
        var type = this.jijieType;
        var config = GameGlobal.Config.ProgressCrazyRechargeConfig;
        var arr = [];
        var obj = config[type];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var cfgObj = obj[key];
                var o = {};
                o.type = type;
                o.cfg = cfgObj;
                o.weight = cfgObj.id;
                var canGet = GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue >= cfgObj.money;
                var getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetChargeReward(cfgObj.id);
                if (canGet) {
                    if (getted)
                        o.weight += 1000;
                    else
                        o.weight -= 1000;
                }
                else if (getted) {
                    o.weight += 1000;
                }
                arr.push(o);
            }
        }
        return arr;
    };
    KaiFuLeiJiReChargePanel.prototype.OnClose = function () {
    };
    KaiFuLeiJiReChargePanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var type = this.jijieType;
        var arrlist = this.getReward();
        SortTools.sortMap(arrlist, "weight");
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
        this.allReCharge_label.text = "累计充值：" + GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue + '元';
    };
    KaiFuLeiJiReChargePanel.prototype._OnClick = function (e) {
        if (e.currentTarget == this.getwayLabel) {
            RechargeWin.Open();
            //GameGlobal.ActivityKaiFuModel.OpenAdvancedPanel();
        }
    };
    return KaiFuLeiJiReChargePanel;
}(BaseView));
__reflect(KaiFuLeiJiReChargePanel.prototype, "KaiFuLeiJiReChargePanel");
var KaiFuLeiJiReChargeItem = (function (_super) {
    __extends(KaiFuLeiJiReChargeItem, _super);
    function KaiFuLeiJiReChargeItem() {
        return _super.call(this) || this;
    }
    KaiFuLeiJiReChargeItem.prototype.onClick = function (e) {
        if (this.btn.label == "领 取") {
            GameGlobal.ActivityKaiFuModel.Send_advanced_charger_reward(this.data.cfg.id);
        }
    };
    KaiFuLeiJiReChargeItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var weight = this.data.weight;
        this.tipsTxt.text = "累计充值" + cfgObj.money + "元";
        this.btn.visible = weight < 100;
        this.btn.label = (weight > 0 && weight < 100) ? "未达成" : "领 取";
        UIHelper.ShowRedPoint(this.btn, weight < 0);
        this.getted_img.visible = !this.btn.visible;
    };
    return KaiFuLeiJiReChargeItem;
}(KaiFuJiJieAwardItem));
__reflect(KaiFuLeiJiReChargeItem.prototype, "KaiFuLeiJiReChargeItem");
//# sourceMappingURL=KaiFuLeiJiReChargePanel.js.map