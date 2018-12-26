class AcrossBossBox extends eui.Component {

	public mBox: Sproto.kfboss_boxinfo

    /////////////////////////////////////////////////////////////////////////////
    // AcrossBossBoxSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected dataGroup: eui.Group;
    protected img: eui.Image;
    protected barGroup: eui.Group;
    protected bar: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

	private mIds: {[key: number]: eui.ProgressBar} = {}
	private mClotieTime: number

	public constructor(box: Sproto.kfboss_boxinfo | Sproto.guildboss_boxinfo, clotime) {
		super()
		this.skinName = "AcrossBossBoxSkin"
		this.mBox = box
		this.mClotieTime = clotime
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)

		this.dataGroup.x = -1 * (this.dataGroup.width >> 1)
		this.dataGroup.y = -1 * (this.dataGroup.height >> 1)

		this.barGroup.visible = false
	}

	private GetBar(): eui.ProgressBar {
		let bar = new eui.ProgressBar	
		bar.skinName = "bar0Skin"
		let clotie = this.mClotieTime
		bar.maximum = clotie
		bar.value = clotie
		bar.slideDuration = clotie * 1000
		bar.width=148
		bar.height=20
		bar.labelFunction = function(cur, max) {
			return cur + "秒"
		}
		return bar
	}

	public ResetBarValue(bar: eui.ProgressBar, value: number) {
		if (value == null) {
			value = GameGlobal.Config.KfBossBaseConfig.coltime
		}
		value = Math.max(value - GameServer.serverTime, 0)
		bar.slideDuration = 0
		bar.value = value
		bar.slideDuration = value * 1000
	}

	public OnAdded(notPlay: boolean) {
		if (!notPlay) {
			this.img.scaleX = this.img.scaleY = 0
			let tween = egret.Tween.get(this.img)
			tween.to({
				scaleX: 1,
				scaleY: 1,
				y: -100
			}, 200, egret.Ease.backOut)
			.to({
				y: 0
			}, 100)
		}
		this.x = (this.mBox.x)
		this.y = (this.mBox.y)
		GameMap.GetMap().mMapEntityView.AddDrop(this)
	}

	public DoRemoved() {
		DisplayUtils.removeFromParent(this)
	}

	public _OnClick() {
		GameGlobal.RaidMgr.mMapRaid.MoveOrder(this.mBox.id, this.x, this.y, 100)
	}

	public ShowBar(id: number, time: number) {
		let bar = this.mIds[id]
		if (!time) {
			if (bar) {
				DisplayUtils.removeFromParent(bar)
				delete this.mIds[id]
			}
		} else {
			if (!bar) {
				bar = this.GetBar()
				this.bar.addChild(bar)
				this.mIds[id] = bar
			}
			this.ResetBarValue(bar, time)
			bar.value = 0
		}
		this.barGroup.visible = this.bar.numChildren > 0
	}

	public ShowBars(datas: Sproto.kfboss_collect_info[]) {
		for (let data of datas) {
			this.ShowBar(data.playerid, data.time)
		}
	}

	public RemoveBar() {
		this.mIds = {}
		this.bar.removeChildren()
		this.barGroup.visible = false
	}
}