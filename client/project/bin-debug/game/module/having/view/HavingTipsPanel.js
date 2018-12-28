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
var HavingTipsPanel = (function (_super) {
    __extends(HavingTipsPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HavingTipsPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingTipsSkin";
        _this.commondialog.title = "V9玄女出战";
        return _this;
    }
    HavingTipsPanel.prototype.childrenCreated = function () {
        this.commondialog.OnAdded(this);
        this._AddClick(this.btn, this.tap);
        this.list.itemRenderer = ItemBaseNotName;
        var item = CommonUtils.GetArray(GameGlobal.Config.VipConfig[9].treward);
        this.list.dataProvider = new eui.ArrayCollection(item);
    };
    HavingTipsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.VIP_LEVEL_CHANGE, this.updateContent);
        GameGlobal.RechargeModel.xuanNvCard = false;
        this.updateContent();
    };
    HavingTipsPanel.prototype.updateContent = function () {
        this.btn.label = "提升VIP";
        if (UserVip.ins().lv >= 9)
            this.btn.label = "领取奖励";
    };
    HavingTipsPanel.prototype.tap = function () {
        if (this.btn.label == "提升VIP")
            GameGlobal.RechargeModel.sendRecharge(6);
        else {
            UserVip.ins().sendXuanNvAwards(9);
            ViewManager.ins().close(HavingTipsPanel);
        }
    };
    HavingTipsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return HavingTipsPanel;
}(BaseEuiView));
__reflect(HavingTipsPanel.prototype, "HavingTipsPanel");
//# sourceMappingURL=HavingTipsPanel.js.map