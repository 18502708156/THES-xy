/** 战斗结束事件 */
class BattleFinishData extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_FINISH
	public ret: number = 0
	public isWin: boolean

	public DoExecute() {
	}
}

/** 录像战斗结束事件 */
class BattleVideoFinishData extends BattleFinishData {

	private cb: Function

	public constructor(cb: Function) {
		super()
		this.cb = cb
	}

	public DoExecute() {
		GameGlobal.RaidMgr.EnterCurMapRaid()
		if (this.cb) {
			this.cb()
			this.cb = null
		}
	}
}

/** 挂机战斗结束事件 */
class BattleNormalFinishData extends BattleFinishData {
	public DoExecute() {
		GameMap.GetBattleView().StartHide(() => {
			// 防止播放动画的时候副本切换了。
			if (GameGlobal.RaidMgr.mBattleRaid != this.mContext) {
				return
			}
			GameGlobal.RaidMgr.EnterCurMapRaid()
			GameGlobal.UserFb.sendWaveMonster()
		})
	}
}

/** 关卡战斗结束事件 */
class BattleDefaultFinishData extends BattleFinishData {
	public rewards: RewardData[] = []
	public star: number = null

	public DoExecute() {
		if (BattleMap.mFbType == UserFb.FB_TYPE_GANGMAP) //帮会地图战斗结束不弹结算界面
		{
			if (this.ret == 1) {
				GameGlobal.RaidModel.SendGetBossReward()
				GameGlobal.RaidMgr.ExitFbAndEnterMap()
				return
			}

			GameGlobal.UserFb.sendExitFb()
			return
		}
		if (this.ret == 1 || this.ret == 3) {
			ViewManager.ins().open(ResultWinPanel, this.rewards, () => {
				GameGlobal.RaidModel.SendGetBossReward()

				if (BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR && GameGlobal.GangBattleModel.NeedJumpToOutsider() 
					&& this.ret == 3) {//帮会战 非南天门和殿前战斗失败情况的处理
					GameGlobal.UserFb.sendExitFb()
					GameGlobal.GangBattleModel.SendEnterBattle()
					return
				}

				GameGlobal.RaidMgr.ExitFbAndEnterMap()
			}, this.star, this.ret)
		} else {
			if (BattleMap.IsGuanQiaBoss()) {
				GameGlobal.UserFb.mAuto = false
			}

			ViewManager.ins().open(ResultFailPanel, this.rewards, () => {
				if (GameGlobal.UserFb.bCbtAutoFight) {
					GameGlobal.UserFb.bCbtAutoFight = false//藏宝图自动战斗中断
				}
				if (GameGlobal.UserFb.bTianTingAutoFight) {
					GameGlobal.UserFb.bTianTingAutoFight = false//勇闯天庭自动战斗中断
				}

				if ((BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR || BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR_PK)
				   && GameGlobal.GangBattleModel.NeedJumpToOutsider()) { //帮会战 非南天门和殿前战斗失败情况的处理
					if (GameGlobal.GangBattleModel.IsInOutsideScience())
					{
						GameGlobal.RaidMgr.ExitFbAndEnterMap()
						GameGlobal.GangBattleModel.SendEnterBattle()
						return
					}

					GameGlobal.UserFb.sendExitFb()
					GameGlobal.GangBattleModel.SendEnterBattle()
					return
				}

				GameGlobal.RaidMgr.ExitFbAndEnterMap();
			}, this.ret)
		}
	}
}

/**竞技结束 */
class ArenaPKFinishData extends BattleDefaultFinishData {
	public maxrank: number;
	public rank: number;
	public lastrank: number;

	public DoExecute() {
		if (!this.isWin && BattleMap.IsGuanQiaBoss()) {
			GameGlobal.UserFb.mAuto = false;
		}
		ViewManager.ins().open(ArenaPKResultPanel, this.isWin, this.rewards, this.maxrank, this.rank, this.lastrank, () => {
			GameGlobal.Arena.sendGetRewards();
			GameGlobal.RaidMgr.ExitFbAndEnterMap();
		})
	}
}

/**跨服争霸结束 */
class CrossFinishData extends BattleDefaultFinishData {
	public iswin: boolean
	public commonpoint: number
	public DoExecute() {
		ViewManager.ins().open(this.iswin ? CrossBattleResultWin : CrossBattleResultFailWin, this.commonpoint, () => {
			GameGlobal.RaidMgr.ExitFbAndEnterMap();
		})
	}
}

/**捕捉宠物*/
class CatchPetFinishData extends BattleDefaultFinishData {
	public iswin: boolean
	public id: number
	public DoExecute() {
		ViewManager.ins().open(this.iswin ? CatchPetResultWin : CatchPetResultFailWin, this.id, () => {
			GameGlobal.RaidMgr.EnterCurMapRaid()
		})
	}
}

/**
 * 仙道会
 */
class XiandaoFinishData extends BattleDefaultFinishData {
	public roleData: Sproto.qualifyingMgr_role_data[] = []

	public DoExecute() {
		// 关闭界面的时候请求地图数据
		if (GameGlobal.XiandaoModel.IsKnockout()) {
			GameGlobal.XiandaoModel.SendGetTime()
		} else {
			GameGlobal.XiandaoModel.SendGetMapInfo()
		}

		GameGlobal.RaidMgr.ExitFbAndEnterMap();
		ViewManager.ins().open(XiandaoResultPanel, this.isWin, this.roleData)
	}
}

class CrossBossFinishData extends BattleFinishData {

	public rewards: Sproto.reward_data[] = []

	public DoExecute() {
		let view = ViewManager.ins().open(ResultAcrossBossPanel, this.rewards) as ResultAcrossBossPanel
		view.SetCloseFunc(() => {
			GameGlobal.RaidModel.SendGetBossReward();
			GameGlobal.RaidMgr.ExitFbAndEnterMap();
		})
	}
}

class LadderFinishData extends BattleFinishData {
	isWin//是否胜利	
	list //奖励数据列表	
	upGrade //之前的level
	upStar //之前的id
	changeStar //加了多少星

	public DoExecute() {
		let view = ViewManager.ins().open(LadderResultWin, this.isWin, this.list, this.upGrade, this.upStar, this.changeStar);
	}
}