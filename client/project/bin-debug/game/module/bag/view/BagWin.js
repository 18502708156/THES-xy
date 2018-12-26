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
var BagWin = (function (_super) {
    __extends(BagWin, _super);
    function BagWin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // private m_ViewChildren
    BagWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "BagSkin";
        var list = [
            TabView.CreateTabViewData(BagEquipTypePanel),
            TabView.CreateTabViewData(BagItemTypePanel),
        ];
        if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
            list.push(TabView.CreateTabViewData(BagStarTypePanel));
        }
        this.viewStack.tabChildren = list;
        this.commonWindowBg.SetViewStack(this.viewStack);
    };
    BagWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var openIndex = param[0] || 0;
        this.viewStack.UpdateTabShowState(3, false);
        this.commonWindowBg.OnAdded(this, openIndex);
        this.observe(MessageDef.ITEM_OTHER_COUNT_CHANGE, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    BagWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    BagWin.prototype.destoryView = function () {
        // 不销毁该界面
    };
    BagWin.prototype.UpdateRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.UserBag.getIsExitUsedItem());
    };
    BagWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    BagWin.prototype.OnOpenIndex = function (openIndex) {
        return true;
    };
    BagWin.prototype.UpdateContent = function () { };
    BagWin.LAYER_LEVEL = LayerManager.UI_Main;
    return BagWin;
}(BaseEuiView));
__reflect(BagWin.prototype, "BagWin", ["ICommonWindow", "ICommonWindowTitle"]);
var BagEquipTypePanel = (function (_super) {
    __extends(BagEquipTypePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BagEquipTypePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BagEquipTypeSkin";
        _this.itemScroller.viewport = _this.itemList;
        _this.itemList.itemRenderer = BagItemBase;
        _this._AddClick(_this.smeltBtn, _this.onClick);
        _this._AddClick(_this.addBtn, _this.onClick);
        return _this;
    }
    BagEquipTypePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.observe(MessageDef.BAG_VOL_ADD, this.SetCount);
        this.UpdateContent();
    };
    BagEquipTypePanel.prototype.UpdateContent = function () {
        this.itemList.dataProvider = new eui.ArrayCollection(UserBag.ins().getBagSortQualityEquips(5, 0, 1));
        if (UserBag.ins().getBagItemNum() / UserBag.ins().getMaxBagRoom() >= 0.8) {
            UIHelper.ShowRedPoint(this.smeltBtn, true);
        }
        else {
            UIHelper.ShowRedPoint(this.smeltBtn, false);
        }
        this.SetCount();
    };
    BagEquipTypePanel.prototype.SetCount = function () {
        this.itemCount.text = UserBag.ins().getBagItemNum() + "/" + UserBag.ins().getMaxBagRoom();
    };
    /**点击 */
    BagEquipTypePanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.smeltBtn:
                ViewManager.ins().close(BagWin);
                ViewManager.ins().open(SmeltEquipTotalWin);
                break;
            case this.addBtn:
                var config = GlobalConfig.ins().BagBaseConfig;
                var row = (UserBag.ins().bagNum - config.baseSize) / config.rowSize;
                if (row == CommonUtils.getObjectLength(GlobalConfig.ins().BagExpandConfig)) {
                    UserTips.ins().showTips(StringUtils.addColor("格子不能继续扩张", 0xff0000));
                }
                else {
                    ViewManager.ins().open(BagAddItemWarn);
                }
                break;
        }
    };
    BagEquipTypePanel.NAME = "装备";
    return BagEquipTypePanel;
}(BaseView));
__reflect(BagEquipTypePanel.prototype, "BagEquipTypePanel", ["ICommonWindowTitle"]);
var BagItemTypePanel = (function (_super) {
    __extends(BagItemTypePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BagItemTypePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BagItemTypeSkin";
        _this.itemListGoods.itemRenderer = BagItemBase;
        _this.itemListGoods.dataProvider = new eui.ArrayCollection();
        _this.itemGoodsScroller.viewport = _this.itemListGoods;
        return _this;
    }
    BagItemTypePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    BagItemTypePanel.prototype.UpdateContent = function () {
        this.itemListGoods.dataProvider.replaceAll(UserBag.ins().getBagGoodsBySort());
    };
    BagItemTypePanel.NAME = "道具";
    return BagItemTypePanel;
}(BaseView));
__reflect(BagItemTypePanel.prototype, "BagItemTypePanel", ["ICommonWindowTitle"]);
var BagStarTypePanel = (function (_super) {
    __extends(BagStarTypePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BagStarTypePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BagItemTypeSkin";
        _this.itemListGoods.itemRenderer = BagItemBase;
        _this.itemListGoods.dataProvider = new eui.ArrayCollection();
        _this.itemGoodsScroller.viewport = _this.itemListGoods;
        return _this;
    }
    BagStarTypePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    /**点击 */
    BagStarTypePanel.prototype.onClick = function (e) {
        switch (e.currentTarget) {
        }
    };
    BagStarTypePanel.prototype.UpdateContent = function () {
        this.itemListGoods.dataProvider = new eui.ArrayCollection(UserBag.ins().GetBagStarBySort());
    };
    BagStarTypePanel.NAME = "命格";
    return BagStarTypePanel;
}(BaseView));
__reflect(BagStarTypePanel.prototype, "BagStarTypePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=BagWin.js.map