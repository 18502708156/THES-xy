class MailListPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "邮件"


	_mails
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // MailListSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected mailList: eui.List
    protected mailScroller: eui.Scroller
    protected noMailTip: eui.Label
    protected allReceiveBtn: eui.Button
	bgbg
    //protected group: eui.Group
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "MailListSkin"
		this._mails = []
		this.mailList.itemRenderer = MailItem
		// this.mailScroller.viewport = this.mailList
	}

	public OnOpen() {
		this.allReceiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.mailList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMail, this)
		this.observe(MessageDef.MAIL_DATA_CHANGE, this.setMailData)
		this.observe(MessageDef.OPEN_MAIL, this.setOpenMail)
		this.setMailData()
	}

	public OnClose() {
		this.allReceiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.mailList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMail, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.OPEN_MAIL, this.setOpenMail, this)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.allReceiveBtn:
				for (var t: number[] = [], i = MailModel.ins().getMailByReceive(), n = 0; n < i.length; n++) t.push(i[n].handle);
				MailModel.ins().sendGetItem(t)
		}
	}

	onSendMail(e) {
		var t = e.target.parent;
		if (t) {
			var i = t.data;
			i && MailModel.ins().sendMailContentData(i.handle)
		}
	}

	setMailData() {
		var bRead = false
		this._mails = MailModel.ins().mailData
		this.mailList.dataProvider = new eui.ArrayCollection(this._mails)
		// this.allReceiveBtn.visible = Boolean(MailModel.ins().getMailByReceive().length)
		//this.group.visible = Boolean(MailModel.ins().getMailByReceive().length)
		MailModel.ins().mailData.length > 0 && (this.noMailTip.visible = !1)
		if(!(MailModel.ins().mailData.length > 0)){
			this.allReceiveBtn.visible = false
			this.bgbg.visible = false
		}

		for (const index in this._mails) {
			var pMail = this._mails[index]
			if(pMail.receive === 0)
			{
				bRead = true //有未读邮件
				break
			}
		}

		//领取按钮显示
		if(bRead)
		{
			this.allReceiveBtn.visible = true
			this.mailScroller.height = 727
		}
		else
		{
			this.allReceiveBtn.visible = false
			this.mailScroller.height = 840
		}

	}

	setOpenMail(e) {
		for (var t = 0; t < this.mailList.numChildren; t++) {
			var mailItem = this.mailList.getChildAt(t) as MailItem
			if (mailItem.data.handle == e.handle) return void (mailItem.data = e)
		}
	}

	UpdateContent(): void {

	}
}