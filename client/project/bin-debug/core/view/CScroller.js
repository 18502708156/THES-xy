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
var ceui;
(function (ceui) {
    var CScroller = (function (_super) {
        __extends(CScroller, _super);
        function CScroller() {
            var _this = _super.call(this) || this;
            _this.skinName = "CScrollerSkin";
            var self = _this;
            var touchScrollH = new ceui.CTouchScroll(self.horizontalUpdateHandler, self.horizontalEndHandler, self);
            var touchScrollV = new ceui.CTouchScroll(self.verticalUpdateHandler, self.verticalEndHanlder, self);
            _this.$Scroller = {
                0: "auto",
                1: "auto",
                2: null,
                3: 0,
                4: 0,
                5: false,
                6: false,
                7: false,
                8: touchScrollH,
                9: touchScrollV,
                10: null,
                11: false,
                12: false //touchCancle
            };
            return _this;
        }
        return CScroller;
    }(eui.Scroller));
    ceui.CScroller = CScroller;
    __reflect(CScroller.prototype, "ceui.CScroller");
})(ceui || (ceui = {}));
//# sourceMappingURL=CScroller.js.map