class PetMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// PetMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected viewStack: TabView;
	protected showGroup: eui.Group;
	protected group: eui.Group;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public mSelectIndex = 0
	public mPetList = []
	private mListLRBtnCtrl: ListLRBtnCtrl

	private mPetInactiveView: PetInactiveView

	public constructor() {
		super()
		this.skinName = "PetMainSkin"
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 112)
	}

	public childrenCreated() {
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(PetUpLevelPanel, { skinName: "PetUpLevelSkin", mContext: this }),
			TabView.CreateTabViewData(PetSkillPanel, { skinName: "PetSkillSkin", mContext: this }),
			TabView.CreateTabViewData(PetTonglPanel, { mContext: this }),
			TabView.CreateTabViewData(PetShouhPanel, { mContext: this }),
		]

		this.commonWindowBg.SetViewStack(this.viewStack)

		this.list.itemRenderer = PetHeadItem
		this.ResortList()
		this.list.selectedIndex = this.mSelectIndex
		this._AddItemClick(this.list, this._OnItemTap)
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_11);
	}

	public OnOpen(...args) {
		this.observe(MessageDef.PET_UPATE_INFO, this.UpdateList)
		this.observe(MessageDef.PET_ACTIVE, this.UpdateActive)
		this.commonWindowBg.OnAdded(this, args.length ? args[0] : 0)
		this.CheckShowGroup(args.length ? args[0] : 0)
		this.mListLRBtnCtrl.OnRefresh();
		this.UpdateContent()

		this.observe(MessageDef.RP_BAG_PET_ACT_ITEM, this.UpdateRedPoint)
		this.observe(MessageDef.RP_PET, this.UpdateRedPoint)
		this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPoint)
		this.UpdateRedPoint()

		this.observe(GameGlobal.PetTonglModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex2)
		this.observe(GameGlobal.PetTonglModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex2)
		this.UpdateRedPointIndex2()

		this.observe(GameGlobal.PetShouhModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex3)
		this.observe(GameGlobal.PetShouhModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex3)
		this.UpdateRedPointIndex3()

		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.updateJiJieBtnPng();
	}
	
	private updateJiJieBtnPng(): void
	{
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.pet_soul]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.pet_psychic]);
	}

	private UpdateRedPoint() {
		this.commonWindowBg.CheckTalRedPoint(0)
		this.commonWindowBg.CheckTalRedPoint(1)

		UIHelper.ListRefresh(this.list)
	}

	private UpdateRedPointIndex2() {
		this.commonWindowBg.CheckTalRedPoint(2)
	}

	private UpdateRedPointIndex3() {
		this.commonWindowBg.CheckTalRedPoint(3)
	}

	public OnClose() {
		this._ClosePetView()
		MainBottomPanel.CloseNav(this)
	}

	public _OnItemTap(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		this.mSelectIndex = index
		this.UpdateContent()
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}

	private ResortList() {
		this.mPetList = CommonUtils.GetArray(GameGlobal.Config.petBiographyConfig, "id")
		let model = GameGlobal.PetModel
		let getWeight = function (config) {
			let confId = config.id
			if (model.HasBattle(confId)) {
				return model.GetBattlePos(confId) - 10000000
			}
			if (model.HasPet(confId)) {
				let quality = GameGlobal.Config.petBiographyConfig[confId].quality
				return confId - 1000000 - quality * 10000
			} else {
				if (model.mRedPoint.IsRedAct(confId)) {
					return confId - 100000
				}
			}
			return confId
		}
		this.mPetList.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})

		this.list.dataProvider = new eui.ArrayCollection(this.mPetList)
		
		let list = []
		for (let data of this.mPetList) {
			list.push(PetHeadItem.RedPoint(data.id))
		}
		this.mListLRBtnCtrl.SetRedPointList(list)
		this.mListLRBtnCtrl.OnRefresh()
	}

	private UpdateActive() {
		this.ResortList()
		this.UpdateContent()
	}

	private UpdateContent() {
		this.commonWindowBg.GetCurViewStackElement().UpdateContent()
		this._UpdatePetView()
	}

	private _UpdatePetView() {
		let id = this.mPetList[this.mSelectIndex].id
		if (!GameGlobal.PetModel.HasPet(id)) {
			if (!this.mPetInactiveView) {
				this.mPetInactiveView = new PetInactiveView
			}
			if (!this.mPetInactiveView.parent) {
				this.group.addChild(this.mPetInactiveView)
				this.mPetInactiveView.DoOpen([])
			}
			this.mPetInactiveView.UpdateContent(id)
		} else {
			this._ClosePetView()
		}
	}

	private _ClosePetView() {
		if (this.mPetInactiveView && this.mPetInactiveView.parent) {
			this.mPetInactiveView.DoClose()
			DisplayUtils.removeFromParent(this.mPetInactiveView)
		}
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		this.CheckShowGroup(selectedIndex)
		switch (selectedIndex) {
			case 1:
				return Deblocking.Check(DeblockingType.TYPE_12);
			case 2:
				return Deblocking.Check(DeblockingType.TYPE_13);
			case 3:
				return Deblocking.Check(DeblockingType.TYPE_14);
		}
		return true
	}

	private CheckShowGroup(selectedIndex: number) {
		this.showGroup.visible = true;
		switch (selectedIndex) {
			case 2:
			case 3:
				this.showGroup.visible = false;
				break
		}
	}
}

class PetHeadItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// PetHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemIcon;
	protected imgBattle: eui.Image;
	protected imgNotice: eui.Image;
	protected imgType: eui.Image;
	protected lbName: eui.Label;
	protected lbLev: eui.Label;
	protected starGroup: eui.DataGroup;
	protected redPoint: eui.Image;
	protected imgShen: eui.Image;
	///////////////////////////////////////////////////////////////////////////// 

	public dataChanged() {
		let config = this.data
		let index = GameGlobal.PetModel.mBattleList.indexOf(config.id)
		if (index == 0) {
			this.imgBattle.source = "ui_bm_chuzhan"
		} else if (index == -1) {
			this.imgBattle.source = ""
		} else {
			this.imgBattle.source = "ui_bm_beizhan"
		}
		PetHeadItem.SetContent(this, config)
		let info = GameGlobal.PetModel.GetPetInfo(config.id)
		if (info && info.mName) {
			this.lbName.text = info.mName 
		}
		this.imgShen.visible = config.type == 2
		this.UpdateRedPoint()
	}

	public static SetContent(comp: PetHeadItem, config) {
		comp.lbName.text = config.name
		comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		comp.lbLev.text = GameGlobal.PetModel.HasPet(config.id) ? ("Lv." + GameGlobal.PetModel.GetLevel(config.id)) : ""
		comp.item.SetQuality(config.quality)
		comp.item.setItemImg(PetConst.GetHeadIcon(config.id))
		if (!config.gray)
			comp.item.setGray(!GameGlobal.PetModel.HasPet(config.id))
	}

	public static SetContentByInfo(comp: PetHeadItem, info: PetInfo) {
		this.SetContent(comp, GameGlobal.Config.petBiographyConfig[info.mPetId])
		comp.lbName.text = info.mName
	}

	private UpdateRedPoint() {
		this.redPoint.visible = PetHeadItem.RedPoint(this.data.id)
	}

	public static RedPoint(id: number): boolean {
		return GameGlobal.PetModel.IsRedPointPet(id) || GameGlobal.PetModel.HasPet(id) && !GameGlobal.PetModel.HasBattle(id) && GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_BATTLE);
	}
}