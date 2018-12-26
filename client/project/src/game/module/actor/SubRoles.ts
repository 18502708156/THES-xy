class SubRoles extends BaseSystem {

	public static readonly MAX_COUNT = 1

	public static ROLE_INIT = false

	public mTemplate: {[key: number]: UserTemplate} = {}

	public static GetDefaultSex(job: number): number {
		if (job == 3) {
			return 1
		}
		return 0
	}

	private rolesModel: Role

	static ins(): SubRoles {
		return super.ins();
	}

	public Init() {
		let config = GameGlobal.Config.FashionSkinConfig
		for (let k in config) {
			let data = config[k][0]
			GameGlobal.UserBag.AddListenerItem(data.itemid.id, MessageDef.BAG_USER_SKIN_COUNT_UPDATE)
		}
		config = GameGlobal.Config.TitleConf
		for (let k in config) {
			GameGlobal.UserBag.AddListenerItem(config[k].itemid ? config[k].itemid.id : 0, MessageDef.BAG_USER_TITLE_COUNT_UPDATE)
		}
		GameGlobal.UserBag.AddListenerItem(SHOP_MONEY.jinzhuang, MessageDef.BAG_USER_ORANGE_COUNT_UPDATE)
	}

	public GetRoleData(): Role {
		return this.rolesModel
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sub_roles, this.doSubRole)

		this.regNetMsg(S2cProtocol.sc_template_init_data, this._DoInitData)
		this.regNetMsg(S2cProtocol.sc_template_update_data, this._DoUpdateData)
	}


	private _DoInitData(rsp: Sproto.sc_template_init_data_request) {
		let data = this.mTemplate[rsp.templateType]
		if (data) {
			data._DoInitData(rsp)
		} else {
			console.error("not impl type => " + rsp.templateType)
		}
	}

	private _DoUpdateData(rsp: Sproto.sc_template_update_data_request) {
		let data = this.mTemplate[rsp.templateType]
		if (data) {
			data._DoUpdateData(rsp)
		} else {
			console.error("not impl type => " + rsp.templateType)
		}
	}


	/**
     * 子角色列表
     */
	public doSubRole(data: Sproto.sub_roles_request) {
		if (!this.rolesModel) {
			this.rolesModel = new Role
		}
		this.rolesModel.parser(data.roleList);
		this.rolesModel.job = GameGlobal.actorModel.job
		this.rolesModel.sex = GameGlobal.actorModel.sex
		this.rolesModel.entityName = GameGlobal.actorModel.name

		this.UpdatePower()

		GameGlobal.MessageCenter.dispatch(MessageDef.SUB_ROLE_CHANGE)

		SubRoles.ROLE_INIT = true
	};

    /**
     * 处理属性变化
     */
	public doSubRoleAtt(rsp: Sproto.sub_role_att_change_request) {
		var roleID = rsp.roleID;
		var model = this.rolesModel
		model.parserAtt(rsp.attributeData);
		model.power = rsp.power;
		this.UpdatePower()

		GameLogic.ins().actorModel.SetPower(model.power, false)
	};

	public UpdatePower(notTip = false) {
		// let power = 0
		// var len = this.rolesModel.length;
		// for (var i = 0; i < len; i++) {
		// 	power += this.getSubRoleByIndex(i).power;
		// }
		// power += HeroModel.ins().mPower
		// power += PetModel.ins().mPower;
		// GameLogic.ins().actorModel.SetPower(power, notTip)
	}
}