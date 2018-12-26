class ListLRBtnCtrl {
	
	private m_List: eui.List
	private m_Scroller: eui.Scroller
	private m_LeftBtn: eui.Button
	private m_RightBtn: eui.Button

	private paddingLeft: number = 0
	private paddingRight: number = 0
	private gap: number = 0
	private itemWidth: number = 0

	public animation: boolean = true
	public mNotVisible: boolean

	private m_RedList: boolean[]

	public constructor(list: eui.List, lhs: eui.Button, rhs: eui.Button, itemWidth: number) {
		this.m_List = list
		if (this.m_List.layout) {
			let layout = this.m_List.layout as eui.HorizontalLayout
			this.paddingLeft = layout.paddingLeft
			this.paddingRight = layout.paddingRight
			this.gap = layout.gap
		}
		this.itemWidth = itemWidth
		this.m_LeftBtn = lhs
		this.m_RightBtn = rhs
		let scroller = list.parent as eui.Scroller
		if (egret.is(scroller, "eui.Scroller")) {
			this.m_Scroller = scroller
			this.m_Scroller.addEventListener(egret.Event.CHANGE, this.OnRefresh, this)
			this.m_LeftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
			this.m_RightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
	}

	public SetRedPointList(list: boolean[]) {
		this.m_RedList = list
	}

	public SetPage(pageIndex: number) {
		this.m_Scroller.validateNow()
		this.m_List.validateNow()
		this.m_List.scrollH = this.m_Scroller.width * pageIndex
		this.m_Scroller.$Scroller[8].currentScrollPos = this.m_List.scrollH
		this.OnRefresh()
	}

	private _OnClick(e: egret.TouchEvent) {
		this.m_Scroller.stopAnimation()
		let list = this.m_List
		let listWidth = this.m_Scroller.width - this.paddingLeft - this.paddingRight
		switch (e.target) {
			case this.m_LeftBtn:
				this.SetPos(Math.max(0, list.scrollH - this.m_Scroller.width))
			break
			case this.m_RightBtn:
				this.SetPos(Math.min(this.GetListItemWidth() - listWidth, list.scrollH + this.m_Scroller.width))
			break
		}
		this.OnRefresh()
	}
	
	private SetPos(pos: number): void {
		if (this.animation) {
			let touch = this.m_Scroller.$Scroller[8]
			touch.maxScrollPos = this.m_List.contentWidth
			touch.throwTo(pos)
		} else {
			this.m_List.scrollH = pos
		}
	}

	private GetListItemWidth(): number {
		let len = this.m_List.numElements
		return len * this.itemWidth + (len - 1) * this.gap
	}

	OnRefresh() {
		if (!this.m_Scroller || this.mNotVisible) {
			return
		}
		let list = this.m_List
		let leftBtn = this.m_LeftBtn
		let rightBtn = this.m_RightBtn
		let w = this.GetListItemWidth()
		if (w < this.m_Scroller.width) {
			leftBtn.visible = false
			rightBtn.visible = false
		} else {
			leftBtn.visible = list.scrollH > (this.itemWidth + this.paddingLeft)
            rightBtn.visible = (w - this.itemWidth) - (list.scrollH - this.paddingLeft) > (this.m_Scroller.width)

			if (this.m_RedList) {
				let leftIndex = Math.floor(list.scrollH / (this.itemWidth + this.gap))
				let rightIndex = Math.floor((list.scrollH + this.m_Scroller.width) / (this.itemWidth + this.gap))
				if (leftBtn.visible) {
					let red = false
					for (let i = 0; i <= leftIndex; i++) {
						if (this.m_RedList[i]) {
							red = true	
							break
						}
					}
					UIHelper.ShowRedPoint(leftBtn, red)
				} 
				if (rightBtn.visible) {
					let red = false
					for (let i = rightIndex, len = this.m_RedList.length; i < len; i++) {
						if (this.m_RedList[i]) {
							red = true	
							break
						}
					}
					UIHelper.ShowRedPoint(rightBtn, red)
				}
			}
		}
	}

	public SetLeftIndex(leftIndex: number) {
		let list = this.m_List
		list.validateNow()
		let w = this.GetListItemWidth()
		let listWidth = this.m_Scroller.width - this.paddingLeft - this.paddingRight
		list.scrollH = Math.min(leftIndex * this.itemWidth + Math.max((leftIndex - 1) * this.gap, 0), this.GetListItemWidth() - listWidth)

		let touch = this.m_Scroller.$Scroller[8]
		touch.currentPosition = touch.currentScrollPos = list.scrollH
	}
}