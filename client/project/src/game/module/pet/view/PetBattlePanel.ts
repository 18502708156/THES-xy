class PetBattlePanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
    // PetBattleSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected head1: eui.Component;
    protected btn1: eui.Button;
    protected head2: eui.Component;
    protected btn2: eui.Button;
    protected head3: eui.Component;
    protected btn3: eui.Button;
    protected head4: eui.Component;
    protected btn4: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private m_SelPetId: number

	public constructor() {
		super()
		this.skinName = "PetBattleSkin"
		this._AddClick(this.btn1, this._OnClick)
		this._AddClick(this.btn2, this._OnClick)
		this._AddClick(this.btn3, this._OnClick)
		this._AddClick(this.btn4, this._OnClick)
	}

	public OnOpen(...param: any[]) {
		this.m_SelPetId = param[0]
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
			case this.btn3:
				index = 2
			break
			case this.btn4:
				index = 3
			break
		}
		GameGlobal.PetModel.SendBattle(this.m_SelPetId, index)
		this.CloseSelf()
	}

	private UpdateContent() {
		let model = GameGlobal.PetModel
		for (let i = 0; i < 4; i++) {
			let head = this["head" + (i + 1)]
			let id = model.mBattleList[i]
			if (id) {
				head.visible = true
				PetHeadItem.SetContentByInfo(head, model.GetPetInfo(id))
			} else {
				head.visible = false
			}
		}
	}
}