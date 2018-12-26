class GangModifyNoticeView extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // GangModifyNoticeSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected btnComfirn: eui.Button;
	protected btnCancel: eui.Button;
	protected labNumTip: eui.Label;
	protected labInput: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private mChooseIdx: number

	public constructor() {
		super()
		this.skinName = "GangModifyNoticeSkin"
		this._AddClick(this.btnComfirn, this._OnClick)
		this._AddClick(this.btnCancel, this._OnClick)
		this.labInput.addEventListener(egret.Event.CHANGE, this._OnChang, this)
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.showReturnBtn(false)

		this.commonDialog.title = "公告"
		this.labInput.type = "input"
		this.labInput.multiline = this.labInput.wordWrap = true
		this.labInput.maxChars = 150
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}

	private _OnChang(e:egret.Event) {
		this.labNumTip.text = `${e.target.text.length}/150`
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnComfirn:
				let text = this.labInput.text
				GameGlobal.GangModel.SendModifyNotice(text)
				ViewManager.ins().close(this)
			break
			case this.btnCancel:
				ViewManager.ins().close(this)
			break
		}
		
	}

	private InitGang() {
		UserTips.ins().showTips("创建帮会成功")
		ViewManager.ins().close(this)
	}
}