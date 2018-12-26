/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:51
 * @meaning: 灵童命格框信息
 *
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
var DestinyShowRectItem = (function (_super) {
    __extends(DestinyShowRectItem, _super);
    function DestinyShowRectItem() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._totalNum = 0;
        // 皮肤名称
        _this.skinName = "DestinyShowRectSkin";
        _this.listView.itemRenderer = DestinyShowInfoItem;
        return _this;
    }
    DestinyShowRectItem.prototype.dataChanged = function () {
        if (this.data) {
            this.nameLabel.text = this.data.tList[0].name || "";
            this.imgIcon.source = ResDataPath.GetItemFullPath(this.data.tList[0].icon || "");
        }
        if (this.data.bSelect) {
            this.currentState = "show";
            this.listView.dataProvider = new eui.ArrayCollection(this.data.tList);
        }
        else {
            this.currentState = "nor";
            this.listView.dataProvider = new eui.ArrayCollection([]);
        }
    };
    return DestinyShowRectItem;
}(eui.ItemRenderer));
__reflect(DestinyShowRectItem.prototype, "DestinyShowRectItem");
//# sourceMappingURL=DestinyShowRectItem.js.map