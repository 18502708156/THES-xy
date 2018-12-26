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
var YingYuanEnAiInfoPanel = (function (_super) {
    __extends(YingYuanEnAiInfoPanel, _super);
    function YingYuanEnAiInfoPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YingYuanEnAiInfoPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = YingYuanEnAiItem;
    };
    YingYuanEnAiInfoPanel.prototype.OnOpen = function () {
        GameGlobal.YingYuanModel.SendLoveInfo();
        this.observe(MessageDef.MARRY_LOVE_INFO, this.UpdateContent);
        this.observe(MessageDef.IS_MARRY_INFO, this.UpdateContent);
        TimerManager.ins().doTimer(1000, 0, this.updataTime, this);
    };
    YingYuanEnAiInfoPanel.prototype.updataTime = function () {
        GameGlobal.YingYuanModel.TimeLove();
        this.UpdateContent();
    };
    YingYuanEnAiInfoPanel.prototype.UpdateContent = function () {
        this.num.text = GameGlobal.YingYuanModel.marryInfo.intimate + "";
        var Config = GameGlobal.Config.LoveConfig;
        var ConfigData = [];
        for (var data in Config) {
            ConfigData.push(data);
        }
        this.list.dataProvider = new eui.ArrayCollection(ConfigData);
    };
    YingYuanEnAiInfoPanel.NAME = "恩爱";
    return YingYuanEnAiInfoPanel;
}(BaseView));
__reflect(YingYuanEnAiInfoPanel.prototype, "YingYuanEnAiInfoPanel", ["ICommonWindowTitle"]);
var YingYuanEnAiItem = (function (_super) {
    __extends(YingYuanEnAiItem, _super);
    function YingYuanEnAiItem() {
        var _this = _super.call(this) || this;
        _this.ICONIMG = [
            "ui_ea_bm_qianshou",
            "ui_ea_bm_yonbao",
            "ui_ea_bm_qinwen",
            "ui_ea_bm_chongxing"
        ];
        return _this;
    }
    YingYuanEnAiItem.prototype.childrenCreated = function () {
        this.huifu_bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.do_bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    YingYuanEnAiItem.prototype._OnClick = function (e) {
        var data = Number(this.data);
        switch (e.target) {
            case this.do_bnt:
                GameGlobal.YingYuanModel.UseMarryLove(Number(this.data));
                break;
            case this.huifu_bnt:
                var cur = "one";
                var Config = GameGlobal.Config.LoveConfig[data];
                ViewManager.ins().open(YingYuanEnAiPanel, cur, Config.recoverymaterial, Config.price, function () {
                    GameGlobal.YingYuanModel.RevertMarryLove(data);
                });
                break;
        }
    };
    YingYuanEnAiItem.prototype.dataChanged = function () {
        //TimerManager.ins().removeAll(this)
        //this.time.text = ""
        var data = Number(this.data);
        var Config = GameGlobal.Config.LoveConfig[data];
        var Info = GameGlobal.YingYuanModel.getMarryLove(data);
        if (!Info) {
            return;
        }
        this.icon.source = this.ICONIMG[data - 1];
        this.doName.text = Config.category;
        this.tianNum.text = Config.intimate + "点";
        this.dayTimes.text = (Config.quantity - Info.daycount) + "/" + Config.quantity;
        if (Config.frequency == 0) {
            this.times.visible = false;
            this.timesText.visible = false;
        }
        this.times.text = Info.count + "/" + Config.frequency;
        this.do_bnt.label = Config.category;
        if (Config.recoverymaterial && Config.frequency == 0) {
            this.do_bnt.visible = Config.quantity - Info.daycount != 0;
            this.huifu_bnt.visible = Config.quantity - Info.daycount == 0;
            //this.huifu_bnt.visible = Info.count == 0 || Config.recoverymaterial || Config.quantity - Info.daycount == 0
        }
        else {
            if (Config.recoverymaterial) {
                this.do_bnt.visible = Info.count != 0;
                this.huifu_bnt.visible = Info.count == 0;
            }
            else {
                this.do_bnt.visible = true; //Info.count != 0
                this.huifu_bnt.visible = false;
            }
        }
        Info.count == 0 ? this.times.textColor = 0xFF0000 : this.times.textColor = 0x019704;
        Config.quantity - Info.daycount == 0 ? this.dayTimes.textColor = 0xFF0000 : this.dayTimes.textColor = 0x019704;
        // if (Info.time > 0) {
        // 	//this.AddTimer(1000, 0, this.updataTime)
        // } else {
        // 	//TimerManager.ins().remove(this.updataTime, this)
        // 	this.time.text = ""
        // }
        if (Config.price) {
            this.priceicon.setType(Config.price.id);
            this.priceicon.setPrice(Config.price.count);
        }
        else {
            this.priceicon.visible = false;
        }
        this.updataTime();
    };
    YingYuanEnAiItem.prototype.updataTime = function () {
        var data = Number(this.data);
        var Info = GameGlobal.YingYuanModel.getMarryLove(data);
        if (Info.time <= 0) {
            //TimerManager.ins().remove(this.updataTime, this)
            this.time.text = "";
            return;
        }
        var InfoTime = GameServer.serverTime + Info.time;
        this.time.text = "(" + GameServer.GetPkTime(InfoTime) + ")后恢复次数";
        //Info.time--
    };
    return YingYuanEnAiItem;
}(eui.ItemRenderer));
__reflect(YingYuanEnAiItem.prototype, "YingYuanEnAiItem");
//# sourceMappingURL=YingYuanEnAiInfoPanel.js.map