class UpLvWayModel extends BaseSystem
{
	public dic={};
	//积分
	public score=0;
	public rewards=[];
	public mRedPoint: UpLvWayRedPoint
	public constructor() 
	{
		super();
		this.mRedPoint=new UpLvWayRedPoint(this);
		this.regNetMsg(S2cProtocol.sc_enhance_info, this._DoInitInfo);
		this.regNetMsg(S2cProtocol.sc_enhance_add_info, this._DoUpdate);
	}

	private _DoInitInfo(rsp: Sproto.sc_enhance_info_request) 
	{
		this.score=rsp.point;
		this.rewards=rsp.rewards;
		for(let i=0;i<rsp.data.length;i++)
		{
			let data=rsp.data[i];
			this.dic[data["no"]]=data["val"];
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_CHANGE_SCORE);
	}

	private _DoUpdate(rsp: Sproto.sc_enhance_add_info_request) 
	{
		this.score=rsp.point;
		this.dic[rsp.no]=rsp.val;
		GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_CHANGE_SCORE);
	}

	public _Reward(ID):void
	{
		let req = new Sproto.cs_enhance_get_reward_request
		req.no=ID;
		this.Rpc(C2sProtocol.cs_enhance_get_reward, req,(rsp: Sproto.cs_enhance_get_reward_response) => 
		{
			if(rsp.ret==true)
			{
			
				if(this.rewards.indexOf(req.no)==-1)
					this.rewards.push(rsp.no);
				GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_ACQUIRE_ITEM);
			}
		}, this );
	}

	public isFinish(id,tabNeedCount):boolean
	{
		for(let key in this.dic)
		{
			if(Number(key)==id)
			{
				if(this.dic[key]>=tabNeedCount)
					return true;
			}
		}
		return false;
	}
}

class UpLvWayRedPoint extends IRedPoint
{
	private mModel:UpLvWayModel;
	public static readonly UPLVWAY_ACTIVATION = 0
	constructor(model: UpLvWayModel) 
	{
		super()
		this.mModel = model
	}

	public GetMessageDef(): string[] 
	{
		return [
			MessageDef.UPLVWAY_CHANGE_SCORE,
			// MessageDef.TOTEMS_UPDATEACTIVATION,
		];
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[UpLvWayRedPoint.UPLVWAY_ACTIVATION]: this.showRedPoint
		}
	}

	public OnChange(index: number): void 
	{
		GameGlobal.MessageCenter.dispatch(MessageDef.UPLVWAY_REDPOINT_NOTICE);
	}

	private tabItemCound=4;
	public showRedPoint():boolean
	{
		for(let i=0;i<4;i++)
		{
			if(this.mModel.score>=GameGlobal.Config.BianQiangRewardConfig[i+1].points)
			{
				if(this.mModel.rewards.indexOf(i+1)==-1)
					return true;
			}
		}
		return false;
	}


}