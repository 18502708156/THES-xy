class CrossBattleModel extends BaseSystem {

	public UpGroup: boolean = true

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_king_info, this.getKingInfo)              //跨服争霸数据
		//this.regNetMsg(S2cProtocol.sc_king_point_info,this.kingPointInfo)       //个人积分
		this.regNetMsg(S2cProtocol.sc_king_begin_act, this.startKingBegin)       //活动开始 
		this.regNetMsg(S2cProtocol.sc_king_city_data, this.getKingCityData)      //返回单个城池信息
		this.regNetMsg(S2cProtocol.sc_king_status_change, this.statusInfo)       //状态变更 
		this.regNetMsg(S2cProtocol.sc_king_player_enter, this.goPlayer)          //有玩家进去
		this.regNetMsg(S2cProtocol.sc_king_player_leave, this.levelPlayer)       //有玩家离开
		this.regNetMsg(S2cProtocol.sc_king_transform_change, this.transformPlay) //变身状态变更
		this.regNetMsg(S2cProtocol.sc_king_point_data, this.getModel)            //积分
		this.regNetMsg(S2cProtocol.sc_king_attack_result, this.AttackCityResult) //攻城结算
		this.regNetMsg(S2cProtocol.sc_king_pk_result, this.AttackPkResult)       //PK结算
		this.regNetMsg(S2cProtocol.sc_king_point_info, this.uudatePointInfo)
		this.regNetMsg(S2cProtocol.sc_king_reborn_countdown, this.fuHuoTime)
		this.regNetMsg(S2cProtocol.sc_king_my_guard_city, this.myGuardCity)
		this.regNetMsg(S2cProtocol.sc_king_update_city, this.upDateCity)
		this.regNetMsg(S2cProtocol.sc_king_info_update, this.kingCitysUpdata)
		this.regNetMsg(S2cProtocol.sc_king_fighting_change, this.kingFightingChange)
		this.regNetMsg(S2cProtocol.sc_king_report, this.getEndAwardPanelData);

		//	this.regNetMsg(S2cProtocol.sc_king_transform_change,this.transformPlay)   
	}

	public getKingCityInfo() {
		let data = new Sproto.cs_king_city_data_request();
		data.camp = GameGlobal.GameLogic.actorModel.job;
		this.Rpc(C2sProtocol.cs_king_city_data, data);
	}

	public camp: number       //自己的阵营
	public status: number     //我的状态   #我的状态 1准备 2自由行动 3死亡 4守城
	public reborncout: number = 1 //复活时间 #复活倒计时 如果死亡状态的话
	public players: Sproto.king_player_info[] = []    // 所有玩家
	public citys: Sproto.king_city_info[] = []
	public fighting: number[] = []      //战斗中的玩家 
	public transform: number[] = []     //变身中的玩家
	public camppoint: Sproto.king_camp_point[] = []   //所有城积分
	public citypoint: number = 0    //王城积分
	public commonpoint: number = 0  //个人积分
	public oneCity: Sproto.sc_king_city_data_request   //单个城池信息临时存放
	public cityreward: number[] = []   //主城索引
	public commonreward: number[] = [] //个人索引
	public actcountdown: number = 0 //活动倒计时

	public getCityInfo(index) {
		for (var i = 0; i < this.citys.length; i++) {
			if (this.citys[i].camp == index) {
				return this.citys[i].guards
			}
		}
	}

	public getKingInfo(rsp: Sproto.sc_king_info_request) {
		this.camp = rsp.camp;
		this.status = rsp.status;
		this.reborncout = rsp.reborncout + GameServer.serverTime
		this.players = rsp.players;
		this.citys = rsp.citys;
		//this.fighting =  rsp.fighting;
		this.camppoint = this.campPointPx(rsp.camppoint);
		this.transform = rsp.transform;
		this.actcountdown = rsp.actcountdown > 0 ? (rsp.actcountdown + GameServer.serverTime) : 0
		this.addfightingIcon();
		GameGlobal.MessageCenter.dispatch(MessageDef.SHOUCITY_UPDATE_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_MAINJNFEN_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO)
		ViewManager.ins().close(ActivityWin)
		ViewManager.ins().close(GameCityPanel)
	}

	public bianShen() {
		let raid = GameGlobal.RaidMgr.mMapRaid
		for (let i = 0; i < this.transform.length; i++) {
			if (raid.mEntityList[this.transform[i]]) {
				raid.ShapeShift(this.transform[i], "monster/warcar_001");
			}
		}
	}

	public campPointPx(points: Sproto.king_camp_point[]): Sproto.king_camp_point[] {
		points.sort((lhs, rhs) => {
			return rhs.point - lhs.point
		})
		return points
	}

	public getPlayerStatus(handle: number) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].dbid == handle) {
				return this.players[i].status
			}
		}
		return 0
	}

	public getPlayerCamp(handle: number) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].dbid == handle) {
				return this.players[i].camp
			}
		}
		return 0
	}

	public DelayAddfightingIcon() {
		TimerManager.ins().doTimer(200, 1, () => {
			if (egret.is(GameGlobal.RaidMgr.mMapRaid, "MapRaidCrossBattle")) {
				this.addfightingIcon()
			}
		}, this)
	}

	public addfightingIcon() {
		let allEntityList = GameGlobal.RaidMgr.mMapRaid.mEntityList
		for (let key in allEntityList) {
			allEntityList[key].ChageStatus(EntityStatusView.NONE);
		}
		for (let i = 0; i < this.fighting.length; i++) {
			let player = this.fighting[i]
			if (allEntityList[player]) {
				allEntityList[player].ChageStatus(EntityStatusView.ATK)
			}
		}
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i]
			let entity = allEntityList[player.dbid]
			if (entity) {
				if (player.status == EntityStatusView.DIE) {
					allEntityList[player.dbid].ChageStatus(EntityStatusView.DIE);
				}
				allEntityList[player.dbid].SetType(this.ZHENGTYPE[player.camp]);
			}
		}

		// let actorID = GameGlobal.actorModel.actorID
		// if (allEntityList[actorID]) {
		// 	allEntityList[actorID].visible = true
		// }

		GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO)
	}

	public getCitysInfo(camp) {
		for (let i = 0; i < this.citys.length; i++) {
			if (this.citys[i].camp == camp) {
				return this.citys[i]
			}
		}
		return
	}

	public getPerJf() {
		let config = GameGlobal.Config.KingPointsRewardConfig
		let configData = []
		for (let data in config) {
			configData.push(data);
		}
		for (let i = 0; i < configData.length; i++) {
			if (this.commonpoint < config[configData[i]].partnerpoints) {
				return this.commonpoint + "/" + config[configData[i]].partnerpoints
			} else {
				if (this.commonreward.indexOf(config[Number(configData[i])].id) == -1) {
					return this.commonpoint + "/" + config[configData[i]].partnerpoints
				}
			}
		}
		return this.commonpoint + "/" + config[configData[configData.length - 1]].partnerpoints
	}

	// public getPerNextJf() {
	// 	let config = GameGlobal.Config.KingPointsRewardConfig
	// 	let configData = []
	// 	for(let data in config){
	//         configData.push(data);
	// 	}
	// 	for(let i = 0 ; i<configData.length ; i++){
	// 		 if(this.commonpoint < config[configData[i]].partnerpoints){
	// 			 return config[configData[i]].partnerpoints
	// 		 }
	// 		 return config[configData[configData.length-1]].partnerpoints
	// 	}		
	// }

	// public getCityNextJf() {
	// 	let config = GameGlobal.Config.KingWPointsRewardConfig
	// 	let configData = []
	// 	for(let data in config){
	//         configData.push(data);
	// 	}
	// 	for(let i = 0 ; i<configData.length ; i++){
	// 		 if(this.citypoint < config[configData[i]].citypoints){
	// 			 return config[configData[i]].citypoints
	// 		 }
	// 		 return config[configData[configData.length-1]].citypoints
	// 	}		
	// }	

	//获取BUFF效果
	public getBuff() {
		// let city = this.getCitysInfo(camp)
		// if(!city){
		// 	return 
		// }
		// if(city.camp == this.camp){
		// 	return  
		// }
		//return city.currcamp
		let buf = []
		for (let i = 1; i < 4; i++) {
			let city = this.getCitysInfo(i)
			if (city && this.camp != city.camp && city.currcamp == this.camp) {
				buf.push(city.camp);
			}
		}
		return buf
	}

	public kingFightingChange(rsp: Sproto.sc_king_fighting_change_request) {
		this.fighting = rsp.fighting
		this.addfightingIcon()
	}

	public kingPointInfo(rsp: Sproto.sc_king_point_info_request) {
		// this.citypoint = rsp.citypoint;
		// this.commonpoint = rsp.commonpoint;
		// 奖励索引还没搞。
	}

	//玩家进入
	public goPlayer(rsp: Sproto.sc_king_player_enter_request) {
		this.players.push(rsp.player);
		this.addfightingIcon()
	}

	//玩家离开
	public levelPlayer(rsp: Sproto.sc_king_player_leave_request) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].dbid == rsp.dbid) {
				this.players.splice(i, 1)
				return
			}
		}
	}

	//玩家状态信息 
	public statusInfo(rsp: Sproto.sc_king_status_change_request) {
		if (rsp.dbid == GameGlobal.GameLogic.actorModel.actorID) {
			this.status = rsp.status
			if (rsp.status != 3) {
				this.reborncout = 1;
				GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO)
			}
		}
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].dbid == rsp.dbid) {
				this.players[i].status = rsp.status;
				this.addfightingIcon()
				break
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.SHOUCITY_UPDATE_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO)

	}

	public startKingBegin() {
		console.log("活动开始");  //全部变自由
	}

	CITYNAME = [
		"王城",
		"人族",
		"仙族",
		"魔族"
	]

	ZHENGNAME = [
		"公共",
		"人族阵营",
		"仙族阵营",
		"魔族阵营"
	]

	ZHENGTYPE = [
		"",
		"ui_hddt_bm_renzu",
		"ui_hddt_bm_xianzu",
		"ui_hddt_bm_mozu",
		"",
	]

	BUFFTYPE = [
		"",
		"ui_hddt_bm_renzubuff",
		"ui_hddt_bm_xianzubuff",
		"ui_hddt_bm_mozibuff"
	]

	TYPECOLOR = [
		,
		"ui_hddt_bm_renzudian",
		"ui_hddt_bm_xianzudian",
		"ui_hddt_bm_mozudian"
	]

	public SendRecruit() {
		this.Rpc(C2sProtocol.cs_king_team_recruit)
	}

	//请求单个城池数据
	public sendKingCityData(type: number) {
		let data = new Sproto.cs_king_city_data_request()
		data.camp = type
		this.Rpc(C2sProtocol.cs_king_city_data, data);
	}

	//返回单个城池数据
	public getKingCityData(rsp: Sproto.sc_king_city_data_request) {
		this.oneCity = rsp
		this.oneCity.guardtime = GameServer.serverTime - this.oneCity.guardtime
		if (this.status == 1) {
			UserTips.InfoTip("活动还未开始")
		}
		if (rsp.currcamp == this.camp && this.getRoleBool(rsp.guards)) {
			ViewManager.ins().open(CrossBattleCityInfomaTion)
		} else {
			ViewManager.ins().open(CrossBattleCityInfoWarn)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_ONECITY_INFO)
	}

	//判断城池中是否自己在守城
	public getRoleBool(guards: Sproto.king_guard_info[]) {
		for (let i = 0; i < guards.length; i++) {
			if (guards[i].dbid == GameGlobal.GameLogic.actorModel.actorID) {
				return true
			}
		}
		return false
	}

	//攻城 
	public attackCity(camp: number) {
		let att = new Sproto.cs_king_city_attack_request()
		att.camp = camp
		this.Rpc(C2sProtocol.cs_king_city_attack, att);
		GameGlobal.ViewManager.close(CrossBattleCityInfoWarn)
	}

	//防守 
	public fangShouCity(camp: number) {
		let att = new Sproto.cs_king_city_guard_request()
		att.camp = camp;
		this.Rpc(C2sProtocol.cs_king_city_guard, att);
		GameGlobal.ViewManager.close(CrossBattleCityInfoWarn)
	}

	//自由PK
	public freePk(id: number) {
		let roleID = new Sproto.cs_king_pk_request()
		roleID.targetid = id;
		this.Rpc(C2sProtocol.cs_king_pk, roleID);
	}

	//变身中的玩家状态变更
	public transformPlay(rsp: Sproto.sc_king_transform_change_request) {
		// if(rsp.istransform){
		// 	this.transform.push(rsp.dbid)
		// }else{
		// 	this.transform.splice(this.transform.indexOf(rsp.dbid),1)
		// }
		this.chageBianShen(rsp)
	}

	public chageBianShen(rsp: Sproto.sc_king_transform_change_request) {
		let raid = GameGlobal.RaidMgr.mMapRaid
		if (!raid.mEntityList[rsp.dbid]) {
			return
		}
		if (rsp.istransform) {
			this.transform.push(rsp.dbid)
			raid.ShapeShift(rsp.dbid, "monster/warcar_001")
		} else {
			this.transform.splice(this.transform.indexOf(rsp.dbid), 1)
			raid.replyShapeShift(rsp.dbid)
		}

	}

	//list列表移动
	public listMoveMap(data: number) {
		let config = GameGlobal.Config.KingBaseConfig.citypos
		switch (data) {
			case 0:
				config = GameGlobal.Config.KingBaseConfig.citypos;
				break;
			case 1:
				config = GameGlobal.Config.KingBaseConfig.rcitypos;
				break;
			case 2:
				config = GameGlobal.Config.KingBaseConfig.mcitypos;
				break;
			case 3:
				config = GameGlobal.Config.KingBaseConfig.xcitypos;
				break;
		}
		GameGlobal.RaidMgr.mMapRaid.MoveOrder(data, config[0], config[1])
	}

	//复活
	public fuHuo() {
		this.Rpc(C2sProtocol.cs_king_pay_revive)
	}

	public getModel(rsp: Sproto.sc_king_point_data_request) {
		if (this.citypoint != rsp.citypoint) {
			let num = rsp.citypoint - this.citypoint
			if (num <= 0) {
				return
			}
			UserTips.InfoTip("王城积分+" + num)
		}
		if (this.commonpoint != rsp.commonpoint) {
			let num = rsp.commonpoint - this.commonpoint
			if (num <= 0) {
				return
			}
			UserTips.InfoTip("贡献+" + num)
		}
		this.citypoint = rsp.citypoint
		this.commonpoint = rsp.commonpoint
		this.cityreward = rsp.cityreward
		this.commonreward = rsp.commonreward
		GameGlobal.MessageCenter.dispatch(MessageDef.JF_UPDATE_INFO)
	}

	public getCity(orderId: number, handle: number) {
		if (orderId != MoveTeam.NONE_ORDER && GameGlobal.GameLogic.actorModel.actorID != handle) {
			return
		}
		this.sendKingCityData(orderId);
		//this.sendKingCityData()
	}

	//获取玩家积分数据
	public getJfModel() {
		this.Rpc(C2sProtocol.cs_king_point_data)
	}

	public huoQuJiangLi(type: number, index: number) {
		let data = new Sproto.cs_king_get_point_reward_request()
		data.pointtype = type
		data.index = index
		this.Rpc(C2sProtocol.cs_king_get_point_reward, data)
	}

	//变身请求
	public getBs() {
		if (GameGlobal.CrossBattleTeamModel.mTeamInfo.HasTeam()) {
			UserTips.ErrorTip("处于组队中，无法变身")
			return
		}
		ViewManager.ins().close(CrossBattleChargeWarn)
		this.Rpc(C2sProtocol.cs_king_transform)
	}

	//攻城结果
	public AttackCityResult(rsp: Sproto.sc_king_attack_result_request) {

		let raid = GameGlobal.RaidMgr.mBattleRaid
		if (raid) {
			let finishAction = new CrossFinishData
			finishAction.iswin = rsp.iswin
			finishAction.commonpoint = rsp.commonpoint
			raid.SetFinishAction(finishAction)
		}

		// ViewManager.ins().open(rsp.iswin?CrossBattleResultWin:CrossBattleResultFailWin,null,() => {
		// 		GameGlobal.UserFb.sendExitFb();
		//         GameGlobal.RaidMgr.EnterCurMapRaid();
		// 	})
		//GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)
	}

	public AttackPkResult(rsp: Sproto.sc_king_pk_result_request) {
		// ViewManager.ins().open(rsp.iswin?CrossBattleResultWin:CrossBattleResultFailWin,null,() => {
		// 		GameGlobal.UserFb.sendExitFb();
		//         GameGlobal.RaidMgr.EnterCurMapRaid();
		// 	})
		// //GameGlobal.UserFb.Rpc(C2sProtocol.cs_raid_next_map)	

		let raid = GameGlobal.RaidMgr.mBattleRaid
		if (raid) {
			let finishAction = new CrossFinishData
			finishAction.iswin = rsp.iswin
			finishAction.commonpoint = rsp.commonpoint
			raid.SetFinishAction(finishAction)
		}
	}

	public uudatePointInfo(rsp: Sproto.sc_king_point_info_request) {
		this.camppoint = this.campPointPx(rsp.camppoint)
		GameGlobal.MessageCenter.dispatch(MessageDef.KFZB_MAINJNFEN_INFO)
	}

	public fuHuoTime(rsp: Sproto.sc_king_reborn_countdown_request) {
		this.reborncout = rsp.reborncout + GameServer.serverTime
		GameGlobal.MessageCenter.dispatch(MessageDef.FUHUO_UPDATE_INFO)
	}

	public GetDeadTime(): number {
		if (this.reborncout) {
			return Math.max(this.reborncout - GameServer.serverTime, 0)
		}
		return 0
	}

	public upDateCity(rsp: Sproto.sc_king_update_city_request) {
		this.citys = rsp.citys
		GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO)
	}

	public kingLeave() {
		this.Rpc(C2sProtocol.cs_king_leave)
	}

	public MyShouCity: number = 99
	public myGuardCity(rsp: Sproto.sc_king_my_guard_city_request) {
		this.MyShouCity = rsp.city
		GameGlobal.MessageCenter.dispatch(MessageDef.SEND_CITY)
	}

	public myGuardCityCs() {
		this.Rpc(C2sProtocol.cs_king_my_guard_city)
	}

	public kingCitysUpdata(rsp: Sproto.sc_king_info_update_request) {
		for (let i = 0; i < this.citys.length; i++) {
			if (this.citys[i].camp == rsp.citys.camp) {
				this.citys.splice(i, 1)
				this.citys.push(rsp.citys)
				break
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.CITYTYPE_UPDATE_INFO)
	}

	public getEndAwardPanelData(rep: Sproto.sc_king_report_request) {
		if (rep) {
			let data = new activityEndAwardData()
			data.award = rep.rewards;
			data.paneltitle = "跨服争霸";
			let selfRank = 0
			for (let key in rep.sharedata.rank) {
				if (rep.sharedata.rank[key] == rep.persondetail.camp) {
					selfRank = parseInt(key) + 1
					break;
				}
			}

			data.rankTxt = `我方阵营排名：第${selfRank}名`
			if (!rep.sharedata.rank)
				data.rankTxt = `本次跨服争霸无人胜出`

			let icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
			icon1Date.titleName = "本届跨服争霸胜方";
			// icon1Date.iconSrc = iconSrc
			if (rep.persondetail.camp == 1) {
				icon1Date.name = "人族阵营";
				icon1Date.iconSrc = "ui_hddt_bm_renzu"
			}
			else if (rep.persondetail.camp == 2) {
				icon1Date.name = "仙族阵营";
				icon1Date.iconSrc = "ui_hddt_bm_xianzu"
			}
			else if (rep.persondetail.camp == 3) {
				icon1Date.name = "魔族阵营";
				icon1Date.iconSrc = "ui_hddt_bm_mozu"
			}
			data.icon1 = icon1Date;
			ViewManager.ins().open(ActivityEndAwardPanel, data);
		}
	}
} 