class ChatInputView extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // ChatInputSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected input: eui.TextInput;
    protected textDisplay: eui.EditableText;
    protected promptDisplay: eui.Label;
    protected biaoQingBtn: eui.Button;
    public sendBtn: eui.Button;
    protected faceGroup: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private m_Callback: Function

	public constructor() {
		super()
		this.skinName = "ChatInputSkin"

		this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnSend, this)
		this.biaoQingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}

	private OnClick() {
		if (this.faceGroup.numChildren > 0) {
			this.faceGroup.removeChildren()
			return
		}
		let comp = new ChatFaceView((id: number) => {
			this.input.text += `[${id}]`
		})
		// let pos = egret.$TempPoint
		// this.biaoQingBtn.parent.localToGlobal(this.biaoQingBtn.x, this.biaoQingBtn.y, pos)
		// this.globalToLocal(pos.x, pos.y, pos)
		// let x = pos.x + (this.biaoQingBtn.width >> 1)
		// let y = pos.y + (this.biaoQingBtn.height >> 1)
		comp.SetPos(0, 0)
		this.faceGroup.addChild(comp)
	}

	public SetCallback(callback: Function) {
		this.m_Callback = callback
	}

	public SetText(val: string) {
		this.input.text = val
	}

	private OnSend() {
		if (this.m_Callback) {
			this.m_Callback(this.input.text)
		}
		// Chat.Send(this.bar.selectedIndex, this.input.text, () => {
		// 	this.input.text = ""
		// })
	}
}