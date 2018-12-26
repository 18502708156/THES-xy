var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ListLRBtnCtrl = (function () {
    function ListLRBtnCtrl(list, lhs, rhs, itemWidth) {
        this.paddingLeft = 0;
        this.paddingRight = 0;
        this.gap = 0;
        this.itemWidth = 0;
        this.animation = true;
        this.m_List = list;
        if (this.m_List.layout) {
            var layout = this.m_List.layout;
            this.paddingLeft = layout.paddingLeft;
            this.paddingRight = layout.paddingRight;
            this.gap = layout.gap;
        }
        this.itemWidth = itemWidth;
        this.m_LeftBtn = lhs;
        this.m_RightBtn = rhs;
        var scroller = list.parent;
        if (egret.is(scroller, "eui.Scroller")) {
            this.m_Scroller = scroller;
            this.m_Scroller.addEventListener(egret.Event.CHANGE, this.OnRefresh, this);
            this.m_LeftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
            this.m_RightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
    }
    ListLRBtnCtrl.prototype.SetRedPointList = function (list) {
        this.m_RedList = list;
    };
    ListLRBtnCtrl.prototype.SetPage = function (pageIndex) {
        this.m_Scroller.validateNow();
        this.m_List.validateNow();
        this.m_List.scrollH = this.m_Scroller.width * pageIndex;
        this.m_Scroller.$Scroller[8].currentScrollPos = this.m_List.scrollH;
        this.OnRefresh();
    };
    ListLRBtnCtrl.prototype._OnClick = function (e) {
        this.m_Scroller.stopAnimation();
        var list = this.m_List;
        var listWidth = this.m_Scroller.width - this.paddingLeft - this.paddingRight;
        switch (e.target) {
            case this.m_LeftBtn:
                this.SetPos(Math.max(0, list.scrollH - this.m_Scroller.width));
                break;
            case this.m_RightBtn:
                this.SetPos(Math.min(this.GetListItemWidth() - listWidth, list.scrollH + this.m_Scroller.width));
                break;
        }
        this.OnRefresh();
    };
    ListLRBtnCtrl.prototype.SetPos = function (pos) {
        if (this.animation) {
            var touch = this.m_Scroller.$Scroller[8];
            touch.maxScrollPos = this.m_List.contentWidth;
            touch.throwTo(pos);
        }
        else {
            this.m_List.scrollH = pos;
        }
    };
    ListLRBtnCtrl.prototype.GetListItemWidth = function () {
        var len = this.m_List.numElements;
        return len * this.itemWidth + (len - 1) * this.gap;
    };
    ListLRBtnCtrl.prototype.OnRefresh = function () {
        if (!this.m_Scroller || this.mNotVisible) {
            return;
        }
        var list = this.m_List;
        var leftBtn = this.m_LeftBtn;
        var rightBtn = this.m_RightBtn;
        var w = this.GetListItemWidth();
        if (w < this.m_Scroller.width) {
            leftBtn.visible = false;
            rightBtn.visible = false;
        }
        else {
            leftBtn.visible = list.scrollH > (this.itemWidth + this.paddingLeft);
            rightBtn.visible = (w - this.itemWidth) - (list.scrollH - this.paddingLeft) > (this.m_Scroller.width);
            if (this.m_RedList) {
                var leftIndex = Math.floor(list.scrollH / (this.itemWidth + this.gap));
                var rightIndex = Math.floor((list.scrollH + this.m_Scroller.width) / (this.itemWidth + this.gap));
                if (leftBtn.visible) {
                    var red = false;
                    for (var i = 0; i <= leftIndex; i++) {
                        if (this.m_RedList[i]) {
                            red = true;
                            break;
                        }
                    }
                    UIHelper.ShowRedPoint(leftBtn, red);
                }
                if (rightBtn.visible) {
                    var red = false;
                    for (var i = rightIndex, len = this.m_RedList.length; i < len; i++) {
                        if (this.m_RedList[i]) {
                            red = true;
                            break;
                        }
                    }
                    UIHelper.ShowRedPoint(rightBtn, red);
                }
            }
        }
    };
    ListLRBtnCtrl.prototype.SetLeftIndex = function (leftIndex) {
        var list = this.m_List;
        list.validateNow();
        var w = this.GetListItemWidth();
        var listWidth = this.m_Scroller.width - this.paddingLeft - this.paddingRight;
        list.scrollH = Math.min(leftIndex * this.itemWidth + Math.max((leftIndex - 1) * this.gap, 0), this.GetListItemWidth() - listWidth);
        var touch = this.m_Scroller.$Scroller[8];
        touch.currentPosition = touch.currentScrollPos = list.scrollH;
    };
    return ListLRBtnCtrl;
}());
__reflect(ListLRBtnCtrl.prototype, "ListLRBtnCtrl");
//# sourceMappingURL=ListLRBtnCtrl.js.map