class ActorName extends eui.Component implements  eui.UIComponent {

	// private title: eui.Group
	
	private lv: eui.BitmapLabel

	// 部分skin下不显示
	// private pos: eui.Group
	public label: eui.Label

	// 尊
	private m_IsMonth01: boolean = false
	// 月
	private m_IsMonth02: boolean = false
	private m_VipLv: number = 0
	private m_Name: string | egret.ITextElement[] = ""

	private m_Lv: number
	private m_ZsLv: number

	private m_Align: boolean = false

	public set actorName(name: string) {
		this.m_Name = name
		this._UpdateContent()
	}

	public set month(isMonty: boolean) {
		this.m_IsMonth02 = Boolean(isMonty)
		this._UpdateContent()
	}

	public set zun(isZun: boolean) {
		this.m_IsMonth01 = Boolean(isZun)
		this._UpdateContent()
	}

	public set vipLv(vipLv: number) {
		this.m_VipLv = Number(vipLv)
		this._UpdateContent()
	}

	public set align(value: boolean) {
		this.m_Align = Boolean(value)
		this._UpdateContent()
	}

	public Set(name: string | egret.ITextElement[], vipLv: number, isMonty: boolean | number, isZun: boolean | number): void {
		this.m_Name = name
		this.m_VipLv = vipLv
		this.m_IsMonth02 = isMonty ? true : false
		this.m_IsMonth01 = isZun ? true : false
		this._UpdateContent()
	}

	public Set2(name: string | egret.ITextElement[], vipLv: number, isMonty: boolean | number, isZun: boolean | number, lv: number, zsLv: number): void {
		this.m_Name = name
		this.m_VipLv = vipLv
		this.m_IsMonth02 = isMonty ? true : false
		this.m_IsMonth01 = isZun ? true : false
		this.m_Lv = lv
		this.m_ZsLv = zsLv
		this._UpdateContent()
	}

	public constructor() {
		super()
	}

	private _UpdateContent(): void {
		if (!this.$stage) {
			return
		}
		let text = ""
		if(this.m_IsMonth01) text += "尊"
		if(this.m_IsMonth02) text += "月"
		if(this.m_VipLv > 0) text += "V" + this.m_VipLv;
		if (text == "") {
			this.lv.visible = false
			this.lv.includeInLayout = false
		} else {
			this.lv.text = text
			this.lv.visible = true
			this.lv.includeInLayout = true
		}
		if(this.label)
		{
			if (this.m_Name == null) {
				this.label.text = ""
			} else if (typeof(this.m_Name) == "string") {
				this.label.text = this.m_Name
			} else {
				this.label.textFlow = this.m_Name
			}
		}
		if (this["levelLabel"]) {
			if (this.m_Lv != null) {
				this["levelLabel"].text = "   " + GameString.GetLvName(this.m_ZsLv, this.m_Lv)
			} else {
				this["levelLabel"].text = ""
			}
		}
	}
}