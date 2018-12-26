class RoleAttrWin extends BaseEuiView {
    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // RoleAttrSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected attr: eui.Group;
    protected closeBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private mShowList = [
		AttributeType.atMaxHp,
		AttributeType.atSpeed,
		AttributeType.atAttack,
		AttributeType.atDef,
		AttributeType.atHitRate,
		AttributeType.atEvade,
		AttributeType.atCrit,
		AttributeType.atTough,
		AttributeType.atDefy,
		AttributeType.atDefyReduction,
		AttributeType.atDamageEnhance,
		AttributeType.atDamageReduction,
		AttributeType.atDamageEnhancePerc,
		AttributeType.atDamageReductionPerc,
		AttributeType.atCritEnhance,
		AttributeType.atCritReduction,
		AttributeType.atPVPEnhance,
		AttributeType.atPVPReduction,
		AttributeType.atPVEEnhance,
		AttributeType.atPVEReduction,
	]

	public constructor() {
		super()
	}


	initUI() {
		super.initUI()
		this.skinName = "RoleAttrSkin";

		this._AddClick(this.closeBtn, this.CloseSelf)
	};

	OnOpen(...param: any[]) {
		this.setRoleAttr()
	};
	
	setRoleAttr(): void {
		var role = GameGlobal.SubRoles.GetRoleData()
		
		var i = 0;
		for (var j = 0; j < this.mShowList.length; j++) {
			var str = "";
			let type = this.mShowList[j];
			let attName = AttributeData.getAttrStrByType(type);
			
			let value = role.getAtt(type);
			if (type == AttributeType.atAttack) {
				// let atAtkEx = role.getAtt(AttributeType.atAtkEx)
				// if (atAtkEx > 0) {
				// 	value = Math.floor(value * (10000 + atAtkEx) * 0.0001)
				// }
			}
			if (attName.length < 3) {
				attName = AttributeData.inserteBlank(attName, 4);
			}
			if (type >= AttributeType.atDamageEnhancePerc) {
				str += attName + "：" + (value / 100) + "%";
			} else {
				str += attName + "：" + value;
			}
			let label = new eui.Label
			label.size = 24
			label.text = str
			this.attr.addChild(label)
		}
	}
}