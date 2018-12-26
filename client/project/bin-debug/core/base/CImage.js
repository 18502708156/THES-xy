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
var CImage = (function (_super) {
    __extends(CImage, _super);
    function CImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CImage.prototype, "source", {
        set: function (source) {
            this.source2(source);
        },
        enumerable: true,
        configurable: true
    });
    CImage.prototype.source2 = function (source) {
        var newUrl = source;
        if (this.m_Url == newUrl) {
            return;
        }
        if (this.m_Url) {
            ResMgr.Unref(ResMgr.GetName(this.m_Url), ResMgr.IMG_LIFT_TIME);
        }
        this.m_Url = newUrl;
        if (this.m_Url) {
            ResMgr.Ref(ResMgr.GetName(this.m_Url));
        }
        egret.superSetter(CImage, this, 'source', source);
    };
    CImage.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this.m_Cache) {
            this.source2(this.m_Cache);
            this.m_Cache = null;
        }
    };
    CImage.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.m_Url) {
            this.m_Cache = this.m_Url;
            this.source2(null);
        }
    };
    return CImage;
}(eui.Image));
__reflect(CImage.prototype, "CImage");
//# sourceMappingURL=CImage.js.map