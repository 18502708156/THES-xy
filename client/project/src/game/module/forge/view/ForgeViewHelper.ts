class ForgeViewHelper {
	public static InitItemGroup(equipList: ForgeEquipList) {
		for (let i = 0; i < equipList.itemGroup.numChildren; i++) {
			let child = equipList.itemGroup.getChildAt(i) as ForgeEquipItem
			child.imgIcon.source = ResDataPath.GetEquipDefaultIcon(i)
		}
	}

	public static UpdateMasterBtn(forgeType: ForgeType, masterBtn: ForgeMasterBtn): number {
		let config = GameGlobal.ForgeModel.GetMasterConfig(forgeType)
		let role = GameGlobal.SubRoles.GetRoleData()
		let [index, min] = role.GetMinEquipIndexAndLevel(forgeType)
		let curKey
		for (let k in config) {
			if (min >= config[k].level) {
				curKey = k
			}
		}
		let configData
		if (curKey) {
			configData = config[curKey]
		}
		let curLevel = 0
		if (configData) {
			masterBtn.rankLabel.visible = true
			masterBtn.rankLabel.text = configData.suitLv + "阶"
			curLevel = configData.suitLv
			if (config[configData.suitLv + 1]) {
				masterBtn.masterLabel.text = `(${min}/${config[configData.suitLv + 1].level})`
			} else {
				masterBtn.masterLabel.text = ""
			}
			masterBtn.masterBtn.iconDisplay.filters = null
		} else {
			masterBtn.masterBtn.iconDisplay.filters = Color.GetFilter()
			masterBtn.rankLabel.visible = false
			masterBtn.masterLabel.text = `(${min}/${config[1].level})`
		}
		let icon = ""
		if (forgeType == ForgeType.BOOST) {
			icon = "ui_bt_qhds"
		} else if (forgeType == ForgeType.REFINE) {
			icon = "ui_bt_jlds"
		} else if (forgeType == ForgeType.EXERCISE) {
			icon = "ui_bt_dlds"
		} else {
			icon = "ui_bt_bsds"
		}
		masterBtn.masterBtn.icon = icon
		return curLevel
	}
}