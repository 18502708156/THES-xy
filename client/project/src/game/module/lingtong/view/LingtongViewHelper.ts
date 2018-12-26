class LingtongViewHelper {
	public static SetRole(roleShowPanel: RoleShowPanel, sex: number = null, dressId: number = null) {
		let role = new RoleShowData
        role.job = 1
		if (sex == null) {
			sex = GameGlobal.LingtongAttrModel.mSex
		}
		role.sex = sex - 1
		if (dressId == null) {
			dressId = GameGlobal.LingtongModel.mDressId
		}
		if (!dressId) {
			dressId = 1
		}
        role.clothID = GameGlobal.LingtongModel.SkinConfig[dressId].pid
        roleShowPanel.Set(RoleShowDressType.ROLE, role)
	}
}