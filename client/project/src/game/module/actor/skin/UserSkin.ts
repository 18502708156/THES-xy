/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 16:15
 * @meaning: 时装管理类
 * 
 **/

class UserSkin extends BaseSystem {


	public mMsgDefUpdate = MessageDef.ROLE_SKIN_UPDATE



	public titleConfig = []//称号本地文件


	private tServerData: Sproto.sc_effect_skin_update_request


	public constructor() {
		super();
		// this.mRedPoint = new UserWingRedPoint(this)

        this.regNetMsg(S2cProtocol.sc_effect_skin_update, this.doWaveData);

	}

	public Init() {

		this.titleConfig = GameGlobal.Config.FashionSkinConfig

		super.Init()
	}

	public GetSkinConfig() {
		let config = this.titleConfig
		let list = []
		for (let k in config) {
			if (parseInt(k) >= 1000) {
				list.push(config[k])
			}
		}
		list.sort(function(lhs, rhs) {
			return lhs.skinid - rhs.skinid
		})
		return list
		// CommonUtils.GetArray(this.titleConfig, "skinid")
	}

	public HasDress(id: number) {
		var bHave = false
		if(this.tServerData&&this.tServerData.ownlist)
		{
			for (const item in this.tServerData.ownlist) {
				if(this.tServerData.ownlist[item].id===id)
				{
					bHave = true
					break
				}
			}
		}

		return bHave
	}


	public GetDressData(id: number): Sproto.effect_item {
		if(this.tServerData)
		{
			for (const item in this.tServerData.ownlist) {
				if(this.tServerData.ownlist[item].id===id)
				{
					return this.tServerData.ownlist[item]
				}
			}
		}
		return null
	}
   	

	public SendActiveDress(id: number) {
		let req;
		if(this.tServerData&&this.tServerData.wearid != null)
		{
			if(id ===this.tServerData.wearid)		
			{
				this.changDress(id)
			}
			else
			{
				req = new Sproto.cs_effect_skin_activate_request
				req.id = id
				this.Rpc(C2sProtocol.cs_effect_skin_activate, req)
			}
		}
	}

	public changDress(id: number)
	{	
		let req;
		req = new Sproto.cs_effect_skin_change_request
		req.id = id
		this.Rpc(C2sProtocol.cs_effect_skin_change, req)
	}


    public doWaveData(rsp: Sproto.sc_effect_skin_update_request) {
		this.tServerData = rsp //赋值
		//发送更新数据
		GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_SKIN_UPDATE)
		
		GameGlobal.RaidMgr.UpdateRole()
    }

	//att [] 属性数组 用于取属性战力
	public GetDressPower(): number {
		let power = 0
		for (const item in this.titleConfig) {
			if(this.tServerData&&this.tServerData.ownlist)
			{
				for (const index in this.tServerData.ownlist) {
					let wearid = this.tServerData.ownlist[index].id
					if(wearid ===this.titleConfig[item][GameGlobal.actorModel.sex].skinid)
					{
						power += ItemConfig.CalcAttrScoreValue(this.titleConfig[item][GameGlobal.actorModel.sex].attrpower)
					}
				}
			}
		}
		return power
	}

	//获取已经穿戴id
	public getWearId(): number
	{
		if (this.tServerData) {
			return this.tServerData.wearid
		}
		return 0
	}

	public GetActiveDressCount(): number {
		if(this.tServerData&&this.tServerData.ownlist)
		{
			return this.tServerData.ownlist.length
		}
		else
		{
			return 0
		}
	}


	public IsOpen(index: number) {0
		// let openLevel = this.GetOpenLevel(index)
		// return this.mLevel >= openLevel
	}
}