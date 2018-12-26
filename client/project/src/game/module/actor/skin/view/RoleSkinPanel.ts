/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 21:15
 * @meaning: 时装界面
 * 
 **/
class RoleSkinPanel extends BaseEuiView implements ICommonWindow {

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


	
	protected groupItem :eui.Group;//激活所需内容
    protected gaoupHave :eui.Group;//已经有称号
    protected imgHave: eui.Image; //以幻化
    protected changeBtn: eui.Button;//改变按钮

    protected timeGroup: eui.Group;
    protected timeLabel: eui.Label;

		
	private roleShowPanel: RoleShowPanel
    
    /////////////////////////////////////////////////////////////////////////////

	private listCtrl: ListLRBtnCtrl

	public mModel: UserSkin
	private mList: any[] = []

	public constructor() {
		super()
		this.skinName = "RideDressSkin"
		this.list.itemRenderer = RoleSkinDressItem
		this.listCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 109)
		this._AddItemClick(this.list, this._OnItemClick)
		this._AddClick(this.activeBtn, this._OnClick)
		// this._AddClick(this.powerLabel, this.onInfoClick)
		this._AddClick(this.getLabel, this.onGuide)

		this._AddClick(this.changeBtn, this._OnChange)

        
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
        this.commonWindowBg.SetTitle("时装")
		this.commonWindowBg.OnAdded(this)
		this.UpdateList()
		this.list.selectedIndex = 0
		this.listCtrl.OnRefresh();
		this.UpdateContent()

		this.AddLoopTimer(1000, this.UpdateTimeGroup)
	}

	/**获取角色的对应类型皮肤ID*/
	private getSkinId(): number {
		let role = SubRoles.ins().GetRoleData();
		let skinid = role.mRideId;
		return skinid;
	}

	private UpdateList() {
		this.mList = CommonUtils.copyDataHandler(this.mModel.GetSkinConfig())
		let weight = (data) => {
			let config = data[GameGlobal.actorModel.sex];
			let skinid = config.skinid
			let cur = GameGlobal.UserBag.GetCount(config.itemid.id) ||0
			if(cur>0)
			{
				return 0;
			}
			else
			{
				if (this.mModel.HasDress(config.skinid)) {
					return 1;
				}
				else {
					return 2;
				}
			}
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
		let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex]
		this.mModel.SendActiveDress(config.skinid)
	}


	//改变时装
	private _OnChange() {
		let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex]
		this.mModel.changDress(config.skinid)
	}

	//跳转引导
	private onGuide() {
		let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex]
		if(config&&config.itemid.id)
		GainItemConfig.Guide(config.itemid.id)
	}


	private _OnItemClick(e: eui.ItemTapEvent) {
		this.UpdateContent()
	}

    // private onInfoClick(e: eui.ItemTapEvent) {
	// 	//详情
    //     let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
    //      ViewManager.ins().open(RoleTemplateAttrPanel, this.mModel, this.name,config.pid,config.attrpower )
	// }

	private UpdateContent() {
		UIHelper.ListRefresh(this.list)
		let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
		let itemConfig = GameGlobal.Config.ItemConfig[config.itemid.id]
		this.item.setItemData(config.itemid)
		this.item.isShowName(false)
		let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
		let need = config.itemid.count
		if (itemConfig) {
			this.nameLabel.text = itemConfig.name + `(${cur}/${need})`
		}
		this.activeBtn.visible = !this.mModel.HasDress(config.skinid) && cur >= need
		this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0)
		this.attrLabel.textColor = this.mModel.HasDress(config.skinid) ? Color.l_green_1 : Color.l_gray
        this.allPowerLabel.text = "时装总战力：" + this.mModel.GetDressPower()

		this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount()

		//模型
		var skinConfig = GameGlobal.Config.RideSkinConfig[this.getSkinId()];

		let showData = new RoleShowData
		showData.job = GameGlobal.actorModel.job
		showData.sex = GameGlobal.actorModel.sex
		showData.clothID = config.pid
		showData.rideId = skinConfig ? skinConfig.pid : 0
		this.roleShowPanel.SetAll(showData)


        //途径还没有
        this.getLabel.text = ""

		this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower)

		this.timeGroup.visible = false
		//显示激活
		let data = this.mModel.GetDressData(config.skinid)
		this.mDressData = data

		//显示激活
		if(!this.mModel.HasDress(config.skinid))
		{
			this.groupItem.visible = true;//激活所需内容
			this.gaoupHave.visible = false;//已经有称号
			UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id))	
		}
		else
		{
			this.groupItem.visible = false;//激活所需内容
			this.gaoupHave.visible = true;//已经有称号
			if(this.mModel.getWearId() ===config.skinid)//已经穿上
			{
				this.changeBtn.visible = false
				this.imgHave.visible = true 
			}
			else
			{
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

	public static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_33);
	}

}
class RoleSkinDressItem extends eui.ItemRenderer {
	/////////////////////////////////////////////////////////////////////////////
    // RideDressItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected stateImg: eui.Image;
    protected nameLabel: eui.Label;
	protected imgRed: eui.Image;

    /////////////////////////////////////////////////////////////////////////////


	public dataChanged() {
		let config = this.data[GameGlobal.actorModel.sex];
		this.nameLabel.text = config.name
		let panel = this.parent.parent.parent as RoleSkinPanel
		let  bDress = panel.mModel.HasDress(config.skinid)
		this.stateImg.source = bDress? "ui_yuan" : "ui_yuan_quse"
		let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
		if((!bDress)&&cur)
		{
			this.imgRed.visible = true
		}
		else
		{
			this.imgRed.visible = false
		}
	}
}