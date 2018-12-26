/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 装备商店商品item2
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
var ShopEquipItem = (function (_super) {
    __extends(ShopEquipItem, _super);
    function ShopEquipItem() {
        var _this = _super.call(this) || this;
        _this.bBuyAll = false;
        // 皮肤名称
        _this.skinName = "FeatsShopItem";
        // this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    ShopEquipItem.prototype.onClick = function (e) {
        if (egret.is(e.target.parent, 'ItemIcon'))
            return;
        if (this.data && ShopController.ins().enoughBuy(this.data)) {
            ViewManager.ins().open(BuyWin, this.data);
        }
    };
    ShopEquipItem.prototype.dataChanged = function () {
        //更新内容
        this.lbInfo.text = "";
        this.bBuyAll = false;
        this.lbInfo.textColor = Color.l_green_1;
        //icon
        var itemConfig;
        if (this.data.id) {
            itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
            this.nameLabel.text = itemConfig.name;
            this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
            // this.itemIcon.setData(itemConfig);
            this.itemIcon.setDataByConfig(itemConfig);
            this.itemIcon.isShowName(false);
            if (this.data.count) {
                this.itemIcon.setCount(this.data.count + "");
            }
            this.lbLv.text = "Lv." + (itemConfig.level || 1);
            this.LvTipsTxt.visible = GameGlobal.actorModel.level < itemConfig.level;
            //EquipConfig 装备数据
            var itemPower = ItemConfig.CalculateScore(this.data.id);
            var role = SubRoles.ins().GetRoleData();
            var eq = role.getEquipByIndex(itemConfig.subType);
            var eqPower = 0;
            if (eq) {
                eqPower = ItemConfig.CalculateScore(eq.item.configID);
            }
            if (itemPower > eqPower) {
                this.lbInfo.text = "战斗力+" + (itemPower - eqPower);
            }
        }
        //稀有图片
        if (this.data.make && this.data.make === 1) {
            this.imgXiyou.visible = true;
        }
        //设置价格
        if (this.data.currency.type) {
            this.priceIcon.setType(this.data.currency.id);
            this.priceIcon.setPrice(this.data.currency.count);
        }
        else {
            //待添加
            this.priceIcon.setPrice(this.data.currency.count);
        }
        //限购
        if (this.data.daycount) {
            if (this.data.daycount > 0) {
                if (this.data.buyTime && this.data.buyTime > 0 && this.data.daycount && this.data.buyTime === this.data.daycount) {
                    this.bBuyAll = true;
                }
                else {
                    this.lbInfo.text = "(限购" + this.data.buyTime + "/" + this.data.daycount + ")";
                }
            }
        }
        //等级限制
        if (!ShopController.ins().enoughBuy(this.data, 3)) {
            this.lbInfo.text = ShopController.ins().enoughBuy(this.data, 2);
            this.lbInfo.textColor = Color.RedColor;
        }
        //售罄
        if (this.bBuyAll) {
            this.imgSellOut.visible = true;
            this.buy.visible = false;
            // this.filters = Color.GetFilter()//变灰
        }
        else {
            this.imgSellOut.visible = false;
            this.buy.visible = true;
            //  this.filters = null
        }
    };
    return ShopEquipItem;
}(eui.ItemRenderer));
__reflect(ShopEquipItem.prototype, "ShopEquipItem");
//# sourceMappingURL=ShopEquipItem.js.map