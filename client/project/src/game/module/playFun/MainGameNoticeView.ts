class MainGameNoticeView extends BaseView {

	public static TYPE_XIANDAO = 1 // 仙道会
	public static TYPE_GANG_BOSS = 3 //帮会BOSS
	public static TYPE_CROSSBATTER = 5  //跨服争霸
	public static TYPE_GANG_BATTLE = 6  //帮会战

	public static TYPE_CROSS_BOSS = 101 // 跨服BOSS

	public static SHOW_TYPE_TIME = 1 // 显示倒计时
	public static SHOW_TYPE_GOTO = 2 // 显示前往

	/////////////////////////////////////////////////////////////////////////////
	// MainGameNoticeSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected icon: eui.Image;
	protected typeLabel: eui.Label;
	protected lbAnswerInfo: eui.Label;
	protected gotoLabel: eui.Label;
	protected imgAnswerClose: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public mType: number = 0
	private m_EndTime: number = 0
	private m_ShowType: number = 0

	public constructor() {
		super()
		this.skinName = "MainGameNoticeSkin"
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		UIHelper.SetLinkStyleLabel(this.gotoLabel)
	}

	public OnOpen(...param: any[]) {
		if (this.mType && this.m_EndTime > GameServer.serverTime) {
			this.StartTime()
		}
	}

	public OnClose() {
		TimerManager.ins().removeAll(this)
	}

	public SetData(type: number, time: number, showType: number) {
		this.mType = type
		this.m_ShowType = showType
		this.m_EndTime = time + GameServer.serverTime

		if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
			this.lbAnswerInfo.visible = false
			this.gotoLabel.visible = true
		} else {
			this.lbAnswerInfo.visible = true
			this.gotoLabel.visible = false
		}

		this.UpdateContent()
		TimerManager.ins().removeAll(this)
	}

	public StartTime() {
		TimerManager.ins().removeAll(this)

		let time = this.m_EndTime - GameServer.serverTime
		this._UpdateTime()
		if (time <= 0) {
			return
		}
		this.AddTimer(1000, this.m_EndTime - GameServer.serverTime, this._UpdateTime)
	}

	public UpdateContent() {
		this.icon.scaleX = this.icon.scaleY = 1
		if (this.mType == MainGameNoticeView.TYPE_XIANDAO) {
			this.UpdateXiandaohui()
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_CROSSBATTER) {
			this.UpdateCrossBattle()
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_GANG_BATTLE) {
			this.UpdateGangBattle()
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_GANG_BOSS) {
			this.UpdateGangBoss()
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_CROSS_BOSS) {
			this.UpdateCrossBoss()
			return
		}
		console.error("not impl type => " + this.mType)
	}

	private _UpdateTime() {
		if (this.m_ShowType != MainGameNoticeView.SHOW_TYPE_GOTO) {
			this.lbAnswerInfo.textFlow = TextFlowMaker.generateTextFlow(`将在${StringUtils.addColor(Math.max(this.m_EndTime - GameServer.serverTime, 0) + "s", Color.l_green_1)}后开始`)
		}
		if (this.m_EndTime <= GameServer.serverTime) {
			this.Close()
		}
	}

	private UpdateXiandaohui() {
		if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
			this.typeLabel.text = "仙道会预选赛正激烈进行"
		} else {
			this.typeLabel.text = "仙道会活动"
		}
		this.icon.source = "ui_xdh_bt_xiandaohui"
	}

	private UpdateCrossBattle() {
		if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
			this.typeLabel.text = "跨服争霸正在进行"
		} else {
			this.typeLabel.text = "跨服争霸"
		}
		this.icon.source = "ui_bm_kuafuzhengba"
	}

	private UpdateGangBattle() {
		this.typeLabel.text = "帮会战进行中"
		this.icon.source = "ui_bm_banghuizhan"
	}

	private UpdateGangBoss() {
		this.typeLabel.text = "帮会BOSS出现"
		this.icon.source = "ui_bh_bt_boss"
		this.icon.scaleX = this.icon.scaleY = 0.8
	}

	private UpdateCrossBoss() {
		this.typeLabel.text = "跨服BOSS出现"
		this.icon.source = "ui_bm_kuafuBOSS"
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.imgAnswerClose:
				this.Close()
				break
			default:
				if (this.m_ShowType == MainGameNoticeView.SHOW_TYPE_GOTO) {
					this.Goto()
					this.Close()
				}
				break
		}
	}

	private Goto() {
		if (this.mType == MainGameNoticeView.TYPE_XIANDAO) {
			GameGlobal.XiandaoModel.EnterPreliminaries()
			return
		}
		if (this.mType == MainGameNoticeView.TYPE_CROSSBATTER) {
			GameGlobal.ActivityModel.sendActivityEnter(MainGameNoticeView.TYPE_CROSSBATTER);
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_GANG_BATTLE) {
			if (!GameGlobal.actorModel.HasGuild())
			{
				UserTips.ins().showTips("加入帮会才可以参加帮会战")
				return
			}

			GameGlobal.GangBattleModel.SendEnterBattle()
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_GANG_BOSS) {
			if (!GameGlobal.actorModel.HasGuild())
			{
				UserTips.ins().showTips("您还没有帮会")
				return
			}

			ViewManager.ins().open(GangBossPanel)
			return
		}

		if (this.mType == MainGameNoticeView.TYPE_CROSS_BOSS) {
			if (!GameGlobal.actorModel.HasGuild())
			{
				UserTips.ins().showTips("您还没有帮会")
				return
			}

			ViewManager.ins().open(CrossMainPanel, 1)
			return
		}
	}

	public Close() {
		DisplayUtils.removeFromParent(this)
		this.DoClose()
	}
}