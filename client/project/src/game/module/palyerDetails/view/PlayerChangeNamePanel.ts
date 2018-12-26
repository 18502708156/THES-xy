class PlayerChangeNamePanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// GangChangeNameSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected groupBg: eui.Image;
	protected price: PriceIcon;
	protected lbname: eui.Label;
	protected lbTips: eui.Label;
	protected input: eui.TextInput;
	protected textDisplay: eui.EditableText;
	protected promptDisplay: eui.Label;
	protected btnRename: eui.Button;
	protected btnCancel: eui.Button;
	protected costTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////




	private mChooseIdx: number

	public constructor() {
		super()
		this.skinName = "PlayerChangeNameSkin"
		// this.groupBg.visible = true
		this._AddClick(this.btnRename, this._OnClick)
		this._AddClick(this.btnCancel, this._OnClick)
		UIHelper.SetInputMaxChar(this.input, 12)
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.PLAYER_CHANGE_NAME, this.upDataGangName)
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = "玩家改名"

		this.price.setPrice(GameGlobal.Config.RoleBaseConfig.changenamecost.count);
		this.price.visible = GameGlobal.PlayerInfoModel.detailsData.renameCount > 0;
		this.costTxt.visible = GameGlobal.PlayerInfoModel.detailsData.renameCount < 1
	}

	public OnClose() {
		this.removeEvents();
		this.removeObserve();
		this.commonDialog.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnRename:
				let roleName = this.input.text
				if (roleName == "") {
					UserTips.ins().showTips("玩家名字不可为空")
				}
				else if (roleName == GameGlobal.actorModel.name) {
					UserTips.ins().showTips("不能与原名相同")
				}
				else if (GameGlobal.PlayerInfoModel.detailsData.renameCount < 1
					||Checker.Money( GameGlobal.Config.RoleBaseConfig.changenamecost.id, GameGlobal.Config.RoleBaseConfig.changenamecost.count)) {

					GameGlobal.PlayerInfoModel.sendChangeName(roleName);
				}
				break
			case this.btnCancel:
				ViewManager.ins().close(this)
				break
		}

	}

	private upDataGangName(req) {
		UserTips.ins().showTips("修改名字成功")
		ViewManager.ins().close(this)
	}
}