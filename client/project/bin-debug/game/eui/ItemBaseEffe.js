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
var ItemBaseEffe = (function (_super) {
    __extends(ItemBaseEffe, _super);
    function ItemBaseEffe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemBaseEffe.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        // this.showItemEffect()
    };
    return ItemBaseEffe;
}(ItemBase));
__reflect(ItemBaseEffe.prototype, "ItemBaseEffe");
var ItemBaseEffeNoName = (function (_super) {
    __extends(ItemBaseEffeNoName, _super);
    function ItemBaseEffeNoName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemBaseEffeNoName.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        // this.showItemEffect()
    };
    return ItemBaseEffeNoName;
}(ItemBaseNotName));
__reflect(ItemBaseEffeNoName.prototype, "ItemBaseEffeNoName");
//# sourceMappingURL=ItemBaseEffe.js.map