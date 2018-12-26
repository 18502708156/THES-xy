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
var VipIcon = (function (_super) {
    __extends(VipIcon, _super);
    function VipIcon() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_onlyVip = true;
        _this.skinName = "VipIconSkin";
        return _this;
    }
    VipIcon.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
    };
    /**onlyVip 不显示vip等级  只有vip*/
    VipIcon.prototype.setVipLv = function (vipLv, onlyVip) {
        if (onlyVip === void 0) { onlyVip = false; }
        this.m_vipLv = vipLv;
        this.m_onlyVip = onlyVip;
        this.updateSource();
        this.setFiltersGray();
    };
    VipIcon.prototype.setFiltersGray = function () {
        this.filters = this.m_vipLv > 0 ? null : Color.GetFilter();
    };
    VipIcon.prototype.updateSource = function () {
        var config = GameGlobal.Config.VipConfig[this.m_vipLv];
        if (config)
            this.icon.source = config.vipicon;
        this.vipLabel.text = "VIP" + (!this.m_onlyVip ? this.m_vipLv : '');
    };
    VipIcon.prototype.tap = function () {
        ViewManager.ins().open(VipMainPanel);
    };
    return VipIcon;
}(eui.Component));
__reflect(VipIcon.prototype, "VipIcon");
//# sourceMappingURL=VipIcon.js.map