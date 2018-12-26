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
var YingyuanAddItem = (function (_super) {
    __extends(YingyuanAddItem, _super);
    function YingyuanAddItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "YingYuanItemSkin";
        return _this;
    }
    YingyuanAddItem.prototype.childrenCreated = function () {
        this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick, this);
    };
    YingyuanAddItem.prototype.onclick = function () {
        var data = this.data;
        GameGlobal.YingYuanModel.getFriendData(this.data);
    };
    YingyuanAddItem.prototype.dataChanged = function () {
        var data = this.data;
        this.jsname.text = data.friendInfo.name;
        this.lv.text = data.friendInfo.level;
        this.zdl.text = data.friendInfo.power;
    };
    return YingyuanAddItem;
}(eui.ItemRenderer));
__reflect(YingyuanAddItem.prototype, "YingyuanAddItem");
//# sourceMappingURL=YingyuanAddItem.js.map