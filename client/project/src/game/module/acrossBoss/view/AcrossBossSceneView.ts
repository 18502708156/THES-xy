class AcrossBossSceneView extends BaseView {

	public static LABEL = {
		OUT_TIME: "场景关闭倒计时",
		BOSS: "BOSS降临倒计时",
	}

    /////////////////////////////////////////////////////////////////////////////
    // AcrossBossFightSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected titleLabel: eui.Label;
    protected laRank: eui.Label;
    protected btnArrow: eui.Button;
    protected lbTime: eui.Label;
    protected groupAll: eui.Group;
    protected barProtect: eui.ProgressBar;
    protected barBlood: eui.ProgressBar;
    protected checkBox0: eui.CheckBox;
    protected checkBox1: eui.CheckBox;
    protected checkBox2: eui.CheckBox;
    public checkBox3: eui.CheckBox;
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////

    private tCheckBox: eui.CheckBox[] = [];//选择框

	private m_Raid: MapRaidAcrossBoss
	
	public constructor(raid: MapRaidAcrossBoss) {
		super()
		this.m_Raid = raid

		this.skinName = "AcrossBossFightSkin"
		this.list.itemRenderer = AcrossBossNowRankItem

		this._AddClick(this.btnArrow, this._OnClick);
		this._AddClick(this.laRank, this._OnClick);
		this._AddClick(this.checkBox0, this._OnClick);
		this._AddClick(this.checkBox1, this._OnClick);
		this._AddClick(this.checkBox2, this._OnClick);
		
		(this.barProtect.thumb as eui.Image).source = "ui_kf_bm_lansetiao"
		this.barProtect.maximum = 100
		this.barProtect.labelFunction = function(cur: number, max: number) {
			return cur + "%"
		}
		this.barBlood.maximum = 100
		this.barBlood.labelFunction = function(cur: number, max: number) {
			return cur + "%"
		}

        for (let i = 0; i < 3; i++) {
            let item = this["checkBox" + i]
            this.tCheckBox[i] = item
        }
	}

	public OnOpen() {
		let panel = ViewManager.ins().getView(GameMapPanel) as GameMapPanel
		if (panel) {
			panel.SetReturnBtn(-239)
		}
		this.checkBox0.selected = this.m_Raid.mSelList[0]
		this.checkBox2.selected = this.m_Raid.mSelList[2]
		this.checkBox3.selected = this.m_Raid.IsIsAutoReborn()

		this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdatePos)
		this.observe(MessageDef.KF_BOSS_RANK_NOW, this._UpdateRank)
		this.observe(MessageDef.KF_BOSS_UPDATE_HP, this._UpdateHp)
		this.observe(MessageDef.PLAYER_CHANGE_SYSTEM_SETTING, this._UpdatePlayerSetting)
		this._UpdatePlayerSetting()

		GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL)

		this._UpdatePos()
		this._UpdateHp()

		this._UpdateTime()
		this.AddTimer(1000, 0, this._UpdateTime)
		
		this.OnChange(null)
	}

	private _UpdatePlayerSetting() {
		this.checkBox1.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_OTHER_PLAYER)
	}

    //点击选择框改变内容
	public OnChange(index: number) {
		let raid = this.m_Raid
		let list = []	
        for (let i = 0; i < this.tCheckBox.length; i++) {
            list.push(this.tCheckBox[i].selected)
        }
		raid.UpdateSel(index, list)
	}

	private _UpdatePos() {
        MiniChatPanel.UpdateViewPos(this.groupAll)
	}

	public OnClose() {
		this.removeObserve()
		TimerManager.ins().removeAll(this)
	}


	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnArrow:
                let show = this.list.visible = !this.list.visible
				this.btnArrow.icon = show ? "ui_zd_bt_zhankai" : "ui_zd_bt_shousuo"
			break
			case this.laRank:
				if(GameGlobal.AcrossBossController.mCurRank&&GameGlobal.AcrossBossController.mCurRank.playerranks&&GameGlobal.AcrossBossController.mCurRank.playerranks.length)
				{
					ViewManager.ins().open(RankWin,RankDataType.TYPE_ACROSS_PERSON);
				}
				else
				{
					UserTips.ins().showTips("赶紧冲榜吧")
				}
			break
			case this.checkBox0:
				this.OnChange(0)
			break
			case this.checkBox1:
				SystemSettingPanel.ChangeShowOther(this.checkBox1.selected)
			break
			case this.checkBox2:
				this.OnChange(2)
			break
		}
	}

	private _UpdateTime() {
		let state = GameGlobal.AcrossBossController.status
		if (state == AcrossBossState.KILL) {
			this.titleLabel.text = AcrossBossSceneView.LABEL.OUT_TIME
			let time = GameServer.serverTime - GameGlobal.AcrossBossController.changetime
			let stime = GameGlobal.Config.KfBossBaseConfig.leavetime - time
			this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0))
		} else if (state == AcrossBossState.WAIT) {
			this.titleLabel.text = AcrossBossSceneView.LABEL.BOSS
			let time = GameServer.serverTime - GameGlobal.AcrossBossController.changetime
			let stime = GameGlobal.Config.KfBossBaseConfig.readytime - time
			this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0))
		} else {
			this.titleLabel.text = AcrossBossSceneView.LABEL.OUT_TIME
			this.lbTime.text = DateUtils.format_1(GameGlobal.AcrossBossController.getEndTime() * 1000)
		}
	}

	private _UpdateHp() {
		if (GameGlobal.AcrossBossController.status < AcrossBossState.BOSS) {
			this.barProtect.value = 100
			this.barBlood.value = 100
		} else if (GameGlobal.AcrossBossController.status == AcrossBossState.KILL) {
			this.barBlood.value = 0
		} else {
			let model = GameGlobal.AcrossBossController
			this.barProtect.value = Math.ceil(model.shieldvalue / GameGlobal.Config.KfBossBaseConfig.shieldvalue * 100)
			this.barBlood.value = model.hpperc
		}
	}

	private _UpdateRank() {
		let rank = GameGlobal.AcrossBossController.mCurRank
		if (!rank) {
			this.list.dataProvider = new eui.ArrayCollection([])
			return
		}
		this.list.dataProvider = new eui.ArrayCollection(rank.playerranks)
	}
}

class AcrossBossNowRankItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // AcrossBossMiniRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected head: eui.Component;
    protected lbName: eui.Label;
    protected lbLv: eui.Label;
    protected lbRank: eui.Label;
    protected lbHave: eui.Label;
    /////////////////////////////////////////////////////////////////////////////
	
	public dataChanged() {
		let data = this.data as Sproto.kfboss_rank
		this.lbName.text = data.name
		this.lbRank.text = (this.itemIndex + 1) + ""
		this.lbLv.text = GameString.GetSer(data.serverid)
		UIHelper.SetHead(this.head, data.job, data.sex, false)
		this.lbHave.visible = this.itemIndex == 0
	}

	public childrenCreated() {

	}
}