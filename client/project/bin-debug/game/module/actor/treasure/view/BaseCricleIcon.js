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
var BaseCricleIcon = (function (_super) {
    __extends(BaseCricleIcon, _super);
    function BaseCricleIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseCricleIcon.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    BaseCricleIcon.prototype.setData = function (data) {
        if (!data)
            return;
        if (data.icon) {
            this.imgBg.source = data.icon;
        }
        if (typeof (data.quality) === "number") {
            this.imgIcon.source = PetConst.QUALITY_SKILL_BG[data.quality] || "";
        }
    };
    ;
    return BaseCricleIcon;
}(BaseView));
__reflect(BaseCricleIcon.prototype, "BaseCricleIcon");
//# sourceMappingURL=BaseCricleIcon.js.map