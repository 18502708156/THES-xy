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
var TipsItem = (function (_super) {
    __extends(TipsItem, _super);
    function TipsItem() {
        var _this = _super.call(this) || this;
        _this.endPos = 0;
        _this.speed = 0;
        _this.step = 0;
        _this.time = 0;
        _this.skinName = "TipsSkin";
        _this.group.x = 0;
        _this.group.width = 0;
        return _this;
    }
    Object.defineProperty(TipsItem.prototype, "labelText", {
        set: function (value) {
            this.lab.textFlow = TextFlowMaker.generateTextFlow(value);
            this.bg.width = this.lab.width + 80;
            this.group.y = 0;
            this.step = 0;
            this.time = 0;
            this.alpha = 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TipsItem.prototype, "iconName", {
        set: function (src) {
            this.icon.source = src;
        },
        enumerable: true,
        configurable: true
    });
    TipsItem.prototype.Update = function (delta) {
        this.time += delta;
        var endTime;
        if (this.step == 0) {
            endTime = 500;
            this.group.y = -this.height * Math.min(this.time / endTime, 1);
        }
        else if (this.step == 1) {
            endTime = 500;
        }
        else if (this.step == 2) {
            endTime = 200;
            this.alpha = 1 - Math.min(this.time / endTime, 1);
        }
        else {
            return false;
        }
        if (this.time >= endTime) {
            ++this.step;
            this.time = 0;
        }
        return true;
    };
    return TipsItem;
}(eui.Component));
__reflect(TipsItem.prototype, "TipsItem");
//# sourceMappingURL=TipsItem.js.map