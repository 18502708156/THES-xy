class FormationWin extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // FormationMainSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected showGroup: eui.Group;
    protected group: eui.Group;
    protected list: eui.List;
    protected leftBtn: eui.Button;
    protected rightBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public mSelectIndex = 0
	public mFormationList = []
	private mListLRBtnCtrl: ListLRBtnCtrl

	private mFormationInfoPanel: FormationInfoPanel

	public constructor() {
		super()
		this.skinName = "FormationMainSkin"
		this.commonWindowBg.SetTitle("阵型")
		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 112)
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_113)
	}

	public childrenCreated() {
		this.list.itemRenderer = FormationItem
		this.mFormationList = CommonUtils.GetArray(GameGlobal.Config.FormationListConfig, "id")
		let model = GameGlobal.FormationModel
		let getWeight = function(config) {
			let confId = config.id
			if (model.IsUsed(confId)) {
				return confId - 100000
			}

			if (model.HasFormation(confId)) {
				return confId - 10000
			}

			return confId
		}
		this.mFormationList.sort(function(lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(this.mFormationList)
		this.list.selectedIndex = this.mSelectIndex
		this._AddItemClick(this.list, this._OnItemTap)
	}

	public OnOpen(...args) {
		this.observe(MessageDef.FORMATION_UPDATE_INFO, this.UpdateList)
		this.commonWindowBg.OnAdded(this)
		this.mListLRBtnCtrl.OnRefresh();
		this.UpdateContent()
	}

	public OnClose() {
		this._CloseFormationView()
	}

	public _OnItemTap(e: eui.ItemTapEvent) {
		let index = e.itemIndex
		this.mSelectIndex = index
		this.UpdateContent()
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.list)
	}

	private UpdateContent() {
		this.UpdateInfoView()
	}

	private UpdateInfoView() {
		let id = this.mFormationList[this.mSelectIndex].id
		if (!this.mFormationInfoPanel) {
			this.mFormationInfoPanel = new FormationInfoPanel
		}
		if (!this.mFormationInfoPanel.parent) {
			this.group.addChild(this.mFormationInfoPanel)
			this.mFormationInfoPanel.DoOpen([])
		}
		this.mFormationInfoPanel.UpdateContent(id)
	}

	private _CloseFormationView() {
		if (this.mFormationInfoPanel && this.mFormationInfoPanel.parent) {
			this.mFormationInfoPanel.DoClose()
			DisplayUtils.removeFromParent(this.mFormationInfoPanel)
		}
	}
}

class FormationItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // FormationItemSkin.exml
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

	public childrenCreated() {
	}

	public dataChanged() {
		let config = this.data
		let model = GameGlobal.FormationModel
		if (model.IsUsed(config.id))
			this.imgBattle.source = "ui_zx_bm_xuanyon"
		else
			this.imgBattle.source = ""
	
		FormationItem.SetContent(this, config)
		this.UpdateRedPoint()
	}

	public static SetContent(comp: FormationItem, config) {
		comp.lbName.text = config.name
		comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		comp.lbLev.text = ""
		comp.item.SetQuality(config.quality)
		comp.item.setItemImg(config.item)
		comp.item.setGray(!GameGlobal.FormationModel.HasFormation(config.id))
	}

	private UpdateRedPoint() {
		this.redPoint.visible = GameGlobal.FormationModel.mRedPoint.IsRedAct(this.data.id)
								|| GameGlobal.FormationModel.mRedPoint.IsRedLevel(this.data.id)
								|| GameGlobal.FormationModel.mRedPoint.IsRedSkill(this.data.id)
								|| GameGlobal.FormationModel.mRedPoint.IsRedSoul(this.data.id)
								|| GameGlobal.FormationModel.mRedPoint.IsRedDrug(this.data.id)
	}
}