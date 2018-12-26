class SmeltSelectItem extends eui.ItemRenderer {

	translate
	nameLabel
	gradeLabel
	attrLabel
	checkBoxs

	public constructor() {
		super();

		this.translate = {
			'hp': AttributeType.atMaxHp,
			'atk': AttributeType.atAttack,
			'def': AttributeType.atDef,
			// 'res': AttributeType.atRes,
			'crit': AttributeType.atCrit,
			'tough': AttributeType.atTough
		};
		this.skinName = "SmeltSeletctItemSkin";
		this.touchChildren = false;
	}
	itemConfig
	arrowIcon
	itemIcon: ItemIcon
	lvLabel
	createChildren() {
		super.createChildren()
	};
	dataChanged() {
		if (this.data instanceof ItemData) {
			var data = this.data;
			//道具数据
			this.itemConfig = data.itemConfig;
			this.arrowIcon.visible = false;
			if (!this.itemConfig)
				return;
			// this.itemIcon.isShowJob(true)
			this.itemIcon.setData(this.itemConfig);
			if (this.itemConfig.type == 4) {
				this.updateWingEquip(); //比较披风装备
				this.lvLabel.text = this.itemConfig.name;
			}
			else if (this.itemConfig.type == 0) {
				//和身上的天珠装备比较评分
				// if (this.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
				// 	var score = ItemConfig.calculateBagItemScore(data);
				// 	var len = SubRoles.ins().subRolesLen;
				// 	for (var i = 0; i < len; i++) {
				// 		var role = SubRoles.ins().getSubRoleByIndex(i);
				// 		if (!role.getEquipByIndex(EquipPos.DZI).item.itemConfig
				// 			|| score > ItemConfig.calculateBagItemScore(role.getEquipByIndex(EquipPos.DZI).item)) {
				// 			this.arrowIcon.visible = true;
				// 			break;
				// 		}
				// 	}
				// 	this.lvLabel.text = this.itemConfig.name;
				// }
				// else
					this.lvLabel.text = ((this.itemConfig.zsLevel) ? this.itemConfig.zsLevel + "阶" : "lv." + this.itemConfig.level);
			}
			else {
				this.lvLabel.text = '';
			}
			this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.itemConfig.quality];
			this.nameLabel.text = this.itemConfig.name;
			// let config = GlobalConfig.ins().EquipConfig[data.configID];
			// let attrStr:string = "";
			// let type:number = 0;
			// for(let k in this.translate) {
			//	 if(config[k] <= 0)
			//		 continue;
			//	 for(let i: number = 0;i < data.att.length; i++){
			//		 type = data.att[i].type;
			//		 if(this.translate[k] == type){
			//			 attrStr += AttributeData.getAttrStrByType(type) + ": ";
			//			 attrStr += config[k] + ' +' + data.att[i].value + "\n";
			//		 }
			//	 }
			// }
			this.gradeLabel.text = "评分：" + ItemConfig.calculateBagItemScore(data);
			this.attrLabel.text = AttributeData.getAttrInfoByItemData(data);
		}
	};
	//对比下披风装备
	updateWingEquip() {

	};
}