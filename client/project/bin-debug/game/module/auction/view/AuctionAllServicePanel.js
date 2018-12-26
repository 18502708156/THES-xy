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
var AuctionAllServicePanel = (function (_super) {
    __extends(AuctionAllServicePanel, _super);
    function AuctionAllServicePanel() {
        return _super.call(this) || this;
    }
    AuctionAllServicePanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    AuctionAllServicePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        AuctionBasePanel.aucType = 0;
        _super.prototype.OnOpen.call(this);
    };
    AuctionAllServicePanel.NAME = '全服拍品';
    return AuctionAllServicePanel;
}(AuctionBasePanel));
__reflect(AuctionAllServicePanel.prototype, "AuctionAllServicePanel");
//# sourceMappingURL=AuctionAllServicePanel.js.map