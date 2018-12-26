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
var PageButton = (function (_super) {
    __extends(PageButton, _super);
    function PageButton() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._page = -1;
        _this._max = -1;
        _this.skinName = 'PageButtonSkin';
        return _this;
    }
    PageButton.prototype.childrenCreated = function () {
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    };
    /**
     * 设置当前页
     * @param value 当前页的页码。从1开始。小于1时强制为1，大于最大值时强制为最大值
     */
    PageButton.prototype.setPage = function (value) {
        if (value == this._page)
            return;
        if (value < 1)
            value = 1;
        if (this._max > -1)
            if (value > this._max)
                value = this._max;
        this._page = value;
        this.checkEnabled();
    };
    /**
     * 设置最大页码。
     * @param value 最大页码。当当前页超过最大值的时候，强制为最大值
     */
    PageButton.prototype.setMax = function (value) {
        if (value == this._max)
            return;
        if (value < 1)
            value = 1;
        if (this._page > value)
            this._page = value;
        this._max = value;
        this.checkEnabled();
    };
    PageButton.prototype.onClickHandler = function (e) {
        var rate = e.currentTarget == this.leftBtn ? -1 : 1;
        var page = this._page + rate;
        this.setPage(page);
        MessageCenter.ins().dispatch(MessageDef.PAGE_BUTTON_UPDATE, page);
    };
    PageButton.prototype.checkEnabled = function () {
        this.pageTxt.text = this._page + '/' + this._max;
        this.leftBtn.enabled = this.rightBtn.enabled = false;
        if (this._max > 1) {
            if (this._page > 1)
                this.leftBtn.enabled = true;
            if (this._page < this._max)
                this.rightBtn.enabled = true;
        }
    };
    return PageButton;
}(eui.Component));
__reflect(PageButton.prototype, "PageButton", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=PageButton.js.map