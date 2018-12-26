class ForgeGemPanel extends ForgePanel {

	public static NAME = "宝石"
    /////////////////////////////////////////////////////////////////////////////
    // ForgeGemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected attGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private m_GemLabel: ForgeGemItem[] = []
	public mForgeType: ForgeType = ForgeType.GEM
	
	public static GetImg(type: string, level: number): string {
		return "resource/assets/image/item_single/2000003.png"
	}

	public static GetLen(att: any[]) {
		let len = 0
		for (let data of att) {
			if (data.value) {
				++len
			}
		}
		return len
	}

	public constructor() {
		super()
		this.skinName = "ForgeGemSkin"
		for (let i = 0; i < this.attGroup.numChildren; i++) {
			this.m_GemLabel[i] = this.attGroup.getChildAt(i) as ForgeGemItem
		}
	}
		
	public OnOpen() {
		super.OnOpen()
		this.equipComp.onKeyBtn.label = "一键镶嵌"
		this.equipComp.masterBtn.masterBtn.icon = "ui_bt_bsds"
	}
	
	protected GetForgeValue(data: EquipsData) {
		return data.gem
	}

	protected GetConsumeTypeId(): number {
		return 200002
	}

	protected SetAttrData(config, nextConfig) {
		var attrName = "";
		let lv = this.lv
		if (config) {
			var attr = AttributeData.getAttrStrAdd(config.attr, 15);
			attrName = AttributeData.getAttrStrByType(config.attr[0].type);
			for (let i = 1; i <= this.m_GemLabel.length; ++i) {
				let item =  this.m_GemLabel[i - 1]
				let len = ForgeGemPanel.GetLen(config.attr)
				if (len < i) {
					this.SetGemLabel(item, "bs_00", attrName, null)
				} else {
					let showLv = lv
					if (len > i) {
						showLv = 10
						lv -= 10
					}
					let icon = ForgeGemPanel.GetImg(config.attr[0].type, showLv)
					this.SetGemLabel(item, icon, attrName, attr[i - 1].value)
				}				
			}		
		} else {
			attrName = AttributeData.getAttrStrByType(nextConfig.attr[0].type);
			for (let i = 0; i < this.m_GemLabel.length; ++i) {
				let item =  this.m_GemLabel[i]
				this.SetGemLabel(item, "bs_00", attrName, null)
			}
		}
	}

	
	private SetGemLabel(label: ForgeGemItem, icon: string, attr: string, value: string): void {
		label.img.source = icon || "bs_00";
		if (value) {
			label.attName.text = attr 
			label.attName.textColor = Color.l_brown_2
			label.attValue.text = "+" + value
			label.attValue.textColor = Color.l_green_1
		} else {
			label.attName.text = attr + "宝石";
			label.attValue.text = "未激活"
		}
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_GEM)
    }
}

interface ForgeGemItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
    // ForgeGemItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    img: eui.Image;
    attName: eui.Label;
    attValue: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
}