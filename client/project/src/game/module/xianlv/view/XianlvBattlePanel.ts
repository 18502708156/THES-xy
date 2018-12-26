class XianlvBattlePanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // XianlvBattleSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected head1: eui.Component;
    protected btn1: eui.Button;
    protected head2: eui.Component;
    protected btn2: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private m_SelXianlvId: number

	public constructor() {
		super()
		this.skinName = "XianlvBattleSkin"
		this._AddClick(this.btn1, this._OnClick)
		this._AddClick(this.btn2, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.m_SelXianlvId = param[0]
		this.commonDialog.OnAdded(this)
		this.UpdateContent()
	}

	public OnClose() {

	}

	private _OnClick(e: egret.TouchEvent) {
		let index = 0
		switch (e.currentTarget) {
			case this.btn1:
				index = 0
			break
			case this.btn2:
				index = 1
			break
		}
		GameGlobal.XianlvModel.SendBattle(this.m_SelXianlvId, index)
		this.CloseSelf()
	}

	private UpdateContent() {
		let model = GameGlobal.XianlvModel
		for (let i = 0; i < 2; i++) {
			let head = this["head" + (i + 1)]
			let id = model.mBattleList[i]
			if (id) {
				head.visible = true
				XianlvHeadItem.SetContentByInfo(head, model.GetXianlvInfo(id))
			} else {
				head.visible = false
			}
		}
	}
}