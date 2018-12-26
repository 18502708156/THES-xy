class GameBattlePubBossView extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // GameGattlePubBossSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected bar: eui.ProgressBar;
    protected arrBtn: eui.Button;
    protected infoGroup: eui.Group;
    protected rankLabel: eui.Label;
    protected rankValue: eui.Label;
    protected myRank: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GameGattlePubBossSkin"
		this.percentWidth = 100
		this.bar.labelFunction = function(cur, max) {
			return "BOSS血量：" + cur + "/" + max
		}
		this._AddClick(this.arrBtn, this._OnClick)
	}

	public OnOpen() {
		this.observe(MessageDef.PUBLIC_BOSS_UPDATE_ATK, this._UpdateContent)
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos)
		this._UpdateContent()
		this._UpdatePos()
	}

	public OnClose() {
		GameGlobal.BossModel.ClearPubBossAtkInfo()
	}

	private _OnClick() {
		let show = this.infoGroup.visible = !this.infoGroup.visible
		this.arrBtn.icon = show ? "ui_zd_bt_shousuo" : "ui_zd_bt_zhankai"
	}

	private _UpdatePos() {
		this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint)
		this.group.y = egret.$TempPoint.y
	}

	private _UpdateContent() {
		let rsp = GameGlobal.BossModel.mPubBossAtkInfo
		this.UpdateRank(rsp)
	}

	public UpdateHp(cur: number, max: number) {
		if (!cur && !max) {
			this.bar.visible = false
		} else {
			this.bar.visible = true
		}
		this.bar.maximum = max
		this.bar.value = cur
	}

	public UpdateRank(rsp: Sproto.sc_public_boss_update_attack_request) {
		if (!rsp) {
			return
		}
		let list = []
		let listValue = []
		let attackInfo = rsp.attackinfos || []
		for (let i = 0; i < 3; i++) {
			let data = attackInfo[i]
			let str = (i + 1) + " "
			if (data) {
				str += data.name
				listValue.push(data.injure)
			} else {
				str += "暂无"
				listValue.push(0)
			}
			list.push(str)
		}
		this.rankLabel.text = list.join("\n")
		this.rankValue.text = listValue.join("\n")

		// rsp.myattackinfo.injure
		this.myRank.text = "我的：" + (rsp.myattackinfo ? rsp.myattackinfo.injure : 0)
	}
}