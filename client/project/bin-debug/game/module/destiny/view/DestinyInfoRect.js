/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/27 17:01
 * @meaning: 灵童命格属性内容详情
 *
 **/
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
//打造的信息框
var DestinyInfoRect = (function (_super) {
    __extends(DestinyInfoRect, _super);
    function DestinyInfoRect() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tListLb = [];
        _this.skinName = "DestinyRectInfoSkin";
        for (var i = 0; i < 4; i++) {
            _this.tListLb[i] = _this["lbArr" + i];
        }
        return _this;
    }
    DestinyInfoRect.prototype.onUpdate = function (_data) {
        if (_data) {
            this.tListLb[0].textColor = ItemBase.QUALITY_COLOR[_data.quality];
            for (var item in this.tListLb) {
                var str = _data.list[item] || "";
                this.tListLb[item].text = str;
            }
        }
    };
    return DestinyInfoRect;
}(BaseView));
__reflect(DestinyInfoRect.prototype, "DestinyInfoRect");
//# sourceMappingURL=DestinyInfoRect.js.map