class LingtongMainPanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private mPetInactiveView: LingtongInactiveView

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
		this.mCommonWindowBg.title = "灵童"
	}

	public childrenCreated() {
		let list =  [
			TabView.CreateTabViewData(LingtongUpLevelPanel),
			TabView.CreateTabViewData(LingtongSkillPanel),
			TabView.CreateTabViewData(LingtongRankPanel),
		]
		if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
			list.push(TabView.CreateTabViewData(DestinyPanel))
			// list.push(TabView.CreateTabViewData(DestinyNiPanel))
		}
		this.mCommonWindowBg.SetTabView(list)
	}

	public OnOpen(...param: any[]) {
		this.mCommonWindowBg.OnAdded(this, param[0] || 0)
		this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)

		this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
		this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint)
		this.UpdateContent()
		this.UpdateRedPoint()
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	private UpdateRedPoint() {
		this.mCommonWindowBg.CheckTalRedPoint(0)
		this.mCommonWindowBg.CheckTalRedPoint(1)
		this.mCommonWindowBg.CheckTalRedPoint(2)
	}

	private UpdateContent() {
		if (GameGlobal.LingtongAttrModel.IsActive()) {
			this.mCommonWindowBg.GetCurViewStackElement().UpdateContent()
		}
		this._UpdatePetView()
	}

	private _UpdatePetView(index: number = null) {
		if (index == null) {
			index = this.mCommonWindowBg.viewStack.selectedIndex
		}
		if (index == 3) {
			if (this.mPetInactiveView) {
				this.mPetInactiveView.visible = false
			}
			this.mCommonWindowBg.viewStack.visible = true
		} else {
			if (!GameGlobal.LingtongAttrModel.IsActive()) {
				if (!this.mPetInactiveView) {
					this.mPetInactiveView = new LingtongInactiveView
				}
				this.mPetInactiveView.visible = true
				if (!this.mPetInactiveView.parent) {
					this.addChild(this.mPetInactiveView)
					this.mPetInactiveView.DoOpen([])
				}
				this.mPetInactiveView.UpdateContent()
				this.mCommonWindowBg.viewStack.visible = false
			} else {
				this.mCommonWindowBg.viewStack.visible = true
				this._ClosePetView()
			}
		}
	}

	private _ClosePetView() {
		if (this.mPetInactiveView && this.mPetInactiveView.parent) {
			this.mPetInactiveView.DoClose()
			DisplayUtils.removeFromParent(this.mPetInactiveView)
		}
	}

	OnOpenIndex?(openIndex: number): boolean {
		if (!GameGlobal.LingtongAttrModel.IsActive() && openIndex != 3) {
			if (openIndex != 0) {
				UserTips.InfoTip("请先激活灵童")
			}
		}
		this._UpdatePetView(openIndex)
		return true
	}

    public static openCheck(...param: any[]) {
        return Deblocking.Check(DeblockingType.TYPE_116)
        // return true
    }
}