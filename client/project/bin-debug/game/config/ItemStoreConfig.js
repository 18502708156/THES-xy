var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ItemStoreConfig = (function () {
    function ItemStoreConfig() {
    }
    ItemStoreConfig.getStoreByItemID = function (id, type) {
        if (type === void 0) { type = ShopController.EN_SHOP_BANGYUAN; }
        var arr;
        switch (type) {
            case ShopController.EN_SHOP_BANGYUAN:
                arr = this.GetItemBYStoreConfig();
                break;
            case ShopController.EN_SHOP_YUANBAO:
                arr = this.GetItemYBStoreConfig();
                break;
        }
        if (arr) {
            return arr[id] || null;
        }
        return null;
    };
    ItemStoreConfig.GetItemBYStoreConfig = function () {
        if (!this.mBangYuanStore) {
            var datas = this.mBangYuanStore = {};
            var config = GameGlobal.Config.BangYuanStore;
            for (var key in config) {
                datas[config[key].id] = config[key];
            }
        }
        return this.mBangYuanStore;
    };
    ItemStoreConfig.GetItemYBStoreConfig = function () {
        if (!this.mYuanBaoStore) {
            var datas = this.mYuanBaoStore = {};
            var config = GameGlobal.Config.YuanBaoStore;
            for (var key in config) {
                datas[config[key].id] = config[key];
            }
        }
        return this.mYuanBaoStore;
    };
    ItemStoreConfig.GetPrice = function (itemId, type) {
        if (type === void 0) { type = ShopController.EN_SHOP_BANGYUAN; }
        var config = this.getStoreByItemID(itemId, type);
        if (config) {
            return config.currency.count;
        }
        return 9999999;
    };
    ItemStoreConfig.GetStoreType = function (id) {
        if (this.GetItemBYStoreConfig()[id]) {
            return ShopController.EN_SHOP_BANGYUAN;
        }
        if (this.GetItemYBStoreConfig()[id]) {
            return ShopController.EN_SHOP_YUANBAO;
        }
        return -1;
    };
    return ItemStoreConfig;
}());
__reflect(ItemStoreConfig.prototype, "ItemStoreConfig");
//# sourceMappingURL=ItemStoreConfig.js.map