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
    var CVerticalLayout = (function (_super) {
        __extends(CVerticalLayout, _super);
        function CVerticalLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CVerticalLayout.prototype.measureReal = function () {
        };
        CVerticalLayout.prototype.measureVirtual = function () {
            var target = this.$target;
            var typicalHeight = this.$typicalHeight;
            var measuredHeight = this.getElementTotalSize();
            var measuredWidth = Math.max(this.maxElementSize, this.$typicalWidth);
            var bounds = egret.$TempRectangle;
            var endIndex = this.endIndex;
            var elementSizeTable = this.elementSizeTable;
            for (var index = this.startIndex; index < endIndex; index++) {
                var layoutElement = (target.getElementAt(index));
                if (!egret.is(layoutElement, "eui.UIComponent") || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredHeight += bounds.height;
                measuredHeight -= isNaN(elementSizeTable[index]) ? typicalHeight : elementSizeTable[index];
                measuredWidth = Math.max(measuredWidth, bounds.width);
            }
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        };
        CVerticalLayout.prototype.updateDisplayListReal = function (width, height) {
        };
        CVerticalLayout.prototype.updateDisplayListVirtual = function (width, height) {
            var target = this.$target;
            if (this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            var paddingB = this.$paddingBottom;
            var paddingL = this.$paddingLeft;
            var paddingR = this.$paddingRight;
            var gap = this.$gap;
            var contentHeight;
            var numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentHeight = -(this.getStartPosition(numElements) + gap - paddingB);
                target.setContentSize(target.contentWidth, contentHeight);
                return;
            }
            var endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            var justify = false;
            var contentJustify = false;
            var hAlign = 0;
            var bounds = egret.$TempRectangle;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var justifyWidth = Math.ceil(targetWidth);
            var layoutElement;
            var typicalHeight = this.$typicalHeight;
            var typicalWidth = this.$typicalWidth;
            var maxElementWidth = this.maxElementSize;
            var oldMaxW = Math.max(typicalWidth, this.maxElementSize);
            var x = 0;
            var y = 0;
            var contentWidth = 0;
            var oldElementSize;
            var needInvalidateSize = false;
            var elementSizeTable = this.elementSizeTable;
            //对可见区域进行布局
            for (var i = this.startIndex; i <= endIndex; i++) {
                var exceesWidth = 0;
                layoutElement = (target.getVirtualElementAt(i));
                if (!egret.is(layoutElement, "eui.UIComponent") || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                if (!contentJustify) {
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                }
                if (justify) {
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth, NaN);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    layoutElement.getLayoutBounds(bounds);
                    exceesWidth = (targetWidth - bounds.width) * hAlign;
                    exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                    x = paddingL + exceesWidth;
                }
                contentWidth = Math.max(contentWidth, bounds.width);
                if (!needInvalidateSize) {
                    oldElementSize = isNaN(elementSizeTable[i]) ? typicalHeight : elementSizeTable[i];
                    if (oldElementSize != bounds.height)
                        needInvalidateSize = true;
                }
                elementSizeTable[i] = bounds.height;
                y = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
            }
            contentWidth += paddingL + paddingR;
            contentHeight = this.getElementTotalSize();
            // 另外一种情况
            if (contentHeight < this.target.height) {
                var y_1 = this.$paddingTop;
                for (var i = endIndex; i >= this.startIndex; --i) {
                    layoutElement = (target.getVirtualElementAt(i));
                    if (!egret.is(layoutElement, "eui.UIComponent") || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.$setY(y_1);
                    var h = elementSizeTable[i];
                    if (isNaN(h)) {
                        h = typicalHeight;
                    }
                    y_1 += h + gap;
                }
            }
            this.maxElementSize = maxElementWidth;
            target.setContentSize(contentWidth, contentHeight);
            if (needInvalidateSize || oldMaxW < this.maxElementSize) {
                target.invalidateSize();
            }
        };
        CVerticalLayout.prototype.GetPos = function (index) {
            var typicalHeight = this.$typicalHeight;
            var startPos = this.$paddingTop;
            var gap = this.$gap;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < index; i++) {
                var h = elementSizeTable[i];
                if (isNaN(h)) {
                    h = typicalHeight;
                }
                startPos += h + gap;
            }
            return startPos;
        };
        CVerticalLayout.prototype.getStartPosition = function (index) {
            var typicalHeight = this.$typicalHeight;
            var startPos = this.$target.height - this.$paddingBottom - this.getElementSize(0);
            var gap = this.$gap;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 1; i <= index; i++) {
                var h = elementSizeTable[i];
                if (isNaN(h)) {
                    h = typicalHeight;
                }
                startPos -= (h + gap);
            }
            return startPos;
        };
        CVerticalLayout.prototype.getElementSize = function (index) {
            if (this.$useVirtualLayout) {
                var size = this.elementSizeTable[index];
                if (isNaN(size)) {
                    size = this.$typicalHeight;
                }
                return size;
            }
            if (this.$target) {
                return this.$target.getElementAt(index).height;
            }
            return 0;
        };
        CVerticalLayout.prototype.getElementTotalSize = function () {
            var typicalHeight = this.$typicalHeight;
            var gap = this.$gap;
            var totalSize = 0;
            var length = this.$target.numElements;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < length; i++) {
                var h = elementSizeTable[i];
                if (isNaN(h)) {
                    h = typicalHeight;
                }
                totalSize += h + gap;
            }
            totalSize -= gap;
            return totalSize;
        };
        CVerticalLayout.prototype.elementAdded = function (index) {
            _super.prototype.elementAdded.call(this, index);
            this.elementSizeTable.splice(index, 0, this.$typicalHeight);
        };
        CVerticalLayout.prototype.getIndexInView = function () {
            var target = this.$target;
            if (!target || target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var values = target.$UIComponent;
            if (values[10 /* width */] == 0 || values[11 /* height */] == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var numElements = target.numElements;
            var contentTopY = this.getStartPosition(numElements - 1) - this.getElementSize(numElements - 1) - this.$paddingTop;
            var bottomY = target.scrollV + values[11 /* height */];
            if (bottomY < contentTopY) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var topY = target.scrollV;
            if (topY > values[11 /* height */] - this.$paddingBottom) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var oldStartIndex = this.startIndex;
            var oldEndIndex = this.endIndex;
            this.startIndex = this.findIndexAt(bottomY, 0, numElements - 1);
            if (this.startIndex == -1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(topY, 0, numElements - 1);
            if (this.endIndex == -1)
                this.endIndex = numElements - 1;
            return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
        };
        CVerticalLayout.prototype.findIndexAt = function (x, i0, i1) {
            var index = ((i0 + i1) * 0.5) | 0;
            var elementX = this.getStartPosition(index);
            var elementWidth = this.getElementSize(index);
            if ((x >= elementX) && (x < elementX + elementWidth + this.$gap))
                return index;
            else if (i0 == i1)
                return -1;
            else if (x > elementX)
                return this.findIndexAt(x, i0, Math.max(i0, index - 1));
            else
                return this.findIndexAt(x, Math.min(index + 1, i1), i1);
        };
        return CVerticalLayout;
    }(eui.LinearLayoutBase));
    ceui.CVerticalLayout = CVerticalLayout;
    __reflect(CVerticalLayout.prototype, "ceui.CVerticalLayout");
})(ceui || (ceui = {}));
//# sourceMappingURL=CVerticalLayout.js.map