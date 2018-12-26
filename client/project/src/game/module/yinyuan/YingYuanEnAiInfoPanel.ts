class YingYuanEnAiInfoPanel extends BaseView implements ICommonWindowTitle {

	public list: eui.List;
	public num: eui.Label

	public static NAME = "恩爱"


	protected childrenCreated(): void {
		this.list.itemRenderer = YingYuanEnAiItem

	}

	public OnOpen() {
		GameGlobal.YingYuanModel.SendLoveInfo()
		this.observe(MessageDef.MARRY_LOVE_INFO, this.UpdateContent)
		this.observe(MessageDef.IS_MARRY_INFO, this.UpdateContent)
		TimerManager.ins().doTimer(1000, 0, this.updataTime, this)

	}

	public updataTime() {
		GameGlobal.YingYuanModel.TimeLove()
		this.UpdateContent()
	}

	public UpdateContent(): void {
		this.num.text = GameGlobal.YingYuanModel.marryInfo.intimate + ""
		let Config = GameGlobal.Config.LoveConfig
		let ConfigData = []
		for (let data in Config) {
			ConfigData.push(data)
		}
		this.list.dataProvider = new eui.ArrayCollection(ConfigData)
	}

}

class YingYuanEnAiItem extends eui.ItemRenderer {
	public doName: eui.Label;
	public icon: eui.Image;
	public tianNum: eui.Label;
	public dayTimes: eui.Label;
	public times: eui.Label;
	public time: eui.Label;
	public huifu_bnt: eui.Button;
	public do_bnt: eui.Button;
	public priceicon: PriceIcon
	public timesText: eui.Label
	public constructor() {
		super();
	}

	protected childrenCreated(): void {
		this.huifu_bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.do_bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	ICONIMG = [
		"ui_ea_bm_qianshou",
		"ui_ea_bm_yonbao",
		"ui_ea_bm_qinwen",
		"ui_ea_bm_chongxing"
	]

	public _OnClick(e: egret.TouchEvent) {
		let data = Number(this.data)
		switch (e.target) {
			case this.do_bnt:
				GameGlobal.YingYuanModel.UseMarryLove(Number(this.data));
				break;
			case this.huifu_bnt:
				let cur = "one"
				let Config = GameGlobal.Config.LoveConfig[data]
				ViewManager.ins().open(YingYuanEnAiPanel, cur, Config.recoverymaterial, Config.price, () => {
					GameGlobal.YingYuanModel.RevertMarryLove(data);
				})
				break;
		}
	}

	public dataChanged() {
		//TimerManager.ins().removeAll(this)
		//this.time.text = ""
		let data = Number(this.data)
		let Config = GameGlobal.Config.LoveConfig[data]
		let Info = GameGlobal.YingYuanModel.getMarryLove(data)
		if (!Info) {
			return
		}
		this.icon.source = this.ICONIMG[data - 1]
		this.doName.text = Config.category
		this.tianNum.text = Config.intimate + "点"
		this.dayTimes.text = (Config.quantity - Info.daycount) + "/" + Config.quantity
		if (Config.frequency == 0) {
			this.times.visible = false
			this.timesText.visible = false
		}
		this.times.text = Info.count + "/" + Config.frequency
		this.do_bnt.label = Config.category
		if (Config.recoverymaterial && Config.frequency == 0) {
			this.do_bnt.visible = Config.quantity - Info.daycount != 0
			this.huifu_bnt.visible = Config.quantity - Info.daycount == 0
			//this.huifu_bnt.visible = Info.count == 0 || Config.recoverymaterial || Config.quantity - Info.daycount == 0
		} else {
			if (Config.recoverymaterial) {
				this.do_bnt.visible = Info.count != 0
				this.huifu_bnt.visible = Info.count == 0
			} else {
				this.do_bnt.visible = true  //Info.count != 0
				this.huifu_bnt.visible = false
			}
		}

		Info.count == 0 ? this.times.textColor = 0xFF0000 : this.times.textColor = 0x019704
		Config.quantity - Info.daycount == 0 ? this.dayTimes.textColor = 0xFF0000 : this.dayTimes.textColor = 0x019704

		// if (Info.time > 0) {
		// 	//this.AddTimer(1000, 0, this.updataTime)
		// } else {
		// 	//TimerManager.ins().remove(this.updataTime, this)
		// 	this.time.text = ""
		// }

		if (Config.price) {
			this.priceicon.setType(Config.price.id)
			this.priceicon.setPrice(Config.price.count)
		} else {
			this.priceicon.visible = false
		}
		this.updataTime()

	}

	public updataTime() {
		let data = Number(this.data)
		let Info = GameGlobal.YingYuanModel.getMarryLove(data)
		if (Info.time <= 0) {
			//TimerManager.ins().remove(this.updataTime, this)
			this.time.text = ""
			return
		}
		let InfoTime = GameServer.serverTime + Info.time
		this.time.text = "(" + GameServer.GetPkTime(InfoTime) + ")后恢复次数"
		//Info.time--
	}
}