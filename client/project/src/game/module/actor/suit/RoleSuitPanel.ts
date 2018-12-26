class RoleSuitPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main;

	/////////////////////////////////////////////////////////////////////////////
	// RoleSuitSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected showGroup: eui.Group;
	protected group: eui.Group;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected nameLab: eui.Label;
	protected powerLabel: PowerLabel;
	protected roleShowPanel: RoleShowPanel;
	protected item1: eui.Component;
	protected item2: eui.Component;
	protected item3: eui.Component;
	protected itemList: eui.List;
	/////////////////////////////////////////////////////////////////////////////
	private mListLRBtnCtrl: ListLRBtnCtrl
	public mSelectIndex = 0;

	/**是否有配置时装，没有就用角色自身 */
	private isFashion: boolean = false;

	public constructor() {
		super()
		this.skinName = "RoleSuitSkin";
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 112);
	}

	public childrenCreated() {
		this.list.itemRenderer = RoleSuitHeadItem;
		let mList = CommonUtils.GetArray(GameGlobal.Config.SuitConfig, "id");
		this.list.dataProvider = new eui.ArrayCollection(mList)
		this.list.selectedIndex = this.mSelectIndex;
		this._AddItemClick(this.list, this._OnItemTap);

		this.itemList.itemRenderer = RoleSuitEquipItem;
		this.itemList.dataProvider = null;
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this.commonWindowBg.SetTitle('套装');
		this.mListLRBtnCtrl.OnRefresh();
		this.UpdateContent();
	}

	private _OnItemTap(e: eui.ItemTapEvent) {
		this.mSelectIndex = e.itemIndex;
		this.UpdateContent();
	}

	private UpdateContent(): void {
		let id = this.mSelectIndex + 1;
		let config = GameGlobal.Config.SuitConfig[id];
		if (config) {
			let num = 0;
			let addPower = 0;
			let equips = [];
			this.isFashion = false;
			let role = SubRoles.ins().GetRoleData();
			let roleShowData = new RoleShowData
			roleShowData.job = role.job
			roleShowData.sex = role.sex
			for (let i = 0; i < config.activation.length; i++) {
				let type = config.activation[i].type;
				let skinIds = this.getSkinIdsByType(type);
				let skinid = config.activation[i].id;
				let index = skinIds.indexOf(skinid);
				let skinConfig = this.getSkinConfig(type, skinid, roleShowData);
				if (index > -1) {//表示激活
					num++;
					if (type == UserTemplate.TYPE_DRESS_FATION) {
						addPower += ItemConfig.CalcAttrScoreValue(skinConfig[GameGlobal.actorModel.sex].attrpower);
					}
					else addPower += ItemConfig.CalcAttrScoreValue(skinConfig.attrpower);
				}
				equips[i] = {
					type: type,
					flag: index > -1,
					config: (type == UserTemplate.TYPE_DRESS_FATION ? skinConfig[GameGlobal.actorModel.sex] : skinConfig),
				};
			}
			this.itemList.dataProvider = new eui.ArrayCollection(equips);
			if (!this.isFashion) {
				// this.roleShowPanel.SetBody(RoleShowPanel.GetPath(role.GetSubRoleData().GetBodyId(), role.job, role.sex, true));
				roleShowData.clothID = role.GetSubRoleData().GetBodyId()
			}
			this.roleShowPanel.SetAll(roleShowData)
			let item: RoleSuitItem;
			for (let i = 1; i <= 3; i++) {
				item = (this['item' + i] as RoleSuitItem);
				item.bg.source = num >= (i + 1) ? 'ui_tz_bm_jihuoshuxingbg01' : 'ui_tz_bm_jihuoshuxingbg02';
				item.title.textColor = num >= (i + 1) ? 0x6e330b : 0x986d43;
				item.title.text = '激活' + (i + 1) + '件'
				item.attr.textColor = num >= (i + 1) ? 0x6e330b : 0x986d43;
				item.attr.text = `战力：${ItemConfig.CalcAttrScoreValue(config['attrpower_' + i])}\n` + AttributeData.getAttStr(config['attrpower_' + i], 0, 1, '：');
			}

			this.powerLabel.text = addPower;
			this.nameLab.text = config.name;
		}
	}

	private getSkinConfig(type, skinid, roleShowData: RoleShowData): any {
		let config;
		switch (type) {
			case UserTemplate.TYPE_RIDE:
				config = GameGlobal.Config.RideSkinConfig[skinid];
				// this.roleShowPanel.SetRide(AppearanceConfig.GetUIPath(config.pid));
				roleShowData.rideId = config.pid
				break;
			case UserTemplate.TYPE_WING:
				config = GameGlobal.Config.WingSkinConfig[skinid];
				// this.roleShowPanel.SetWing(AppearanceConfig.GetUIPath(config.pid));
				roleShowData.wingId = config.pid
				break;
			case UserTemplate.TYPE_SHENGB:
				config = GameGlobal.Config.WeaponSkinConfig[skinid];
				// this.roleShowPanel.SetWeapon(AppearanceConfig.GetUIPath(config.pid));
				roleShowData.swordID = config.pid
				break;
			case UserTemplate.TYPE_DRESS_FATION:
				config = GameGlobal.Config.FashionSkinConfig[skinid];
				// this.roleShowPanel.SetBody(AppearanceConfig.GetUIPath(config[GameGlobal.actorModel.sex].pid));
				this.isFashion = true;
				roleShowData.clothID = config[GameGlobal.actorModel.sex].pid
				break;
			case UserTemplate.TYPE_TIANX:
				config = GameGlobal.Config.FairySkinConfig[skinid];
				// this.roleShowPanel.SetTianx(AppearanceConfig.GetUIPath(config.pid));
				roleShowData.tianxId = config.pid
				break;
		}
		return config;
	}

	/**获取角色的某个类型皮肤ID集合*/
	private getSkinIdsByType(type): number[] {
		let role = SubRoles.ins().GetRoleData();
		let skinList = role.skinDic[type] || [];
		return skinList;
	}
}

class RoleSuitHeadItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RoleSuitHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected icon: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		if (!this.data) return;
		let config = this.data;
		this.icon.source = config.icon;
	}
}

class RoleSuitItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// RoleSuitItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	public bg: eui.Image;
	public title: eui.Label;
	public attr: eui.Label;
	/////////////////////////////////////////////////////////////////////////////
}

class RoleSuitEquipItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// RoleSuitEquipItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	public itemIcon: ItemBaseNotName;
	public title: eui.Label;
	public power: eui.Label;
	public flag: eui.Label;
	public flagImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////
	public constructor() {
		super()
		this.skinName = 'RoleSuitEquipItemSkin';
	}
	createChildren() {
		this.title.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this)
	}
	dataChanged(): void {
		if (!this.data) return;
		this.flagImg.source = this.data.flag ? 'ui_yuan' : 'ui_yuan_quse';
		this.flag.text = this.data.flag ? '已激活' : '未激活';
		this.flag.textColor = this.data.flag ? 0xd27701 : 0x94999b;
		if (this.data.config) {
			UIHelper.SetLinkStyleLabel(this.title, this.data.config.name)
			this.itemIcon.data = this.data.config.itemid;
			this.power.textColor = this.data.flag ? 0xd27701 : 0x94999b;
			this.power.text = '战力 ' + ItemConfig.CalcAttrScoreValue(this.data.config.attrpower);
		}
	}

	private tap() {
		let pid = this.data.config.skinid;
		if (this.data.type == 1)
			ViewManager.ins().open(RoleRideDressPanel, GameGlobal.UserRide,pid);
		else if (this.data.type == 2)
			ViewManager.ins().open(RoleRideDressPanel, GameGlobal.UserWing,pid);
		else if (this.data.type == 3)
			ViewManager.ins().open(RoleRideDressPanel, GameGlobal.TianxModel,pid);
		else if (this.data.type == 4)
			ViewManager.ins().open(RoleRideDressPanel, GameGlobal.SwordModel,pid);
	}
}