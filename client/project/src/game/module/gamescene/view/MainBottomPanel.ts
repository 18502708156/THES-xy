class MainBottomPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_USER_INFO;
	public static VIEW_LAYER_LEVEL = ViewLayerLevel.TOP

	public static BUTTON_TYPE_FIGHT = 0
	public static BUTTON_TYPE_CITY = 1

	public constructor() {
		super();
	}
    /////////////////////////////////////////////////////////////////////////////
    // MainBottomPanelSkins.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bottomBgGroup: eui.Group;
    protected expBar: eui.ProgressBar;
    protected expBarLabel: eui.Label;
    protected fightBtn: eui.Button;
    protected cityBtn: eui.Button;
    protected roleBtn: eui.Button;
    protected forgingBtn: eui.Button;
    protected xiannvBtn: eui.Button;
    protected petBtn: eui.Button;
    protected bossUpdateGroup: eui.Group;
    protected bossNameTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	// private mCurType: number = MainBottomPanel.BUTTON_TYPE_FIGHT

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.fightBtn,//cityBtn,
			[2]: this.fightBtn,
		}
	}

	navBtn: Array<eui.Button>;
	navBind: Array<Function>;

	public initUI() {
		super.initUI();
		this.skinName = "MainBottomPanelSkin"
		this.touchEnabled = false

		this.expBar.slideDuration = 0;
		this.expBar.labelDisplay.visible = false
		this.expBar.labelDisplay = this.expBarLabel
		this.navBtn = [this.fightBtn, this.cityBtn, this.roleBtn, this.forgingBtn, this.xiannvBtn, this.petBtn];
		this.navBind = [null, GameCityPanel, RoleWin, ForgeWin, null, PetMainPanel];
		this.bossUpdateGroup.visible = false;
		this.bossUpdateGroup.touchEnabled = false;
		for (var i = 0; i < this.navBtn.length; i++) {
			this.navBtn[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}
		this.AddClick(this.bossUpdateGroup, () => {
			ViewManager.ins().open(BossMainPanel, 1)
		})
		this.ShowCount()

		ActivityKaiFuModel.pushJiJieBtn(this.roleBtn);
	}

	public OnOpen(...param: any[]) {
		super.OnOpen(param);

		this.observe(MessageDef.INIT_ACTOR, this._DoInitInfo)

		// this.observe(MessageDef.MAP_TYPE_CHANGE, this.ChangeBtnState)
		//FateEff
		// this.observe(MessageDef.SHOWFATEEFF,this.UpdateFateEff);
		//**主城红点 began*/
		this.observe(MessageDef.ALL_BOSS_NOTICE, this.UpdateCityRedPoint) 		 //BOSS
		this.observe(MessageDef.FB_REDPOINT_NOTICE, this.UpdateCityRedPoint)     //副本
		this.observe(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateCityRedPoint) 	 //跨服 -  跨服BOSS
		this.observe(MessageDef.ARENA_INFO_DATA, this.UpdateCityRedPoint)	 	 //竞技场 
		this.observe(MessageDef.ARENA_BUY_RESULT, this.UpdateCityRedPoint)		 //竞技场 
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateCityRedPoint)		//装备商店 橙色装备可分解
		this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateCityRedPoint)		//房屋
		// this.observe(MessageDef.GANG_ALL_NOTICE, this.UpdateCityRedPoint)		//帮会
		this.observe(MessageDef.GODPETACTIVE_UPDATE_INFO, this.UpdateCityRedPoint) //神兽降临
		this.observe(MessageDef.GODPETACTIVE_LOTTERY_NOTICE, this.UpdateCityRedPoint) //降服神兽
		this.observe(MessageDef.FRIEND_RED_POINT_CHANGE, this.UpdateCityRedPoint) //好友

		this.UpdateCityRedPoint()
		//**主城红点  end */
		this.observe(MessageDef.PUBLIC_BOSS_REBORN, this.bossReborn)		//全民boss复活

		this.observe(MessageDef.RP_FORGE, this.UpdateForgeRedPoint)
		this.UpdateForgeRedPoint()

		this.observe(MessageDef.EXP_CHANGE, this._DoExpChange);
		this.observe(MessageDef.LEVEL_CHANGE, this._DoExpChange);
		this._DoExpInit()

		this.observe(MessageDef.ROLE_HINT, this.showRoleBtnRedPoint);
		this.observe(MessageDef.RP_ROLE_HINT, this.showRoleBtnRedPoint);
		this.observe(MessageDef.RP_SKILL_UPGRADE, this.showRoleBtnRedPoint);
		this.observe(MessageDef.RP_TREASURE, this.showRoleBtnRedPoint);
		this.observe(GameGlobal.UserRide.GetItemRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.UserRide.GetItemEquipRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.UserWing.GetItemRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.UserWing.GetItemEquipRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.showRoleBtnRedPoint)
		this.observe(MessageDef.FORMATION_ALL_NOTICE, this.showRoleBtnRedPoint)
		this.observe(MessageDef.DEITYEQUIP_ALL_NOTICE, this.showRoleBtnRedPoint)
		this.showRoleBtnRedPoint()

		this.observe(MessageDef.RP_BAG_PET_ACT_ITEM, this.UpdatePetRedPoint)
		this.observe(MessageDef.RP_PET, this.UpdatePetRedPoint)
		this.observe(GameGlobal.PetTonglModel.GetItemRpUpdateMsg(), this.UpdatePetRedPoint)
		this.observe(GameGlobal.PetTonglModel.GetItemEquipRpUpdateMsg(), this.UpdatePetRedPoint)
		this.observe(GameGlobal.PetShouhModel.GetItemRpUpdateMsg(), this.UpdatePetRedPoint)
		this.observe(GameGlobal.PetShouhModel.GetItemEquipRpUpdateMsg(), this.UpdatePetRedPoint)
		this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdatePetRedPoint)
		this.UpdatePetRedPoint()

		this.observe(GameGlobal.XianlvFzModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvFzModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvXwModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvXwModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(MessageDef.RP_BAG_XIANLV_ACT_ITEM, this.UpdateXianlvRedPoint)
		this.observe(MessageDef.RP_XIANLV, this.UpdateXianlvRedPoint)
		this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateXianlvRedPoint)
		this.UpdateXianlvRedPoint()

		this.observe(GameGlobal.HavingModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingHuanModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingHuanModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingLingqModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingLingqModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.UpdateTiannvRedPoint()

		this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateTiansRedPoint)
		this.observe(MessageDef.RP_TIANSHEN, this.UpdateTiansRedPoint)
		this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateTiansRedPoint)
		this.UpdateTiansRedPoint()

		this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateLigntongRedPoint)
		this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateLigntongRedPoint)
		this.observe(MessageDef.RP_LINGTONG, this.UpdateLigntongRedPoint)
		this.UpdateLigntongRedPoint()

		// this.observe(MessageDef.GANG_ALL_NOTICE, this.UpdateGangRedPoint)
		// this.observe(MessageDef.GANG_EXIT_NOTICE, this.UpdateGangRedPoint)
		// this.UpdateGangRedPoint()

		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
	}

	private _DoInitInfo() {
		this._DoExpInit()
		this.ShowCount()
	}

	private ShowCount() {
		let tiansState = Deblocking.Check(DeblockingType.TYPE_23, true)
		let tiannvState = Deblocking.Check(DeblockingType.TYPE_19, true)
		let lingtState = Deblocking.Check(DeblockingType.TYPE_116, true)
		let state = tiansState || tiannvState || lingtState
		this.xiannvBtn.icon = state ? "ui_bm_helpwar" : "ui_bm_xianlv"
		return state
	}

	private UpdateForgeRedPoint() {
		this.forgingBtn["redPoint"].visible = GameGlobal.ForgeModel.mRedPoint.IsRedPoint()
	}

	public showRoleBtnRedPoint() {
		this.roleBtn["redPoint"].visible = this.GetRoleRedPoint()
	}
	public updateJiJieBtnPng(): void {
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.roleBtn, [ActivityKaiFuJiJieType.ride, ActivityKaiFuJiJieType.wing
			, ActivityKaiFuJiJieType.fairy, ActivityKaiFuJiJieType.weapon]);

		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.petBtn, [ActivityKaiFuJiJieType.pet_psychic, ActivityKaiFuJiJieType.pet_soul]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.xiannvBtn, [ActivityKaiFuJiJieType.xianlv_circle, ActivityKaiFuJiJieType.xianlv_position,
		ActivityKaiFuJiJieType.tiannv_nimbus, ActivityKaiFuJiJieType.tiannv_flower]);
		// ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.tianvBtn, [ActivityKaiFuJiJieType.tiannv_nimbus, ActivityKaiFuJiJieType.tiannv_flower]);
		// ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.xiannvBtn0, [ActivityKaiFuJiJieType.xianlv_circle, ActivityKaiFuJiJieType.xianlv_position]);
	}

	private UpdateFateEff(): void {
		FateEff.isShowEff(this);
	}

	private GetRoleRedPoint(): boolean {
		if (GameGlobal.UserRole.IsRedPoint()) {
			return true
		}
		if (GameGlobal.UserRole.IsRedEquip()) {
			return true
		}
		if (GameGlobal.UserRide.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.UserWing.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.UserSkill.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.TianxModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.SwordModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.FormationModel.mRedPoint.IsRedPoint()) {
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

	private UpdatePetRedPoint() {
		let b = GameGlobal.PetModel.mRedPoint.IsRedPoint()
		if (!b) {
			b = GameGlobal.PetTonglModel.mRedPoint.IsRedPoint()
		}
		if (!b) {
			b = GameGlobal.PetShouhModel.mRedPoint.IsRedPoint()
		}
		if (!b) {
			b = GameGlobal.YuanfenModel.IsRedPoint()
		}
		UIHelper.ShowRedPoint(this.petBtn, b)
	}

	private GetXianlvRedPoint(): boolean {
		if (GameGlobal.XianlvModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.XianlvFzModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.XianlvXwModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.YuanfenModel.IsRedPoint()) {
			return true
		}
		return false
	}

	private UpdateXianlvMainRedPoint() {
		UIHelper.ShowRedPoint(this.xiannvBtn, this.GetXianlvRedPoint() || this.GetTiannvRedPoint() || GameGlobal.TianShenModel.mRedPoint.IsRedPoint() || GameGlobal.LingtongAttrModel.IsRedPoint())
	}

	private UpdateXianlvRedPoint() {
		this.UpdateXianlvMainRedPoint()
		//UIHelper.ShowRedPoint(this.xiannvBtn0, this.GetXianlvRedPoint())
	}

	private GetTiannvRedPoint() {
		if (GameGlobal.HavingModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.HavingHuanModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.HavingLingqModel.mRedPoint.IsRedPoint()) {
			return true
		}
		return false
	}

	private UpdateTiannvRedPoint() {
		this.UpdateXianlvMainRedPoint()
		//UIHelper.ShowRedPoint(this.tianvBtn, this.GetTiannvRedPoint())
	}

	private UpdateTiansRedPoint() {
		this.UpdateXianlvMainRedPoint()
		//UIHelper.ShowRedPoint(this.tianshenBtn, GameGlobal.TianShenModel.mRedPoint.IsRedPoint())
	}

	private UpdateLigntongRedPoint() {
		this.UpdateXianlvMainRedPoint()
		//UIHelper.ShowRedPoint(this.lingtongBtn, GameGlobal.LingtongAttrModel.IsRedPoint())
	}

	// private UpdateGangRedPoint() {
	// 	UIHelper.ShowRedPoint(this.guildBtn, GameGlobal.GangModel.mRedPoint.IsRedPoint())
	// }

	private UpdateCityRedPoint() {
		// if (this.mCurType != MainBottomPanel.BUTTON_TYPE_FIGHT 
		// 	|| !Deblocking.Check(DeblockingType.TYPE_95, true)) {
		// 	UIHelper.ShowRedPoint(this.fightBtn, false)
		// 	return
		// }
		if (!Deblocking.Check(DeblockingType.TYPE_95, true)) {
			return
		}

		// 部分功能在主城显示了，主城不需要在提示红点
		let redPointFlag = 
		GameGlobal.BossModel.IsRedPoint() //BOSS
			|| GameGlobal.UserFb.IsRedPoint() //副本
			|| GameGlobal.YingYuanModel.CanUpgrade() //房屋
			|| GameGlobal.AcrossBossController.IsAcrossBossAct() //跨服BOSS
			|| GameGlobal.Arena.IsRedPoint() // 竞技场
			// || GameGlobal.GangModel.mRedPoint.IsRedPoint() //帮会
			|| GameGlobal.UserBag.HasOrangeEquip()
			|| GameGlobal.FuliModel.IsRedPoint()//福利大厅
			|| GameGlobal.GodPetActiveModel.mRedPoint //神兽降临
			|| GameGlobal.GodPetActiveModel.CanLottery() //降服神兽
			|| GameGlobal.FriendModel.checkRedPoint() //好友

		// let redPointFlag = 
		// 	GameGlobal.YingYuanModel.CanUpgrade() //房屋
		// 	|| GameGlobal.UserBag.HasOrangeEquip()
		// 	|| GameGlobal.FriendModel.checkRedPoint() //好友
		// 	|| GameGlobal.FuliModel.IsRedPoint()

		UIHelper.ShowRedPoint(this.cityBtn, redPointFlag)
	}

	// private m_OldSelectIndex = -1


	public onClick(e: egret.TouchEvent) {
		var index = this.navBtn.indexOf(e.currentTarget);

		for (var i = 0; i < this.navBtn.length; i++) {
			// 当前是可用的状态visible
			if (index != i && this.navBtn[i].visible) {
				this.closeWindow(i);
			}
		}
		// if(index==2 || index==4|| index==5) //暫時屏蔽Eff 
		// 	UIHelper.SetBtnEffe(this.navBtn[index],"ui_zhy001",false);
		//仙侣
		if (index == 4) {
			if (!this.ShowCount()) {
				if (ViewManager.ins().isShow(XianlvMainPanel)) {
					ViewManager.ins().close(XianlvMainPanel)
				} else {
					ViewManager.ins().open(XianlvMainPanel)
				}
			} else {
				//this.conGroup.visible = !this.conGroup.visible
				if (ViewManager.ins().isShow(BottomSelectPanel)) {
					ViewManager.ins().close(BottomSelectPanel)
				} else {
					ViewManager.ins().open(BottomSelectPanel)
				}
			}
			return
		} else {
			//this.conGroup.visible = false;
			ViewManager.ins().close(BottomSelectPanel)
		}

		if (index == 0) {
			ViewManager.ins().closePartPanel()
			// if (this.mCurType == MainBottomPanel.BUTTON_TYPE_FIGHT) {
			// 	if (!Deblocking.Check(DeblockingType.TYPE_95)) {
			// 		return
			// 	}
			// 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_CITY)
			// 	if (!GameGlobal.RaidMgr.mCityRaid) {
			// 		GameGlobal.RaidMgr.EnterCityMapRaid()
			// 		GameGlobal.CommonRaidModel.SendEnterCity(null)
			// 	}
			// } else {
			// 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_NORMAL)
			// }
		}

		// if (index == 5) {
		// 	if (ViewManager.ins().isShow(GangListWin))
		// 	{
		// 		ViewManager.ins().close(GangListWin)
		// 		this.SetLight(-1)
		// 	}
		// 	else if (ViewManager.ins().isShow(GangMainWin))
		// 	{
		// 		ViewManager.ins().close(GangMainWin)
		// 		this.SetLight(-1)
		// 	}
		// 	else
		// 	{
		// 		GameGlobal.GangModel.OpenGangView()
		// 		this.SetLight(5);
		// 	}
		// }

		let navCls = this.navBind[index]
		if (navCls) {
			if (ViewManager.ins().isShow(navCls)) {
				ViewManager.ins().close(navCls)
				// this.SetLight(-1);
			} else {
				ViewManager.ins().open(navCls);
				// this.SetLight(index);
			}
		}
	};

	// private SetLight(index: number) {
	// 	for (let i = 0; i < this.navBtn.length; i++) {
	// 		(this.navBtn[i] as any).light.visible = index == i
	// 	}
	// }

	public closeWindow(index) {
		if (this.navBind[index]) {
			if (ViewManager.ins().isShow(this.navBind[index])) {
				ViewManager.ins().close(this.navBind[index]);
			}
		}
	}

	private _DoExpInit() {
		let expConfig = GlobalConfig.ins().ExpConfig[GameGlobal.actorModel.level]
		if (!expConfig) {
			return
		}
		var maxExp = expConfig.exp;
		this.expBar.maximum = maxExp;
		this.expBar.value = GameGlobal.actorModel.exp
	}

	private _DoExpChange() {
		let expConfig = GlobalConfig.ins().ExpConfig[GameGlobal.actorModel.level]
		if (!expConfig) {
			return
		}
		var maxExp = expConfig.exp;
		egret.Tween.removeTweens(this.expBar);
		var tween = egret.Tween.get(this.expBar);
		if (this.expBar.maximum != maxExp) {
			tween.to({ "value": this.expBar.maximum }, 500).wait(200).call(() => {
				this.expBar.maximum = maxExp;
				this.expBar.value = 0;
				this._DoExpChange();
			}, this);
			return;
		}
		else {
			tween.to({ "value": GameGlobal.actorModel.exp }, 500);
		}
	}

	// public hidePaoPao() {
	// 	// this.shopRefresh.visible = false;
	// 	if (this.m_ShopTipMc && this.m_ShopTipMc.parent) {
	// 		this.m_ShopTipMc.parent.removeChild(this.m_ShopTipMc)	
	// 	}
	// 	egret.clearInterval(this.times);
	// };

	// public static CloseNav(type: number): void {
	// 	var uiview2 = <MainBottomPanel>ViewManager.ins().getView(MainBottomPanel);
	// 	if (uiview2) {
	// 		uiview2.closeNav(type);
	// 	}
	// }
	public static CloseNav(obj: BaseEuiView): void {
		let cls = Util.GetClass(obj)
		if (!cls) {
			return
		}
		var uiview2 = <MainBottomPanel>ViewManager.ins().getView(MainBottomPanel);
		if (uiview2) {
			let index = uiview2.navBind.indexOf(cls)
			if (index != -1) {
				// uiview2.SetLight(index);
			} else {
				if (DEBUG) {
					console.warn("obj is not bottom panel view !!!")
				}
			}
		}
	}

	public bossReborn(id, visible) {
		let name;
		if (id != null) {
			name = GameGlobal.Config.MonstersConfig[GameGlobal.Config.PublicBossConfig[id].bossid][GameGlobal.Config.MonstersConfig_keys.name]
			this.bossNameTxt.textFlow = TextFlowMaker.generateTextFlow(`|C:${Color.Green}&T:${name}|复活了`);
		}
		this.bossUpdateGroup.visible = visible;
		this.bossUpdateGroup.touchEnabled = visible;
	}

	// public ChangeBtnState() {
	// 	if (GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_CITY)
	// 		this.mCurType = MainBottomPanel.BUTTON_TYPE_CITY
	// 	else
	// 		this.mCurType = MainBottomPanel.BUTTON_TYPE_FIGHT

	// 	this.fightBtn.icon = this.mCurType == MainBottomPanel.BUTTON_TYPE_CITY ? "ui_bm_zhandou" : "ui_bm_zhucheng"
	// 	if (this.mCurType == MainBottomPanel.BUTTON_TYPE_CITY)
	// 	{
	// 		this.bossUpdateGroup.visible = false
	// 		UIHelper.ShowRedPoint(this.fightBtn, false)
	// 	}
	// 	else
	// 	{
	// 		this.UpdateCityRedPoint()
	// 	}
			
	// }
}
