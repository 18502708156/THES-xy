/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/24 17:01
 * @meaning: 跨服boss详情
 * 
 **/

class AcrossBossPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "跨服BOSS"
	public mWindowHelpId?: number = 20


	tPanelData = [];//界面总体数据数据

	protected lbShowTitle: eui.Label; //
	protected lbPlayerName: eui.Label;
	protected lbUnionName: eui.Label;
	protected lbTime: eui.Label;//倒计时

	protected counterLabel: DurationLabel;


	private listBoss: eui.List;
	private listHave: eui.List;
	protected showPanel: PetShowPanel

	protected btnOpen: eui.Button
	protected btnInfo: eui.Button
	protected btnShowAward: eui.Button


	////////
	oConfig; //boss 配表数据
	nStatus = 0;//boss状态
	nCountTime = 0;//倒计时

	/////////////////////////////////////////////////////////////////////////////

    public static RedPointCheck(): boolean {
        return GameGlobal.AcrossBossController.IsAcrossBossAct()
    }

	public constructor() {
		super()
		this.skinName = "AcrossBossSkin"
		this.listBoss.itemRenderer = ItemBaseNotName;
		this.listHave.itemRenderer = ItemBaseNotName;
	}

	public childrenCreated() {
		this.oConfig = GlobalConfig.ins().KfBossBaseConfig
	}

	public OnOpen(...param: any[]) {

		var nIndex = param[0] || 0;
		this.observe(MessageDef.KF_BOSS_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.ACROSS_BOSS, this.UpdateContent)//boss数据变化
		this.observe(MessageDef.KF_BOSS_RANK_NOW, this.UpdateContent)//boss数据变化
		this._AddClick(this.btnOpen, this.onClick)
		this._AddClick(this.btnInfo, this.showTip)
		this._AddClick(this.btnShowAward, this.showAward)

		this.btnShowAward.icon = ActivityModel.ICONSOURCE_MAP[ActivityModel.TYPE_GANG_BOSS]

		//获取排行
		GameGlobal.AcrossBossManage.sendGetLastRank()

		this.showPanel.SetBodyId(MonstersConfig.GetAppId(GlobalConfig.ins().KfBossBaseConfig.bossid))

		this.AddLoopTimer(1000, this.upTime);

		this.UpdateContent()


	}

	public UpdateContent() {

		this.setData()

		this.listBoss.dataProvider = new eui.ArrayCollection(this.oConfig.showItem1);
		this.listHave.dataProvider = new eui.ArrayCollection(this.oConfig.showItem2);


		this.upInfo()


	}


	public upInfo() {

		let tRankLast;
		let strName = ""
		let strId = ""
		if (this.nStatus) {
			this.btnOpen.label = "挑战"
			this.lbShowTitle.text = "当前所属"
			if (GameGlobal.AcrossBossController.mCurRank && GameGlobal.AcrossBossController.mCurRank.playerranks && GameGlobal.AcrossBossController.mCurRank.playerranks[0]) {
				strName = GameGlobal.AcrossBossController.mCurRank.playerranks[0].name
				strId = GameGlobal.AcrossBossController.mCurRank.playerranks[0].serverid + ""
			}
		}
		else {
			this.btnOpen.label = "未开始"
			this.lbShowTitle.text = "上次归属"
			if (GameGlobal.AcrossBossController.tRankLast && GameGlobal.AcrossBossController.tRankLast.firstinfo) {
				strName = GameGlobal.AcrossBossController.tRankLast.firstinfo.name
				strId = GameGlobal.AcrossBossController.tRankLast.firstinfo.serverid + ""
			}
		}

		this.lbPlayerName.text = strName ?(strName + ".S" + strId) : ""
		this.lbUnionName.text = "" //帮会数据暂时还没有

	}

	private setPower(str) {

		if (str.length > 4) {
			var wNum = Math.floor(Number(str) / 1000);
			str = wNum / 10 + "万";
		}

		return str
	}

	public upTime() {
		//时间更新

		if (this.nStatus) {
			let activityTime = GameGlobal.AcrossBossController.getEndTime()
			this.lbTime.text = DateUtils.getFormatBySecond(activityTime)

		}
		else {
			//倒计时显示
			if (this.oConfig.opentime && this.oConfig.opentime.length) {
				this.lbTime.text = this.oConfig.opentime[0] + "~" + this.oConfig.opentime[1]
			}
		}

	}


	public setData() {
		this.nStatus = GameGlobal.AcrossBossController.status//boss状态
		this.nCountTime = GameGlobal.AcrossBossController.changetime//状态时间
	}




	private onClick(e: egret.TouchEvent) {
		if (this.nStatus) {
			let lv = GlobalConfig.ins().KfBossBaseConfig.guildlv || 0
			let unionLv = GameGlobal.GangModel.getGangLv()
			if (unionLv >= lv) {
				GameGlobal.AcrossBossManage.enterMap()
				ViewManager.ins().close(CrossMainPanel);
				// ViewManager.ins().close(GameCityPanel);
			}
			else {
				UserTips.FormatTip(GameGlobal.Config.KfBossBaseConfig.kfboss_tips01, lv)
			}

		}
		else {
			UserTips.ins().showTips("未开始")
		}
	}


	private showTip(e) {
		ViewManager.ins().open(ActivityDescPanel, 28);
	}

	private showAward() {
		ActivityRewardShowWin.Open(101)
	}

}


