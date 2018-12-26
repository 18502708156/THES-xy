/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 商店购买弹框
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
var BuyWin = (function (_super) {
    __extends(BuyWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BuyWin() {
        var _this = _super.call(this) || this;
        _this.m_eShopType = ShopType.normal;
        return _this;
    }
    BuyWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "BuySkin";
        this.num = 1;
        // this.itemIcon.imgJob.visible = false;
    };
    ;
    BuyWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.add10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sub10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
        this.numLabel.addEventListener(egret.Event.CHANGE, this.inputOver, this);
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateView); //物品变化也对当前进行刷新处理
        this.observe(MessageDef.POWER_CHANGE, this.updateView); //对所有货币进行监听
        this.observe(MessageDef.SHOP_CHANGE, this.updateView); //对所有货币进行监听
        if (param[1])
            this.m_eShopType = param[1];
        this.num = 1;
        this.pItemData = param[0];
        this.shopID = this.pItemData.id;
        this.updateView();
        this.inputOver();
        UIHelper.PlayPanelTween(this.animGroup);
    };
    ;
    BuyWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.add10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sub10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
        this.numLabel.removeEventListener(egret.Event.CHANGE, this.inputOver, this);
    };
    ;
    BuyWin.prototype.updateView = function () {
        var itemConfig = GlobalConfig.ins().ItemConfig[this.pItemData.id];
        this.itemIcon.setDataByConfig(itemConfig);
        this.itemIcon.isShowName(false);
        if (this.pItemData.count) {
            this.itemIcon.setCount(this.pItemData.count + "");
        }
        this.totalPrice.price = this.num * this.pItemData.currency.count;
        this.totalPrice.type = this.pItemData.currency.id;
        this.lbItemAccount.textFlow = TextFlowMaker.generateTextFlow(itemConfig.desc); //描述
        this.itemName.text = itemConfig.name + " Lv." + (itemConfig.level || 1);
        this.itemName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        var bBuyAll = false;
        //限购
        this.used.text = "";
        if (this.pItemData.daycount) {
            if (this.pItemData.daycount > 0) {
                if (this.pItemData.buyTime && this.pItemData.buyTime > 0 && this.pItemData.daycount && this.pItemData.buyTime === this.pItemData.daycount) {
                    bBuyAll = true;
                    this.used.text = "售罄";
                }
                else {
                    this.used.text = "(限购" + this.pItemData.buyTime + "/" + this.pItemData.daycount + ")";
                }
            }
        }
    };
    ;
    BuyWin.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.sub10Btn:
                this.num -= 10;
                break;
            case this.sub1Btn:
                this.num -= 1;
                break;
            case this.add10Btn:
                this.num += 10;
                break;
            case this.add1Btn:
                this.num += 1;
                break;
        }
        if (this.num < 1)
            this.num = 1;
        this.numLabel.text = this.num + "";
        this.inputOver();
    };
    ;
    BuyWin.prototype.closeCB = function (e) {
        ViewManager.ins().close(BuyWin);
    };
    ;
    BuyWin.prototype.buy = function (e) {
        //限购修正
        if (this.pItemData.daycount > 0) {
            var maxNum = this.pItemData.daycount - this.pItemData.buyTime;
            if (maxNum <= 0) {
                UserTips.ins().showTips("|C:0xff0000&T:售罄|");
                return;
            }
        }
        //判断拥有物品的数量
        var nNums = this.getHaveGoodsNums();
        if (nNums <= 0 || nNums < this.num) {
            var str = "货币不足";
            switch (this.pItemData.currency.id) {
                case SHOP_MONEY.yuanbao:
                    str = "元宝不足,无法兑换";
                    break;
                case SHOP_MONEY.bangyuan:
                    str = "绑元不足,无法兑换";
                    break;
                case SHOP_MONEY.yinbi:
                    str = "银币不足,无法兑换";
                    break;
                case SHOP_MONEY.banggong:
                    str = "帮贡不足,无法兑换";
                    break;
                case SHOP_MONEY.gongxun:
                    str = "功勋不足,无法兑换";
                    break;
                case SHOP_MONEY.pingfu:
                    str = "皮肤碎片不足,无法兑换";
                    break;
                case SHOP_MONEY.huanshou:
                    str = "幻兽令不足,无法兑换";
                    break;
                case SHOP_MONEY.xianlv:
                    str = "仙侣令不足,无法兑换";
                    break;
                case SHOP_MONEY.jinzhuang:
                    str = "金装碎片不足,无法兑换";
                    break;
                case SHOP_MONEY.youqing:
                    str = "友情值不足,无法兑换";
                    break;
                case SHOP_MONEY.weiwang:
                    str = "威望值不足,无法兑换";
                    break;
                case SHOP_MONEY.treasurePoint:
                    str = "寻宝积分不足,无法兑换";
                    break;
            }
            UserTips.ErrorTip(str);
        }
        else {
            switch (this.m_eShopType) {
                case ShopType.normal:
                    ShopManage.ins().sendBuy(this.pItemData.shopType, this.pItemData.index, this.num);
                    break;
                case ShopType.mystery:
                    ShopManage.ins().sendMysteryBuy(this.pItemData.index, this.num);
                    this.CloseSelf();
                    break;
            }
            if (this.pItemData.currency.id == SHOP_MONEY.jinzhuang) {
                this.CloseSelf();
            }
        }
    };
    ;
    BuyWin.prototype.inputOver = function () {
        this.num = parseInt(this.numLabel.text);
        if (isNaN(this.num) || this.num < 1)
            this.num = 1;
        //限购修正
        if (this.pItemData.daycount > 0) {
            var maxNum = this.pItemData.daycount - this.pItemData.buyTime;
            if (this.num > maxNum) {
                this.num = maxNum;
            }
        }
        else {
            //判断拥有物品的数量
            var nNums = this.getHaveGoodsNums();
            if (this.num > nNums) {
                this.num = nNums;
            }
        }
        if (this.num < 1) {
            this.num = 1;
        }
        this.numLabel.text = this.num + "";
        this.totalPrice.price = this.num * this.pItemData.currency.count;
    };
    ;
    BuyWin.prototype.getHaveGoodsNums = function () {
        var nHave = ShopController.ins().getBuyItemNums(this.pItemData.currency.id);
        var nNums = Math.floor(nHave / this.pItemData.currency.count);
        return nNums;
    };
    BuyWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return BuyWin;
}(BaseEuiView));
__reflect(BuyWin.prototype, "BuyWin");
var ShopType;
(function (ShopType) {
    ShopType[ShopType["normal"] = 0] = "normal";
    ShopType[ShopType["mystery"] = 1] = "mystery";
})(ShopType || (ShopType = {}));
//# sourceMappingURL=BuyWin.js.map