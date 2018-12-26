class GodPieWin extends BaseEuiView {

	static LAYER_LEVEL = LayerManager.UI_Main
	// rightEff
	// leftEff

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GodPieWinSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected contion: eui.Label
	// protected time: eui.Label
	protected btnSend: eui.Button
	protected btnSet: eui.CheckBox
	// protected title: eui.Label
	protected list: eui.List
	protected list2: eui.List
	protected geted: eui.Image
	protected menuList: eui.List
	protected menuScroller: eui.Scroller
	protected titleIamge: eui.Image
	protected labelDisplay: eui.Label
	// protected rightBtn: eui.Button
	// protected labelDisplay: eui.Label
	// protected leftBtn: eui.Button
	protected consumeLabel: eui.Label
	protected desc: eui.Label
	protected date: eui.Label
	protected activityGroup: eui.Group
	protected buyGroup: eui.Group
	protected listGroup: eui.Group
	// protected redPoint: eui.Image
	////////////////////////////////////////////////////////////////////////////////////////////////////

	private m_CurIndex: number = 0
	private m_DataList: eui.ArrayCollection

	public constructor() {
		super()
		this.skinName = "GodPieWinSkin";
		this.list.itemRenderer = ItemBaseEffe
		this.list2.itemRenderer = GodPieListItem
		this.menuList.itemRenderer = GodPieItem
		this.menuList.dataProvider = this.m_DataList = new eui.ArrayCollection()
	}

	private m_List: Sproto.sc_rechargew_shit_request[] = null

	private GetDataList(): Sproto.sc_rechargew_shit_request[] {
		if (this.m_List == null) {
			this.m_List = GameGlobal.GodPieModel.TopDataProvider()
		}
		return this.m_List
	}

	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this)
		//	GameGlobal.MessageCenter.addListener(MessageDef.GOGPIE_UPDATE, this.updataview, this)     //派发更新
		// this.rightEff = new MovieClip
		// this.rightEff.x = this.rightBtn.x
		// this.rightEff.y = this.rightBtn.y + 5
		// this.leftEff = new MovieClip
		// this.leftEff.scaleX = -1
		// this.leftEff.x = this.leftBtn.x + 38
		// this.leftEff.y = this.leftBtn.y + 5
		// this.updataview()

		GameGlobal.GodPieModel.SetShowState()
		let showIndex = param[0] || 0

		this.menuList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTabTouch, this)
		this.AddClick(this.btnSend, this.onClick)
		this.AddClick(this.btnSet, this.onClick)
		// this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		// this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)

		this.m_List = GameGlobal.GodPieModel.TopDataProvider()
		if (this.m_List.length < 1) {
			this.CloseSelf()
			return
		}

		this.observe(MessageDef.GOGPIE_UPDATE, this.UpdateList)
		this.observe(MessageDef.GOGPIE_UPDATE, this.UpdateContent)

		TimerManager.ins().doTimer(1000, 0, this._DoUpdate, this)

		this.UpdateList()
		this.m_CurIndex = -1
		this._UpdateSel(showIndex)

		this.btnSet.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE)
	}

	private UpdateList() {
		if (this.m_List == null) {
			this.m_List = []
		}
		let list = GameGlobal.GodPieModel.TopDataProvider()
		for (let info of list) {
			let existInfo = false
			for (let oldInfo of this.m_List) {
				if (info.config.gtype == oldInfo.config.gtype && info.config.gid == oldInfo.config.gid) {
					existInfo = true
					break
				}
			}
			if (!existInfo) {
				this.m_List.push(info)
			}
		}
		this.m_CurIndex = MathUtils.Clamp(this.m_CurIndex, 0, this.m_List.length - 1)
		this.m_DataList.replaceAll(this.m_List)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
		this.menuList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTabTouch, this)

		TimerManager.ins().removeAll(this)
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.btnSend:
				if (this.GetCurInfo() == null) 
					return

				let index = GodPieModel.GetInfoIndex(this.GetCurInfo())
				GodPieWin.BuyData(this.GetCurInfo(), index)
			break
			case this.btnSet:
				if (this.GetCurInfo() == null) {
					return
				}
				if (!this.btnSet.selected) {
					UserTips.ins().showTips("开启推送")
				} else {
					UserTips.ins().showTips("关闭推送")
				}
				// GameGlobal.GodPieModel.Sendnopop(info.config.payType, info.config.gid, this.btnSet.selected)
				FuncOpenModel.SetData(FuncOpenModel.SAVE_GOD_PIE, this.btnSet.selected)
			break
		}
	}

	onTabTouch(e: eui.PropertyEvent): void {
		this._UpdateSel(this.menuList.selectedIndex)
	}

	private _UpdateSel(index: number): void {
		if (this.m_CurIndex == index) {
			return
		}
		this.list.selectedIndex = index
		this.m_CurIndex = MathUtils.Clamp(index, 0, this.GetDataList().length - 1)
		this.UpdateContent()
	}

	private _DoUpdate(): void {
		let info = this.GetCurInfo()
		if (info == null) {
			return
		}
		if (GodPieModel.IsFinish(info)) {
			this.date.text = '活动结束'
		} else {
			this.date.text = DateUtils.format_5((info.config.endTime - GameServer.serverTime) * 1000, 4)
		}
		this.desc.textFlow = TextFlowMaker.generateTextFlow(info.config.content)
	}

	private _UpdateListContent(info: Sproto.sc_rechargew_shit_request): void {
		// showType
		let list = []
		for (let i = 0, len = info.config.awards.length; i < len; ++i) {
			list.push({index: i, info: info})
		}
		let getWeight = function (config) {
			if (GodPieModel.GetInfoStateByIndex(config.info, config.index) == RewardState.Gotten)
				return config.index + 10000

			return config.index
		}
		list.sort(function(lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})
		this.list2.dataProvider = new eui.ArrayCollection(list)
	}

	private _ShowGroupType(type: number): void {
		this.listGroup.visible = type == 1
		this.activityGroup.visible = !this.listGroup.visible
	}

	public static BuyData(info: Sproto.sc_rechargew_shit_request, index: number): void {
		if (GodPieModel.IsFinish(info)) {
			UserTips.InfoTip("活动结束")
			return
		}

		if (info.config.condType == GodPieCondType.TYPE_03 && info.info.steps[index] < info.config.targets[index]) {
			RechargeWin.Open()
			return
		}

		let conditionStr = ""
		if ((info.config.condType == 1 || info.config.condType == 2) && info.info.step < info.config.targets[index]) {
			UserTips.ErrorTip("条件不满足")
			return
		}

		if (info.config.gtype == 2) {
			if (Checker.Money(MoneyConst.yuanbao, info.config.prices[index] || 0)) {
				GameGlobal.GodPieModel.Sendbuy(info.config.payType, info.config.gid, index + 1)
			}
		} else {
			GameGlobal.GodPieModel.Sendbuy(info.config.payType, info.config.gid, index + 1)
		}
	}

	public static ShowTargetData(contion: eui.Label, consumeLabel: eui.Label, list: eui.List, buyGroup: eui.Group, geted: eui.Image, send: eui.Button, info: Sproto.sc_rechargew_shit_request, pageIndex: number): void {
		let conditionStr = ""
		if (info.config.condType != 0) {
			let targetValue = info.config.targets[pageIndex]
			if (targetValue) {
				let str = info.info.step + "/" + targetValue
				if (info.config.condType == 1) {
					conditionStr = "需充值（" + str + "）金额"
				} else if (info.config.condType == 2) {
					conditionStr = "需消费（" + str + "）元宝"
				} else if (info.config.condType == GodPieCondType.TYPE_03) {
					let str = GodPieModel.GetBuyCountStr(info, pageIndex)
					conditionStr = `单笔充值${targetValue}元档位即可获得` + `${str}`
				}
			}
		}

		contion.text = conditionStr
		UIHelper.SetVisible(contion, conditionStr.length > 0)
		var award = info.config.awards[pageIndex]
		list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(award.items))

		buyGroup.visible = info.config.endTime - GameServer.serverTime >= 0
		let rewardState = GodPieModel.GetInfoStateByIndex(info, pageIndex)
		geted.visible = rewardState == RewardState.Gotten
		buyGroup.visible = rewardState != RewardState.Gotten

		let showRedFlag = info.config.condType == GodPieCondType.TYPE_03 && info.info.steps[pageIndex] >= info.config.targets[pageIndex]
		UIHelper.ShowRedPoint(send, showRedFlag)

		let consume = info.config.prices[pageIndex] || 0
		UIHelper.SetVisible(consumeLabel, consume > 1)
		if (consume > 1) {
			if (info.config.gtype == 1) {
				consumeLabel.text = consume + "元购买"
			} else if (info.config.gtype == 2) {
				consumeLabel.text = consume + "元宝购买"
			}
		}

		if (info.config.condType != GodPieCondType.TYPE_03 && consumeLabel.visible) {
			consumeLabel.text += GodPieModel.GetBuyCountStr(info, pageIndex)
		}

		if (info.config.condType == GodPieCondType.TYPE_03) {
			send.label = info.info.steps[pageIndex] < info.config.targets[pageIndex] ? "前往充值" : "领取"
		} else {
			send.label = consumeLabel.visible ? "购买" : "获取"
		}
	}

	private UpdateContent(): void {
		let info = this.GetDataList()[this.m_CurIndex]
		if (info == null) {
			this.listGroup.visible = false
			this.activityGroup.visible = false
			return
		}

		this._DoUpdate()
		this._ShowGroupType(info.config.showType)
		if (info.config.showType == 1) {
			this._UpdateListContent(info)
			return
		}
		let pageIndex = GodPieModel.GetInfoIndex(info)

		GodPieWin.ShowTargetData(this.contion, this.consumeLabel, this.list, this.buyGroup, this.geted, this.btnSend, info, pageIndex)
	}

	private GetCurInfo(): Sproto.sc_rechargew_shit_request {
		return this.GetDataList()[this.m_CurIndex]
	}
}

class GodPieItem extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GodBtnSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	protected icon: eui.Image;
	protected redPoint: eui.Image;
	////////////////////////////////////////////////////////////////////////////////////////////////////

	dataChanged() {
		let data = this.data as Sproto.sc_rechargew_shit_request
		// this.nameLabel.textFlow = TextFlowMaker.generateTextFlow(data.config.headtext)
		// this.icon.source = GodPieModel.GODPIE_ICONLIST[this.itemIndex % GodPieModel.GODPIE_ICONLIST.length]

		this.redPoint.visible = GodPieModel.GetInfoStateByIndex(data, GodPieModel.GetInfoIndex(data)) == RewardState.CanGet
	}

	// public UpdateSel(index: number): void {
	// 	this.selectIcon.visible = this.itemIndex == index
	// }
}