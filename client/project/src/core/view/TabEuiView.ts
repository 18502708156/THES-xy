class TabEuiView extends TabView {
	public constructor() {
		super()
		this.touchEnabled = false
		this.touchChildren = true
	}

	private m_TmpIndex: number
	private m_TmpData: any

    protected ShowOrHide(index: number, visible:boolean): egret.DisplayObject {
        let child = super.ShowOrHide(index, visible)
		if (child) {
			if (egret.is(child, "BaseView")) {
				if (visible) {
					let data = []
					if (this.m_TmpIndex == index) {
						data = [this.m_TmpData]
					}
					(child as BaseView).DoOpen(data)
	 			} else {
					 (child as BaseView).DoClose()
				 }
			}
		}
		return child
    }
    
    public Replace(cls: any): void {
        for (let data of this.childrenList) {
			if (data.obj && egret.is(data.obj, "BaseView")) {
				(data.obj as BaseView).DoClose()
			}
        }
		super.Replace(cls)
    }

	public CloseView() {
		let view = this.getElementAt(this.selectedIndex)	
		if (view && view["DoClose"]) {
			view["DoClose"]()
		}
		this.m_TmpIndex = null
		this.m_TmpData = null

		this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
		this._selectedIndex = -1
	}

	public OpenIndex(index: number, data: any) {
		this.m_TmpIndex = index
		this.m_TmpData = data
		this.selectedIndex = index
	}
}