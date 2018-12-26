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
var MJGeziItem = (function (_super) {
    __extends(MJGeziItem, _super);
    function MJGeziItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "MJGeziItemSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._OnClick, _this);
        return _this;
    }
    MJGeziItem.prototype._OnClick = function () {
        var itemConfig = GlobalConfig.ins().ItemConfig[this.itemId];
        if (!itemConfig) {
            return;
        }
        if (itemConfig.type == 1) {
            ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, 1);
        }
    };
    MJGeziItem.prototype.setData = function (cfg) {
        if (cfg.id == 1) {
            this.icon.source = "";
            this.score_txt.text = "起点";
        }
        else {
            this.itemId = cfg.rewards.id;
            var itemConfig = GameGlobal.Config.ItemConfig[cfg.rewards.id];
            this.icon.source = ResDataPath.GetItemFullPath(itemConfig.icon);
            this.bg.source = ResDataPath.GetItemQualityName(itemConfig.quality);
            this.score_txt.text = cfg.rewards.count;
        }
    };
    return MJGeziItem;
}(eui.Component));
__reflect(MJGeziItem.prototype, "MJGeziItem");
//# sourceMappingURL=MJGeziItem.js.map