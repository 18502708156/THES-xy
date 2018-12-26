class AttrLabel extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
	}

	// private static GAP = 26
	// private static MIDDLE_POS = 231
	// private static ARROW_WIDTH = 47

	private arrows: eui.Image
	private attrBg: eui.Image
	private attrLabel: eui.Label
	private nextAttrLabel: eui.Label

	private m_HideBg: boolean
	private m_Text: string

	private attrGroup:eui.Group

	private _labelColorL:number
	public set labelColorL(value)
	{
		this._labelColorL = value;
		if(this.attrLabel) this.attrLabel.textColor = value
	}

	public set hideBg(value) {
		this.m_HideBg = true
	}

	private m_Gap //= AttrLabel.GAP

	public set gap(gap) {
		this.m_Gap = parseInt(gap);
		if(this.attrGroup) (<any>this.attrGroup.layout).gap = this.m_Gap;
		// this._UpdateGap()
	}

	public set text(value) {
		this.m_Text = value
		this._UpdateText()
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		if (this.m_HideBg) {
			if(this.attrBg) this.attrBg.visible = false
		}
		if (this.m_Gap != null) {
			(<any>this.attrGroup.layout).gap = this.m_Gap;
			// this._UpdateGap()
		}
		if (this.m_Text != null) {
			this._UpdateText()
		}
		if(this._labelColorL)
		{
			this.attrLabel.textColor = this._labelColorL
		}
	}

	// private _UpdateGap(): void {
	// 	if (!this.$stage) {
	// 		return
	// 	}
		// let gap = (this.m_Gap || AttrLabel.GAP) + AttrLabel.ARROW_WIDTH
		// if (this.nextAttrLabel.visible) {
		// 	this.nextAttrLabel.x = AttrLabel.MIDDLE_POS + gap
		// 	this.attrLabel.x = AttrLabel.MIDDLE_POS - gap - this.attrLabel.width
		// } else {
		// 	this.attrLabel.x = AttrLabel.MIDDLE_POS - this.attrLabel.width * 0.5
		// }
	// }

	private _UpdateText(): void {
		if (!this.$stage || this.m_Text == null) {
			return
		}
		this.attrLabel.text = this.m_Text
		this.arrows.visible = false
		this.nextAttrLabel.visible = false
	}

	public SetCurAttr(attr: string): void {
		this.attrLabel.text = attr
		this.arrows.visible = false
		this.nextAttrLabel.visible = false
		// this._UpdateGap()		
	}

	public SetNextAttr(attr: string): void {
		this.nextAttrLabel.text = attr
		this.arrows.visible = true
		this.nextAttrLabel.visible = true
		// this._UpdateGap()
	}

	public SetCurAttrByAddType(curConfig, addConfig): void {
		let attr = AttributeData.getAttStr(AttributeData.AttrAddition(curConfig.attr, addConfig.attr), 1);
		this.SetCurAttr(attr)
	}

	public SetNextAttrByAddType(nextConfig, nextAddConfig): void {
		let attr = AttributeData.getAttStr(AttributeData.AttrAddition(nextConfig.attr, nextAddConfig.attr), 1);
		this.SetNextAttr(attr)
	}

	moveAttr() {
		var t = egret.Tween.get(this.attrLabel);
		let x1 = this.attrLabel.x
		let x2 = this.nextAttrLabel.x
		t.to({ "x": x1 + 200, "alpha": 0 }, 100).to({ "x": x1 - 200 }, 100).to({ "x": x1, "alpha": 1 }, 100);
		var t1 = egret.Tween.get(this.nextAttrLabel);
		t1.to({ "x": x2 + 200, "alpha": 0 }, 100).to({ "x": x2 - 200 }, 100).to({ "x": x2, "alpha": 1 }, 100);
	}

	public GetAttrLabel(){
		return this.attrLabel
	}

	public GetNextAttrLabel(){
		return this.nextAttrLabel
	}

}