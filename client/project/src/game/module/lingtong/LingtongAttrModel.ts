class LingtongAttrModel extends BaseSystem {

	public mName: string = ""
	public mBuffSkill: number[] = []
	public giftexp: number = 0
	public giftlv: number = 0
	public mXilian: number = 0
	public mXilianSkill: number[] = []
	public mSex: number = 0

	public MAX_GIFT_LEVEL = 5

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_baby_init, this._DoInit)
	}

	public Init() {
		super.Init()
		this.MAX_GIFT_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.BabyTalentConfig[1])


		GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.BabyTalentConfig[1][0].cost[0].id, MessageDef.LINGTONG_RANK_ITEM)
		for (let data of GameGlobal.Config.BabyBasisConfig.freshitemid) {
			GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.LINGTONG_SKILL_ITEM)
		}
	}

	private _DoInit(rsp: Sproto.sc_baby_init_request) {
		this.mName = rsp.name || ""
		this.mBuffSkill = rsp.buffs || []
		this.giftexp = rsp.giftexp || 0
		this.giftlv = rsp.giftlv || 0
		this.mXilian = rsp.xilian || 0
		this.mXilianSkill = rsp.xilianSkills || []
		this.mSex = rsp.sex || 1
		GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO)
	}

	public SendActive(sex: number) {
		let req = new Sproto.cs_baby_active_request
		req.sex = sex
		this.Rpc(C2sProtocol.cs_baby_active, req, (rsp: Sproto.cs_baby_active_response) => {
			if (rsp.ret) {
				this.mSex = sex
				GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO)
				UserTips.InfoTip("激活成功")
			}
		})
	}

	public SendAddGift() {
		this.Rpc(C2sProtocol.cs_baby_addgift, null, (rsp: Sproto.cs_baby_addgift_response) => {
			if (rsp.ret) {
				this.giftexp = rsp.exp
				this.giftlv = rsp.level
				GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_GIFT_INFO)
			}
		})
	}

	public SendRename(name: string) {
		let req = new Sproto.cs_baby_rename_request
		req.name = name
		this.Rpc(C2sProtocol.cs_baby_rename, req, (rsp: Sproto.cs_baby_rename_response) => {
			if (rsp.ret) {
				this.mName = rsp.name
				GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO)
			}
			else
				GameGlobal.UserTips.showTips("输入的名称含有敏感字")

		})
	}

	public SendRefreshSkill(lockList: number[], type: number, autoBuy: boolean) {
		let req = new Sproto.cs_baby_refreshskill_request
		req.locklist = lockList
		req.type = type
		req.autoBuy = autoBuy ? 2 : 0
		this.Rpc(C2sProtocol.cs_baby_refreshskill, req, (rsp: Sproto.cs_baby_refreshskill_response) => {
			if (rsp.ret) {
				this.mXilian = rsp.xilian
				this.mXilianSkill = rsp.xilianSkills
				GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO)
			}
		}, this)
	}

	public SendSetSkill() {
		let req = new Sproto.cs_baby_setskillin_request
		this.Rpc(C2sProtocol.cs_baby_setskillin, req, (rsp: Sproto.cs_baby_setskillin_response) => {
			if (rsp.ret) {
				this.mBuffSkill = rsp.buffs
				this.mXilianSkill = []
				GameGlobal.MessageCenter.dispatch(MessageDef.LINGTONG_UPDATE_INFO)
			}
		}, this)
	}

	public GetSkillId(): number {
		if (this.giftlv) {
			let config = GameGlobal.Config.BabyTalentConfig[this.mSex][this.giftlv - 1]
			if (config) {
				return config.skill
			}
		}
		let config = GameGlobal.Config.BabyActivationConfig[this.mSex || 1]
		return config.skill[0]
	}

	public GetNextSkillId(): number {
		if (this.giftlv) {
			let config = GameGlobal.Config.BabyTalentConfig[this.mSex][this.giftlv]
			if (config) {
				return config.skill
			}
		}
		let config = GameGlobal.Config.BabyActivationConfig[this.mSex || 1]
		return config.skill[0]
	}

	public IsActive(): boolean {
		// return this.giftlv ? true : false
		return this.mSex == 1 || this.mSex == 2
	}

	public GetCurSkill(): number[] {
		let config = GameGlobal.Config.BabyActivationConfig[this.mSex]
		if (config) {
			return config.skill
		}
		return []
	}
	
    public mRedPoint = new LingtongAttrRedPoint

    public IsRedPoint(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_116, true)) {
			return false
		}
        return GameGlobal.LingtongModel.mRedPoint.IsRedPoint() || this.mRedPoint.IsRedPoint()
    }

	public getTianFuAllAttr()
	{
		let exp = this.giftexp;
		let lv = this.giftlv;
		let cfgArr = GameGlobal.Config.BabyTalentConfig[this.mSex];
		if (!cfgArr) {
			return []
		}
		let i:number;
		let len: number = Math.min(cfgArr.length,lv);
		let attrs = [];
		for( i = 0 ; i < len ;i ++ )
		{
			let cfgObj = cfgArr[i];
			let j: number;
			let jLen:number
			if (cfgObj.level < lv)
			{
				jLen = cfgObj.upnum || (cfgObj.proexp / cfgObj.exp);
			} else if (cfgObj.level == lv)
			{
				jLen = exp;
			}	
			for( j = 0 ; j < jLen ;j ++ )
			{
				attrs = AttributeData.AttrAddition(attrs, cfgObj.attrs);
			} 
		}
		if (attrs.length == 0)
		{
			attrs = CommonUtils.copyDataHandler(cfgArr[0].attrs)
			for (let data of attrs) {
				data.value = 0
			}
		}	
		return attrs
	}
}