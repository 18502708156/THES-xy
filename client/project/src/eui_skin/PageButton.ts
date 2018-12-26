class PageButton extends eui.Component implements eui.UIComponent {

	/////////////////////////////////////////////////////////////////////////////
	// PageButtonSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected leftBtn: eui.Button;
	protected pageTxt: eui.Label;
	protected rightBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	private _page: number = -1;
	private _max: number = -1;

	public constructor() {
		super()
		this.skinName = 'PageButtonSkin';
	}

	childrenCreated() {
		this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
		this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
	}

	/**
	 * 设置当前页 
	 * @param value 当前页的页码。从1开始。小于1时强制为1，大于最大值时强制为最大值
	 */
	public setPage(value: number): void {
		if (value == this._page) return;
		if (value < 1) value = 1;
		if (this._max > -1) if (value > this._max) value = this._max;
		this._page = value;
		this.checkEnabled();
	}
	/**
	 * 设置最大页码。 
	 * @param value 最大页码。当当前页超过最大值的时候，强制为最大值
	 */
	public setMax(value: number): void {
		if (value == this._max) return;
		if (value < 1) value = 1;
		if (this._page > value) this._page = value;
		this._max = value;
		this.checkEnabled();
	}

	private onClickHandler(e: egret.TouchEvent): void {
		let rate: number = e.currentTarget == this.leftBtn ? -1 : 1;
		let page = this._page + rate;
		this.setPage(page);
		MessageCenter.ins().dispatch(MessageDef.PAGE_BUTTON_UPDATE, page);
	}

	private checkEnabled(): void {
		this.pageTxt.text = this._page + '/' + this._max;
		this.leftBtn.enabled = this.rightBtn.enabled = false;
		if (this._max > 1) {
			if (this._page > 1) this.leftBtn.enabled = true;
			if (this._page < this._max) this.rightBtn.enabled = true;
		}
	}
}
