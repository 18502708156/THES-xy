class ShouDaoPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	public hunType: eui.Image;
	public hunfL: eui.Image;
	public hunHo: eui.Image;
	public text: eui.Label;
	public jieshou: eui.Button;
	public jujue: eui.Button;
	public next: eui.Button;
	public index: number = 0
	public list0: eui.List
	public face: eui.Component
	public DayTimes: eui.Label
	public constructor() {
		super()
		this.skinName = "ShouDaoSkin";
	}

	public OnOpen(...param: any[]) {
		this._AddClick(this.jieshou, this._OnClick)
		this._AddClick(this.jujue, this._OnClick)
		this._AddClick(this.next, this._OnClick)
		this.list0.itemRenderer = ItemBaseNotName
		this.updateContent()
	}

	private updateContent() {
		if (GameGlobal.YingYuanModel.askMarry.length == 0) {
			ViewManager.ins().close(this);
			return
		}
		if (this.index == (GameGlobal.YingYuanModel.askMarry.length - 1)) {
			this.next.label = "取消"
		}
		let data = GameGlobal.YingYuanModel.askMarry[this.index]
		if (!data) {
			ViewManager.ins().close(this);
			return
		}
		let Config = GameGlobal.Config.MarryConfig[data.grade]
		this.hunType.source = Config.marryicon
		this.list0.dataProvider = new eui.ArrayCollection(Config.id)
		this.text.text = data.name + " " + data.level + "级   " + data.power + "战斗力"
		this.face["face"].source = ResDataPath.GetHeadImgName(data.job, data.sex)
		let ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency
		this.DayTimes.text = "今日还可结婚：" + (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today) + "/" + ConfigModel
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.jieshou:
				let ConfigModel = GameGlobal.Config.MarryBaseConfig.frequency
				if (ConfigModel - GameGlobal.YingYuanModel.marryInfo.today == 0) {
					UserTips.InfoTip("今日没有结婚次数")
					return
				}
				GameGlobal.YingYuanModel.marryAnswer(1, GameGlobal.YingYuanModel.askMarry[this.index].fromid)
				break;
			case this.jujue:
				GameGlobal.YingYuanModel.marryAnswer(0, GameGlobal.YingYuanModel.askMarry[this.index].fromid)
				GameGlobal.YingYuanModel.removeAnswer(GameGlobal.YingYuanModel.askMarry[this.index].fromid)
				this.updateContent()
				break;
			case this.next:
				if (this.index == (GameGlobal.YingYuanModel.askMarry.length - 1)) {
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