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
var NeedItemView = (function (_super) {
    __extends(NeedItemView, _super);
    function NeedItemView() {
        return _super.call(this) || this;
    }
    NeedItemView.prototype.SetItemId = function (id, count) {
        var config = GameGlobal.Config.ItemConfig[id];
        if (!config) {
            return;
        }
        this.mItemId = id;
        this.item.data = id;
        StringUtils.addColor;
        UIHelper.SetLabelText(this.matLabel, StringUtils.addColor(config.name, ItemBase.QUALITY_COLOR[config.quality]), "*" + count);
        UIHelper.SetLabelText(this.useCountLabel, "拥有：", GameGlobal.UserBag.GetCount(id) + "");
    };
    return NeedItemView;
}(eui.Component));
__reflect(NeedItemView.prototype, "NeedItemView");
//# sourceMappingURL=NeedItemView.js.map