/**
 * 图腾Model
 */
class TotemsModel extends BaseSystem 
{
	// public id:number;//编号
	// public lv:number;//等級
	// public upNum:number;//升级次数
	// public todayNum:number;//当天强化暴击阶段次数，配置num减当前参数则为下次必定暴击次数
	// public todayId:number;//当天强化暴击阶段编号，在哪个暴击阶段
	// public breach:number;//是否要突破，不需要为0，需要的话则为当前等级;
	// public date=[];
	public totemsDic={};
	public clickIndex=0;
	public mRedPoint: TotemsModelRedPoint
	//public isNotUp=false;

	public constructor() 
	{
		super()
		this.mRedPoint = new TotemsModelRedPoint(this)
		this.regNetMsg(S2cProtocol.sc_totems_info, this._DoInitInfo)
	}

	private _DoInitInfo(rsp: Sproto.sc_totems_info_request) 
	{
		// this.date=rsp.data;
		for(let i=0;i<rsp.data.length;i++)
		{
			this.totemsDic[rsp.data[i].id]=rsp.data[i];
		}
		// this.totemsDic
		// this.id=rsp.data["id"];
		// this.lv=rsp.data["lv"];
		// this.upNum=rsp.data["upNum"];
		// this.todayNum=rsp.data["todayNum"];
		// this.todayId=rsp.data["todayId"];
		// this.breach=rsp.data["breach"];
		GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_INFO);
	}

	//激活
	public activationTotems(totemsID):void
	{
		let req = new Sproto.cs_totems_open_request
		req.id = totemsID
		this.Rpc(C2sProtocol.cs_totems_open, req,(rsp: Sproto.cs_totems_open_response) => 
		{
			//GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
			//console.log( rsp)
			if(rsp.ret==true)
			{
				let dic={};
				dic=this.rspDate(totemsID,rsp);
				// if(JSON.stringify(dic)!="{}")
				// {
				this.totemsDic[totemsID]=dic;
				GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
				this.mRedPoint.mRedPointMap[totemsID]=false;
				
				// }
				//this.isNotUp=false;
			}
		}, this );
	}

	private rspDate(id,rsp)
	{
		let dic={};
		if(rsp!=undefined)
		{
			if(rsp.ret==true)
			{
				dic["id"]=id;
				dic["lv"]=rsp.lv;
				dic["upNum"]=rsp.upNum;
				dic["todayNum"]=rsp.todayNum;
				dic["todayId"]=rsp.todayId;
				dic["breach"]=rsp.breach;
			}
		}
		return dic;
	}

	//升級
	public upTotems(totemsID,count,isAuto):void
	{
		let req = new Sproto.cs_totems_add_exp_request
		req.id=totemsID;
		req.num=count;
		req.autobuy=isAuto;
		this.Rpc(C2sProtocol.cs_totems_add_exp, req,(rsp: Sproto.cs_totems_add_exp_response) => 
		{
			//GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
			//console.log( rsp);
			if(rsp.ret==true)
			{
				let dic={};
				dic=this.rspDate(totemsID,rsp);
				// if(JSON.stringify(dic)!="{}")
				// {
				this.totemsDic[totemsID]=dic;
				GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
				// }
				//this.isNotUp=false;
			}
		}, this );
	}

	//突破
	public breachTotems(totemsID):void	
	{
		let req = new Sproto.cs_totems_breach_request
		req.id=totemsID;
		this.Rpc(C2sProtocol.cs_totems_breach, req,(rsp: Sproto.cs_totems_breach_response) => 
		{
			//GameGlobal.MessageCenter.dispatch(MessageDef.TSUMKO_RECORD, rsp);
			//console.log( rsp);
			if(rsp.ret==true)
			{
				let dic={};
				dic=this.rspDate(totemsID,rsp);
				// if(JSON.stringify(dic)!="{}")
				// {
				this.totemsDic[totemsID]=dic;
				GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_UPDATEACTIVATION);
				// }
				//this.isNotUp=false;
				this.mRedPoint.mRedPointMap[totemsID]=false;
			}
		}, this );
	}

	//獲取ID數組
	public tabIDArr():any[]
	{
		let arr=[];
		let tab=GameGlobal.Config.TotemsActConfig;
		for(let key in tab)
		{
			let row=tab[key];
			arr.push(row.id);
		}
		return arr;
	}

	public DicIndex(key,IDArr?):number
	{
		let index=-1
		if(IDArr==undefined)
			IDArr=this.tabIDArr();
		for(let i=0;i<IDArr.length;i++)
		{
			if(Number(key)==IDArr[i])
				return i;
		}	
		return index;
	}
	
}

class TotemsModelRedPoint extends IRedPoint
{
	private mModel:TotemsModel;
	public mRedPointMap: {[key: number]: boolean} = {}

	//public static readonly INDEX_UP_SIGN = 0
	public static readonly TOTEMS_ACTIVATION = 0

	constructor(model: TotemsModel) 
	{
		super()
		this.mModel = model
	}

	public GetMessageDef(): string[] 
	{
		return [
			MessageDef.TOTEMS_INFO,
			MessageDef.TOTEMS_UPDATEACTIVATION,
		];
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[TotemsModelRedPoint.TOTEMS_ACTIVATION]: this.showRedPoint
		}
	}

	public showRedPoint():boolean
	{
		let bool=false;
		let IDArr=this.mModel.tabIDArr();
		let tabAct=GameGlobal.Config.TotemsActConfig;
		let tabUp=GameGlobal.Config.TotemsAttrsConfig;
		for(let i=0;i<IDArr.length;i++)
		{
			let ID=IDArr[i];
			if(this.mModel.totemsDic[ID]!=undefined)//激活
			{
				let id=this.mModel.totemsDic[IDArr[i]].id;
				let lv=this.mModel.totemsDic[IDArr[i]].lv;
				//let lv=this.mModel.totemsDic[ID].breach;
				if(lv<=tabUp[id].length)
				{
					//if(tabUp[id][lv-1].tpcost!=undefined)//需要突破
					let breachLv=this.mModel.totemsDic[ID].breach;
					if(breachLv!=0)
					{
						//let breachLv=this.mModel.totemsDic[ID].breach;
						if(tabUp[id][breachLv].tpcost!=undefined)
						{
							if(Checker.Data(tabUp[id][breachLv].tpcost[0],false)==true)
							{
								this.mRedPointMap[id]=true;
								bool= true;
							}
						}
					}
					if(lv<tabUp[id].length)
					{
						if(tabUp[id][lv].cost!=undefined)//需要升級
						{
							if(Checker.Data(tabUp[id][lv].cost[0],false)==true)
							{	
								//this.mRedPointMap[id]=true;
								bool= true;
							}
							
						}
					}
				}
			}
			else
			{
				let item=tabAct[ID].cost[0];
				if(Checker.Data(item,false)==true)
				{
					this.mRedPointMap[ID]=true;
					bool= true;
				}
			}
			//Checker.Data()
		}
		return bool;
	}

	public OnChange(index: number): void 
	{
		GameGlobal.MessageCenter.dispatch(MessageDef.TOTEMS_REDPOINT_NOTICE);
	}

	// private GetIndexAct(): boolean 
	// {

	// }
	private DoActive() 
	{

	}
}