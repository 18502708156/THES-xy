/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/3 11:51
 * @meaning: 金装分解界面
 *
 **/
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
var ShopResolveLayer = (function (_super) {
    __extends(ShopResolveLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopResolveLayer() {
        var _this = _super.call(this) || this;
        _this.skinName = "ShopResolveSkin";
        _this.listView.itemRenderer = ShopResolveItem;
        return _this;
    }
    ShopResolveLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "金装分解";
        this.observe(MessageDef.BYB_CHANGE, this.updateContent);
        this.observe(MessageDef.YB_CHANGE, this.updateContent);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateContent);
        this._AddClick(this.gainWayLabel0, this.tap);
        this._AddClick(this.gainWayLabel1, this.tap);
        this._AddClick(this.gainWayLabel2, this.tap);
        this.priceIcon.setType(MoneyConst.JingZhuang);
        UIHelper.SetLinkStyleLabel(this.gainWayLabel0);
        UIHelper.SetLinkStyleLabel(this.gainWayLabel1);
        UIHelper.SetLinkStyleLabel(this.gainWayLabel2);
        this.updateContent();
    };
    ShopResolveLayer.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    ShopResolveLayer.prototype.updateContent = function () {
        this.priceIcon.setPrice(CommonUtils.overLength(ShopController.ins().getBuyItemNums(MoneyConst.JingZhuang)));
        var itemList = UserBag.ins().getBagEquipByLevelSort(ITEM_QUALITY.ORANGE_QUALITY); //4为橙色
        //只分解比自己装备要低的
        this.listView.dataProvider.replaceAll(itemList);
    };
    ShopResolveLayer.prototype.tap = function (e) {
        switch (e.currentTarget) {
            case this.gainWayLabel0:
                ViewManager.ins().Guide(1007);
                break;
            case this.gainWayLabel1:
                ViewManager.ins().Guide(1029);
                break;
            case this.gainWayLabel2:
                ViewManager.ins().Guide(1031);
                break;
        }
        this.CloseSelf();
    };
    ShopResolveLayer.LAYER_LEVEL = LayerManager.UI_Popup;
    return ShopResolveLayer;
}(BaseEuiView));
__reflect(ShopResolveLayer.prototype, "ShopResolveLayer");
/**
 * ShopResolveItem
 */
var ShopResolveItem = (function (_super) {
    __extends(ShopResolveItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopResolveItem() {
        return _super.call(this) || this;
    }
    ShopResolveItem.prototype.childrenCreated = function () {
        this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
    };
    ShopResolveItem.prototype.destruct = function () {
        this.buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
    };
    ShopResolveItem.prototype.dataChanged = function () {
        if (this.data.itemConfig) {
            this.itemIcon.setDataByConfig(this.data.itemConfig);
            this.itemIcon.setItemCount(false);
            this.nameLabel.text = this.data.itemConfig.name + "(Lv." + this.data.itemConfig.level + ")";
            //分解货币
            var nKey = this.data.itemConfig.level * 10000 + this.data.itemConfig.type * 100 + this.data.itemConfig.quality;
            var oRong = GlobalConfig.ins().SmeltConfig[nKey];
            if (oRong && oRong.cost) {
                if (oRong.cost.length) {
                    for (var item in oRong.cost) {
                        var tCost = oRong.cost[item];
                        this.priceIcon.setType(tCost.id);
                        this.priceIcon.setPrice(tCost.count);
                    }
                }
            }
        }
    };
    ShopResolveItem.prototype.onBtnClick = function () {
        var tArr = [];
        var tArrHandle = { handle: 1 };
        if (this.data && this.data.handle) {
            tArrHandle.handle = this.data.handle;
            tArr.push(tArrHandle);
            UserEquip.ins().sendSmeltEquip(tArr);
        }
    };
    return ShopResolveItem;
}(eui.ItemRenderer));
__reflect(ShopResolveItem.prototype, "ShopResolveItem");
//# sourceMappingURL=ShopResolveLayer.js.map