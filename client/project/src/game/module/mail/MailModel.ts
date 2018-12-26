class MailModel extends BaseSystem {

	public mailData: MailData[] = []
	public currentMailHandle = 0

	static ins(): MailModel {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_mail_init_info, this.doMailData)
		this.regNetMsg(S2cProtocol.sc_mail_detailed_info, this.doMailDetailedData)
		this.regNetMsg(S2cProtocol.sc_mail_delete, this.doDeleteMail)
		this.regNetMsg(S2cProtocol.sc_mail_update_info, this.doGetItemMail)
		this.regNetMsg(S2cProtocol.sc_mail_add_info, this.doAddMail)
	}


	sendMailContentData(handle: number) {
		let req = new Sproto.cs_mail_get_content_request
		req.handle = handle
		this.Rpc(C2sProtocol.cs_mail_get_content, req)
	}

	sendGetItem(handles: number[]) {
		if (!handles || handles.length == 0) return;
		let req = new Sproto.cs_mail_get_reward_request
		req.handle = handles
		this.Rpc(C2sProtocol.cs_mail_get_reward, req)
	}

	private doMailData(rsp: Sproto.sc_mail_init_info_request) {
		this.mailData = [];
		for (var i = rsp.mailData.length, n = 0; i > n; n++) {
			var r = new MailData;
			r.disposeData(rsp.mailData[n]), this.mailData.push(r)
		}
		this.mailSort(1)
		GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE)
	}

	private doAddMail(rsp: Sproto.sc_mail_add_info_request) {

		this.mailData || (this.mailData = []);
		var r = new MailData;
		r.disposeData(rsp.mailData)
		this.mailData.unshift(r)

		GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE)
	}

	private doMailDetailedData(rsp: Sproto.sc_mail_detailed_info_request) {
		var data = new MailData;
		data.parser(rsp);

		let find = false
		for (let i = 0; i < this.mailData.length; i++)
			if (this.mailData[i].handle == data.handle) {
				this.mailData[i] = data
				find = true
				break
			}
		find && (this.currentMailHandle = data.handle, ViewManager.ins().open(MailDetailedWin), GameGlobal.MessageCenter.dispatch(MessageDef.OPEN_MAIL, data), GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE))
	}

	getMailDataByHandle(e: number): MailData {
		for (var t = 0; t < this.mailData.length; t++)
			if (this.mailData[t].handle == e) return this.mailData[t];
		return null
	}

	private doDeleteMail(e: Sproto.sc_mail_delete_request) {
		if (this.mailData)
			for (var t = 0; t < this.mailData.length; t++)
				if (this.mailData[t].handle == e.handle) {
					GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE)
					return void this.mailData.splice(t, 1)
				}
	}

	getMailByReceive(e = 0): MailData[] {
		var t = [];
		if (this.mailData.length > 0)
			for (var i = this.mailData.length - 1; i >= 0; i--) this.mailData[i].receive == e && t.push(this.mailData[i]);
		return t
	}

	getUnreadMail(): boolean {
		if (this.mailData.length > 0) {
			for (var t = this.mailData.length - 1; t >= 0; t--) {
				if (0 == this.mailData[t].type || 0 == this.mailData[t].receive) {
					return true
				}
			}
		}
		return false
	}

	getCurrentMail() {
		return this.getMailDataByHandle(this.currentMailHandle)
	}

	private doGetItemMail(e: Sproto.sc_mail_update_info_request) {
		for (var t = e.updateData.length, i = 0; t > i; i++) {
			var data = e.updateData[i]
			for (var n = data.handle, r = 0; r < this.mailData.length; r++)
				if (this.mailData[r].handle == n) {
					this.mailData[r].type = data.type, this.mailData[r].receive = data.receive, GameGlobal.MessageCenter.dispatch(MessageDef.OPEN_MAIL, this.mailData[r]);
					break
				}
		}
		if (e.showWarnBagSpace)
			// UserTips.ins().showTips("|C:0xff0000&T:背包空间不足|");
			BagFullTipsPanel.Open();
		GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_GET_ITEM);
		GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_DATA_CHANGE);
	}

	private sort1(e, t) {
		var i = e.times,
			n = t.times;
		return i > n ? -1 : n > i ? 1 : 0
	}
	private sort2(e, t) {
		var i = e.times,
			n = t.times;
		return n > i ? -1 : i > n ? 1 : 0
	}

	private mailSort(e) {
		var t = this.mailData;
		return e ? t.sort(this.sort1) : t.sort(this.sort2), t
	}
}