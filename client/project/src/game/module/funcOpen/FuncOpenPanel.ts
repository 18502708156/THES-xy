// class FuncOpenPanel extends BaseEuiView {
// 	public static LAYER_LEVEL = LayerManager.UI_Main_2

// 	public static ICON_LIST = [
// 		"ui_gnyg_icon_boss",
// 		"ui_gnyg_icon_pf",
// 		"ui_gnyg_icon_sw",
// 		"ui_gnyg_icon_bltx",
// 		"ui_gnyg_icon_bsfb",
// 		"ui_gnyg_icon_jmfb",
// 		"ui_gnyg_icon_ypfb",
// 		"ui_gnyg_icon_zjt",
// 		"ui_gnyg_icon_jyy",
// 		"ui_gnyg_icon_bh",
// 	]


// 	private static ICON_LIST2 = [
// 		"ui_cszl_zi4",
// 		"ui_cszl_zi5",
// 		"ui_cszl_zi6",
// 		"ui_cszl_zi7",
// 		"ui_cszl_zi8",
// 		"ui_cszl_zi9",
// 		"ui_cszl_zi10",
// 		"ui_cszl_zi11",
// 		"ui_cszl_zi12",
// 		"ui_cszl_zi13",
// 	]

// 	private static LABEL_LIST = [
// 		"挑战个人BOSS获得橙色武器！\n战力大幅度提升！",
// 		"披风全面提升攻、防、血三大属性！\n可不仅仅是炫酷！",
// 		"提升声望，威慑四方\n被声望值低于自身的玩家攻击时伤害减少7%",
// 		"兵行天下 立国安邦\n更可获得兵法全面提升战斗力！",
// 		"挑战宝石副本获得珍贵宝石碎片\n宝石碎片可让装备属性全面升华",
// 		"挑战经脉副本获得珍贵经脉丹\n全面提升攻、防、血三大属性",
// 		"玉佩增加攻和防属性\n顶极玉佩进可攻、退可守，PK刷怪全程无忧",
// 		"挑战斩将台\n快速提高声望值，威慑对手，强力减伤",
// 		"超级经验玉 打怪存经验\n使用即可获得少量经验 升级无忧",
// 		"了却君王事 深藏功与名\n激情帮会战猎宫争霸 天下门客谁敌手",
// 	]

// 	private commonWindowBg: CommonWindowBg
// 	private iconList: eui.List
// 	private rightBtn: eui.Button
// 	private leftBtn: eui.Button
// 	private icon: eui.Image
// 	private labelIcon: eui.Image
// 	private item: ItemBase
// 	private label: eui.Label
// 	private button: eui.Button
// 	private getLabel: eui.Image
// 	private yunbaoLabel: eui.BitmapLabel
// 	private label2: eui.Label

// 	private m_List: any[] = []

// 	public constructor() {
// 		super()
// 		this.skinName = "FuncOpenSkin"
// 		this.iconList.itemRenderer = FuncOpenItem
// 	}

// 	public open() {
// 		this.commonWindowBg.OnAdded(this)
// 		let config = GameGlobal.Config.FuncNoticeConfig
// 		let list = []
// 		for (let i = 0, datas = FuncOpenPanel.ICON_LIST; i < FuncOpenModel.MAX; ++i) {
// 			list.push({ icon: datas[i], data: config[i + 1] })
// 		}
// 		this.iconList.dataProvider = new eui.ArrayCollection(list)
// 		this.m_List = list

// 		this.AddClick(this.leftBtn, this._OnClick)
// 		this.AddClick(this.rightBtn, this._OnClick)
// 		this.AddClick(this.button, this._OnClick)
// 		this.observe(MessageDef.FUNC_OPEN_UPDATE, this.UpdateContent)

// 		this.iconList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTap, this)
// 		this.AutoSelect()
// 	}

// 	public close() {
// 		this.commonWindowBg.OnRemoved()
// 		this.iconList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTap, this)
// 	}

// 	private _OnTap(e: eui.ItemTapEvent) {
// 		this._OnSelect(e.itemIndex)
// 	}

// 	private _OnClick(e: egret.TouchEvent) {
// 		let itemWidth = 80
// 		var t = 4 * itemWidth
// 		switch (e.target) {
// 			case this.leftBtn:
// 				this.iconList.scrollH <= t ? this.iconList.scrollH = 0 : this.iconList.scrollH -= t;
// 				break
// 			case this.rightBtn:
// 				this.iconList.scrollH > (this.iconList.dataProvider.length - 8) * itemWidth + 2 ? this.iconList.scrollH = (this.iconList.dataProvider.length - 4) * itemWidth + 2 : this.iconList.scrollH += t;
// 				break
// 			case this.button:
// 				let data = this.m_List[this.iconList.selectedIndex]
// 				if (FuncOpenModel.Check(data.data.openLv[0], data.data.openLv[1])) {
// 					FuncOpenModel.ins().SendGetFuncOpen(this.iconList.selectedIndex + 1)
// 				} else {
// 					UserTips.ins().showTips("不可领取")
// 				}
// 				break
// 		}
// 	}

// 	private _OnSelect(index: number): void {
// 		let data = this.m_List[index]
// 		this.icon.source = data.icon
// 		this.item.data = RewardData.ToRewardData(data.data.reward[0])
// 		this.item.isShowName(false)
// 		this.labelIcon.source = FuncOpenPanel.ICON_LIST2[index]
// 		this.label2.text = FuncOpenPanel.LABEL_LIST[index]
// 		this.label.text = FuncOpenModel.GetTipStr2(data.data.openLv[0], data.data.openLv[1])
// 		this.yunbaoLabel.text = data.data.showValue

// 		let rewardIndex = index + 1
// 		let state = FuncOpenModel.ins().GetRewardState(rewardIndex)

// 		this.getLabel.visible = state == RewardState.Gotten
// 		this.button.visible = state != RewardState.Gotten
// 		this.button.enabled = state == RewardState.CanGet
// 		UIHelper.SetBtnNormalEffe(this.button, state == RewardState.CanGet)
// 	}

// 	private UpdateContent() {
// 		this.AutoSelect()
// 		for (let i = 0; i < this.iconList.numChildren; ++i) {
// 			let child = this.iconList.getChildAt(i)
// 			if (child && child["updateRedPoint"]) {
// 				child["updateRedPoint"]()
// 			}
// 		}
// 	}

// 	private AutoSelect() {
// 		let index = FuncOpenModel.ins().GetCurCanRewardIndex()
// 		if (index == -1) {
// 			index = FuncOpenModel.ins().GetNextIndex()
// 		}
// 		if (index == -1) {
// 			this.iconList.selectedIndex = 0
// 			this._OnSelect(0)
// 		} else {
// 			this.iconList.selectedIndex = index - 1
// 			this._OnSelect(index - 1)
// 		}
// 		this._UpdateLocation()
// 	}

// 	private _UpdateLocation() {
// 		this.iconList.validateNow()
// 		UIHelper.SetScrollHIndex(this.iconList, this.iconList.selectedIndex)
// 	}
// }

// class FuncOpenItem extends eui.ItemRenderer {

// 	private iconDisplay: eui.Image
// 	private redPoint: eui.Image

// 	childrenCreated() {

// 	}

// 	dataChanged() {
// 		this.iconDisplay.source = this.data.icon
// 		this.updateRedPoint()
// 	}

// 	updateRedPoint() {
// 		this.redPoint.visible = FuncOpenModel.ins().CanReward(this.data.data.index)
// 	}
// }