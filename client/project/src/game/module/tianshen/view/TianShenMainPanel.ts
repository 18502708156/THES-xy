class TianShenMainPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main
	/////////////////////////////////////////////////////////////////////////////
	// TianShenMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected viewStack: TabView;
	protected showGroup: eui.Group;
	protected group: eui.Group;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public mSelectIndex = 0;
	public mTianShenList
	private mListLRBtnCtrl: ListLRBtnCtrl;

	/**天神未激活面板 */
	private mTianShenInactiveView: TianShenInactiveView;

	public constructor() {
		super()
		this.skinName = "TianShenMainSkin";
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 112);
	}
	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(TianShenUpLevelPanel, { skinName: "TianShenLevelUpSkin", mContext: this }),
			TabView.CreateTabViewData(TianShenBreachPanel, { skinName: "TianShenBreachSkin", mContext: this }),
			TabView.CreateTabViewData(TianShenHeChengPanel, { skinName: "TianShenHeChengSkin", mContext: this }),
			TabView.CreateTabViewData(TianShenBaoQiPanel, { skinName: "TianShenBaoQiSkin", mContext: this }),
		]);

		this.list.itemRenderer = TianShenHeadItem;
		this.mTianShenList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalListConfig, "id")
		let weight = (config) => {
			let weightVal = config.id
			let model = GameGlobal.TianShenModel;
			if (model.HasBattle() && model.mBattleID == config.id) {
				weightVal = weightVal - 100000
				return weightVal
			}

			if (model.HasTianShen(config.id)) {
				weightVal = weightVal - 10000
			}
			return weightVal
		}
		this.mTianShenList.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(this.mTianShenList)
		this.list.selectedIndex = this.mSelectIndex
		this._AddItemClick(this.list, this._OnItemTap)
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_23);
	}

	public OnOpen(...args: any[]) {
		this.commonWindowBg.OnAdded(this);

		this.observe(MessageDef.TIANSHEN_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.TIANSHEN_UPDATE_BREACH, this.UpdateContent)

		this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateRedPoint)
		this.observe(MessageDef.RP_TIANSHEN, this.UpdateRedPoint)
		this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPoint)
		this.UpdateRedPoint()
		this.mListLRBtnCtrl.OnRefresh();
		this.UpdateContent();
	}

	public OnClose() {
		this._ClosePetView()
		MainBottomPanel.CloseNav(this)
	}

	private UpdateRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(0)
		this.mCommonWindowBg.CheckTalRedPoint(1)
		this.mCommonWindowBg.CheckTalRedPoint(2)
		this.mCommonWindowBg.CheckTalRedPoint(3)
	}

	public _OnItemTap(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		this.mSelectIndex = index
		this.UpdateContent()
	}

	private UpdateContent() {
		UIHelper.ListRefresh(this.list)
		this.commonWindowBg.GetCurViewStackElement().UpdateContent()
		this._UpdatePetView()
	}

	private _UpdatePetView() {
		let id = this.mTianShenList[this.mSelectIndex].id;
		if (!GameGlobal.TianShenModel.HasTianShen(id)) {
			if (!this.mTianShenInactiveView) {
				this.mTianShenInactiveView = new TianShenInactiveView()
				this.mTianShenInactiveView.SetContext(this)
			}
			if (!this.mTianShenInactiveView.parent) {
				this.group.addChild(this.mTianShenInactiveView)
				this.mTianShenInactiveView.DoOpen([])
			}
			this.mTianShenInactiveView.UpdateInfo(id)
		} else {
			this._ClosePetView()
		}
	}

	private _ClosePetView() {
		if (this.mTianShenInactiveView && this.mTianShenInactiveView.parent) {
			this.mTianShenInactiveView.DoClose()
			DisplayUtils.removeFromParent(this.mTianShenInactiveView)
		}
	}

	public OnOpenIndex(selectedIndex: number): boolean {
		this.showGroup.visible = true;
		switch (selectedIndex) {
			case 1:
				return Deblocking.Check(DeblockingType.TYPE_24);
			case 2:
				this.showGroup.visible = false;
				return Deblocking.Check(DeblockingType.TYPE_25);
			case 3:
				this.showGroup.visible = false;
				return Deblocking.Check(DeblockingType.TYPE_26);
		}
		return true
	}
}
class TianShenHeadItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// PetHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemIcon;
	protected imgBattle: eui.Image;
	protected imgNotice: eui.Image;
	protected imgType: eui.Image;
	protected lbName: eui.Label;
	protected lbLev: eui.Label;
	protected lbLev2: eui.Label;
	protected redPoint: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let config = this.data
		this.SetContent(config);

		let model = GameGlobal.TianShenModel
		if (model.HasBattle() && model.mBattleID == config.id) {
			this.imgBattle.source = "ui_bm_chuzhan"
		} else {
			this.imgBattle.source = ""
		}
		this.redPoint.visible = GameGlobal.TianShenModel.IsRedPointTianShen(config.id)
	}

	private SetContent(config) {
		this.lbName.text = config.name
		this.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		this.lbLev.text = GameGlobal.TianShenModel.HasTianShen(config.id) ? (GameGlobal.TianShenModel.GetLevel(config.id) + "阶") : ""
		this.lbLev2.text = GameGlobal.TianShenModel.HasTianShen(config.id) ? GameGlobal.TianShenModel.GetBreachLvStr(config.id) : ""
		this.item.SetQuality(config.quality)
		this.item.setItemImg("resource/assets/image/head/tianshen/" + config.icon + ".png");
		this.item.setGray(!GameGlobal.TianShenModel.HasTianShen(config.id))
	}

	public SetContentByInfo(mTianShenId) {
		this.SetContent(GameGlobal.Config.AirMarshalListConfig[mTianShenId]);
	}
}
