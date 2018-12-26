class ForgeEquipPanel extends ForgePanel {
	
    /////////////////////////////////////////////////////////////////////////////
    // ForgeEquipSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected text_1: eui.Label;
    protected arrowImg: eui.Image;
    protected text_2: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ForgeEquipSkin"
	}

    // 引导对象
    public GetGuideTarget() {
        return {
            [1]: this.mContext.equipComp.onKeyBtn,
        }
    }

	public UpdateSel(index: number) {
		super.UpdateSel(index)
		let role = GameGlobal.SubRoles.GetRoleData()
		
		let equipData = role.getEquipByIndex(index)
		let val = this.GetForgeValue(equipData)
		
		if (val) {
			let config = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val, this.mForgeType)
			this.text_1.textFlow = AttributeData.GetAttrTabString(config.attr,"\n")
		} else {
			this.text_1.text = "未激活"
		}
		let nextConfig = GameGlobal.ForgeModel.GetForgeConfigByPos(index, val + 1, this.mForgeType)
		if (nextConfig) {
			this.text_2.textFlow = AttributeData.GetAttrTabString(nextConfig.attr,"\n")
		}
		let isFull = !nextConfig ? true : false
		UIHelper.SetVisible(this.arrowImg, !isFull)
		UIHelper.SetVisible(this.text_2, !isFull)
	}
}

class ForgeqhPanel extends ForgeEquipPanel {

	public static NAME = "强化"

	public mForgeType: ForgeType = ForgeType.BOOST

	public OnOpen() {
		super.OnOpen()
		this.equipComp.onKeyBtn.label = "一键强化"
		this.equipComp.masterBtn.masterBtn.icon = "ui_bt_qhds"
		UIHelper.SetLinkStyleLabel(this.equipComp.getwayLabel, "获取银两")
	} 

	protected GetForgeValue(data: EquipsData) {
		return data.strengthen
	}
	
    public static RedPointCheck(): boolean {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_BOOST)
    }
}

class ForgejlPanel extends ForgeEquipPanel {

	public static NAME = "精炼"

	public mForgeType: ForgeType = ForgeType.REFINE

	public OnOpen() {
		super.OnOpen()
		this.equipComp.onKeyBtn.label = "一键精炼"
		this.equipComp.masterBtn.masterBtn.icon = "ui_bt_jlds"
	}

	protected GetForgeValue(data: EquipsData) {
		return data.refine
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_REFINE)
    }
}

class ForgedlPanel extends ForgeEquipPanel {

	public static NAME = "锻炼"

	public mForgeType: ForgeType = ForgeType.EXERCISE

	public OnOpen() {
		super.OnOpen()
		this.equipComp.onKeyBtn.label = "一键锻炼"
		this.equipComp.masterBtn.masterBtn.icon = "ui_bt_dlds"
	}

	protected GetForgeValue(data: EquipsData) {
		return data.exercise
	}

	protected GetConsumeTypeId(): number {
		return 200002
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_EXERCISE)
    }
}