class RoleInfoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "角色"

    /////////////////////////////////////////////////////////////////////////////
    // RoleInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bless: eui.Button;
    protected dressBtn: eui.Button;
    protected roleTitle: eui.Button;
	protected btnDeityEquip: eui.Button;
    protected checkAttr: eui.Button;
    protected levelLabel: eui.Label;
    protected expLabel: eui.Label;
    protected roleShowPanel: RoleShowPanel;
    protected totalPower: PowerLabel;
    protected oneKeyChange: eui.Button;
    protected upgreadBtn: eui.Button;
    protected item0: RoleItem;
    protected item1: RoleItem;
    protected item2: RoleItem;
    protected item3: RoleItem;
    protected item4: RoleItem;
    protected item5: RoleItem;
    protected item6: RoleItem;
    protected item7: RoleItem;
    protected item8: RoleItem;
    protected item9: RoleItem;
    protected leftBtn: eui.Button;
    protected rightBtn: eui.Button;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	private equips: RoleItem[];
	private mListLRBtnCtrl: ListLRBtnCtrl;

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.oneKeyChange
		}
	}

	protected childrenCreated(): void {
		this.touchEnabled = false;
		this.touchChildren = true;
		this.equips = [];
		for (var i = 0; i < EquipPos.MAX; i++) {
			this.equips[i] = this['item' + i];
			this.equips[i].touchEnabled = true;
		}
		this._AddClick(this.checkAttr, this._OnClick)
		this._AddClick(this.oneKeyChange, this._OnClick)
		this._AddClick(this.upgreadBtn, this._OnClick)
		this._AddClick(this.roleTitle, this._OnClick)
		this._AddClick(this.dressBtn, this._OnClick)
		this._AddClick(this.bless, this._OnClick)
		this._AddClick(this.btnDeityEquip, this._OnClick)
		
		
		
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 110)
		this.mListLRBtnCtrl.mNotVisible = true;
		this.list.itemRenderer = RoleInfoItem;
		this.list.dataProvider = new eui.ArrayCollection
		// this._AddItemClick(this.list, this._OnItemClick);
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.upgreadBtn:
				GameGlobal.actorModel.SendUpLevel()
				break;
			case this.checkAttr:
				ViewManager.ins().open(RoleAttrWin)
				break;
			case this.oneKeyChange:
				GameGlobal.UserRole.SendEquip()
				break;
			case this.roleTitle:
				// UIHelper.SetBtnEffe(this.roleTitle,"ui_yhy002",false);
				ViewManager.ins().open(RoleTitlePanel, GameGlobal.UserTitle)
				break;
			case this.dressBtn:
				// UIHelper.SetBtnEffe(this.dressBtn,"ui_yhy002",false);
				ViewManager.ins().open(RoleSkinPanel, GameGlobal.UserSkin)
				break;
			case this.btnDeityEquip:
				ViewManager.ins().open(DeityEquipWin)
				break
			case this.bless:
				// UIHelper.SetBtnEffe(this.bless,"ui_yhy002",false);
				ViewManager.ins().open(TreasureWin)
				break;

		}
	}

	public OnItemClick(data: any) {
		if(data.name=="神兵系统")
		{
			UIHelper.SetBtnEffe(this["list"].getChildAt(0) as eui.Button,"ui_yhy002",false);
		}
		ViewManager.ins().open(data.win);

		// if (e.item.isopen) {
			// ViewManager.ins().open(e.item.win);
		// }
		// else {
		// 	UserTips.ins().showTips(e.item.level + '级开启' + e.item.name);
		// }
	}

	public OnOpen() {

		this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(MessageDef.CHANGE_EQUIP, this.UpdateRedPoint)
		this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint)

		this.observe(MessageDef.RP_ROLE_HINT, this.UpdateRedPoint);
		this.observe(MessageDef.ROLE_HINT, this.UpdateRedPoint);
		this.observe(MessageDef.CHANGE_EQUIP, this.updataEquip);
		this.observe(MessageDef.EXP_CHANGE, this.UpdateListContent);
		this.observe(MessageDef.LEVEL_CHANGE, this.UpdateExp);
		this.observe(MessageDef.ROLE_TITLE_UPDATE, this.UpdateTitle);
		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.UpdateListContent();
		this.updateJiJieBtnPng();
		// this.UpdateFateEff();  //暫時屏蔽預告Eff
	}
	private updateJiJieBtnPng(): void
	{
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.list.getChildAt(0), [ActivityKaiFuJiJieType.fairy,ActivityKaiFuJiJieType.weapon]);
	}

	UpdateListContent() {
		let lv = GameGlobal.actorModel.level;
		
		let datas = [
			{icon: "ui_bt_shouhu", redPoint: GameGlobal.TianxModel.mRedPoint.IsRedPoint() || GameGlobal.SwordModel.mRedPoint.IsRedPoint(), name: '神兵系统', win: TianxianMainPanel},
			// {icon: "ui_bt_zhenxing", redPoint: GameGlobal.FormationModel.mRedPoint.IsRedPoint(), name: '阵型系统', win: FormationWin},
			{icon: "ui_bt_danyao", redPoint: GameGlobal.UserRole.GetIndexElixir(), name: '丹药系统', win: RoleElixirPanel },
			{icon: "ui_bt_jingmai", redPoint: GameGlobal.UserRole.GetIndexJingmai(), name: '经脉系统', win: RoleJingMaiPanel },
			{icon: "ui_bt_taozhuang", redPoint: false, name: '套装系统', win: RoleSuitPanel },
			{icon: "ui_bt_taozhuangdaren", redPoint: false, name: '套装达人系统', win: RoleSuitTipPanel },
		];

		(this.list.dataProvider as eui.ArrayCollection).replaceAll(datas)
		this.list.validateNow();
		this.leftBtn.visible = this.rightBtn.visible = datas.length > 5;
		this.UpdateExp();
	}

	UpdateExp() {
		let actorModel = GameGlobal.actorModel
		this.levelLabel.text = actorModel.level + ""
		let config = GameGlobal.Config.ExpConfig[actorModel.level]
		let str = ""
		let canUp = false
		if (GameGlobal.Config.ExpConfig[actorModel.level + 1]) {
			str = "/" + CommonUtils.overLength(config.exp)
			canUp = actorModel.exp >= config.exp
		}
		this.expLabel.text = CommonUtils.overLength(actorModel.exp) + str
		this.upgreadBtn.enabled = canUp
	}

	private UpdateTitle() {
		let role = SubRoles.ins().GetRoleData()
		this.roleShowPanel.SetAll(role)
	}

	updataEquip() {
		var model = SubRoles.ins().GetRoleData()
		this.setEquip(model);
	}

	/** 设置装备 */
	setEquip(role: Role) {
		if (!role)
			return;
		var len = role.getEquipLen();
		let canEquips = GameGlobal.UserRole.canChangeEquips
		for (var i = 0; i < len; i++) {
			var element = role.getEquipByIndex(i);
			this.equips[i].model = role;
			this.equips[i].data = element.item;
			if (!element.item.configID) {
				this.equips[i].setItemImg(ResDataPath.GetEquipDefaultGreyIcon(i));
			}
		}

		this.roleShowPanel.SetAll(role)
		this.totalPower.text = GameLogic.ins().actorModel.power + ""
		this.UpdateRedPointEquip()
	}

	private UpdateRedPointEquip() {
		let role = GameGlobal.SubRoles.GetRoleData()
		let can = false
		if (role) {
			let canEquips = GameGlobal.UserRole.canChangeEquips
			for (var i = 0, len = role.getEquipLen(); i < len; i++) {
				let canEquip = canEquips[i] ? true : false
				this.equips[i].IsShowRedPoint((canEquip) ? true : false)
				this.equips[i].IsShowUp(GameGlobal.UserRole.IsOrange(i) ? true : false)
				if (canEquip) {
					can = true
				}
			}
		}
		this.oneKeyChange.visible = can
	}

	public UpdateRedPoint() {
		this.UpdateRedPointEquip()
		UIHelper.ShowRedPoint(this.dressBtn, GameGlobal.UserRole.Get(UserRole.INDEX_SKIN))
		UIHelper.ShowRedPoint(this.roleTitle, GameGlobal.UserRole.Get(UserRole.INDEX_TITLE))
		UIHelper.ShowRedPoint(this.bless, GameGlobal.TreasureModel.mRedPoint.IsRedPoint())
		UIHelper.ShowRedPoint(this.btnDeityEquip, GameGlobal.UserEquip.HasDeityEquipAwake() || GameGlobal.UserEquip.HasDeityEquipInject())
		this.UpdateListContent()
	}

	private UpdateFateEff()
	{
		FateEff.isShowEff2(this);
	}
	// setCanChange() {
	// 	var n = this.equips.length;
	// 	for (var i = 0; i < n; i++) {
	// 		this.equips[i].IsShowRedPoint(false)
	// 	}
	// 	
	// };

	public UpdateContent(): void {
		this.UpdateRedPoint();
		this.updataEquip();
		this.UpdateTitle()
	}
	
    public static RedPointCheck(): boolean {
		if (GameGlobal.UserRole.IsRedEquip()) {
			return true
		}
		if (GameGlobal.UserRole.IsRedPoint()) {
			return true
		}
		if (GameGlobal.TianxModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.SwordModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.TreasureModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.UserEquip.mDeityEquipRP.IsRedPoint()) {
			return true
		}
        return false
    }
}

class RoleInfoItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// Btn0TipSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected iconDisplay: eui.Image;
	protected redPoint: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.width = 96;

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}

	private OnClick() {
		let panel = Util.GetParentByType(this, RoleInfoPanel) as RoleInfoPanel
		panel.OnItemClick(this.data)
	}

	public dataChanged() {
		this.iconDisplay.source = this.data.icon;
		this.redPoint.visible = this.data.redPoint;
	}
}