namespace ceui {
	export class CVerticalLayout extends eui.LinearLayoutBase {

		protected measureReal(): void {
		}

		protected measureVirtual(): void {
			let target = this.$target;
			let typicalHeight = this.$typicalHeight;
			let measuredHeight = this.getElementTotalSize();
			let measuredWidth = Math.max(this.maxElementSize, this.$typicalWidth);
			let bounds = egret.$TempRectangle;
			let endIndex = this.endIndex;
			let elementSizeTable = this.elementSizeTable;
			for (let index = this.startIndex; index < endIndex; index++) {
				let layoutElement = <eui.UIComponent>(target.getElementAt(index));
				if (!egret.is(layoutElement, "eui.UIComponent") || !layoutElement.$includeInLayout) {
					continue;
				}
				layoutElement.getPreferredBounds(bounds);
				measuredHeight += bounds.height;
				measuredHeight -= isNaN(elementSizeTable[index]) ? typicalHeight : elementSizeTable[index];
				measuredWidth = Math.max(measuredWidth, bounds.width);
			}
			let hPadding = this.$paddingLeft + this.$paddingRight;
			let vPadding = this.$paddingTop + this.$paddingBottom;
			target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
		}

		protected updateDisplayListReal(width: number, height: number): void {
		}

		protected updateDisplayListVirtual(width: number, height: number): void {
			let target = this.$target;
			if (this.indexInViewCalculated)
				this.indexInViewCalculated = false;
			else
				this.getIndexInView();
			let paddingB = this.$paddingBottom;
			let paddingL = this.$paddingLeft;
			let paddingR = this.$paddingRight;
			let gap = this.$gap;
			let contentHeight: number;
			let numElements = target.numElements;
			if (this.startIndex == -1 || this.endIndex == -1) {
				contentHeight = -(this.getStartPosition(numElements) + gap - paddingB);
				target.setContentSize(target.contentWidth, contentHeight);
				return;
			}

			let endIndex = this.endIndex;
			target.setVirtualElementIndicesInView(this.startIndex, endIndex);
			//获取垂直布局参数
			let justify = false
			let contentJustify = false
			let hAlign = 0;

			let bounds = egret.$TempRectangle;
			let targetWidth = Math.max(0, width - paddingL - paddingR);
			let justifyWidth = Math.ceil(targetWidth);
			let layoutElement: eui.UIComponent;
			let typicalHeight = this.$typicalHeight;
			let typicalWidth = this.$typicalWidth;
			let maxElementWidth = this.maxElementSize;
			let oldMaxW = Math.max(typicalWidth, this.maxElementSize);

			let x = 0;
			let y = 0;
			let contentWidth = 0;
			let oldElementSize: number;
			let needInvalidateSize = false;
			let elementSizeTable = this.elementSizeTable;

			//对可见区域进行布局
			for (let i = this.startIndex; i <= endIndex; i++) {
				let exceesWidth = 0;
				layoutElement = <eui.UIComponent>(target.getVirtualElementAt(i));
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
			contentHeight = this.getElementTotalSize()

			// 另外一种情况
			if (contentHeight < this.target.height) {
				let y = this.$paddingTop
				for (let i = endIndex; i >= this.startIndex; --i) {
					layoutElement = <eui.UIComponent>(target.getVirtualElementAt(i));
					if (!egret.is(layoutElement, "eui.UIComponent") || !layoutElement.$includeInLayout) {
						continue;
					}
					layoutElement.$setY(y)
					let h = elementSizeTable[i];
					if (isNaN(h)) {
						h = typicalHeight;
					}
					y += h + gap;
				}
			}
			this.maxElementSize = maxElementWidth;
			target.setContentSize(contentWidth, contentHeight);

			if (needInvalidateSize || oldMaxW < this.maxElementSize) {
				target.invalidateSize();
			}
		}

		private GetPos(index: number): number {
			let typicalHeight = this.$typicalHeight;
			let startPos = this.$paddingTop;
			let gap = this.$gap;
			let elementSizeTable = this.elementSizeTable;
			for (let i = 0; i < index; i++) {
				let h = elementSizeTable[i];
				if (isNaN(h)) {
					h = typicalHeight;
				}
				startPos += h + gap;
			}
			return startPos;
		}

		protected getStartPosition(index: number): number {
			let typicalHeight = this.$typicalHeight;
			let startPos = this.$target.height - this.$paddingBottom - this.getElementSize(0);
			let gap = this.$gap;
			let elementSizeTable = this.elementSizeTable;
			for (let i = 1; i <= index; i++) {
				let h = elementSizeTable[i];
				if (isNaN(h)) {
					h = typicalHeight;
				}
				startPos -= (h + gap);
			}
			return startPos;
		}

		protected getElementSize(index: number): number {
			if (this.$useVirtualLayout) {
				let size = this.elementSizeTable[index];
				if (isNaN(size)) {
					size = this.$typicalHeight;
				}
				return size;
			}
			if (this.$target) {
				return this.$target.getElementAt(index).height;
			}
			return 0;
		}

		protected getElementTotalSize(): number {
			let typicalHeight = this.$typicalHeight;
			let gap = this.$gap;
			let totalSize = 0;
			let length = this.$target.numElements;
			let elementSizeTable = this.elementSizeTable;
			for (let i = 0; i < length; i++) {
				let h = elementSizeTable[i];
				if (isNaN(h)) {
					h = typicalHeight;
				}
				totalSize += h + gap;
			}
			totalSize -= gap;
			return totalSize;
		}

		public elementAdded(index: number): void {
			super.elementAdded(index);
			this.elementSizeTable.splice(index, 0, this.$typicalHeight);
		}

		protected getIndexInView(): boolean {
			let target = this.$target;
			if (!target || target.numElements == 0) {
				this.startIndex = this.endIndex = -1;
				return false;
			}

			let values = target.$UIComponent;
			if (values[eui.sys.UIKeys.width] == 0 || values[eui.sys.UIKeys.height] == 0) {
				this.startIndex = this.endIndex = -1;
				return false;
			}

			let numElements = target.numElements;
			let contentTopY = this.getStartPosition(numElements - 1) - this.getElementSize(numElements - 1) - this.$paddingTop;
			let bottomY = target.scrollV + values[eui.sys.UIKeys.height];
			if (bottomY < contentTopY) {
				this.startIndex = -1;
				this.endIndex = -1;
				return false;
			}
			let topY = target.scrollV;
			if (topY > values[eui.sys.UIKeys.height] - this.$paddingBottom) {
				this.startIndex = -1;
				this.endIndex = -1;
				return false;
			}
			let oldStartIndex = this.startIndex;
			let oldEndIndex = this.endIndex;
			this.startIndex = this.findIndexAt(bottomY, 0, numElements - 1);
			if (this.startIndex == -1)
				this.startIndex = 0;
			this.endIndex = this.findIndexAt(topY, 0, numElements - 1);
			if (this.endIndex == -1)
				this.endIndex = numElements - 1;
			return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
		}

		protected findIndexAt(x: number, i0: number, i1: number): number {
			let index = ((i0 + i1) * 0.5) | 0;
			let elementX = this.getStartPosition(index);
			let elementWidth = this.getElementSize(index);
			if ((x >= elementX) && (x < elementX + elementWidth + this.$gap))
				return index;
			else if (i0 == i1)
				return -1;
			else if (x > elementX)
				return this.findIndexAt(x, i0, Math.max(i0, index - 1));
			else
				return this.findIndexAt(x, Math.min(index + 1, i1), i1);
		}
	}
}