class ShouDaoXianHuaPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	public text: eui.Label;
	public text0: eui.Label;
	public jieshou: eui.Button;
	public jujue: eui.Button;
	public next: eui.Button;
	public index: number = 0;
	public userChatData:Sproto.chat_data
	public constructor() {
		super()
		this.skinName = "ShouDaoXianHuaSkin";
	}

	public OnOpen(...param: any[]) {
		this._AddClick(this.jieshou, this._OnClick)
		this._AddClick(this.jujue, this._OnClick)
		this._AddClick(this.next, this._OnClick) 
		this.updateContent()
	}

	private updateContent() {
		this.userChatData = new Sproto.chat_data;
		let other = GameGlobal.YingYuanModel.getOther()
		this.userChatData.id = other.dbid;
		this.userChatData.job = other.job;
		this.userChatData.sex = other.sex;
		this.userChatData.name = other.name;
		let data = GameGlobal.YingYuanModel.marrySFlower
		if (data.length == 0) {
			ViewManager.ins().close(this);
			return
		}

		if (this.index == (data.length - 1)) {
			this.next.label = "取消"
		}
		let indexData = data[this.index]
		if (!indexData) {
			this.text.text = ""
			this.text0.text = ""
			return
		}

		this.text.text = indexData.name + "赠送你" + indexData.flower + "*" + indexData.count
		this.text0.text = "恩爱有加的你们亲密度各自增加了" + indexData.intimacy + "您想对Ta做出什么回应昵？"
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.jieshou:
				ViewManager.ins().open(YingYuanXianHuaPanel);
				GameGlobal.YingYuanModel.flower(this.index)
				this.updateContent()
				break;
			case this.jujue:

				ViewManager.ins().open(PlayerChatpanel, this.userChatData);
				break;
			case this.next:
			    if(this.next.label == "取消"){
					ViewManager.ins().close(this);
					GameGlobal.YingYuanModel.removeAllFlower()
					return 		
				}
				if (this.index == (GameGlobal.YingYuanModel.marrySFlower.length - 1)) {
					ViewManager.ins().close(this);
					return
				}
				this.index++
				this.updateContent();
				break;
		}
	}

	public OnClose() {

	}
}