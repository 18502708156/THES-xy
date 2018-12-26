class CustomServicePanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "意见反馈"

	defaultText = "点击输入咨询内容"
	/////////////////////////////////////////////////////////////////////////////
    // CustomServicePanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected sendBtn: eui.Button;
    protected qqLabel: eui.Label;
    protected input: eui.TextInput;
    /////////////////////////////////////////////////////////////////////////////

	private static QQ_STR = null

	public constructor() {
		super()

		this.skinName = "CustomServicePanelSkin"

		if (CustomServicePanel.QQ_STR == null) {
			GameSocket.ins().Rpc(C2sProtocol.cs_get_kefu_qq, null, this._DoUpdateQQStr, this)
		}
	}

	private _DoUpdateQQStr(rsp: Sproto.cs_get_kefu_qq_response): void {
		CustomServicePanel.QQ_STR = rsp.qq
		this._UpateQQLabel()
	}

	private _UpateQQLabel() {
		if (this.qqLabel == null) {
			return
		}
		let qq = CustomServicePanel.QQ_STR
		if (StringUtils.IsNullOrEmpty(qq)) {
			this.qqLabel.text = ""
		} else {
			this.qqLabel.text = "客服QQ：" + qq
		}
	}

	childrenCreated() {
		this._SetShowState(0)
	}

	private _SetShowState(state: number): void {
		let canInput = state == 0
		this.qqLabel.visible = canInput
		this.sendBtn.visible = canInput
		this.input.visible = canInput
	}

	OnOpen() {
		this._UpateQQLabel()
		this.AddClick(this.sendBtn, this.OnClick)
	}

	private OnClick(t) {
		if (0 == this.input.text.length || this.input.text == this.defaultText) {
			UserTips.ins().showTips("内容不能为空")
			return
		}
		let text = this.input.text
		this.input.text = ""

		let req = new Sproto.cs_send_kefu_msg_request
		req.msg = text
		GameSocket.ins().Rpc(C2sProtocol.cs_send_kefu_msg, req)
		UserTips.ins().showTips("发送成功")

		// this.SendMsg(text)
	}

	// private SendMsg(text) {
	// 	var request = new egret.HttpRequest();
    //     request.responseType = egret.HttpResponseType.TEXT
    //     request.open("http://api.zzby.mjh5.com/leniu/kf_info", egret.HttpMethod.POST);
	// 	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //     request.send(`platformid=${WindowData._GetPlatformId()}&serverid=${Main.Instance.mConnectServerData.id}&account=${GameGlobal.actorModel.actorID}&content=${text}`)

    //     request.addEventListener(egret.Event.COMPLETE, this._Complete, this);
	// 	request.addEventListener(egret.IOErrorEvent.IO_ERROR, this._Error, this);
	// }

	private _Complete(event) {
		var request = <egret.HttpRequest>event.currentTarget;
		console.log(request.response)
	}

	private _Error(event) {
		console.log("event error")
	}

	UpdateContent(): void {

	}
}