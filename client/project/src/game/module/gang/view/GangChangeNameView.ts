class GangChangeNameView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangChangeNameSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected price: PriceIcon;
    protected input: eui.TextInput;
    protected textDisplay: eui.EditableText;
    protected promptDisplay: eui.Label;
    protected btnRename: eui.Button;
    protected btnCancel: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GangChangeNameSkin"
		this._AddClick(this.btnRename, this._OnClick)
		this._AddClick(this.btnCancel, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.GANG_CHANGE_NAME, this.upDataGangName)
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "帮会改名"
		let myGangInfo = GameGlobal.GangModel.myGangInfo
		this.input.textColor = 0x755E4F;
		
		this.input.text = myGangInfo.mGangName
		this.input.maxChars = 6
		
		var type = GameGlobal.Config.GuildConfig.renamecost.id;
		var count = GameGlobal.Config.GuildConfig.renamecost.count;
		this.price.setType(type)
		this.price.setPrice(count);
	}

	public OnClose() {
		this.removeEvents();
		this.removeObserve();
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnRename:
				this.HandleRename()
			break
			case this.btnCancel:
				ViewManager.ins().close(this)
			break
		}
		
	}

	private HandleRename() {
		let myGangInfo = GameGlobal.GangModel.myGangInfo
		let gangName = this.input.text
		if (gangName == "")
		{
			UserTips.ins().showTips("帮会名字不可为空")
			return
		}
		if (gangName == myGangInfo.mGangName)
		{
			UserTips.ins().showTips("不能与帮会原名相同")
			return
		}
		if (Checker.Money(GameGlobal.Config.GuildConfig.renamecost.id, GameGlobal.Config.GuildConfig.renamecost.count))
		{
			GameGlobal.GangModel.sendChangeName(gangName)
		}
	}

	private upDataGangName() {
		UserTips.ins().showTips("修改帮会名字成功")
		ViewManager.ins().close(this)
	}
}