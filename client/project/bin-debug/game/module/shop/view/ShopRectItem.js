/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店商品item2
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
var ShopRectItem = (function (_super) {
    __extends(ShopRectItem, _super);
    function ShopRectItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "ShopRectItemSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    ShopRectItem.prototype.onClick = function (e) {
        if (egret.is(e.target.parent, 'ItemIcon'))
            return;
        if (this.data && ShopController.ins().enoughBuy(this.data)) {
            ViewManager.ins().open(BuyWin, this.data);
        }
    };
    ShopRectItem.prototype.dataChanged = function () {
        //更新内容
        var bBuyAll = false;
        this.lbInfo.text = "";
        //icon
        var itemConfig;
        if (this.data.id) {
            itemConfig = GlobalConfig.ins().ItemConfig[this.data.id];
            this.nameLabel.text = itemConfig.name;
            this.nameLabel.textColor = ItemBase.QUALITY_TIP_COLOR[itemConfig.quality];
            this.itemIcon.setDataByConfig(itemConfig);
            this.itemIcon.isShowName(false);
            if (this.data.count) {
                this.itemIcon.setCount(this.data.count + "");
            }
        }
        if (this.data.limittime) {
            this.imgXiyou.visible = true;
            this.imgXiyou.source = "ui_jchd_bm_xianshi";
        }
        else {
            //稀有图片
            if (this.data.make && this.data.make === 1) {
                this.imgXiyou.visible = true;
                this.imgXiyou.source = "ui_bm_xiyou";
            }
            else {
                this.imgXiyou.visible = false;
            }
        }
        //设置价格
        if (this.data.currency.type) {
            this.priceIcon.setType(this.data.currency.id);
            this.priceIcon.setPrice(this.data.currency.count);
        }
        else {
            //待添加
            this.priceIcon.setType(this.data.currency.id);
            this.priceIcon.setPrice(this.data.currency.count);
        }
        //限购
        if (this.data.daycount) {
            if (this.data.daycount > 0) {
                if (this.data.buyTime && this.data.buyTime > 0 && this.data.daycount && this.data.buyTime === this.data.daycount) {
                    bBuyAll = true;
                }
                else {
                    this.lbInfo.textColor = Color.l_green_1;
                    this.lbInfo.text = "(限购" + this.data.buyTime + "/" + this.data.daycount + ")";
                }
            }
        }
        this.UpdateTime();
        //限制条件
        if (!ShopController.ins().enoughBuy(this.data, 3)) {
            this.lbInfo.text = ShopController.ins().enoughBuy(this.data, 2);
            this.lbInfo.textColor = Color.RedColor;
        }
        //售罄
        if (bBuyAll) {
            this.imgSellOut.visible = true;
            // this.filters = Color.GetFilter()//变灰
        }
        else {
            this.imgSellOut.visible = false;
            //  this.filters = null
        }
    };
    ShopRectItem.prototype.UpdateTime = function () {
        if (this.data.limittime) {
            this.lbtime.visible = true;
            var t = this.data.limittime - GameServer.serverTime;
            if (t > 0) {
                this.lbtime.text = DateUtils.format_9(t * 1000);
            }
            else {
                this.lbtime.text = "已结束";
            }
        }
        else {
            this.lbtime.visible = false;
        }
    };
    return ShopRectItem;
}(eui.ItemRenderer));
__reflect(ShopRectItem.prototype, "ShopRectItem");
//# sourceMappingURL=ShopRectItem.js.map