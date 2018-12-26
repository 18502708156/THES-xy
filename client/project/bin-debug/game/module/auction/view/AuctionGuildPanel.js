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
var AuctionGuildPanel = (function (_super) {
    __extends(AuctionGuildPanel, _super);
    function AuctionGuildPanel() {
        return _super.call(this) || this;
    }
    AuctionGuildPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    AuctionGuildPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        AuctionBasePanel.aucType = 1;
        _super.prototype.OnOpen.call(this);
    };
    AuctionGuildPanel.NAME = '帮会拍品';
    return AuctionGuildPanel;
}(AuctionBasePanel));
__reflect(AuctionGuildPanel.prototype, "AuctionGuildPanel");
//# sourceMappingURL=AuctionGuildPanel.js.map