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
var DestinySItem = (function (_super) {
    __extends(DestinySItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinySItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "DestinyItemSkin";
        _this.imgSelect.visible = false;
        _this.lbLock.visible = false;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    DestinySItem.prototype.onUpdate = function (index, _data) {
        this.index = index;
        this.data = _data;
        this.imgAdd.visible = !_data || !_data.level;
        if (this.imgAdd.visible) {
            this.lbLv.text = "";
            this.imgIcon.visible = false;
            this.imgBg.source = ResDataPath.GetItemQualityName(0);
        }
        else {
            this.lbLv.text = "Lv." + _data.level;
            this.imgIcon.visible = true;
            var config = GlobalConfig.ins().ItemConfig[_data.item];
            this.imgIcon.source = ResDataPath.GetItemFullPath(config.icon);
            this.imgBg.source = ResDataPath.GetItemQualityName(config.quality);
        }
        this.imgRed.visible = GameGlobal.DestinyController.mRedPoint.IsRedUp(index);
    };
    DestinySItem.prototype.onClick = function (e) {
        ViewManager.ins().open(DestinyEquipLayer, this.data, this.index, true);
    };
    return DestinySItem;
}(eui.Component));
__reflect(DestinySItem.prototype, "DestinySItem");
//# sourceMappingURL=DestinySItem.js.map