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
var PetExpeditionIcon = (function (_super) {
    __extends(PetExpeditionIcon, _super);
    ////////////////////////////////////////////
    function PetExpeditionIcon() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionIconSkin";
        return _this;
    }
    Object.defineProperty(PetExpeditionIcon.prototype, "data", {
        set: function (id) {
            var config = GameGlobal.Config.BabyActivationConfig[id];
            this.imgIcon.source = LingtongConst.GetHeadIcon(id);
            this.imgBg.source = ResDataPath.GetItemQualityName(config.quality);
        },
        enumerable: true,
        configurable: true
    });
    return PetExpeditionIcon;
}(BaseView));
__reflect(PetExpeditionIcon.prototype, "PetExpeditionIcon");
//# sourceMappingURL=PetExpeditionIcon.js.map