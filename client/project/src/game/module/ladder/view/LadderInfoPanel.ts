
class LadderInfoPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "王者争霸"

	private m_TimeOutID: number
	private m_OtherHeadList: Sproto.sc_ladder_player_back_request[] = []

	rollTime: number
	timeOut: number
	isComplete: boolean
	/////////////////////////////////////////////////////////////////////////////
	// LadderInfoPanelSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemBaseNotName;
	protected truceIng: eui.Label;
	protected winImg: eui.Image;
	protected myhead: eui.Image;
	protected myName: eui.Label;
	protected otherLevelIcon: eui.Image;
	protected otherName: eui.Label;
	protected enterTime: eui.Label;
	protected levtxt: eui.Component;
	protected ingImg: eui.Group;
	protected corssGroup: eui.Group;
	protected corssWinItem: ItemBase;
	protected corssHeadComp: eui.Component;
	protected corssWinNameLabel: eui.Label;
	protected enterGroup: eui.Group;
	protected wz_open_time: eui.Label;
	protected stateGroup: eui.Group;
	protected flowPlayer: eui.Button;
	protected buyTime: eui.Label;
	protected lastNum: eui.Label;
	protected updatatimetext: eui.Label;
	protected starGroup: eui.DataGroup;
	protected winNum: eui.Label;
	protected otherHeadList: eui.List;
	protected myLevel: eui.Component;
	protected otherLevel: eui.Component;
	protected notEnterLabel: eui.Label;
	protected rankBtn: eui.Button;
	protected preBtn: eui.Button;
	protected winnerBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////



	public constructor() {
		super()
		this.skinName = "LadderInfoPanelSkin"
	}

	childrenCreated() {
		var config = this.GetLadderModel().GetSelfLevelConfig();
		for (let i = 0; i < 5; ++i) {
			let data = new Sproto.sc_ladder_player_back_request
			data.id = 0
			data.name = ""
			data.job = i == 0 ? -1 : MathUtils.randomArray([1, 2, 3])
			data.sex = MathUtils.randomArray([0, 1])
			data.grade = MathUtils.randomArray([1, 2, 3, 4, 5])
			this.m_OtherHeadList[i] = data
		}
		this.starGroup.itemRenderer = LadderStarItem
		this.otherHeadList.useVirtualLayout = false;
		this.otherHeadList.itemRenderer = LadderInfoHeadItem
		this.otherHeadList.dataProvider = new eui.ArrayCollection(this.m_OtherHeadList)
		this.m_TimeOutID = -1
		this.enterTime.visible = false
		this.ingImg.visible = false

		this._AddClick(this.rankBtn, this._OnClick)
		this._AddClick(this.preBtn, this._OnClick)
		this._AddClick(this.winnerBtn, this._OnClick)

		this.notEnterLabel.text = "本周一0:00您未进入本服战力榜前" + GameGlobal.Config.KingSportsBaseConfig.inum + "名，无法参加王者争霸"
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.rankBtn:
				ViewManager.ins().open(LadderRankWin)
				break
			case this.preBtn:
				ViewManager.ins().open(LadderWeekRankWin)
				break
			case this.winnerBtn:
				ViewManager.ins().open(LadderWinnerWin)
				break
		}
	}

	public IsMacth(): boolean {
		return this.enterTime.visible || this.ingImg.visible
	}

	private _ClearTimeOut(): void {
		if (this.m_TimeOutID < 1) {
			return
		}
		egret.clearTimeout(this.m_TimeOutID)
		this.m_TimeOutID = -1
	}

	OnOpen() {
		this._AddClick(this.flowPlayer, this.onTap)
		this._AddClick(this.buyTime, this.onTap)

		this.observe(MessageDef.LADDER_CHANGE, this.UpdateContent);
		// this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateRankList)
		this.observe(MessageDef.LADDER_PLAYER_BACK, this.playerBack)

		this.observe(MessageDef.LADDER_PRE_WEEK_REWARD, this.UpdateRedPoint)
		this.observe(MessageDef.LADDER_WINNER, this.UpdateRedPoint)
		this.UpdateRedPoint()

		this.buyTime.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>购买次数</u></fomt>");
		this.AddLoopTimer(1000, this._updateNextTime);

		this.otherLevel.visible = false;
		this.SetLevelName(this.otherLevel, 0)
		this.UpdateRankList()

		this.mActorInfo = GameGlobal.Ladder.getActorInfo()
	}

	private UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.preBtn, GameGlobal.Ladder.isCanReward)
		UIHelper.ShowRedPoint(this.winnerBtn, GameGlobal.Ladder.mWinnerRecords && !GameGlobal.Ladder.mWinnerRecords.worship)
	}

	OnClose() {
		this._ClearTimeOut()
		egret.clearInterval(this.timeOut);
		this.ClearMatchInfo()
		egret.Tween.removeTweens(this.otherHeadList)

		let info = this.mActorInfo
		if (info && info.id) {
			this.sendStarPlay()
		}

		this.mActorInfo = null
	}

	// closeNew()
	// {
	// 	if(this.initEvent == true)
	// 	{
	// 		this.initEvent = false

	// 		//滚动页close
	// 		this._ClearTimeOut()
	// 		this.removeObserve()
	// 		egret.Tween.removeTweens(this.otherHeadList)
	// 		this.ingImg.visible = false
	// 		this.enterTime.visible = false
	// 	}
	// }

	private UpdateRankList() {
		let list = GameGlobal.Ladder.mRankList
		if (!list || !list.length) {
			return
		}
		let index = 1
		for (let i = 0; i < 30; ++i) {
			let randData = list[Math.floor(Math.random() * list.length)]
			if (!randData) {
				continue
			}
			if (randData.id == GameGlobal.actorModel.actorID) {
				continue
			}
			let headData = this.m_OtherHeadList[index++]
			if (headData.id) {
				continue
			}
			headData.job = randData.job
			headData.sex = randData.sex
			headData.name = randData.player
			headData.serverid = randData.serverid
			if (index >= this.m_OtherHeadList.length) {
				break
			}
		}
		(this.otherHeadList.dataProvider as eui.ArrayCollection).replaceAll(this.m_OtherHeadList)
	}


	/**触摸事件 */
	onTap(e) {
		switch (e.currentTarget) {
			case this.flowPlayer:
				this.DoChallenge()
				break;
			case this.buyTime:
				let ladder = this.GetLadderModel()
				let config = this.GetTianTiConfig()
				if (ladder.todayBuyTime >= config.time) {
					UserTips.ErrorTip("今日购买次数已达上限");
					return;
				}

				if (ladder.isTipsFlag) {
					if (!Checker.Data(config.cost, true)) {
						return
					}
					ladder.sendBuyChallgeTime();
				} else {
					let tips = "确定花费<font color='#019704'>" + config.cost.count + "元宝</font>购买1次跨服王者挑战次数吗？" +
						"\n今日已购买：" + ladder.todayBuyTime + "/" + config.time;
					if (ladder.isTipsFlag == false) {
						tips = tips + "\n\n<font color='#019704'>点击确定后，本次登录不再提示。"
					}
					WarnWin.show(tips, function () {
						ladder.isTipsFlag = true;
						if (!Checker.Data(config.cost, true)) {
							return
						}
						ladder.sendBuyChallgeTime();
					}, this);
				}
				break;
		}
	};

	protected GetLadderModel(): Ladder {
		return GameGlobal.Ladder
	}

	protected GetTianTiConfig(): any {
		return GlobalConfig.ins().KingSportsBaseConfig
	}

	//更新时间
	_updateNextTime() {
		if (this.GetLadderModel().challgeNum >= this.GetTianTiConfig().sportstime) {
			this.updatatimetext.text = '(2小时恢复1次)'
		} else {
			if (this.GetLadderModel().NextTime - GameServer.serverTime > 0) {
				this.updatatimetext.text = `(${GameServer.GetPkTime(this.GetLadderModel().NextTime)}后恢复一次)`
			} else {
				this.updatatimetext.text = '(2小时恢复1次)'
			}
		}
	}

	/**刷新 自己的挑战数据*/
	UpdateContent() {
		if (GameGlobal.Ladder.isOpen) {
			this.notEnterLabel.visible = !GameGlobal.Ladder.canJoin
			this.enterGroup.visible = GameGlobal.Ladder.canJoin
		} else {
			this.enterGroup.visible = true
		}

		this.setMyHead()

		let ladder = this.GetLadderModel()

		this.lastNum.text = "剩余次数：" + ladder.challgeNum + "/" + this.GetTianTiConfig().sportstime;
		if (ladder.challgeNum > 0) {
			this.lastNum.textColor = 0x2ECA22;
		} else {
			this.lastNum.textColor = 0xFF0000;
		}
		this.winNum.text = "净胜场：" + ladder.winNum;

		let grade = ladder.grade
		for (let key in GameGlobal.Config.DWKingSportsConfig) {
			let data = GameGlobal.Config.DWKingSportsConfig[key]
			if (grade >= data.typelv[0] && grade <= data.typelv[1]) {
				this.item.data = data.rankreward[0]
				break
			}
		}

		var config = ladder.GetSelfLevelConfig();
		if (config) {
			LadderConst.SetGradeInfo(this.levtxt, ladder.grade)

			this.SetLevelName(this.myLevel, ladder.grade)
			this.otherLevelIcon.source = LadderConst.GetMiddleIcon(config.showType)
			let list = []
			for (let i = 1, len = config.needstar; i <= len; ++i) {
				list.push(ladder.star >= i)
			}
			this.starGroup.dataProvider = new eui.ArrayCollection(list)
			this.starGroup.validateNow()
		}
		this.winImg.visible = ladder.lianWin;
		this.truceUIChange();
	}

	private SetLevelName(comp: any, grade: number) {
		comp.rankImg.source = LadderConst.GetMiniIcon(grade)
		comp.levelLabel.text = LadderConst.GetGradeInfo(grade)
	}

	truceUIChange() {
		let ladder = this.GetLadderModel()
		this.stateGroup.visible = ladder.isOpen
		this.wz_open_time.visible = !ladder.isOpen;
		this.starGroup.visible = ladder.isOpen
		this.winNum.visible = ladder.isOpen
	}

	protected DoChallenge() {
		if (this.GetLadderModel().challgeNum <= 0) {
			UserTips.InfoTip("挑战次数不足");
			return;
		}
		if (this.IsMacth()) {
			UserTips.InfoTip("匹配中")
			return
		}
		if (!UserFb.CheckActMap()) {
			return
		}
		this.ingImg.visible = true
		this.PlayAnim()
		this.GetLadderModel().sendGetSomeOne()
		this.m_TimeOutID = egret.setTimeout(() => {
			UserTips.InfoTip("请求超时");
			this._ClearTimeOut()
			this.ClearMatchInfo()
		}, this, 5000)
	}

	/**
     * 设置自己的数据显示
     */
	setMyHead() {
		var model = SubRoles.ins().GetRoleData()
		this.myName.text = GameLogic.ins().actorModel.name;
		this.myhead.source = ResDataPath.GetLadderHead(model.job, model.sex)
	}

	private ClearMatchInfo() {
		this.otherHeadList.scrollV = 0
		this.ingImg.visible = false
		this.enterTime.visible = false
		this.otherLevel.visible = false;
	}

	// private _SetBackState(matching: boolean, result: boolean = false) {
	// 	egret.Tween.removeTweens(this.otherHeadList)
	// 	this.ingImg.visible = matching
	// 	if (result) {

	// 	} else {
	// 		this.otherHeadList.scrollV = 0
	// 	}
	// }

	private PlayAnim() {

		egret.Tween.removeTweens(this.otherHeadList)
		let tween = egret.Tween.get(this.otherHeadList)
		tween.wait(LadderInfoPanel.WAIT_TIME)
		this.otherHeadList.scrollV = 0
		let y = 0
		for (let i = 0; i < this.m_OtherHeadList.length - 1; ++i) {
			y += 284
			// console.log("Y:========  "+ y);
			let index = i
			tween.to({ scrollV: y }, LadderInfoPanel.DUR_TIME, egret.Ease.circOut).call(() => {
				this.ShowPlayerInfo(this.m_OtherHeadList[index + 1])
			}, this).wait(LadderInfoPanel.WAIT_TIME)
		}
		tween.call(() => {
			this.rollOver()
		})
	}

	private ShowPlayerInfo(data: Sproto.sc_ladder_player_back_request) {
		if (!data) {
			this.otherName.text = ""
			return
		}
		this.otherLevel.visible = true;
		this.otherName.text = GameString.GetSerAndName(data.serverid, data.name)
		this.SetLevelName(this.otherLevel, data.grade)
	}

	public static DUR_TIME = 286
	public static WAIT_TIME = 286

	private mActorInfo: Sproto.sc_ladder_player_back_request = null

	playerBack() {
		this._ClearTimeOut();
		let info = this.mActorInfo = this.GetLadderModel().getActorInfo()
		if (info && info.id) {
			this.m_OtherHeadList[this.m_OtherHeadList.length - 1] = info
		}
		(this.otherHeadList.dataProvider as eui.ArrayCollection).replaceAll(this.m_OtherHeadList)
	}

    /**
     * 对手头像滚动完成
     */
	rollOver() {
		egret.Tween.removeTweens(this.otherHeadList)
		this.ingImg.visible = false
		this.enterTime.visible = true;
		this.rollTime = 3;
		//进入倒计时xxx秒
		this.enterTime.text = "进入倒计时 " + this.rollTime + " 秒";

		let info = this.mActorInfo
		if (!info || info.id == 0) {
			UserTips.ins().showTips("|C:0xff0000&T:未匹配到对手|");
			this.ClearMatchInfo()
		} else {
			this.timeOut = egret.setInterval(this.refushLabel, this, 1000);
		}
	}

	refushLabel() {
		this.rollTime--;
		//进入倒计时xxx秒
		this.enterTime.text = "进入倒计时 " + this.rollTime + " 秒";
		if (this.rollTime < 1) {
			this.sendStarPlay();
			egret.clearInterval(this.timeOut);
		}
	};

	//开始挑战
	protected sendStarPlay() {
		let info = this.mActorInfo
		this.GetLadderModel().sendStarPlay(info.id, info.type);
	}
}

class LadderInfoHeadItem extends eui.ItemRenderer {
	img: eui.Image

	public dataChanged() {
		let data = this.data as Sproto.sc_ladder_player_back_request
		if (data.job == -1) {
			this.img.source = "ui_wzzb_wenhao"
		} else {
			this.img.source = ResDataPath.GetLadderHead(data.job, data.sex)
		}
	}
}
