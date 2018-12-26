class GangProtectorAwardPanel extends BaseView implements ICommonWindowTitle {
	public static NAME = "每日奖励"

    /////////////////////////////////////////////////////////////////////////////
    // GangJuanXianListSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected awardList: eui.List;
    protected addPowerGroup: eui.Group;
    protected lbAlert0: eui.Label;
    protected get_txt1: GetwayLabel;
    protected get_txt2: GetwayLabel;
    /////////////////////////////////////////////////////////////////////////////


	private defendInfo:GangProtectorInfo = new GangProtectorInfo();
	public constructor() {
		super() 	
	}

	public childrenCreated() {
		this.awardList.itemRenderer = GangPAwardItem
		this.awardList.dataProvider = new eui.ArrayCollection([])
	}

	public OnOpen(...args) {
		this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO,this.upDataProtectorInfo)
		GameGlobal.GangModel.sendGetProtectorInfo();
		
	}
	private upDataProtectorInfo(rsp)
    {
        this.defendInfo = GameGlobal.GangModel.protectorInfo
        this.UpdateContent();
    }
	UpdateContent() {
		let itemLists = [];
		let config = GameGlobal.Config.GuildEverydayConfig;
		let rewardMarks = []
		if (!this.defendInfo) {
			return
		}
		if(this.defendInfo.rewardMark != null){
			rewardMarks = CommonUtils.uintToVecBool(this.defendInfo.rewardMark,32);
		}
		let awardIndex = 0
		for(let key in config)
		{
			let hasGet = false;
			if(awardIndex < rewardMarks.length){
				hasGet = rewardMarks[awardIndex];
			}
			itemLists.push({"id":config[key].id,"exp":config[key].exp,"reward":config[key].reward,"curExp":this.defendInfo.todayActive,"hasGet":hasGet})
			awardIndex ++;
		}

		let getWeight = function (config) {
			let confId = config.id
			if (!config.hasGet)
				return confId + 1000

			return confId
		}
		itemLists.sort(function (lhs, rhs) {
			return getWeight(lhs) - getWeight(rhs)
		})

		this.awardList.dataProvider = new eui.ArrayCollection(itemLists)
	}

	public OnClose() {
		
	}
}

class GangPAwardItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // GangProtectorAwarkListItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected desc_label: eui.Label;
    protected btnApply: eui.Button;
    /////////////////////////////////////////////////////////////////////////////


	public childrenCreated() {
		this.list.itemRenderer = ItemBase;
		this.list.dataProvider = new eui.ArrayCollection([])
		this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		let rewards = this.data.reward;
		(this.list.dataProvider as eui.ArrayCollection).replaceAll(rewards)
		for(var i = 0;i < this.list.numElements;i ++){
			(this.list.getVirtualElementAt(i) as ItemBase).isShowName(false);
		}
		let color = this.data.curExp >= this.data.exp ? Color.l_green_1 : Color.Red
		let text = `今日活跃点达到${this.data.exp} (|C:${color}&T:${this.data.curExp}|/${this.data.exp})`
		this.desc_label.textFlow = TextFlowMaker.generateTextFlow(text)
		if (this.data.curExp >= this.data.exp)
		{
			this.btnApply.enabled = this.data.hasGet
			this.btnApply.label = this.data.hasGet ? "领 取" : "已领取"
		}
		else
		{
			this.btnApply.enabled = false
			this.btnApply.label = "未达成"
		}
	}

	private _OnBtnClick(e: egret.TouchEvent) 
	{
		if(this.data.exp <= this.data.curExp){
			GameGlobal.GangModel.sendGetProtectorEveryDataAward(this.data.id)
		}else{
			UserTips.ins().showTips("活跃点还没达到")
		}
	}
	$onRemoveFromStage(): void{
		super.$onRemoveFromStage();

        if(this.btnApply) this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP,this._OnBtnClick,this)
	}
}