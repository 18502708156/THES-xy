/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 21:15
 * @meaning: 称号界面
 * 
 **/
class RoleTitlePanel extends BaseEuiView implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// RideDressSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected powerLabel: PowerLabel;
	protected list: eui.List;
	protected leftBtn: eui.Button;
	protected rightBtn: eui.Button;
	protected activeBtn: eui.Button;
	protected allPowerLabel: eui.Label;
	protected nameLabel: eui.Label;
	protected getLabel: eui.Label;
	protected activeCountLabel: eui.Label;
	protected attrLabel: eui.Label;
	protected item: ItemBase;
	protected imgInfo: eui.Image;
	protected groupItem: eui.Group;//激活所需内容
	protected gaoupHave: eui.Group;//已经有称号
	protected imgHave: eui.Image; //以幻化
	protected changeBtn: eui.Button;//改变按钮
	protected imgStyle: eui.Image;//称号形象

    protected timeGroup: eui.Group;
    protected timeLabel: eui.Label;



	showPanel: PetShowPanel
	/////////////////////////////////////////////////////////////////////////////

	private listCtrl: ListLRBtnCtrl

	public mModel: UserTitle
	private mList: any[] = []

	public constructor() {
		super()
		this.skinName = "RideDressSkin"
		this.list.itemRenderer = RoleTitleDressItem
		this.listCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 109)
		this._AddItemClick(this.list, this._OnItemClick)
		this._AddClick(this.activeBtn, this._OnClick)
		// this._AddClick(this.powerLabel, this.onInfoClick)
		this._AddClick(this.changeBtn, this._OnChange)
		this._AddClick(this.getLabel, this.onGuide)


	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
		this.commonWindowBg.SetTitle("称号")
		this.commonWindowBg.OnAdded(this)
		this.UpdateList()
		this.list.selectedIndex = 0
		this.UpdateContent()

		this.AddLoopTimer(1000, this.UpdateTimeGroup)
	}

	private UpdateList() {
		let skinConfigList = this.mModel.GetSkinConfig()
		for (let config of skinConfigList) {
			if (config.show == 1)
				this.mList.push(config)
		}

		let weight = (config) => {
			if (!config.hasOwnProperty("itemid"))
				return

			if (this.mModel.HasDress(config.skinid))
				return config.skinid - 1000

			if (GameGlobal.UserBag.GetCount(config.itemid.id) > 0)
				return config.skinid - 10000

			return config.skinid
		}

		this.mList.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})

		this.list.dataProvider = new eui.ArrayCollection(this.mList)
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick() {
		let config = this.mList[this.list.selectedIndex]
		this.mModel.SendActiveDress(config.skinid)
	}



	//改变称号
	private _OnChange() {
		let config = this.mList[this.list.selectedIndex]
		this.mModel.changDress(config.skinid)
	}

	//跳转引导
	private onGuide() {
		let config = this.mList[this.list.selectedIndex]
		if (config && config.itemid.id)
			GainItemConfig.Guide(config.itemid.id)
	}



	private _OnItemClick(e: eui.ItemTapEvent) {
		this.UpdateContent()
	}




	private UpdateContent() {
		let redList = []
		for (let config of this.mList) {
			let bDress = this.mModel.HasDress(config.skinid)
			let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
			let red = false
			if ((!bDress) && cur) {
				red = true
			}
			redList.push(red)
			config.__redPoint__ = red
		}
		this.listCtrl.SetRedPointList(redList)
		this.listCtrl.OnRefresh()
		UIHelper.ListRefresh(this.list)
		let config = this.mList[this.list.selectedIndex]
		let itemConfig = GameGlobal.Config.ItemConfig[config.itemid.id]
		this.item.setItemData(config.itemid)
		this.item.isShowName(false)
		let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
		let need = config.itemid.count
		if (itemConfig) {
			this.nameLabel.text = itemConfig.name + `(${cur}/${need})`
		}
		this.activeBtn.visible = !this.mModel.HasDress(config.skinid) && cur >= need

		//this.changeTitle();
		this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0)
		this.changeTitle();
		this.attrLabel.textColor = this.mModel.HasDress(config.skinid) ? Color.l_green_1 : Color.l_gray
		this.allPowerLabel.text = "称号总战力：" + this.mModel.GetDressPower()

		this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount()

		// this.showPanel.SetBody(AppearanceConfig.GetPath(config.pid))
		this.imgStyle.source = config.icon
		this.imgStyle.scaleX = 1.5
		this.imgStyle.scaleY = 1.5

		//途径还没有
		this.getLabel.text = ""

		this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower)

		this.timeGroup.visible = false

		//显示激活
		let data = this.mModel.GetDressData(config.skinid)
		this.mDressData = data

		if (!data) {
			this.groupItem.visible = true;//激活所需内容
			this.gaoupHave.visible = false;//已经有称号
			if (GainItemConfig.GetGainName(config.itemid.id) == "运营活动") {          //大概是零时屏蔽运营活动 下划线
				this.getLabel.text = GainItemConfig.GetGainName(config.itemid.id)
			} else {
				UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id))
			}
		}
		else {
			this.groupItem.visible = false;//激活所需内容
			this.gaoupHave.visible = true;//已经有称号
			if (this.mModel.getWearId() === config.skinid)//已经穿上
			{
				this.changeBtn.visible = false
				this.imgHave.visible = true
			}
			else {
				this.changeBtn.visible = true
				this.imgHave.visible = false
			}

			this.UpdateTimeGroup()
		}
	}

	private mDressData: Sproto.effect_item

	private UpdateTimeGroup() {
		if (this.mDressData && this.mDressData.term) {
			this.timeGroup.visible = true	
			let time = this.mDressData.term - GameServer.serverTime
			if (time > 0) {
				this.timeLabel.text = DateUtils.format_1(time * 1000)
			}else {
				this.timeLabel.text = "已过期"
			}
		} else {
			this.timeGroup.visible = false
		}
	}

	//改變稱號文本
	private changeTitle(): void {
		let config = this.mList[this.list.selectedIndex];
		let tID = config.skinid;
		let config2 = GameGlobal.Config.TitleAttrConf;
		//this.attrLabel.text="";
		if (config2[tID] != undefined) {
			let pow = config2[tID].attrpower;
			let str = config2[tID].des;
			this.attrLabel.text += "\n" + str + "+" + pow + "%";
			this.attrLabel.textAlign = "left";
		}
		else {
			let item = config.attrpower;
			this.attrLabel.textAlign = "left";
			this.attrLabel.text = AttributeData.getAttStr(item, 0);
		}
	}

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_34);
	}

}
class RoleTitleDressItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
	// RideDressItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected stateImg: eui.Image;
	protected nameLabel: eui.Label;
	protected imgRed: eui.Image;
	/////////////////////////////////////////////////////////////////////////////

	public dataChanged() {
		let config = this.data
		this.nameLabel.text = config.name
		let panel = this.parent.parent.parent as RoleTitlePanel
		let bDress = panel.mModel.HasDress(config.skinid)
		this.stateImg.source = bDress ? "ui_yuan" : "ui_yuan_quse"
		let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
		this.imgRed.visible = this.data.__redPoint__
	}
}