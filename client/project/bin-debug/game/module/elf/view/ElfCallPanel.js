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
var ElfCallPanel = (function (_super) {
    __extends(ElfCallPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ElfCallPanel() {
        var _this = _super.call(this) || this;
        _this.m_PreTimer = 0;
        _this.skinName = "ElfCallSkin";
        return _this;
    }
    ElfCallPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.elfList.itemRenderer = ElfTujianHeadItem;
        var config = GameGlobal.Config.CallbaseConfig.rewardView;
        var data = config.concat(config, config, config, config, config, config, config, config, config, config);
        this.elfList.dataProvider = new eui.ArrayCollection(data);
        this.commonDlg.SetTitle("召灵");
    };
    ElfCallPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDlg.OnAdded(this);
        this.observe(MessageDef.LUCK_RET_ANIM, this.showRusult);
        this.observe(MessageDef.LUCK_RECORD, this.updateCnetent);
        this._AddClick(this.gotoListBtn1, this._onTap);
        this._AddClick(this.gotoListBtn2, this._onTap);
        this._AddClick(this.normalCallBtn, this._onTap);
        this._AddClick(this.ybOneCallBtn, this._onTap);
        this._AddClick(this.ybTenCallBtn, this._onTap);
        this.m_PreTimer = egret.getTimer();
        TimerManager.ins().doFrame(1, 0, this._DoUpdate, this);
        this.updateCnetent();
    };
    ElfCallPanel.prototype._onTap = function (e) {
        var config = GameGlobal.Config.CallDrawConfig;
        var callbaseConfig = GameGlobal.Config.CallbaseConfig;
        var item = config[1][0].cost;
        switch (e.currentTarget) {
            case this.normalCallBtn:
                var info = GameGlobal.TreasureHuntModel.mInfo;
                if (!info) {
                    return;
                }
                if (callbaseConfig.maxtime > info.babydaylist[0]) {
                    if (Checker.Money(item.id, item.count))
                        GameGlobal.TreasureHuntModel.SendTreasure(4, 1);
                }
                else
                    GameGlobal.UserTips.showTips("今天抽奖次数已用完");
                break;
            case this.ybOneCallBtn:
                info = GameGlobal.TreasureHuntModel.mInfo;
                if (!info) {
                    return;
                }
                item = config[2][0].cost;
                if (!info.babydaylist[1] || Checker.Money(item.id, item.count))
                    GameGlobal.TreasureHuntModel.SendTreasure(4, 2);
                break;
            case this.ybTenCallBtn:
                item = config[3][0].cost;
                if (Checker.Money(item.id, item.count))
                    GameGlobal.TreasureHuntModel.SendTreasure(4, 3);
                break;
            case this.gotoListBtn1:
                ViewManager.ins().open(ElfTujianPanel, 0);
                break;
            case this.gotoListBtn2:
                ViewManager.ins().open(ElfTujianPanel, 1);
                break;
            default:
                break;
        }
    };
    ElfCallPanel.prototype.updateCnetent = function () {
        var config = GameGlobal.Config.CallDrawConfig;
        var item = config[1][0].cost;
        this.priceIcon1.setPrice(item.count);
        this.priceIcon1.setType(item.id);
        this.priceIcon1.setColor(Color.White);
        item = config[2][0].cost;
        this.priceIcon2.setType(item.id);
        this.priceIcon2.setPrice(item.count);
        this.priceIcon2.setColor(Color.White);
        item = config[3][0].cost;
        this.priceIcon3.setType(item.id);
        this.priceIcon3.setPrice(item.count);
        this.priceIcon3.setColor(Color.White);
        var info = GameGlobal.TreasureHuntModel.mInfo;
        if (!info) {
            return;
        }
        var callbaseConfig = GameGlobal.Config.CallbaseConfig;
        this.tipsTxt.textFlow = TextFlowMaker.generateTextFlow("\u4ECA\u5929\u5269\u4F59\u6B21\u6570\uFF1A|C:" + Color.l_green_2 + "&T:" + (callbaseConfig.maxtime - info.babydaylist[0]));
        this.ybOneCallBtn.label = info.babydaylist[1] ? "召唤一次" : "本次免费";
        this.firtip.visible = info && (info.babycounts[2] || 0) < 1;
        var itemConfig = GameGlobal.Config.CallDrawConfig[2][0].rewards[0];
        if (itemConfig.type == 0)
            this.rewardTxt.text = MoneyConstToName[itemConfig.id];
        else
            this.rewardTxt.text = GameGlobal.Config.ItemConfig[itemConfig.id].name;
    };
    ElfCallPanel.prototype.showRusult = function (req) {
        if (!ViewManager.ins().isShow(ElfResultPanel))
            ViewManager.ins().open(ElfResultPanel, req);
    };
    ElfCallPanel.prototype._DoUpdate = function () {
        var t = egret.getTimer();
        this.elfList.scrollH = (this.elfList.scrollH + (t - this.m_PreTimer) * 0.01) % 10000;
        this.m_PreTimer = t;
    };
    ElfCallPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return ElfCallPanel;
}(BaseEuiView));
__reflect(ElfCallPanel.prototype, "ElfCallPanel");
//# sourceMappingURL=ElfCallPanel.js.map