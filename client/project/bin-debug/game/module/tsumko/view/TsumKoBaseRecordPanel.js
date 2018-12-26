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
/**
 81难-生死劫(小关卡记录界面)
 */
// TsumKoBaseRecordSkin.exml
var TsumKoBaseRecordPanel = (function (_super) {
    __extends(TsumKoBaseRecordPanel, _super);
    function TsumKoBaseRecordPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TsumKoBaseRecordSkin";
        _this.observe(MessageDef.CHOICECHECKPOINT, _this.updateView);
        return _this;
    }
    TsumKoBaseRecordPanel.prototype.childrenCreated = function () {
        this.observe(MessageDef.TSUMKO_RECORD, this.record);
        this._AddClick(this.shopBtn, this._onClick);
    };
    TsumKoBaseRecordPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.updateView();
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("八十一难");
        this.challengeLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.ins().open(TsumKoBasePanel);
            ViewManager.ins().close(TsumKoBaseRecordPanel);
        }, this);
        var count1 = GameGlobal.Config.DisasterFbBaseConfig.assisttimes;
        var helpCount = GameGlobal.TsumKoBaseModel.info_helpReward;
        if (helpCount == undefined)
            helpCount = 0;
        var count = count1 - helpCount;
        this.countLabel.text = "(" + count + "/" + count1 + ")";
    };
    TsumKoBaseRecordPanel.prototype.updateView = function () {
        var id = GameGlobal.TsumKoBaseModel.recordId;
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.Config.DisasterFbConfig[id].showdrop);
        this.title1.text = GameGlobal.Config.DisasterFbConfig[id].name;
        this.title0.text = GameGlobal.Config.DisasterFbConfig[id].name;
    };
    TsumKoBaseRecordPanel.prototype.record = function (req) {
        if (req.first != null) {
            var name1 = "", name2 = "", name3 = "";
            if (req.first.name1 != undefined)
                name1 = req.first.name1;
            if (req.first.name2 != undefined)
                name2 = req.first.name2;
            if (req.first.name3 != undefined)
                name3 = req.first.name3;
            this.ranksLabel.text = name1 + name2 + name3;
            this.roundLabel.text = req.first.round + "回合";
            this.timeLabel.text = DateUtils.format_2(req.first.time * 1000);
        }
        else {
            this.ranksLabel.text = "暂 无";
            this.roundLabel.text = "暂 无";
            this.timeLabel.text = "暂 无";
        }
        if (req.fast != null) {
            var name1 = "", name2 = "", name3 = "";
            if (req.fast.name1 != undefined)
                name1 = req.fast.name1;
            if (req.fast.name2 != undefined)
                name2 = req.fast.name2;
            if (req.fast.name3 != undefined)
                name3 = req.fast.name3;
            this.ranksLabel1.text = name1 + name2 + name3;
            this.roundLabel1.text = req.fast.round + "回合";
            this.timeLabel1.text = DateUtils.format_2(req.fast.time * 1000);
        }
        else {
            this.ranksLabel1.text = "暂 无";
            this.roundLabel1.text = "暂 无";
            this.timeLabel1.text = "暂 无";
        }
    };
    TsumKoBaseRecordPanel.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.shopBtn:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_BASHI]);
                break;
        }
    };
    TsumKoBaseRecordPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    TsumKoBaseRecordPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return TsumKoBaseRecordPanel;
}(BaseEuiView));
__reflect(TsumKoBaseRecordPanel.prototype, "TsumKoBaseRecordPanel", ["ICommonWindow"]);
//# sourceMappingURL=TsumKoBaseRecordPanel.js.map