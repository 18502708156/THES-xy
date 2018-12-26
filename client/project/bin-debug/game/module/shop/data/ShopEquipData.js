/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/8 14:15
 * @meaning: 商店装备数据
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
var ShopEquipData = (function (_super) {
    __extends(ShopEquipData, _super);
    function ShopEquipData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //自定义字段
        _this.buyTime = 0; //购买次数
        _this.shopType = 0; //商店类型
        return _this;
    }
    ShopEquipData.prototype.initLocalData = function (data, _type) {
        this.index = data.index || 0; //索引
        this.tabnum = data.tabnum || 0; //分页页签序号
        this.type = data.type || 0; //类型
        this.unlocktype = data.unlocktype || {}; //解锁条件类型
        this.mark = data.mark || 0; //稀有标识
        this.id = data.id || 0; //道具ID
        this.count = data.count || 0; //单次购买数量
        this.daycount = data.daycount || 0; //最大限购次数
        this.currency = data.currency || {}; //商品兑换货币类型及数量
        this.shopType = _type || 0;
    };
    return ShopEquipData;
}(ShopBaseData));
__reflect(ShopEquipData.prototype, "ShopEquipData");
//# sourceMappingURL=ShopEquipData.js.map