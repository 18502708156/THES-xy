class CommonRaidModel extends BaseSystem {

	public mMainCityInfo: Sproto.sc_map_maincity_info_request
	public mChannelInfos: Sproto.maincity_channel_data[]
	public mRecordChannelId: number

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_map_enter, this._MapEnter)
		this.regNetMsg(S2cProtocol.sc_map_other_enter, this._MapOtherEnter)
		this.regNetMsg(S2cProtocol.sc_map_other_leave, this._MapOtherLeave)
		this.regNetMsg(S2cProtocol.sc_map_other_move, this._MapOtherMove)
		this.regNetMsg(S2cProtocol.sc_map_other_fly,this._MapOtherFly)
		this.regNetMsg(S2cProtocol.sc_map_maincity_info,this._MainCityInfo)
		this.regNetMsg(S2cProtocol.sc_map_player_update,this._PlayerUpdate)
		this.regNetMsg(S2cProtocol.sc_map_player_status, this._PlayerStatus)
	}

	private m_Raid: {[key: number]: CommonMapRaid} = {}

	private GetRaid(): MapRaid {
		for (let k in this.m_Raid) {
			if (Number(k) == GameMap.TYPE_ID_CITY) {
				continue
			}
			return this.m_Raid[k]
		}
		return null
	}

	private ClearRaid() {
		for (let k in this.m_Raid) {
			if (Number(k) == GameMap.TYPE_ID_CITY) {
				continue
			}
			delete this.m_Raid[k]
		}
	}

	// 场景是否存在
	public get OpenClick(): boolean {
		return this.GetRaid() != null
	}
	
    public OnSocketClose() {
		// this.raid = null
		this.m_Raid = {}
    }	
	 
	public _MapEnter(rsp: Sproto.sc_map_enter_request) { 
		let mapid = rsp.mapid
		// if (mapid == GameMap.TYPE_ID_CITY) {
		// 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_CITY)
		// 	let raid = this.m_Raid[mapid] = GameGlobal.RaidMgr.EnterCityMapRaid()
		// 	raid.RemoveAllEntity()
		// 	raid.CreateRole(rsp.myself)
		// 	raid.CreateRoleList(rsp.entitylist)
		// 	ViewManager.ins().close(PlayFunView);
		// 	ViewManager.ins().close(GameCityPanel);
		// } else {
		// 	GameGlobal.RaidMgr.SetShowType(RaidMgr.TYPE_NORMAL)
			let cfg = GameGlobal.Config.MapConfig[mapid]
			let data = new GameMapData
			data.fubenID = mapid
			data.mapX = rsp.x
			data.mapY = rsp.y
			data.fbType = cfg.type
			let raid = GameGlobal.RaidMgr.EnterNewMapRaid(data) as CommonMapRaid;
			this.m_Raid[mapid] = raid

			raid.CreateRole(rsp.myself)
			raid.CreateRoleList(rsp.entitylist)
			GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST)
			// 先赋值，然后处理界面
			ViewManager.ins().close(PlayFunView);
			ViewManager.ins().close(GameCityPanel);
			ViewManager.ins().close(MainTop2Panel);
		// }
	}

	public _MapOtherEnter(rsp: Sproto.sc_map_other_enter_request) {
		// if (!this.raid) {
		// 	return
		// }
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
		raid.CreateRole(rsp.entity)
		GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST)
	}

	public _MapOtherLeave(rsp: Sproto.sc_map_other_leave_request) {
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
		if(rsp.id == GameGlobal.GameLogic.actorModel.actorID){
			this.EnterNormapMap()
		} else {
			raid.RemoveEntity(rsp.id) 
			GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST)
		}
	}

	public _MapOtherMove(rsp: Sproto.sc_map_other_move_request) {
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
		raid.OtherMoveTo(rsp.id, rsp.x, rsp.y)
		GameGlobal.MessageCenter.dispatch(MessageDef.MINI_MAP_UPDATE_LIST)
	}

	public _MapMove(mapId: number, x: number, y: number) {
		let Move = new Sproto.cs_map_move_request();
		Move.mapid = mapId;
		Move.x = x;
		Move.y = y;
		this.Rpc(C2sProtocol.cs_map_move, Move)
	}

	public _cs_map_fly(mapId: number, x: number, y: number) {
		let Fly = new Sproto.cs_map_fly_request();
		Fly.mapid = mapId;
		Fly.x = x;
		Fly.y = y;
		this.Rpc(C2sProtocol.cs_map_fly, Fly)
	}
	
	public _MapOtherFly(rsp:Sproto.sc_map_other_fly_request) {
		// if (!this.raid) {
		// 	return
		// }
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
       raid.FlyTo(rsp.id, rsp.x, rsp.y)      
	}

	private _PlayerUpdate(rsp: Sproto.sc_map_player_update_request) {
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
		raid.UpdateOtherRole(rsp)
	}

	private _PlayerStatus(rsp: Sproto.sc_map_player_status_request) {
		let raid = this.m_Raid[rsp.mapid]
		if (!raid) {
			return
		}
		raid.UpdatePlayerStatus(rsp.id, rsp.status)
	}

	private _MainCityInfo(rsp: Sproto.sc_map_maincity_info_request) {
		this.mMainCityInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.MAIN_CITY_INFO)
	}

	// 离开场景，进入挂机地图
	private EnterNormapMap() {
		let raid = this.GetRaid()
		if (!raid) {
			return
		}
		if (raid.mFbType == UserFb.FB_TYPE_CLOUD_NINE) {
			SubRoles.ins().GetRoleData().ClearTmpData()
		}
		this.ClearRaid()
		GameGlobal.ViewManagerImpl.CheckMainTop2Panel();
		GameGlobal.ViewManagerImpl.CheckPlayFunviewState();
		//返回挂机场景
		let data = new GameMapData
		data.fubenID = GameGlobal.UserFb.config.sid
		GameGlobal.RaidMgr.EnterNewMapRaid(data)
		console.log("已经退出");
	}

	public MapLeave() {
		let raid = this.GetRaid()
		if (!raid) {
			return
		}
		raid.OnLeave()

		let mapId = new Sproto.cs_map_leave_request();
		mapId.mapid = raid.mMapId;
		this.Rpc(C2sProtocol.cs_map_leave, mapId, (rsp: Sproto.cs_map_leave_response) => {
			if (rsp.ret) {
				this.EnterNormapMap()
			}
		});
	}
	
	public _MapGo(mapId: number) {
		let rsp = new Sproto.cs_map_enter_request();
		rsp.mapid = mapId;
		this.Rpc(C2sProtocol.cs_map_enter, rsp, (rsp: Sproto.cs_map_enter_response) => {
			if (rsp.ret) {
				console.log("已经进入");
			}
		});
	}
	
	public SendEnterCity(lineNo) {
		let req = new Sproto.cs_map_maincity_enter_request
		req.channelId = lineNo

		this.Rpc(C2sProtocol.cs_map_maincity_enter, req, (rsp: Sproto.cs_map_maincity_enter_response) => {
			if (!rsp.ret)
			{
				UserTips.ins().showTips("|C:0xdb0000&T:进入主城失败|")
			}
		}, this)
	}

	public SendWorship(type) {
		let req = new Sproto.cs_map_maincity_worship_request
		req.type = type

		this.Rpc(C2sProtocol.cs_map_maincity_worship, req, (rsp: Sproto.cs_map_maincity_worship_response) => {
			if (rsp.ret)
			{
				
			}
		}, this)
	}

	public SendGetChannelInfo() {
		let req = new Sproto.cs_map_maincity_channel_info_request
		this.Rpc(C2sProtocol.cs_map_maincity_channel_info, req, (rsp: Sproto.cs_map_maincity_channel_info_response) => {
			this.mChannelInfos = rsp.channels
			GameGlobal.MessageCenter.dispatch(MessageDef.CHANNEL_UPDATE_INFO)
		}, this)
	}

	public GetPointSource(count): string{
		let iconNum = 1
		let iconPath = ""
		for (let key in GameGlobal.Config.CityXStateConfig)
		{
			let config = GameGlobal.Config.CityXStateConfig[key]
			if (config.range >= count)
			{
				iconNum = parseInt(key)
				break
			}
		}

		switch(iconNum) {
			case 1:
				iconPath = "ui_zc_bm_xian_lv"
			break
			case 2:
				iconPath = "ui_zc_bm_xian_huang"
			break
			case 3:
				iconPath = "ui_zc_bm_xian_hong"
			break
		}
		
		return iconPath
	}

	public RefreshChannelList() {
		GameGlobal.MessageCenter.dispatch(MessageDef.CHANNEL_UPDATE_LIST)
	}

	public IsInCurMap(mapId) {
		return this.m_Raid[mapId] != null
	}
}