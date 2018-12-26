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
var TianShenHeChengPanel = (function (_super) {
    __extends(TianShenHeChengPanel, _super);
    function TianShenHeChengPanel() {
        return _super.call(this) || this;
    }
    TianShenHeChengPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = TianShenHeChengItem;
        this.mHeChengList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalSynthesisConfig, "id");
        this.list.dataProvider = new eui.ArrayCollection(this.mHeChengList);
    };
    TianShenHeChengPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateContent);
    };
    TianShenHeChengPanel.prototype.UpdateContent = function () {
        this.list.dataProvider = new eui.ArrayCollection(this.mHeChengList);
    };
    TianShenHeChengPanel.NAME = "合成";
    return TianShenHeChengPanel;
}(BaseView));
__reflect(TianShenHeChengPanel.prototype, "TianShenHeChengPanel", ["ICommonWindowTitle"]);
var TianShenHeChengItem = (function (_super) {
    __extends(TianShenHeChengItem, _super);
    function TianShenHeChengItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tianshenId = 0;
        return _this;
    }
    TianShenHeChengItem.prototype.childrenCreated = function () {
        this.btnHC.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.getwayLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    TianShenHeChengItem.prototype.onClickHandler = function (e) {
        GameGlobal.TianShenModel.SendHeCheng(this.tianshenId);
    };
    TianShenHeChengItem.prototype.onClick = function () {
        UserWarn.ins().setBuyGoodsWarn(this.data.cost.id);
    };
    TianShenHeChengItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        this.tianshenId = this.data.id;
        this.needItemView.SetItemId(this.data.cost.id, this.data.cost.count);
        var canUp = UserBag.ins().GetCount(this.data.cost.id) >= this.data.cost.count;
        this.btnHC.visible = canUp;
        this.getwayLabel.visible = !canUp;
        this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>获取" + GameGlobal.GetItemName(this.tianshenId) + "碎片</u></a>");
    };
    return TianShenHeChengItem;
}(eui.ItemRenderer));
__reflect(TianShenHeChengItem.prototype, "TianShenHeChengItem");
//# sourceMappingURL=TianShenHeChengPanel.js.map