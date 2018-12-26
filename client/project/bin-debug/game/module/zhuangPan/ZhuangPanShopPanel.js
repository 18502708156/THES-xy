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
var ZhuangPanShopPanel = (function (_super) {
    __extends(ZhuangPanShopPanel, _super);
    function ZhuangPanShopPanel() {
        var _this = _super.call(this) || this;
        _this.click = true;
        _this.index = 0;
        _this.skinName = "zhuangPanPanelSkin";
        return _this;
    }
    ZhuangPanShopPanel.prototype.childrenCreated = function () {
    };
    ZhuangPanShopPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._activityId = param[0];
        //       this._AddClick(this.bnt, this._Onclick)
        this._AddClick(this.cj, this._Onclick);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateIndex);
        this.observe(MessageDef.ACTIVITY_ADVANCED_ZHUANG_PAN_RULE, this._anminRota);
        this.AddTimer(1000, 0, this.UpdataTime);
        this.UpdateContent();
    };
    ZhuangPanShopPanel.prototype.OnClose = function () {
    };
    ZhuangPanShopPanel.prototype._Onclick = function () {
        if (this.activityData.openState == 0 && this.activityData.drawtime <= 0) {
            UserTips.InfoTip("活动结束");
            return;
        }
        if (this.activityData.drawtime <= 0) {
            UserTips.InfoTip("没有次数");
            return;
        }
        if (!this.click) {
            return;
        }
        GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, 1);
    };
    ZhuangPanShopPanel.prototype._anminRota = function (rsp) {
        var _this = this;
        var rota = Math.random() * 360 + 360 * 7;
        if (this.click) {
            this.click = false;
            egret.Tween.get(this.bnt).to({ rotation: rota }, 3000, egret.Ease.sineInOut).call(function () {
                ViewManager.ins().open(ZhuangPanResultPanel, rsp);
                _this.click = true;
                _this.bnt.rotation = 0;
            });
        }
    };
    ZhuangPanShopPanel.prototype.UpdateIndex = function (index) {
        if (index == this._activityId) {
            this.UpdateContent();
        }
        return;
    };
    ZhuangPanShopPanel.prototype.UpdateContent = function () {
        this.activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        this.index = this.activityData.reachindex || 0;
        if (this.index == 10) {
            this.index = 9;
        }
        this.times.text = "次数:" + (this.activityData.drawtime || 0);
        this.UpdateItems();
        this.UpdateBar();
        this.UpdataTime();
        this.UpdataBg();
    };
    ZhuangPanShopPanel.prototype.UpdateItems = function () {
        var Config = GameGlobal.Config.ActivityType6Config[this._activityId][this.index];
        for (var i = 0; i < this.items.numChildren; i++) {
            var item = this.items.getChildAt(i);
            //for (let a = 0; a < Config.showitem.length; a++) {
            item.data = Config.showitem[i];
            //}
        }
    };
    ZhuangPanShopPanel.prototype.UpdataTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.lastTime.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString());
        }
        else {
            this.lastTime.textFlow = TextFlowMaker.generateTextFlow("活动未开启");
        }
    };
    ZhuangPanShopPanel.prototype.UpdateBar = function () {
        var curIndex = this.index;
        if (this.index == 10) {
            curIndex = 9;
        }
        var Config = GameGlobal.Config.ActivityType6Config[this._activityId][curIndex];
        this.zhuangPanBg.source = Config.pic;
        this.bar.maximum = Config.value;
        this.bar.value = this.activityData.value || 0;
        var text = Config.text;
        var arry = text.split("%s");
        this.barText.text = arry[0] + "" + (Config.value - (this.activityData.value || 0)) + "" + arry[1] + "" + Config.count + "" + arry[2];
        if (Config.value - this.activityData.value <= 0 && curIndex == 9) {
            this.barText.text = "已达到最大数额";
        }
    };
    ZhuangPanShopPanel.prototype.UpdataBg = function () {
        if (this.activityData.openState == 0) {
            this.lastTime.visible = false;
            if (this.activityData.drawtime <= 0) {
                this.say.text = "活动结束";
            }
            else {
                this.say.text = "活动结束 \n 您还有" + (this.activityData.drawtime || 0) + "次抽奖请尽快使用";
            }
        }
        else {
            this.say.text = "";
        }
    };
    return ZhuangPanShopPanel;
}(BaseView));
__reflect(ZhuangPanShopPanel.prototype, "ZhuangPanShopPanel", ["ICommonWindow"]);
var ZhuangPanitem = (function (_super) {
    __extends(ZhuangPanitem, _super);
    function ZhuangPanitem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZhuangPanitem.prototype.childrenCreated = function () {
    };
    ZhuangPanitem.prototype.dataChanged = function () {
        this.item.data = this.data;
        this.quality.source = "";
        if (GameGlobal.Config.ItemConfig[this.data.id].quality == 4) {
            this.quality.source = "ui_jchd_bm_zhenping";
        }
        if (GameGlobal.Config.ItemConfig[this.data.id].quality == 5) {
            this.quality.source = "ui_jchd_bm_zhenxi";
        }
    };
    return ZhuangPanitem;
}(eui.ItemRenderer));
__reflect(ZhuangPanitem.prototype, "ZhuangPanitem");
//# sourceMappingURL=ZhuangPanShopPanel.js.map