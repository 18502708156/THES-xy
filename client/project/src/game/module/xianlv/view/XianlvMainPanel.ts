class XianlvMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// XianlvMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected viewStack: TabView;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected group: eui.Group
	protected showGroup: eui.Group;
	protected help: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public mSelectIndex = 0
	public mXianlvList = []
	private mListLRBtnCtrl: ListLRBtnCtrl

	private mXianlvInactiveView: XianlvInactiveView

	public constructor() {
		super()
		this.skinName = "XianlvMainSkin"
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 112)
	}

	public childrenCreated() {
		this.viewStack.tabChildren = [
			TabView.CreateTabViewData(XianlvUpLevelPanel, { skinName: "XianlvUpLevelSkin", mContext: this }),
			TabView.CreateTabViewData(XianlvupStarPanel, { skinName: "XianlvupStarSkin", mContext: this }),
			TabView.CreateTabViewData(XianlvFzPanel, { mContext: this }),
			TabView.CreateTabViewData(XianlvXwPanel, { mContext: this }),
		]


		this.commonWindowBg.SetViewStack(this.viewStack)

		this.list.itemRenderer = XianlvHeadItem
		this.mXianlvList = CommonUtils.GetArray(GameGlobal.Config.partnerBiographyConfig, "id")
		let weight = (config) => {
			let weightVal = config.id
			let model = GameGlobal.XianlvModel
			if (model.HasBattle(config.id)) {
				let battlePos = model.GetBattlePos(config.id)
				weightVal = battlePos - 10000000
				return weightVal
			}

			if (model.HasXianlv(config.id)) {
				let quality = GameGlobal.Config.partnerBiographyConfig[config.id].quality
				weightVal = weightVal - 1000000 - quality * 10000
			} else {
				if (model.mRedPoint.IsRedAct(config.id)) {
					return config.id - 100000
				}
			}
			return weightVal
		}
		this.mXianlvList.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(this.mXianlvList)
		this.list.selectedIndex = this.mSelectIndex
		this._AddItemClick(this.list, this._OnItemTap)
		this._AddClick(this.help, this._click)
	}

	public _click() {
		this.commonWindowBg.setHelp(5, "规则说明")
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] || 0)
		this.OnOpenIndex(param[0] || 0)
		this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent)

		this.observe(MessageDef.RP_BAG_XIANLV_ACT_ITEM, this.UpdateRedPointIndex)
		this.observe(MessageDef.RP_XIANLV, this.UpdateRedPointIndex)
		this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPointIndex)
		this.UpdateRedPointIndex()

		this.observe(GameGlobal.XianlvFzModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex2)
		this.observe(GameGlobal.XianlvFzModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex2)
		this.UpdateRedPointIndex2()

		this.observe(GameGlobal.XianlvXwModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex3)
		this.observe(GameGlobal.XianlvXwModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex3)
		this.UpdateRedPointIndex3()
		this.mListLRBtnCtrl.OnRefresh();
		this.UpdateContent()
		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)
		this.updateJiJieBtnPng();
	}

	private updateJiJieBtnPng(): void {
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.xianlv_position]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.xianlv_circle]);
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
		let list = []
		for (let data of this.mXianlvList) {
			list.push(XianlvHeadItem.RedPoint(data.id))
		}
		this.mListLRBtnCtrl.SetRedPointList(list)
		this.mListLRBtnCtrl.OnRefresh()

		UIHelper.ListRefresh(this.list)
	}

	private UpdateContent() {
		this.UpdateList()
		this.commonWindowBg.GetCurViewStackElement().UpdateContent()
		this._UpdatePetView()
	}

	private _UpdatePetView() {
		let id = this.mXianlvList[this.mSelectIndex].id
		if (!GameGlobal.XianlvModel.HasXianlv(id)) {
			if (!this.mXianlvInactiveView) {
				this.mXianlvInactiveView = new XianlvInactiveView()
				this.mXianlvInactiveView.SetContext(this)
			}
			if (!this.mXianlvInactiveView.parent) {
				this.group.addChild(this.mXianlvInactiveView)
				this.mXianlvInactiveView.DoOpen([])
			}
			this.mXianlvInactiveView.UpdateInfo(id)
		} else {
			this._ClosePetView()
		}
	}

	private UpdateRedPointIndex() {
		this.UpdateList()
		this.commonWindowBg.CheckTalRedPoint(0)
		this.commonWindowBg.CheckTalRedPoint(1)
	}

	private UpdateRedPointIndex2() {
		this.commonWindowBg.CheckTalRedPoint(2)
	}

	private UpdateRedPointIndex3() {
		this.commonWindowBg.CheckTalRedPoint(3)
	}

	private _ClosePetView() {
		if (this.mXianlvInactiveView && this.mXianlvInactiveView.parent) {
			this.mXianlvInactiveView.DoClose()
			DisplayUtils.removeFromParent(this.mXianlvInactiveView)
		}
	}

	OnOpenIndex?(openIndex: number): boolean {
		let showList = openIndex == 0 || openIndex == 1
		this.showGroup.visible = showList
		return true
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_15)
	}
}

class XianlvHeadItem extends eui.ItemRenderer {

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
	/////////////////////////////////////////////////////////////////////////////

	private mStarList: boolean[]

	public childrenCreated() {
		this.starGroup.itemRenderer = XianlvStar
		this.starGroup.visible = true
	}

	public dataChanged() {
		let config = this.data
		XianlvHeadItem.SetContent(this, config)

		let model = GameGlobal.XianlvModel
		if (model.HasBattle(config.id)) {
			this.imgBattle.source = "ui_bm_chuzhan"
		} else {
			this.imgBattle.source = ""
		}
		if (this.mStarList == null) {
			this.mStarList = []
		}
		let info = model.GetXianlvInfo(config.id)

		if (this.starGroup.numChildren != info.mStar) {
			this.mStarList.length = info.mStar
			this.starGroup.dataProvider = new eui.ArrayCollection(this.mStarList)
		}

		this.redPoint.visible = XianlvHeadItem.RedPoint(config.id)
	}

	public static RedPoint(id: number): boolean {
		return GameGlobal.XianlvModel.IsRedPointXianlv(id) || GameGlobal.XianlvModel.mRedPoint.IsRedRank(id)
	}

	public static SetContent(comp: XianlvHeadItem, config) {
		comp.lbName.text = config.name
		comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		comp.lbLev.text = GameGlobal.XianlvModel.HasXianlv(config.id) ? (GameGlobal.XianlvModel.GetLevel(config.id) + "阶") : ""
		comp.item.SetQuality(config.quality)
		comp.item.setItemImg("resource/assets/image/head/xianlv/" + config.icon + ".png")
		comp.item.setGray(!GameGlobal.XianlvModel.HasXianlv(config.id))
	}

	public static SetContentByInfo(comp: XianlvHeadItem, info: XianlvInfo) {
		this.SetContent(comp, GameGlobal.Config.partnerBiographyConfig[info.mXianlvId])
	}
}

class XianlvStar extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// StarSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected starImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	// public dataChanged() {
	// this.starImg.source = this.data ? UIHelper.STAE_IMG_NAME : UIHelper.STAE_NONE_IMG_NAME
	// }

	// public childrenCreated() {

	// }
}