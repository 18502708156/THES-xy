class MailDetailedWin extends BaseEuiView {
	public constructor() {
		super()
	}

	itemList

	background
	receiveBtn
	textLabel
	desc
	pAddGronp //附件内容

	commonDialog: CommonWindowBg
	initUI () {
		super.initUI()
		this.skinName = "MailContentSkin"
		this.itemList.itemRenderer = ItemBase
	}
	
	OnOpen () {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.observe(MessageDef.MAIL_GET_ITEM, this.setMailData)
		this.observe(MessageDef.MAIL_DATA_CHANGE, this.setMailData)
		this.setMailData()
	    this.commonDialog.OnAdded(this)
	}
	
	OnClose () {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this.commonDialog.OnRemoved()
		this.receiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_GET_ITEM, this.setMailData, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this)
	}
	
	onTap(e) {
		switch (e.currentTarget) {
			case this.receiveBtn:
				var t = [];
				t.push(MailModel.ins().currentMailHandle), MailModel.ins().sendGetItem(t);
		}
	}
	
	otherClose (e) {
		var t = this.background;
		e.localX >= t.x && e.localX <= t.x + t.width && e.localY >= t.y && e.localY <= t.y + t.height || ViewManager.ins().close(MailDetailedWin)
	}
	
	setMailData () {
		var e = MailModel.ins().getCurrentMail();
		this.textLabel.text = e.text, this.setReceiveBtn(e.receive, e.item.length > 0), this.itemList.dataProvider = new eui.ArrayCollection(e.item)


		//判断是否将按钮变色
		if(e.receive === 1)
		{
			this.receiveBtn.filters = Color.GetFilter()//变灰
		}

		//判断是否需要显示附件内容
		if(e.item.length>0)
		{
			this.pAddGronp.visible = true;
		}
		else
		{
			this.pAddGronp.visible = false;
		}
	}
	
	setReceiveBtn (e, t) {
		void 0 === t && (t = !1);
		var i = "";
		this.receiveBtn.visible = e >= 0, i = e ? "已领取" : "领取", this.receiveBtn.label = i, this.receiveBtn.enabled = !Boolean(e), this.receiveBtn.visible = t, this.desc.visible = !t
	}
}
MailDetailedWin.LAYER_LEVEL =  LayerManager.UI_Main;