class ChatTipsWin extends BaseEuiView {

	time = 0
	sureBtn
	cancelBtn
	checkbox
	callback
	descTF
	public constructor() {
		super()

}

	initUI() {
		this.skinName = "ChatTipsWinSkin"
	}
	OnOpen(...param: any[]) {
		this.AddClick(this.sureBtn, this.onTouch)
		this.AddClick(this.cancelBtn, this.onTouch)
		this.AddClick(this.checkbox, this.onTouch)
		this.time = param[0],
			this.callback = param[1],
			this.update()
	}
	onTouch(t) {
		var e = GlobalConfig.ins().ChatConstConfig;
		switch (t.currentTarget) {
			case this.sureBtn:
				GameLogic.ins().actorModel.yb < e.cost ? UserTips.ins().showTips("|C:0xff0000&T:元宝不足|") : this.callback && this.callback()
				ViewManager.ins().close(this)
				break;
			case this.cancelBtn:
				GameGlobal.Chat.isNoShowTipsPanel = !1
				ViewManager.ins().close(this)
				break;
			case this.checkbox:
				GameGlobal.Chat.isNoShowTipsPanel = this.checkbox.selected
		}
	}
	update() {
		this.time > 0 && (TimerManager.ins().isExists(this.updateCD, this) || TimerManager.ins().doTimer(1e3, this.time, this.updateCD, this), this.show())
	}
	show() {
		var t = GlobalConfig.ins().ChatConstConfig;
		this.descTF.textFlow = TextFlowMaker.generateTextFlow1("世界频道每次发言需间隔" + t.worldChatCd + "秒，" + this.time + "秒后可以免费发言\n花费|C:0xEEEE00&T:" + t.cost + "元宝|即可立即发言")
	}
	updateCD() {
		this.time--
		this.time <= 0 && (TimerManager.ins().remove(this.updateCD, this), ViewManager.ins().close(this))
		this.show()
	}
	OnClose() {
		TimerManager.ins().remove(this.updateCD, this)
	}
}

ChatTipsWin.LAYER_LEVEL =  LayerManager.UI_Popup;
