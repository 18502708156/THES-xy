
class GuanQiaRewardPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "关卡"

    /////////////////////////////////////////////////////////////////////////////
    // GuanqiajiangliSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected challengeBtn: eui.Button;
    protected btn_help: eui.Button;
    protected lb_beHelpNum: eui.Label;
    protected lb_helpNum: eui.Label;
    protected showRankTxt: eui.Label;
    protected mapNameTxt: eui.Label;
    protected needWave: eui.Label;
    protected lb_r0: eui.Label;
    protected lb_r1: eui.Label;
    protected lb_r2: eui.Label;
    protected gchapreward: ItemBaseNotName;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected itemGroup: eui.Group;
    protected item0: ItemBaseNotName;
    protected item1: ItemBaseNotName;
    protected item2: ItemBaseNotName;
    protected item3: ItemBaseNotName;
    protected item4: ItemBaseNotName;
    protected showPanel: PetShowPanel;
    /////////////////////////////////////////////////////////////////////////////



	/** 宝箱指向关卡 */
	boxPass = 0;

	info

	guideHand = null
	guideFrame = null

	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.challengeBtn
		}
	}

	public constructor() {
		super()


	}


	protected childrenCreated(): void {
		this.challengeBtn.visible = false
		this.bar.value = 0
	};
	OnOpen() {
		this.AddClick(this.showRankTxt, this.onTouchTap)
		this.AddClick(this.challengeBtn, this.onTouchTap)
		this.AddClick(this.btn_help, this.onTouchTap)
		this.observe(MessageDef.FUBEN_CHANGE, this.upDataGuanqia)
		GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_FB);
		this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, this.UpdateContent)
		this.UpdateContent();
		TimerManager.ins().doTimer(100, 1, this.startUpdateRule, this); //时间更新函数
	};
	OnClose() {
		GuanQiaRewardPanel.CLICK_TASK_COMEIN = false
		// this.simpleRankPanel.close()
		//  TimerManager.ins().remove(this.hideGuideHand, this)
		// this.hideGuideHand()
	};

	private startUpdateRule()
	{
		
	}

	onTouchTap(e) {
		switch (e.currentTarget) {
			case this.challengeBtn:
				if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
					BagFullTipsPanel.Open()
				} else {
					GameGlobal.UserFb.sendPKBoss()
				}
				break;
			case this.showRankTxt:
				ViewManager.ins().open(GuanQiaRankPanel)
				break;
			case this.btn_help:
					if(Deblocking.Check(DeblockingType.TYPE_49)&&Deblocking.Check(DeblockingType.TYPE_115))
					{
						if(GameGlobal.UserFb.isShowBossPK())
						{
							GameGlobal.Chat.chatShareInfo(20, null);//目前只有世界
							UserTips.InfoTip("已发送求助信息到世界聊天")
							// UserTips.ins().showTips("5秒后才能再请求")
						}
						else
						{
							UserTips.ins().showTips("请先击杀剩余怪物")
						}

					}
				break;
		}
	};
	upDataGuanqia() {
		this.UpdateContent();
	};
	upDateGuanqiaWroldReward() {
		this.boxPass = GameGlobal.UserFb.getWorldGuanQia()
	};

	/** 获取头像下表计算起始值 */
	getPassIndex(guanqiaID) {
		var index;
		if (guanqiaID % GuanQiaRewardPanel.BOSS_HEAD_COUNT == 0)
			index = guanqiaID - GuanQiaRewardPanel.BOSS_HEAD_COUNT + 1;
		else
			index = guanqiaID - guanqiaID % GuanQiaRewardPanel.BOSS_HEAD_COUNT + 1;
		return index;
	};

	UpdateContent() {
		let rankData: Sproto.sc_rank_data_request = GameGlobal.RankingModel.ranks[RankingModel.RANK_TYPE_FB];
		if (rankData)
			for (let value of rankData.datas) {
				if (value.pos == 1)
					this.lb_r0.text = `${value.pos}  ${value.name}  ${value.chapterlevel}关`
				else if (value.pos == 2)
					this.lb_r1.text = `${value.pos}  ${value.name}  ${value.chapterlevel}关`
				else if (value.pos == 3)
					this.lb_r2.text = `${value.pos}  ${value.name}  ${value.chapterlevel}关`
			}

		var guanqiaID = GameGlobal.UserFb.guanqiaID;
		var bossReward = GameGlobal.UserFb.config.showAward

		// var [config, isReward]  = ChapterRewardPanel.IsReward()
		let isReward = false

		// var config = GlobalConfig.ins().ChaptersRewardConfig[GameGlobal.UserFb.guanqiaReward];
		// var preConfig = GlobalConfig.ins().ChaptersRewardConfig[GameGlobal.UserFb.guanqiaReward - 1];
		// if (!config) {
		// 	config = preConfig;
		// } else {
		// 	this.bar.maximum = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
		// 	this.bar.value = guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
		// 	isReward = this.bar.value >= this.bar.maximum
		// }

		//关卡求助内容

    // appealtime = 0
    // helptime = 0

		let nMaxAppeal = GlobalConfig.ins().ChaptersCommonConfig.appealtime ||0
		let nMaxHelp = GlobalConfig.ins().ChaptersCommonConfig.helptime ||0
		this.lb_helpNum.text = "已求助次数：" +  GameGlobal.UserFb.appealtime + "/" + nMaxAppeal
		this.lb_beHelpNum.text = "可协助次数：" +  GameGlobal.UserFb.helptime + "/" + nMaxHelp

		let guanqiaId = GameGlobal.UserFb.guanqiaID - 1
		let chapterConfig = GameGlobal.Config.ChaptersRewardConfig[Math.floor(guanqiaId / 10) + 1]
		this.gchapreward.data = chapterConfig.rewards[0]
		this.bar.maximum = 10
		this.bar.value = guanqiaId % 10

		this.showPanel.SetBodyId(Number(GameGlobal.UserFb.config.bossId.avatar))

		this.mapNameTxt.text = "第" + GameGlobal.UserFb.guanqiaID + "关 " + GameGlobal.UserFb.Desc
		var item;
		for (var i = 0; i < this.itemGroup.numChildren; i++) {
			item = this.itemGroup.getChildAt(i);
			if (bossReward[i]) {
				item.data = bossReward[i];
			}
			else {
				DisplayUtils.removeFromParent(item);
			}
		}
		let userFb = GameGlobal.UserFb
		this.updateChallenge();
		this.showChallengeGuide();
	};
	/**是否通过点击任务列表进来的 */
	public static CLICK_TASK_COMEIN: boolean 
	updateChallenge() {
		if(GuanQiaRewardPanel.CLICK_TASK_COMEIN && GameGlobal.UserFb.guanqiaID < GameGlobal.Config.GuideBaseConfig.chapterid)
		{
			this.challengeBtn.visible = true;
		} else {
			this.challengeBtn.visible = GameGlobal.UserFb.isShowBossPK();
		}
		
		this.needWave.visible = !this.challengeBtn.visible;
		this.needWave.text = "再击杀" + GameGlobal.UserFb.getNeedWave() + "波怪物可挑战";
		if (GameGlobal.UserFb.guanqiaID >= GameGlobal.UserFb.checkGuanKaMax()) {
			this.challengeBtn.visible = false;
			this.needWave.visible = true;
			this.needWave.text = "恭喜通关所有关卡";
		}
	};
    /**
     * 显示挑战引导
     * @returns void
     */
	showChallengeGuide() {
		
	};

	/** boss头像数量 */
	public static BOSS_HEAD_COUNT = 10;
}