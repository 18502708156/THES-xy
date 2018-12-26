class GangCreateView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangCreateSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected input: eui.TextInput;
    protected item1: GangCreateItemView;
	protected item2: GangCreateItemView;
	protected btnCreate: eui.Button;
	protected list: eui.List;
	protected labCount: eui.Label;
	protected labTip: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private mChooseIdx: number

	public constructor() {
		super()
		this.skinName = "GangCreateSkin"
		this._AddClick(this.item1, this._OnClick)
		this._AddClick(this.item2, this._OnClick)
		this._AddClick(this.btnCreate, this._OnClick)

		this.list.itemRenderer = ItemBaseNotName
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.GANG_INIT, this.InitGang)
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "创建帮会"
		this.input.textColor = 0x755E4F;
		this.input.text = ""
		UIHelper.SetInputMaxChar(this.input, 12)
		this.item1.SetItemInfo(1)
		this.item2.SetItemInfo(2)
		this.ChooseItem(1)

		let curReceiveCount = GameGlobal.GangModel.receiveCount
		let maxReceiveCount = GameGlobal.Config.GuildConfig.creatrewardcount
		this.item1.SetDoubleImg(curReceiveCount < maxReceiveCount)
		this.item2.SetDoubleImg(curReceiveCount < maxReceiveCount)
		let text = GameGlobal.Config.GuildConfig.des
		this.labTip.text = text.replace("%s", `${maxReceiveCount}`)
		this.labCount.text = `帮会数量：${curReceiveCount}/${maxReceiveCount}`
		this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.GuildConfig.creatreward)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private ChooseItem(idx) {
		this.mChooseIdx = idx
		this.item1.SetChooseInfo(this.mChooseIdx)
		this.item2.SetChooseInfo(this.mChooseIdx)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnCreate:
				let gangName = this.input.text
				if (gangName == "")
				{
					UserTips.ins().showTips("帮会名字不可为空")
					return
				}
				var config = GameGlobal.Config.GuildCreateConfig[this.mChooseIdx]
				var needLv = config.level;
				var needVipLv = config.vipLv;
				if(!Checker.Level(null,needLv)){
					return;
				}
				if(!Checker.VipLevel(needVipLv)){
					return
				}
				if(!Checker.Money(config.cost.id,config.cost.count)){
					return
				}
				GameGlobal.GangModel.SendCreateGang(this.mChooseIdx, gangName)
			break
			case this.item1:
				this.ChooseItem(1)
			break
			case this.item2:
				this.ChooseItem(2)
			break
		}
		
	}

	private InitGang() {
		UserTips.ins().showTips("创建帮会成功")
		ViewManager.ins().close(this)
	}
}