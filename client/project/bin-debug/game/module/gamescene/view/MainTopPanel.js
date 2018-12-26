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
var MainTopPanel = (function (_super) {
    __extends(MainTopPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function MainTopPanel() {
        return _super.call(this) || this;
    }
    MainTopPanel.prototype.destoryView = function () { };
    MainTopPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MainTopPanelSkin";
        this.touchEnabled = false;
        this._AddClick(this.god, this.onClick);
        this._AddClick(this.yb, this.onClick);
        this._AddClick(this.byb, this.onClick);
    };
    MainTopPanel.prototype.initData = function () {
        this.updateData();
    };
    MainTopPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.GOLD_CHANGE, this.initData);
        this.observe(MessageDef.YB_CHANGE, this.initData);
        this.observe(MessageDef.BYB_CHANGE, this.initData);
        this.observe(MessageDef.postInitActorInfo, this.updateData);
        this.initData();
    };
    MainTopPanel.prototype.updateData = function () {
        this.god.label = CommonUtils.overLength(GameGlobal.actorModel.gold);
        if (GameGlobal.actorModel.yb >= 100000000) {
            this.yb.label = CommonUtils.overLength(GameGlobal.actorModel.yb);
        }
        else {
            this.yb.label = GameGlobal.actorModel.yb + "";
        }
        if (GameGlobal.actorModel.byb >= 100000000) {
            this.byb.label = CommonUtils.overLength(GameGlobal.actorModel.byb);
        }
        else {
            this.byb.label = GameGlobal.actorModel.byb + "";
        }
    };
    MainTopPanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.god:
                ViewManager.ins().open(ExchangeMoneyWin);
                break;
            case this.yb:
                RechargeWin.Open();
                break;
            case this.byb:
                ViewManager.ins().open(ShopGoodsWarn).setData(MoneyConst.byb, 1);
                break;
        }
    };
    ;
    MainTopPanel.LAYER_LEVEL = LayerManager.UI_USER_INFO;
    return MainTopPanel;
}(BaseEuiView));
__reflect(MainTopPanel.prototype, "MainTopPanel");
//# sourceMappingURL=MainTopPanel.js.map