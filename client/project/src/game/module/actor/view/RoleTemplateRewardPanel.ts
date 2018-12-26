class RoleTemplateRewardPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////
    // RoleTemplateRewardSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bar: eui.TabBar;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "RoleTemplateRewardSkin"
		this.list.itemRenderer = RoleTemplateRewardItem

		let list = []
		for (let type in GameGlobal.Config.ProgressRewardConfig) {
			list.push({name: ItemConst.TYPE_NAME[UserTemplate.TEMPTYPE_TO_ITEMTYPE[type]], type: type})
		}
		list.sort(function(lhs, rhs) {
			return lhs - rhs
		})
		this.bar.dataProvider = new eui.ArrayCollection(list)
		this.bar.selectedIndex = 0

		this._AddItemClick(this.bar, this._OnItemClick)

	}

	public OnOpen(...param: any[]) {
		this.mCommonWindowBg.OnAdded(this)
		let type = param[0]
		if (type != null) {
			let i = 0
			for (let data of (this.bar.dataProvider as eui.ArrayCollection).source) {
				if (type == data.type)	 {
					this.bar.selectedIndex = i
					break
				}
				++i
			}
		}
		this._UpdateContent()

		this.observe(MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ALL___, this.UpdateList)
	}

	private _OnItemClick(e: eui.ItemTapEvent) {
		this._UpdateContent()
	}

	private _UpdateContent() {
		let item = this.bar.selectedItem
		this.UpdateList()
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.bar)
		this.bar.validateNow()
		for (let i = 0, len = this.bar.dataProvider.length; i < len; i++) {
			let item = this.bar.getChildAt(i);
			UIHelper.ShowRedPoint(item, GameGlobal.SubRoles.mTemplate[this.bar.dataProvider.getItemAt(i).type].mRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD))
		}
		let model = GameGlobal.SubRoles.mTemplate[this.bar.selectedItem.type]
		let list = []
		let datas = GameGlobal.Config.ProgressRewardConfig[this.bar.selectedItem.type]
		for (let data of datas) {
			list.push(data)
		}
		let w = (data) => {
			let state = model.GetRewardState(data.id - 1)
			if (state == RewardState.Gotten) {
				return 10000 + data.id
			}
			if (state == RewardState.CanGet) {
				return -10000 + data.id
			}
			return data.id

		}
		list.sort((lhs, rhs) => {
			return w(lhs) - w(rhs)
		})
		this.list.dataProvider = new eui.ArrayCollection(list)
	}
}

class RoleTemplateRewardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // RoleTemplateRewardItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected title: eui.Label;
    protected goBtn: eui.Button;
    protected list: eui.List;
    protected getImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.list.itemRenderer = ItemBaseEffeNoName
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let config = this.data
		let model: UserTemplate = GameGlobal.SubRoles.mTemplate[config.type]
		model.SendGetReward(config.id)
	}

	public dataChanged() {
		let config = this.data
		this.title.text = ItemConst.TYPE_NAME[UserTemplate.TEMPTYPE_TO_ITEMTYPE[config.type]] + "进阶到" + config.progress + "阶奖励"
		this.list.dataProvider = new eui.ArrayCollection(config.reward)

		let type = (config.type)
		let model: UserTemplate = GameGlobal.SubRoles.mTemplate[type]
		this.goBtn.visible = false
		this.getImg.visible = false
		if (model) {
			let state = model.GetRewardState(config.id - 1)
			this.goBtn.visible = state == RewardState.CanGet
			this.getImg.visible = state == RewardState.Gotten
		}
	}
}
