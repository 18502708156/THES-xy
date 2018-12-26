class SmeltEquipItem extends ItemBase {
	public constructor() {
		super();
	}
	childrenCreated() {
		super.childrenCreated();
	};
	dataChanged() {
		this.clear();
		if (this.data instanceof ItemData) {
			this.itemConfig = this.data.itemConfig;
			this.itemIcon.setData(this.itemConfig);
			this.nameTxt.textColor = Color.l_normal;
			if (this.itemConfig.type == 4) {
				this.nameTxt.text = this.itemConfig.name;
			}
			else {
				// if (this.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
				// 	this.nameTxt.text = this.itemConfig.name;
				// }
				// else
					this.nameTxt.text = this.itemConfig.zsLevel > 0 ? (this.itemConfig.zsLevel + "阶") : ("lv." + this.itemConfig.level);
			}
			// this.itemIcon.imgJob.source = (this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job && this.itemIcon.imgJob.visible ? JobItemIconConst[this.itemConfig.job] : '';
			// this.itemIcon.setJobImg((this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job ? JobItemIconConst[this.itemConfig.job] : '')
		}
		else
		{
			this.itemIcon.setItemImg("ui_bt_plue3")
		}
	};
	onClick() {
	};
	playEff() {
		if (this.data) {
			UIHelper.PlayBoomEff(this)
		}
	};
	clear() {
		super.clear();
		this.itemIcon.setItemImg("ui_bt_plue3")
	}
}