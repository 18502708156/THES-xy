class ConsumeLabel extends eui.Component implements  eui.UIComponent {
    /////////////////////////////////////////////////////////////////////////////
    // ConsumeLabel.exml
    /////////////////////////////////////////////////////////////////////////////
    protected typeImg: eui.Image;
    protected label: eui.Label;
	protected imgGroup: eui.Group
    /////////////////////////////////////////////////////////////////////////////

	public mIsImg = false

	private m_ConsumeItemId: number
	private m_ConsumeType: string
	private m_ConsumeValue: number
	private m_CurValue: number

	private m_CacheValue: string

	private m_IsMaxTip = null

	private m_overLengthFlag = false

	private _textColor
	
	private _Complete() {
		UIHelper.SetRatio(this.typeImg, 44, 44)
	}

	public set consumeItemId(value) {
		let id = Number(value)
		let config = GameGlobal.Config.ItemConfig[id]
		if (config) {
			this.consumeType = config.name
		} else {
			this.consumeType = ""
		}
		this.m_ConsumeItemId = id
	}

	public get consumeItemId(): number {
		return this.m_ConsumeItemId
	}

	public set consumeType(value) {
		this.m_ConsumeType = value
		this.m_ConsumeItemId = null
	}

	public get consumeType(): string {
		return this.m_ConsumeType
	}

	public SetData(type: string, needValue: number = null, curValue: number = null): void {
		this.consumeType = type
		if (curValue != null) {
			this.m_CurValue = curValue
		} else {
			this.m_CurValue = null
		}
		if (needValue != null) {
			this.m_ConsumeValue = needValue
		} else {
			this.m_ConsumeValue = null
		}
		this._UpdateContent()
	}

	public SetItem(itemId: number, needValue: number = null, curValue: number = null): void {
		this.consumeItemId = itemId
		if (curValue != null) {
			this.m_CurValue = curValue
		}
		if (needValue != null) {
			this.m_ConsumeValue = needValue
		}
		this._UpdateContent()
	}

	public set overLengthFlag(flag)
	{
		this.m_overLengthFlag = flag
	}

	public set textColor(value)
	{
		this._textColor = value;
		if(this.label) this.label.textColor = this._textColor;
	}

	public set maxTip(value) {
		this.m_IsMaxTip = value
		if (!this.$stage) {
			return
		}
		this._UpdateMaxTip()
	}

	public set consumeValue(value: any) {
		this.m_ConsumeValue = parseInt(value)
		this._UpdateContent()	
	}

	public get consumeValue() {
		return this.m_ConsumeValue
	}

	public set curValue(value: any) {
		this.m_CurValue = parseInt(value)
		this._UpdateContent()	
	}

	public get curValue() {
		return this.m_CurValue
	}

	private _UpdateMaxTip(): boolean {
		if (StringUtils.IsNullOrEmpty(this.m_IsMaxTip)) {
			return false
		}
		this.label.visible = true
		this.label.text = this.m_IsMaxTip
		return true
	}

	private _UpdateContent() {
		if (!this.$stage) {
			return
		}
		if (this._UpdateMaxTip()) {
			return
		}
		if (this._textColor) {
			this.label.textColor = this._textColor
		}

		this.label.visible = true
		let str = ""
		
		if (this.mIsImg) {
			UIHelper.SetVisible(this.imgGroup, true)
			this.typeImg.source = RewardData.GetCurrencyMiniRes(this.m_ConsumeItemId)
		} else {
			UIHelper.SetVisible(this.imgGroup, false)

			if (this.m_ConsumeType) {
				str += this.m_ConsumeType
			}
			str += "："
		}

		if (this.m_CurValue != null && !isNaN(this.m_CurValue)) {
			let curValueText = this.m_overLengthFlag ? CommonUtils.overLength(this.m_CurValue) : this.m_CurValue
			if (this.m_ConsumeValue != null)
				str += (this.m_CurValue < this.m_ConsumeValue ? "|C:0xff0000&T:" : "|C:0x019704&T:") + curValueText + "|/";
			else
				str += this.m_CurValue + "/";
		}
		if (this.m_ConsumeValue != null) {
			str += this.m_ConsumeValue
		} else {
			str += 0
		}
		this.label.textFlow = TextFlowMaker.generateTextFlow(str);
	}

	public static GetValueColor(value, needValue): egret.ITextElement[] {
		value = value || 0
		return TextFlowMaker.generateTextFlow(StringUtils.addColor(value, value >= needValue ? 0x019704 : Color.Red) + "/" + needValue)
	}

	public static GetValue(value, needValue): boolean {
        if(value >= needValue){
			return true
		}
		return false
	}
     
	public static GetValueColor2(value, needValue, color = null): egret.ITextElement[] {
		value = value || 0
		color = color || 0x019704
		return TextFlowMaker.generateTextFlow(StringUtils.addColor(value, value >= needValue ? color : Color.Red) + "/" + needValue)
	}

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		if(this._textColor)
		{
			if(this.label) this.label.textColor = this._textColor;
		}
		this.imgGroup.includeInLayout = false
		this.typeImg.addEventListener(egret.Event.COMPLETE, this._Complete, this)
		
		this._UpdateContent()
	}

	public ShowMaxTip(value: string): void {
		if (!value) {
			return
		}
		this.m_CacheValue = this.label.text
		this.label.text = value
	}

	// public static GetLabelText(cur: number, need: number): string {
	// 	// return cur < need ? "|C:0xff0000&T:"
	// 	// if (cur < need) {
	// 	// 	return "|C:0xff0000&T:" : "|C:0x019704&T:") + this.m_CurValue + "|/"
	// 	// }
	// 	// return `|${cur < need ? "C:0xff0000&T": "" }${cur}|/${need}`
	// }
}