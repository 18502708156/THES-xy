class PetChangeNamePanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
     
	/////////////////////////////////////////////////////////////////////////////
	// PetRenameSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog
	protected btnRename: eui.Button;
	protected btnCancel: eui.Button;
	protected input: eui.TextInput;
	/////////////////////////////////////////////////////////////////////////////
	protected petId;
	protected text;
	protected callFun;

	private mChooseIdx: number

	public constructor() {
		super()
		this.skinName = "PetRenameSkin"
		// this.groupBg.visible = true
		this._AddClick(this.btnRename, this._OnClick)
		this._AddClick(this.btnCancel, this._OnClick)
		UIHelper.SetInputMaxChar(this.input, 12)
	}
    /**
	 * param[0] 标题字符串 param[1]改名成功消息  param[2]回调函数
	 */
	public OnOpen(...param: any[]) {
		this.observe(param[1], this.upDataGangName)
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)
		this.commonDialog.title = param[0]
		this.input.text = param[2] || ""
		this.callFun = param[3];
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
					UserTips.ins().showTips("宠物名字不可为空")
				}
				else if (roleName == GameGlobal.actorModel.name) {
					UserTips.ins().showTips("不能与原名相同")
				}
				else {
					this.callFun(this.input.text);
				}
				break
			case this.btnCancel:
				ViewManager.ins().close(this)
				break
		}

	}

	private upDataGangName() {
		UserTips.ins().showTips("修改名字成功")
		ViewManager.ins().close(this)
	}
}