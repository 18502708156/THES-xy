class TsumKoBaseModel extends BaseSystem {

	info_clear:any//已通关的关卡
	info_helpReward=0;//已协助次数
	info_buy:{[key:number]: Sproto.eightyOneHard_data} = {};//购买宝箱数据
	info_todayClearlist:{[key:number]: Sproto.eightyOneHard_data} = {};//今天通关数据

	//选择小关
	public recordId=0;
	//选择章节Id
	public chapterid=0;
	//對話选择的ID
	public chatXiD=0;
	//是否當前購買
	public isCurBuy=false;
	//是否當前清理關卡
	public isCurClear=false;

	public changeId():void
	{
		if(this.chatXiD!=0)
		{
			this.chapterid=Math.ceil(this.chatXiD/9);
			this.recordId=this.chatXiD;
		}	
	}

	public constructor() {
		super();

		this.regNetMsg(S2cProtocol.sc_fuben_eightyOneHard_info, this._DoInitInfo);
		this.regNetMsg(S2cProtocol.sc_fuben_eightyOneHard_info_update, this._DoUpdate);
	}

	private _DoInitInfo(rsp: Sproto.sc_fuben_eightyOneHard_info_request) {
		this.info_clear=rsp.clear;
		this.info_helpReward=rsp.helpReward;
		
		for (let info of rsp.buy|| [])
		{
			this.info_buy[info["key1"]] = info
		}

		for (let info of rsp.todayClearlist|| [])
		{
			this.info_todayClearlist[info["key1"]] = info
		}
	}
	private _DoUpdate(rsp: Sproto.sc_fuben_eightyOneHard_info_update_request) {
		if (rsp.clear!=undefined) this.info_clear=rsp.clear;
		if (rsp.clear!=undefined) this.info_helpReward=rsp.helpReward;
		for (let info of (rsp.buy || []))
		{
			this.info_buy[info["key1"]] = info
			this.isCurBuy=true;
		}
		for (let info of rsp.todayClearlist || [])
		{
			this.info_todayClearlist[info["key1"]] = info
			this.isCurClear=true;
		}
		MessageCenter.ins().dispatch(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST);
		MessageCenter.ins().dispatch(MessageDef.TSUMKO_UPDATE_LIST);
		MessageCenter.ins().dispatch(MessageDef.ClOSETSUMKOBASEBAGITEMPLANEL);
	}
	//扫荡
	public SendSweep(id)
	{
		let req = new Sproto.cs_eightyOneHard_sweep_request
		req.id = id

		this.Rpc(C2sProtocol.cs_eightyOneHard_sweep, req)
	}
	//一键扫荡
	public SendSweepAll()
	{
		let req = new Sproto.cs_eightyOneHard_sweep_all_request
		
		this.Rpc(C2sProtocol.cs_eightyOneHard_sweep_all,req)
	}
	//购买宝箱
	public SendBuy(id)
	{
		let req = new Sproto.cs_eightyOneHard_buy_request
		req.id = id
		
		this.Rpc(C2sProtocol.cs_eightyOneHard_buy,req)
	}
	//是否购买
	public IsGatePass(chaperId, gateId) 
	{
		let info = this.info_buy[chaperId]
		if (info!=undefined)
			return (info["key2"] & Math.pow(2, gateId)) > 0;
		return false;
	}

	//是否通过
	public IsClearance(chaperId, gateId) 
	{
		let info = this.info_todayClearlist[chaperId]
		if (info!=undefined)
			return (info["key2"] & Math.pow(2, gateId)) > 0;
		return false;
	}

	//这章是否通关
	public IsAllClearance(chaperId)
	{
		let info = this.info_todayClearlist[chaperId]
		if (info!=undefined)
			return (info["key2"] & 1022) == 1022;
		return false;
	}

	//查看记录
	public Record(id):void
	{
		let req = new Sproto.cs_eightyOneHard_record_request
		req.id = id
		
		this.Rpc(C2sProtocol.cs_eightyOneHard_record,req, (rsp: Sproto.cs_eightyOneHard_record_response) => {
			GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
		}, this)
	}

	//是否能打开小章节View
	public IsOpenView():boolean
	{
		let bool=true;
		if(GameGlobal.actorModel.level<GameGlobal.Config.DisasterFbBaseConfig.openid)
		{
			UserTips.ins().showTips(GameGlobal.Config.DisasterFbBaseConfig.openid+"级开启");
			bool=false;
			return bool;
		}
		if(this.info_clear+1<this.chatXiD)
		{
			UserTips.ins().showTips("请先通关前置关卡");
			bool=false;
			return bool;
		}
		if(GameGlobal.TsumKoModel.mTeamInfo.HasTeam()==true)//有组队
		{
			//UserTips.ins().showTips("已有组队");
			bool=false;
			return bool;
		}
		return bool;
	}
	
}

class TsumKoBaseRedPoint extends IRedPoint
{
	private mModel:TsumKoBaseModel;
	constructor(model: TsumKoBaseModel) 
	{
		super()
		this.mModel = model
	}

	public GetMessageDef(): string[] 
	{
		return [];
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[TotemsModelRedPoint.TOTEMS_ACTIVATION]: this.showRedPoint
		}
	}
	private showRedPoint():boolean
	{
		let bool=false;
		// let id=0;
		// if(this.mModel.IsAllClearance(id)==true) //是否全部通关
		// {

		// }
		// if(this.mModel.IsClearance(1,1))//
		// {

		// }
		let chapter=this.mModel.info_clear/9;
		for(let i=0;i<9;i++)
		{
			
		}
		return bool;
	}

	public OnChange(index: number): void 
	{
		//GameGlobal.MessageCenter.dispatch(MessageDef.TsumKoBase_REDPOINT_NOTICE);
	}
}