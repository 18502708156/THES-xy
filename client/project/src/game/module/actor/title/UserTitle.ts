/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/23 18:15
 * @meaning: 称号管理类
 * 
 **/

class UserTitle extends BaseSystem {


	public mMsgDefUpdate = MessageDef.ROLE_TITLE_UPDATE



	public titleConfig//称号本地文件


	public tServerData:Sproto.sc_effect_title_update_request;


	public constructor() {
		super();
		// this.mRedPoint = new UserWingRedPoint(this)

        this.regNetMsg(S2cProtocol.sc_effect_title_update, this.doWaveData);

	}

	public Init() {

		this.titleConfig = GameGlobal.Config.TitleConf

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
		if(this.tServerData)
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
   
	public getOwnList (): Sproto.effect_item[] {
		return this.tServerData.ownlist
	}

	public SendActiveDress(id: number) {
		let req;
		if(id ===this.tServerData.wearid)		
		{
			this.changDress(id)
		}
		else
		{
			req = new Sproto.cs_effect_title_activate_request
			req.id = id
			this.Rpc(C2sProtocol.cs_effect_title_activate, req)
		}
	}

	public changDress(id: number)
	{	
		let req;
		req = new Sproto.cs_effect_title_change_request
		req.id = id
		this.Rpc(C2sProtocol.cs_effect_title_change, req)
	}


    public doWaveData(rsp: Sproto.sc_effect_title_update_request) {
		let weardId = this.getWearId()
		this.tServerData = rsp //赋值
		//发送更新数据
		GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_TITLE_UPDATE)
		// if (weardId != this.getWearId()) {
			GameGlobal.RaidMgr.UpdateRole()
		// }
    }

	//att [] 属性数组 用于取属性战力
	public GetDressPower(): number {
		let power = 0
		for (const item in this.titleConfig) {
			for (const index in this.tServerData.ownlist) {
				let wearid = this.tServerData.ownlist[index].id
				if(wearid ===this.titleConfig[item].skinid)
				{
					power += ItemConfig.CalcAttrScoreValue(this.titleConfig[item].attrpower)
				}
			}
		}
		return power
	}

	public GetActiveDressCount(): number {
		if (!this.tServerData) {
			return 0
		}
		return this.tServerData.ownlist.length
	}

	//获取已经穿戴id
	public getWearId(): number
	{
		if (this.tServerData) {
			return this.tServerData.wearid
		}
		return 0
	}

	public GetIndex(index: number): Sproto.effect_item {
		if (this.tServerData && this.tServerData.ownlist) {
			return this.tServerData.ownlist[index] || null
		}
		return null
	}


	//獲取半分比
	public GetAddAttrRate(type):number
	{
		let pow=0;
		let  config=GameGlobal.Config.TitleAttrConf;
		for(let key in config)
		{
			if(this.HasDress(config[key].skinid)==true)
			{
				if(config[key].type==type)
					pow+=config[key].attrpower;
			}
		}
		return pow/100;
	}

}

