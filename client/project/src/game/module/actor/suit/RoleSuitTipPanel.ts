class RoleSuitTipPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// ForgeMasterTipSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected img: eui.Image;
	protected curLabel: eui.Label;
	protected curTipLabel: eui.Label;
	protected activeLabel: eui.Label;
	protected activeLabel2: eui.Label;
	protected nextLabel: eui.Label;
	protected nextTipLabel: eui.Label;
	protected effLabel: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "RoleSuitTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {

		let config = GameGlobal.Config.RoleSuitConfig;
		let curLevel = this.getSuitLevel(config);
		let addPower = null;
		if (curLevel) {
			this.activeLabel2.visible = false;
			this.curTipLabel.text = config[curLevel].des;
			this.curLabel.text = AttributeData.getAttStr(config[curLevel].attrs, 0)
			if (config[curLevel + 1]) {
				this.currentState = "active";
				this.nextTipLabel.text = config[curLevel + 1].des;
				this.nextLabel.text = AttributeData.getAttStr(config[curLevel + 1].attrs, 0)
				addPower = ItemConfig.CalcAttrScoreValue(config[curLevel + 1].attrs) - ItemConfig.CalcAttrScoreValue(config[curLevel].attrs)
			} else {
				this.currentState = "full"
			}
		} else {
			this.activeLabel2.visible = true;
			this.nextTipLabel.text = config[1].des;
			this.currentState = "none"
			this.nextLabel.text = AttributeData.getAttStr(config[1].attrs, 0)
			addPower = ItemConfig.CalcAttrScoreValue(config[1].attrs)
		}
		if (addPower != null) {
			this.effLabel.text = "可提升" + addPower + "战力"
		} else {
			this.effLabel.text = "";
		}
	}

	private getSuitLevel(config): number {
		let role = SubRoles.ins().GetRoleData();
		let len = role.getEquipLen();
		let num, curLevel = 0;
		let equipData: EquipsData;
		for (let data in config) {
			num = 0;
			for (let i = 0; i < len; i++) {
				equipData = role.getEquipByIndex(i);
				if (equipData && equipData.item.configID) {//有穿戴
					if (config[data].quality <= equipData.item.itemConfig.quality && equipData.item.itemConfig.level >= config[data].level) {
						num++;
					}
				}
			}
			if (num >= config[data].count) {
				curLevel = config[data].suitLv;
			}
			else
				break;
		}
		this.img.filters = curLevel ? null : Color.GetFilter();
		return curLevel;
	}

	public OnClose() {

	}
}