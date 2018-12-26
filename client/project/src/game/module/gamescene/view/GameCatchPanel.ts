class GameCatchPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_BATTLE
    public static VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM
	
	/////////////////////////////////////////////////////////////////////////////
    // GameCatchSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected groupAdaptation: eui.Group;
    protected catchPet: eui.Button;
    /////////////////////////////////////////////////////////////////////////////
 
	public constructor() {
		super()
		this.skinName = "GameCatchSkin"
	}

	public OnOpen() {
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos)
		this.AddClick(this.catchPet, this._OnClick)
		this._UpdatePos()
	}

	private _UpdatePos() {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation)
	}
	
	private _OnClick() {
		GameGlobal.CatchPetModel.SendPetCatch()
	}

	public Catch() {
		this.catchPet.visible = false
	}
}