class GangBossSceneView extends BaseView {

	public static LABEL = {
		OUT_TIME: "场景关闭倒计时",
		BOSS: "BOSS降临倒计时",
		BOSSREBORNING: "BOSS复活倒计时"
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

	private m_Raid: MapRaidGangBoss
	
	public constructor(raid: MapRaidGangBoss) {
		super()
		this.m_Raid = raid

		this.skinName = "AcrossBossFightSkin"
		this.list.itemRenderer = GangBossNowRankItem

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
		this.observe(MessageDef.GANGBOSS_RANK_NOW, this._UpdateRank)
		this.observe(MessageDef.GANGBOSS_UPDATE_HP, this._UpdateHp)
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
				if(GameGlobal.GangBossModel.mCurRank&&GameGlobal.GangBossModel.mCurRank.playerranks&&GameGlobal.GangBossModel.mCurRank.playerranks.length)
				{
					ViewManager.ins().open(RankWin,RankDataType.TYPE_GANG_BOSS_PERSON)
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
		let state = GameGlobal.GangBossModel.status
		if (state == AcrossBossState.KILL) {
			this.titleLabel.text = GangBossSceneView.LABEL.OUT_TIME
			let time = GameServer.serverTime - GameGlobal.GangBossModel.changetime
			let stime = GameGlobal.Config.GuildBossBaseConfig.leavetime - time
			this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0))
		} else if (state == AcrossBossState.WAIT) {
			this.titleLabel.text = GangBossSceneView.LABEL.BOSS
			let time = GameServer.serverTime - GameGlobal.GangBossModel.changetime
			let stime = GameGlobal.Config.GuildBossBaseConfig.readytime - time
			this.lbTime.text = DateUtils.format_1(Math.max(stime * 1000, 0))
		} else if (state == AcrossBossState.REBORNING) {
			this.titleLabel.text  = GangBossSceneView.LABEL.BOSSREBORNING
			this.lbTime.text = DateUtils.format_1(GameGlobal.GangBossModel.getBossRebornTime() * 1000)
		} else {
			this.titleLabel.text = GangBossSceneView.LABEL.OUT_TIME
			this.lbTime.text = DateUtils.format_1(GameGlobal.GangBossModel.getEndTime() * 1000)
		}
	}

	private _UpdateHp() {
		if (GameGlobal.GangBossModel.status < AcrossBossState.BOSS) {
			this.barProtect.value = 100
			this.barBlood.value = 100
		} else if (GameGlobal.GangBossModel.status == AcrossBossState.KILL) {
			this.barBlood.value = 0
		} else {
			let model = GameGlobal.GangBossModel
			this.barProtect.value = Math.ceil(model.shieldvalue / GameGlobal.Config.GuildBossBaseConfig.shieldvalue * 100)
			this.barBlood.value = model.hpperc
		}
	}

	private _UpdateRank() {
		let rank = GameGlobal.GangBossModel.mCurRank
		if (!rank) {
			this.list.dataProvider = new eui.ArrayCollection([])
			return
		}
		this.list.dataProvider = new eui.ArrayCollection(rank.playerranks)
	}
}

class GangBossNowRankItem extends eui.ItemRenderer {
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
		let data = this.data as Sproto.guildboss_rank
		this.lbName.text = data.name
		this.lbRank.text = (this.itemIndex + 1) + ""
		this.lbLv.text = ""
		UIHelper.SetHead(this.head, data.job, data.sex, false)
		this.lbHave.visible = this.itemIndex == 0
	}

	public childrenCreated() {

	}
}