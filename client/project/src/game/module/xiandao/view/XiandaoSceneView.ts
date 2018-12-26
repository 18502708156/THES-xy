class XiandaoSceneView extends BaseView {
    public static LAYER_LEVEL = LayerManager.UI_BATTLE

    /////////////////////////////////////////////////////////////////////////////
    // XiandaoSceneSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: CmLabel;
    protected rankGroup: eui.Group;
    protected infoGroup: eui.Group;
    protected rankLabel: eui.Label;
    protected rankValue: eui.Label;
    protected myRank: eui.Label;
    protected look: eui.Label;
    protected arrBtn: eui.Button;
    protected group: eui.Group;
    protected timeLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	private m_ExitTime: number = -1
	
	public constructor() {
		super()
		this.skinName = "XiandaoSceneSkin"
		UIHelper.SetLinkStyleLabel(this.look)
		this._AddClick(this.arrBtn, this._OnClick)
		this._AddClick(this.look, this._OnClick)
	}

	public OnOpen() {
		this.m_ExitTime = -1
		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdateChatPos)	
		this.observe(MessageDef.XIANDAO_MAP_UPDATE, this._UpdateRank)	
		
		GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

		this._UpdateChatPos()
		this._UpdateRank()
		this.AddTimer(1000, 0, this._UpdateTime)

		if (GameGlobal.XiandaoModel.IsKnockout()) {
			this.titleLabel.text = XiandaoKnockoutView.RANK_PRO_STR[GameGlobal.XiandaoModel.GetKnockoutId()]
			this.rankGroup.visible = false
		} else {
			this.titleLabel.text = "预选赛"
			this.rankGroup.visible = true
		}
	}

	public OnClose() {
		this.removeObserve()
		TimerManager.ins().removeAll(this)
	}

	public _UpdateChatPos() {
		this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint)
		this.group.y = egret.$TempPoint.y	
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.arrBtn:
				let show = this.infoGroup.visible = !this.infoGroup.visible
				this.arrBtn.icon = show ? "ui_zd_bt_shousuo" : "ui_zd_bt_zhankai"
			break
			case this.look:
				ViewManager.ins().open(XiandaoRankPanel)
			break
		}
	}

	private _UpdateMyTime() {
		if (this.m_ExitTime < 0) {
			this.m_ExitTime = 3
		}
		let exitTime = this.m_ExitTime--
		if (exitTime <= 0) {
			GameGlobal.CommonRaidModel.MapLeave()
			TimerManager.ins().removeAll(this)
		}
		return exitTime
	}

	private _UpdateTime() {
		let model = GameGlobal.XiandaoModel
		if (model.IsKnockout()) {
			if (model.mMyTime && !model.mMyTime.ret) {
				let exitTime = this._UpdateMyTime()
				this.timeLabel.text = `活动结束，将在${exitTime}秒后退出场景`
			} else {
				this.timeLabel.text = `下一场预计在${Math.max(model.mMyTime.timeout - GameServer.serverTime, 0)}秒后进行`	
			}
		} else {
			if (model.IsExitGame() || model.IsCloseAct()) {
				let exitTime = this._UpdateMyTime()
				if (model.IsExitGame()) {
					this.timeLabel.text = `您已败了3场比赛，将在${exitTime}秒后退出场景`	
				} else {
					this.timeLabel.text = `活动结束，将在${exitTime}秒后退出场景`	
				}
				return
			} else {
				this.timeLabel.text = `下一场预计在${model.GetNextTime()}秒后进行`	
			}
		}
		
	}

	private _UpdateRank() {
		let rank = GameGlobal.XiandaoModel.GetSimpleRankData()
		let list = []
		let listValue = []
		for (let i = 0; i < 3; i++) {
			let data = rank[i]
			let str = (i + 1) + "     "
			if (data) {
				str += data.roleName
				listValue.push(data.score)
			} else {
				str += "暂无"
				listValue.push(0)
			}
			list.push(str)
		}
		this.rankLabel.text = list.join("\n")
		this.rankValue.text = listValue.join("\n")

		let myRank = GameGlobal.XiandaoModel.GetSimpleMyRank() as any
		if (!myRank) {
			myRank = "未上榜"
		}
		this.myRank.text = `我的排名：${myRank}	积分：${GameGlobal.XiandaoModel.GetSimpleMyRankScore()}`
	}
}