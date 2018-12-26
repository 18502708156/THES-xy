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
var GangPanTaoHuiListItem = (function (_super) {
    __extends(GangPanTaoHuiListItem, _super);
    function GangPanTaoHuiListItem() {
        var _this = _super.call(this) || this;
        _this.TYPECOLOR = [
            "#019704",
            "#DB0000",
            "#F77C67"
        ];
        _this.TYPENAME = [
            "百年桃",
            "万年桃",
            "千年桃"
        ];
        return _this;
    }
    GangPanTaoHuiListItem.prototype.dataChanged = function () {
        var data = this.data;
        var str = GameServer.PanTaoHui(data.time) + "   ";
        str += '[<font color = "#00A2FF">' + data.playerName + '</font>]' + "   ";
        str += '食用了<font color = "' + this.TYPECOLOR[data.peachId - 1] + '">' + this.TYPENAME[data.peachId - 1] + '</font>';
        this.info.textFlow = (new egret.HtmlTextParser()).parser(str);
    };
    return GangPanTaoHuiListItem;
}(eui.ItemRenderer));
__reflect(GangPanTaoHuiListItem.prototype, "GangPanTaoHuiListItem");
//# sourceMappingURL=GangPanTaoHuiListItem.js.map