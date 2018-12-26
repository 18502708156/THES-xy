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
var ItemRenderer = (function (_super) {
    __extends(ItemRenderer, _super);
    function ItemRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemRenderer.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        GameGlobal.MessageCenter.removeAll(this);
        TimerManager.ins().removeAll(this);
    };
    return ItemRenderer;
}(eui.ItemRenderer));
__reflect(ItemRenderer.prototype, "ItemRenderer");
//# sourceMappingURL=ItemRenderer.js.map