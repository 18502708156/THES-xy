class ArenaRoleItem extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
	// ArenaRoleItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected rankTxt: eui.BitmapLabel;
	protected roleShowPanel: RoleShowPanel;
	protected totalPower: PowerLabel;
	protected challengeImg: eui.Image;
	protected mkillImg: eui.Image;
	protected nameTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////
	private rank;

	public constructor() {
		super();
	}

	public getRank(): number {
		return this.rank;
	}

	public updateData(data: Sproto.arena_target_data): void {
		this.rank = data.rank;

		this.totalPower.text = data.power;
		this.rankTxt.text = data.rank + '';
		this.nameTxt.text = data.name;
		this.mkillImg.visible = data.iskill;

		if (data.id > 0) {
			this.challengeImg.visible = false;
			this.nameTxt.visible = true;
			let roleData = new RoleShowData;
			roleData.job = data.job;
			roleData.sex = data.sex;
			//角色： 1. 坐骑 2.翅膀 3.天仙 4.神兵 5.时装 6.称号
			// data.shows[RoleShowDataType.ROLE_TITLE] = 0
			// data.shows[RoleShowDataType.ROLE_TIANXIAN] = 0
			roleData.shows = data.shows;
			this.roleShowPanel.SetAll(roleData);
			this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = .6;
		}
		else {//表示机器人
			this.challengeImg.visible = true;
			this.nameTxt.visible = false;
			this.roleShowPanel.ClearCache()
			this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(data.monId || 220004)))
			this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 1;
		}
	}
}