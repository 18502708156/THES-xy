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
var MailItem = (function (_super) {
    __extends(MailItem, _super);
    function MailItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "MailItemSkin";
        _this.tipLabel = null;
        return _this;
    }
    MailItem.prototype.dataChanged = function () {
        var e = this.data;
        //只有在未读未领取的东西才会有物品图标显示
        if (e.receive === 0) {
            this.give.visible = true;
        }
        else {
            this.give.visible = false;
        }
        var exStr = e.type ? "(已读)" : "(未读)";
        var exColor = e.type ? Color.l_normal : Color.l_green_1;
        e instanceof MailData && (this.nameLabel.textFlow = TextFlowMaker.generateTextFlow("|T:" + e.title + "|C:" + exColor + "&T:" + exStr + "|"),
            this.dateLabel.text = DateUtils.getFormatBySecond(e.times, 2));
    };
    return MailItem;
}(eui.ItemRenderer));
__reflect(MailItem.prototype, "MailItem");
//# sourceMappingURL=MailItem.js.map