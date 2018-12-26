class ActorModel {

	/** 战斗力 */
	private _power = 0;

	actorID: number;
	soul: number;
	public job: number;
	public sex: number;
	private _guildID: number = 0;
	private _guildName: string;
	private _name: string;
	private _level: number;
	private _exp: number;
	private _gold: number = 0
	private _yb: number = 0
	private _feats: number
	private _prestige: number
	private _prestige_level: number
	private _contrib: number;
	public _byb: number = 0
	public friendCoin: number = 0

	public mFuncOpen: number
	public mSaveData: number
	public mSaveDataList: number[] = []

	public static IsGM(): boolean {
		return Main.Instance.GmLevel == 100
	}

	public static IsSimpleGM(): boolean {
		if (DEBUG) {
			return true
		}
		return Main.Instance.GmLevel >= 1
	}

	public get vipLv(): number {
		return UserVip.ins().lv
	}

	public constructor() {
	}

	public SendUpLevel() {
		GameSocket.ins().Rpc(C2sProtocol.cs_change_role_level)
	}

	public parser(data: Sproto.sc_actor_base_request) {
		this.setGuild(data.guildid, data.guildname);
		this.actorID = data.actorid;
		this.job = data.job
		this.sex = data.sex
		// 更新当前的服务器ID
		if (Main.Instance.mConnectServerData) {
			Main.Instance.mConnectServerData.id = data.serverid
		}
		this._name = data.actorname;
		this._level = data.level;
		this._exp = data.exp;
		this._power = data.power || 0;
		this._gold = data.gold;
		this._yb = data.yuanbao;
		this._contrib = data.contrib;
		this._byb = data.byb;
		this.friendCoin = data.friendcoin;
		UserVip.ins().lv = data.vip;
		var BagBaseConfig = GlobalConfig.ins().BagBaseConfig;
		UserBag.ins().bagNum = data.bagnum * BagBaseConfig.rowSize + BagBaseConfig.baseSize;

		this.mSaveData = data.clientvalue
		this.mSaveDataList = data.clientvaluelist || []

		GameGlobal.SoundManager.SetBgOn(!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_SY))

		GameGlobal.MessageCenter.dispatch(MessageDef.POWER_CHANGE);

		egret.setTimeout(this.InitMsg, this, 1000)

		GameGlobal.MessageCenter.dispatch(MessageDef.INIT_ACTOR);

		GameGlobal.EntityEffMgr.RefActorEff(this.job)
	}
	
	get name() {
		return this._name;
	}

	set name(value) {
		if (this._name != value) {
			this._name = value;
			MessageCenter.ins().dispatch(MessageDef.NAME_CHANGE);
		}
	}
    
	get byb() {
		return this._byb
	}

	set byb(value) {
		if (this._byb != value) {
			var addGold = value - this._byb;
			if (addGold > 0) {
				var str = "";
				str = "|C:0xffb02d&T:绑元  +" + addGold + "|";
				let src = ResDataPath.GetItemFullPath("ui_icon_item_4203")
				UserTips.ins().showContTips(str,src);
			}
			this._byb = value;
		}
	}

	get gold() {
		return this._gold;
	}

	set gold(value) {
		if (this._gold != value) {
			var addGold = value - this._gold;
			if (addGold > 0) {
				var str = "";
				str = "|C:0xffb02d&T:银两  +" + addGold + "|";
				let src = ResDataPath.GetItemFullPath("ui_icon_item_4202")
				UserTips.ins().showContTips(str,src);
			}
			this._gold = value;
		}
	}

	get yb() {
		return this._yb;
	}

	set yb(value) {
		if (this._yb != value) {
			var addYB = value - this._yb;
			if (addYB > 0) {
				var str = "";
				str = "|C:0xffb02d&T:元宝  +" + addYB + "|";
				let src = ResDataPath.GetItemFullPath("ui_icon_item_4204")
				UserTips.ins().showContTips(str,src);
			}
			this._yb = value;
		}
	}

	get level() {
		return this._level;
	}

	set level(value) {
		if (this._level != value) {
			this._level = value

			MessageCenter.ins().dispatch(MessageDef.LEVEL_CHANGE)

			Deblocking.Update(Deblocking.CHECK_TYPE_02)
			if (this._level == 20) {
				// Shop.ins().NotifyShop(true)
			}
			// Recharge.DoUpgrate()

		}
	}

	get exp() {
		return this._exp;
	}

	set exp(value) {
		if (this._exp != value) {
			this._exp = value;
		}
	}

	get contrib() {
		return this._contrib;
	}

	set contrib(value) {
		if (this._contrib != value) {
			this._contrib = value;
		}
	}

	get power() {
		return this._power;
	}

	public SetPower(value: number, notTip) {
		if (this._power != value) {
			if (this._power < value && this._power > 0) {
				if (!notTip) {
					MessageCenter.ins().dispatch(MessageDef.POWER_BOOST, value, this._power);
				}
			}
			this._power = value;
			MessageCenter.ins().dispatch(MessageDef.POWER_CHANGE);
		}
	}

	public setGuild(id, name) {
		if (this._guildID != id) {
			this._guildID = id;
			this._guildName = name;
			if (this._guildID != 0) {
				// if (ViewManager.ins().isShow(GuildApplyWin)) {
				// 	if (ViewManager.ins().isShow(GuildCreateWin)) {
				// 		ViewManager.ins().close(GuildCreateWin)
				// 	}
				// 	ViewManager.ins().close(GuildApplyWin);
				// 	ViewManager.ins().open(GuildMap);
				// }
			}
		}
	}

	get guildID() {
		return this._guildID;
	}

	public HasGuild(): boolean {
		return this._guildID != 0
	}

	get guildName() {
		return this._guildName;
	}

	//获取货币数量 type:为数据表{type=0, id=x, count=xx}中的id
	public GetNum(type: MoneyConst) {
		let count = 0
		switch(type) {
			case MoneyConst.gold:
				count = this._gold
			break
			case MoneyConst.yuanbao:
				count = this._yb
			break
			case MoneyConst.byb:
				count = this.byb
			break
			case MoneyConst.GuildContrib:
				count = this._contrib
			break
		}

		return count
	}

	public GetCurrencyName(type: MoneyConst) {
		return MoneyConstToName[type]
	}

	public IsCurrency(type: MoneyConst) {
		return MoneyConstToName[type] != null
	}

	// 登录后需要请求的数据
	public InitMsg() {
		GameGlobal.CrossTeamModel.SendGetInfos()
		GameGlobal.BossModel.sendCallFieldBossList()
		GameGlobal.BossModel.sendCallVipBossList()
		GameGlobal.Arena.sendArenaData()
		GameGlobal.QujingModel.SendEnterEscortView()
		GameGlobal.AuctionModel.sendAuctionList(0)

		if (this.HasGuild())
		{
			GameGlobal.GangModel.SendGetPanTaoHuiInfo()
			GameGlobal.GangModel.sendGetSkillInfos()
			GameGlobal.GangModel.sendGetProtectorInfo()
			GameGlobal.GangMapModel.SendGetExchange()
			GameGlobal.GuildTeamModel.SendGetInfos()
			GameGlobal.GangModel.sendGetGangBossInfo()
			GameGlobal.AuctionModel.sendAuctionList(1)

			let myGangInfo = GameGlobal.GangModel.myGangInfo
			if (myGangInfo && GangConst.GetAuditingRight(myGangInfo.mOffice))
			{
				GameGlobal.GangModel.SendGetApplicantList()
			}
		}
		
		GameGlobal.Ladder.SendInitInfo()
	}
}