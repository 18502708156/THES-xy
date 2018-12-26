/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 21:51
 * @meaning: 常规商店详情
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
var ShopEquipLayer = (function (_super) {
    __extends(ShopEquipLayer, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ShopEquipLayer() {
        var _this = _super.call(this) || this;
        _this.nSelect222 = 0;
        _this.tTitleName = []; //商店标题名称
        _this.tItemData = {}; //商品数据
        _this.nSelect = 1; //默认选中第一个
        _this.skinName = "ShopEquipSkin";
        _this.listView.itemRenderer = ShopEquipItem;
        _this.listTitle.itemRenderer = ShopEqTitle;
        _this.listTitle.selectedIndex = 0;
        return _this;
    }
    ShopEquipLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setMoney); //
        this.observe(MessageDef.POWER_CHANGE, this.setMoney); //
        this.observe(MessageDef.GUILD_CONTRIB_UPDATE, this.setMoney); //
        this.observe(MessageDef.SHOP_CHANGE, this.UpdateContent); //商店购买变化
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateRedPoint);
        this._AddItemClick(this.listTitle, this.onListClick);
        // this._AddItemClick(this.listView, this.onListViewClick)
        this._AddClick(this.goPrice, this.onClick);
        UIHelper.SetLinkStyleLabel(this.goPrice);
        this.setMoney();
        this.UpdateContent();
        this.UpdateRedPoint();
        var type = param[0];
        if (type) {
            var i = 0;
            for (var _a = 0, _b = this.tTitleName; _a < _b.length; _a++) {
                var data = _b[_a];
                if (data.nSelect == type) {
                    break;
                }
                ++i;
            }
            this.OnSelectList(type);
            this.listTitle.selectedIndex = i;
        }
    };
    ShopEquipLayer.prototype.UpdateRedPoint = function () {
        this.redPoint.visible = GameGlobal.UserBag.HasOrangeEquip();
    };
    ShopEquipLayer.prototype.setData = function () {
        this.tShopData = ShopController.ins().getShopDataByIndex(ShopController.EN_SHOP_EQUIP);
        //重置
        this.tItemData = {};
        this.tTitleName = [];
        for (var ind in this.tShopData.shop) {
            if (!this.tItemData[this.tShopData.shop[ind].tabnum]) {
                this.tItemData[this.tShopData.shop[ind].tabnum] = [];
            }
            this.tItemData[this.tShopData.shop[ind].tabnum].push(this.tShopData.shop[ind]); //根据标签插入
            var itemConfig_1 = GlobalConfig.ins().ItemConfig[this.tShopData.shop[ind].id];
            if (this.tTitleName.length > 0) {
                for (var i_1 = 0; i_1 < this.tTitleName.length; i_1++) {
                    if (this.tTitleName[i_1].nSelect === this.tShopData.shop[ind].tabnum) {
                        this.tTitleName[i_1].maxLv = itemConfig_1.level;
                        break;
                    }
                    if (i_1 == this.tTitleName.length - 1)
                        this.tTitleName.push(this.getShopTitleName(this.tShopData.shop[ind].tabnum, itemConfig_1.level));
                }
            }
            else
                this.tTitleName.push(this.getShopTitleName(this.tShopData.shop[ind].tabnum, itemConfig_1.level));
        }
        var role = SubRoles.ins().GetRoleData();
        var len = role.getEquipLen();
        var reachQualityCounter = 0;
        var equipMinLv = -1;
        var itemConfig = null;
        for (var i = 0; i < len; i++) {
            var element = role.getEquipByIndex(i);
            if (element)
                itemConfig = element.item.itemConfig;
            if (itemConfig) {
                if (4 <= itemConfig.quality)
                    reachQualityCounter++;
                if (equipMinLv > itemConfig.level || equipMinLv < 0)
                    equipMinLv = itemConfig.level;
            }
        }
        if (reachQualityCounter >= len) {
            for (var i_2 = 0; i_2 < this.tTitleName.length;) {
                if (this.tTitleName[i_2].maxLv <= equipMinLv && this.tTitleName[i_2].nSelect != 1) {
                    this.tTitleName.splice(i_2, 1);
                }
                else
                    i_2++;
            }
        }
    };
    // _type为 (tabnum字段) 分页标签
    ShopEquipLayer.prototype.getShopTitleName = function (_type, maxLv) {
        var nameObj = {};
        var strName = "";
        if (_type === 1) {
            strName = "物品商店";
        }
        else {
            strName = _type + "级金装";
        }
        nameObj = { nSelect: _type, strName: strName, maxLv: maxLv };
        return nameObj;
    };
    ShopEquipLayer.prototype.UpdateContent = function () {
        this.setData();
        var tListData = this.tItemData[this.nSelect];
        ShopController.ins().sortLimitTime(tListData);
        this.listView.dataProvider.replaceAll(tListData);
        this.listTitle.dataProvider.replaceAll(this.tTitleName);
        var strAccount = "";
        var strNums = GameGlobal.UserFb.lltModel.layer + "";
        if (typeof (this.tShopData.instructions) == "string") {
            strAccount = this.tShopData.instructions.replace("%s", strNums); //这里系统并没有参数,所以后期需要补充
        }
        this.account.text = strAccount;
    };
    ShopEquipLayer.prototype.setMoney = function () {
        this.setData();
        if (this.tShopData.moneytype) {
            this.priceIcon.setType(this.tShopData.moneytype);
            this.priceIcon.price = CommonUtils.overLength(ShopController.ins().getBuyItemNums(this.tShopData.moneytype));
        }
    };
    ShopEquipLayer.prototype.onListClick = function (e) {
        var type = e.item.nSelect;
        this.OnSelectList(type);
    };
    ShopEquipLayer.prototype.OnSelectList = function (type) {
        this.nSelect = type;
        ShopController.ins().sortLimitTime(this.tItemData[type]);
        this.listView.dataProvider = new eui.ArrayCollection(this.tItemData[type]);
    };
    ShopEquipLayer.prototype.onListViewClick = function (e) {
        // var pItem = e.item
        // if(pItem&&ShopController.ins().enoughBuy(pItem))
        // {
        // 	ViewManager.ins().open(BuyWin,pItem)
        // }
    };
    /**点击 */
    ShopEquipLayer.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.goPrice:
                //跳转
                ViewManager.ins().open(ShopResolveLayer);
                break;
        }
    };
    ShopEquipLayer.NAME = "装备商店";
    return ShopEquipLayer;
}(BaseView));
__reflect(ShopEquipLayer.prototype, "ShopEquipLayer", ["ICommonWindowTitle"]);
//# sourceMappingURL=ShopEquipLayer.js.map