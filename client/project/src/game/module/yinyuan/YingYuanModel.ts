class YingYuanModel extends BaseSystem {

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_marry_info, this.getMarryInfo)
		this.regNetMsg(S2cProtocol.sc_marry_asked, this.marryAsked)
		this.regNetMsg(S2cProtocol.sc_marry_remove_asked, this.removeAsked)
		this.regNetMsg(S2cProtocol.sc_marry_invitation, this.marryInvitation)
		this.regNetMsg(S2cProtocol.sc_marry_recv_flower, this.marryRecvFlower)
		this.regNetMsg(S2cProtocol.sc_marry_login_tip, this.marryLoginTip)
		this.regNetMsg(S2cProtocol.sc_marry_new, this.marryNew)
		this.regNetMsg(S2cProtocol.sc_marry_friends, this.marryFriends)
		this.regNetMsg(S2cProtocol.sc_marry_divorce_bro, this.divorceBro)
		this.regNetMsg(S2cProtocol.sc_marry_love_info, this.MarryLoveInfo)
		this.regNetMsg(S2cProtocol.sc_marry_house_partner_up, this.DoAddHouseShareExp)
		this.regNetMsg(S2cProtocol.sc_marry_flower_bro, this.marryFlowerBro)
	}

	public marryInfo: Sproto.sc_marry_info_request
	public marryFRIend = null
	public askMarry: Sproto.sc_marry_asked_request[] = []
	public marryInvita: Sproto.sc_marry_invitation_request[] = []
	public marrySFlower: Sproto.sc_marry_recv_flower_request[] = []
	public friend: Sproto.marry_friend[] = []
	public marryLove: Sproto.marry_love[] = []
	public shareUpInfo: Sproto.sc_marry_house_partner_up_request

	public getRole(player: Sproto.marry_object) {
		let list = []
		let entityRole = new EntityRole
		entityRole.parserBase({
			ownerid: player.dbid,
			handler: player.dbid,
			type: EntityType.Role,
			shows: {
				job: player.job,
				sex: player.sex,
				shows: player.shows
			},
		} as Sproto.entity_data)
		entityRole.entityName = player.name;
		return entityRole
	}


	public TimeLove() {
		for (let i = 0; i < this.marryLove.length; i++) {
			if (this.marryLove[i].time > 0) {
				this.marryLove[i].time--
			}
		}
	}

	/*
     恩爱	
	 */
	public UseMarryLove(type: number) {
		let lovetype = new Sproto.cs_marry_love_use_request
		lovetype.lovetype = type
		this.Rpc(C2sProtocol.cs_marry_love_use, lovetype, this.UseMarryLoveRule)
	}

	public UseMarryLoveRule(rsp: Sproto.cs_buy_pk_response) {
		if (rsp.ret) {
			//			UserTips.InfoTip("使用成功")
		}
	}

	public RevertMarryLove(type: number) {
		let lovetype = new Sproto.cs_marry_love_revert_request
		lovetype.lovetype = type
		this.Rpc(C2sProtocol.cs_marry_love_revert, lovetype, this.ReverMarryLoveRule)
	}

	public ReverMarryLoveRule(rsp: Sproto.cs_marry_love_revert_response) {
		if (rsp.ret) {
			//UserTips.InfoTip("回复成功")
		}
	}

	public SendLoveInfo() {
		this.Rpc(C2sProtocol.cs_marry_love_info)
	}

	public MarryLoveInfo(rsp: Sproto.sc_marry_love_info_request) {
		this.marryLove = rsp.loves
		GameGlobal.MessageCenter.dispatch(MessageDef.MARRY_LOVE_INFO)
	}

	public getMarryLove(id: number) {
		for (let i = 0; i < this.marryLove.length; i++) {
			if (this.marryLove[i].lovetype == id) {
				return this.marryLove[i]
			}
		}
	}

	/* */
	public iSMarry() {
		if (!this.marryInfo) {
			return false
		}
		return this.marryInfo.marry
	}

	public getOther(): Sproto.marry_object {
		if (this.iSMarry()) {
			if (this.marryInfo.husband.dbid != GameGlobal.GameLogic.actorModel.actorID) {
				return this.marryInfo.husband
			} else {
				return this.marryInfo.wife
			}
		}
	}

	public divorceBro(rsp: Sproto.sc_marry_divorce_bro_request) {
		for (let i = 0; i < this.marryInvita.length; i++) {
			if (this.marryInvita[i].dbid == rsp.ids[0] || this.marryInvita[i].dbid == rsp.ids[1]) {
				this.marryInvita.splice(i, 1)
				break
			}
		}
		this.removeAllFlower()
		GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO)
	}

	public getOtherData() {
		if (this.iSMarry()) {
			if (this.marryInfo.husband.dbid == GameGlobal.actorModel.actorID) {
				return this.marryInfo.wife
			} else {
				return this.marryInfo.husband
			}
		}
	}

	public sendMarryFriends() {                 // 请求结婚状态
		this.Rpc(C2sProtocol.cs_marry_friends)
	}

	public getMarryInfo(rsp: Sproto.sc_marry_info_request) {     //获取结婚
		this.marryInfo = rsp
		this.askMarry = []
		ViewManager.ins().close(ShouDaoPanel)
		GameGlobal.MessageCenter.dispatch(MessageDef.IS_MARRY_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_UPDATE_INFO)

		if (this.marryInfo.marry == false && this.marryInfo.grade > 0) {
			this.shareUpInfo = null
			GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE)
			GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_UPDATE_SINGLE)
		}
	}

	public marryPropose(targetid, grade, spouse) {               //ID 婚礼模式 称呼      //请求結婚
		let Pro = new Sproto.cs_marry_propose_request()
		Pro.targetid = targetid
		Pro.grade = grade
		Pro.spouse = spouse
		this.Rpc(C2sProtocol.cs_marry_propose, Pro, this.marryProRule)
	}

	public marryProRule(rsp: Sproto.cs_marry_propose_response) {
		if (rsp.ret == 0) {
			UserTips.InfoTip("已发送")
			// this.askMarry = []
			// ViewManager.ins().close(ShouDaoPanel)
		}
	}

	public MarryConfigLen() {
		let Config = GameGlobal.Config.MarryConfig;
		let Len = 0
		for (let data in Config) {
			Len++
		}
		return Len
	}

	public getFriendData(data) {
		this.marryFRIend = data
		ViewManager.ins().close(YingYuanAddPanel)
		GameGlobal.MessageCenter.dispatch(MessageDef.YING_YUAN_HEAD)
	}

	public marryAsked(rsp: Sproto.sc_marry_asked_request) {
		this.askMarry.push(rsp)
		this.askMarry.sort((lhs, rhs) => {
			return lhs.power - rhs.power
		})
		GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO)
	}

	public removeAsked(rsp: Sproto.sc_marry_remove_asked_request) {
		for (let i = 0; i < this.askMarry.length; i++) {
			if (this.askMarry[i].fromid == rsp.fromid) {
				this.askMarry.splice(i, 1);
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO)
	}

	public marryAnswer(agree, id) {
		let data = new Sproto.cs_marry_answer_request
		data.agree = agree
		data.fromid = id
		this.Rpc(C2sProtocol.cs_marry_answer, data)
	}

	public removeAnswer(id) {
		for (let i = 0; i < this.askMarry.length; i++) {
			if (this.askMarry[i].fromid == id) {
				this.askMarry.splice(i, 1);
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.QIU_MARRY_INFO)
	}

	public marryLevelUp() {
		this.Rpc(C2sProtocol.cs_marry_levelup);
	}

	public marryDivorce() {
		this.Rpc(C2sProtocol.cs_marry_divorce)
		UserTips.InfoTip("离婚成功")
	}

	public marryInvitation(rsp: Sproto.sc_marry_invitation_request) {
		this.marryInvita.push(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO)
		if (rsp.effect) {
			this.mcName = "eff_ui_yanhua"
			this.openEff()
		}
	}

	public marryGreeting(id, quantity) {
		let Greet = new Sproto.cs_marry_greeting_request
		Greet.dbid = id
		Greet.quantity = quantity
		this.Rpc(C2sProtocol.cs_marry_greeting, Greet, this.marryGreetingRule)
	}

	public marryGreetingRule(rsp: Sproto.cs_marry_greeting_response) {
		if (rsp.ret == 0) {
			ViewManager.ins().close(YingYuanHeLiPanel)
			this.marryInvita.splice(0, 1);
			GameGlobal.MessageCenter.dispatch(MessageDef.INVITATION_INFO)
		}
	}

	public marryFlower(quantity, count, autobuy) {
		let Flower = new Sproto.cs_marry_flower_request
		Flower.quantity = quantity
		Flower.count = count
		Flower.autobuy = autobuy
		this.Rpc(C2sProtocol.cs_marry_flower, Flower, this.marryFlowerRule)
	}

	public marryFlowerRule(rsp: Sproto.cs_marry_flower_response) {
		if (rsp.ret == 0) {
			ViewManager.ins().close(YingYuanXianHuaPanel)
			this.mcName = "eff_ui_huaban"
			this.openEff2()
		}
	}

	public partner: Sproto.marry_object = null
	public marryLoginTip(rsp: Sproto.sc_marry_login_tip_request) {
		this.partner = rsp.partner
		ViewManager.ins().open(YingYuanZjmPanel)
	}

	public marryRecvFlower(rsp: Sproto.sc_marry_recv_flower_request) {
		this.marrySFlower.push(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO)
		this.mcName = "eff_ui_huaban"
		this.openEff2()
	}

	public flower(index) {
		this.marrySFlower.splice(index, 1);
		GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO)
	}

	public marryNew() {
		//ViewManager.ins().open(YingYuanZhengShuPanel)
		this.mcName = "eff_ui_yanhua"
		this.openEff()
	}

	public marryFlowerBro(rsp: Sproto.sc_marry_flower_bro_request) {
		if (rsp.effect) {
			this.mcName = "eff_ui_huaban"
			this.openEff2()
		}
	}

	public openEff() {
		if (this.isOpenEff) {
			this.isOpenEff = false
		}
		// TimerManager.ins().doTimer(this.time, 24, this.playEffMove, this, this.closeEff)
	}

	public closeEff() {
		this.isOpenEff = true
	}

	public openEff2() {
		// this.playEffMove2()
	}

	public mcName: string
	public time: number = Math.floor(Math.random() * 2 + 300)
	public isOpenEff: boolean = false

	public EFFXY = [
		[300, 300], [300, 700], [700, 700], [700, 200], [450, 450]
	]

	// public playEffMove2() {
	// 	if (!this.mcName) {
	// 		return
	// 	}
	// 	let eff = new MovieClip
	// 	eff.loadUrl(ResDataPath.GetUIEffePath2(this.mcName), true, 12);
	// 	eff.scaleX = 2
	// 	eff.scaleY = 2
	// 	eff.x = this.EFFXY[4][0]
	// 	eff.y = this.EFFXY[4][1]
	// 	LayerManager.UI_Tips.addChild(eff)
	// }

	// public playEffMove() {
	// 	if (!this.mcName) {
	// 		return
	// 	}
	// 	this.time = Math.floor(Math.random() * 2 + 300)
	// 	let eff = this.playEff(this.mcName)
	// 	let index = Math.floor(Math.random() * this.EFFXY.length)
	// 	eff.x = this.EFFXY[index][0]
	// 	eff.y = this.EFFXY[index][1]
	// 	let scale = Math.floor(Math.random() * 1 + 1)
	// 	eff.scaleX = scale
	// 	eff.scaleY = scale
	// 	LayerManager.UI_Tips.addChild(eff)
	// }

	// public playEff(str: string) {
	// 	let allSrcenEff = new MovieClip
	// 	allSrcenEff.loadUrl(ResDataPath.GetUIEffePath2(str), true, 1);
	// 	return allSrcenEff
	// }

	public marryFriends(rsp: Sproto.sc_marry_friends_request) {
		this.friend = rsp.friends
	}

	public getMarryFriends(id: number) {
		for (let i = 0; i < this.friend.length; i++) {
			if (this.friend[i].dbid == id) {
				return this.friend[i]
			}
		}
	}

	public removeAllFlower() {
		this.marrySFlower = []
		GameGlobal.MessageCenter.dispatch(MessageDef.FLOWER_INFO)
	}

	/**房屋 */
	//////////////////////////////////////////////////////////////////
	private DoAddHouseShareExp(rsp: Sproto.sc_marry_house_partner_up_request) {
		this.shareUpInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE)
	}

	public SendAddHouseExp() {
		this.Rpc(C2sProtocol.cs_marry_house_addexp)
	}

	public SendHouseBuild(grade) {
		let req = new Sproto.cs_marry_house_grade_request
		req.grade = grade

		this.Rpc(C2sProtocol.cs_marry_house_grade, req, (rsp: Sproto.cs_marry_house_grade_response) => {
			if (rsp.ret) {

			}
		}, this)
	}

	public SendAddHouseShareExp() {
		this.Rpc(C2sProtocol.cs_marry_house_use_partner_up)

		this.shareUpInfo = null
		GameGlobal.MessageCenter.dispatch(MessageDef.HOUSE_SHARED_NOTICE)
	}

	public GetIntimacy() {
		if (!this.marryInfo) {
			return 0
		}
		return this.marryInfo.intimacy
	}

	public GetHouseGrade() {
		if (!this.marryInfo) {
			return 0
		}
		return this.marryInfo.grade || 0
	}

	public GetHouseLv() {
		if (!this.marryInfo) {
			return []
		}
		return [this.marryInfo.houselv, this.marryInfo.houseup]
	}

	public GetPower() {
		if (!this.marryInfo) {
			return 0
		}
		return HouseConst.GetPower(this.marryInfo.grade, this.marryInfo.houselv, this.marryInfo.houseup)
	}

	public GetCurAttr() {
		return HouseConst.GetHouseTotalAttr(this.marryInfo.grade, this.marryInfo.houselv, this.marryInfo.houseup)
	}

	public GetNextAttr() {
		if (!this.marryInfo) {
			return 0
		}
		return HouseConst.GetHouseLevelAttr(this.marryInfo.grade, this.marryInfo.houselv + 1)
	}

	public IsMaxLevel() {
		if (!this.marryInfo) {
			return false
		}
		return HouseConst.IsMaxLevel(this.marryInfo.grade, this.marryInfo.houselv)
	}

	public GetCostIntimacy() {
		let config = HouseConst.GetHouseConfig(this.marryInfo.grade, this.marryInfo.houselv)
		return config ? (config.Intimacy || 0) : 0
	}

	public GetHouseUpnum() {
		let config = HouseConst.GetHouseConfig(this.marryInfo.grade, this.marryInfo.houselv)
		return (config ? config.exp : 0) * (GameGlobal.Config.MarryBaseConfig.exp)
	}

	public IsMaxGrage() {
		let config = HouseConst.GetHouseShowConfig(this.marryInfo.grade + 1)
		return config == null
	}

	public GetBuildCost(grade) {
		let config = HouseConst.GetHouseShowConfig(grade)
		let orgConfig = HouseConst.GetHouseShowConfig(this.marryInfo.grade)

		return {
			type: config.price.type,
			id: config.price.id,
			count: config.price.count - orgConfig.price.count
		}
	}

	public CanUpgrade() {
		if (!this.marryInfo || !this.marryInfo.marry || this.IsMaxLevel()) {
			return false
		}

		return this.GetCostIntimacy() <= this.GetIntimacy()
	}
	//////////////////////////////////////////////////////////////////
	/**房屋 end */

} 