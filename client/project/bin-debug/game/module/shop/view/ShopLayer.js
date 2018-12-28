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
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店主界面
 *
 **/
var ShopLayer = (function (_super) {
    __extends(ShopLayer, _super);
    function ShopLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tShopData = [];
        return _this;
    }
    ShopLayer.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "ShopSkin";
    };
    ShopLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.viewStack.tabChildren = this.getOpenList(param[0] || []); //商店列表
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.viewStack.UpdateTabShowState(this.viewStack.length, false);
        this.commonWindowBg.OnAdded(this, 0, param[1]);
        var shopType = param[1];
        if (shopType == ShopController.EN_SHOP_EQUIP) {
            this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateTabBtnRedPoint);
            this.UpdateTabBtnRedPoint();
        }
    };
    ShopLayer.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.UserBag.HasOrangeEquip());
    };
    ShopLayer.prototype.getOpenList = function (tLayerType) {
        var list = [];
        for (var item in tLayerType) {
            switch (tLayerType[item]) {
                case ShopController.EN_SHOP_DAYAN:
                    list.push(TabView.CreateTabViewData(ShopNormalView));
                    break;
                case ShopController.EN_SHOP_EQUIP:
                    list.push(TabView.CreateTabViewData(ShopEquipLayer));
                    break;
                case ShopController.EN_SHOP_BLACK:
                    list.push(TabView.CreateTabViewData(ShopBlackLayer));
                    break;
                case ShopController.EN_SHOP_YUANBAO:
                    list.push(TabView.CreateTabViewData(ShopYuanBaoLayer));
                    break;
                case ShopController.EN_SHOP_BANGYUAN:
                    list.push(TabView.CreateTabViewData(ShopBangYuanLayer));
                    break;
                case ShopController.EN_SHOP_CAILIAO:
                    list.push(TabView.CreateTabViewData(ShopCaiLiaoLayer));
                    break;
                case ShopController.EN_SHOP_ARENA:
                    list.push(TabView.CreateTabViewData(ShopArenaLayer));
                    break;
                case ShopController.EN_SHOP_XIANDU:
                    list.push(TabView.CreateTabViewData(ShopXianDaoLayer));
                    break;
                case ShopController.EN_SHOP_WEIWANG:
                    list.push(TabView.CreateTabViewData(ShopWeiWangLayer));
                    break;
                case ShopController.EN_SHOP_BASHI:
                    list.push(TabView.CreateTabViewData(shopBashiLayer));
                    break;
                case ShopController.EN_SHOP_CHONGWU:
                    list.push(TabView.CreateTabViewData(ShopChongWuLayer));
                    break;
                case ShopController.EN_SHOP_XIANLV:
                    list.push(TabView.CreateTabViewData(ShopXianlvLayer));
                    break;
                case ShopController.EN_SHOP_BANGPAI:
                    list.push(TabView.CreateTabViewData(ShopBanghuiLayer));
                    break;
                case ShopController.EN_SHOP_ZHUANGBAN:
                    list.push(TabView.CreateTabViewData(ShopZhangBanLayer));
                    break;
                case ShopController.EN_SHOP_PIFU:
                    list.push(TabView.CreateTabViewData(ShopPiFuLayer));
                    break;
                case ShopController.EN_SHOP_YOUQING:
                    list.push(TabView.CreateTabViewData(ShopYouQingLayer));
                    break;
                case ShopController.EN_SHOP_JINGJI:
                    list.push(TabView.CreateTabViewData(ShopJingJiLayer));
                    break;
                case ShopController.EN_SHOP_QUJING:
                    list.push(TabView.CreateTabViewData(ShopQuJingLayer));
                    break;
                case ShopController.EN_SHOP_DATI:
                    list.push(TabView.CreateTabViewData(ShopDaTiLayer));
                    break;
                case ShopController.EN_SHOP_MYSTERY:
                    list.push(TabView.CreateTabViewData(ShopMysteryPanel));
                    break;
                case ShopController.EN_SHOP_INTEGRAL:
                    list.push(TabView.CreateTabViewData(ShopIntegralPnael));
                    break;
                case ShopController.EN_SHOP_TREASURE_HUNT:
                    list.push(TabView.CreateTabViewData(ShopTreasureHuntPnael));
                    break;
            }
        }
        return list;
    };
    ShopLayer.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    ShopLayer.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    ShopLayer.prototype.OnOpenIndex = function (openIndex) {
        return true;
    };
    ShopLayer.prototype.UpdateContent = function () { };
    ShopLayer.LAYER_LEVEL = LayerManager.UI_Main;
    return ShopLayer;
}(BaseEuiView));
__reflect(ShopLayer.prototype, "ShopLayer", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=ShopLayer.js.map