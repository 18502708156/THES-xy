/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/23 18:15
 * @meaning: 丹药管理类
 * 
 **/

class UserElixir extends BaseSystem {


	public mMsgDefUpdate = MessageDef.ROLE_ELIXIR_UPDATE




    tElixirData;//丹药数据
    tConfig;//配表数据

	tElixirArr;//丹药全部属性


	public constructor() {
		super();
		// this.mRedPoint = new UserWingRedPoint(this)

        this.regNetMsg(S2cProtocol.sc_panacea_update, this.doWaveData);

	}

    ///////////////协议部分////////////////////

    //posid 丹药id
	public useElixir(posid: number)
	{	
		let req;
		req = new Sproto.cs_panacea_use_request
		req.posid = posid
		this.Rpc(C2sProtocol.cs_panacea_use, req)
	}


    public doWaveData(rsp: Sproto.sc_panacea_update_request) {
        this.tElixirData = []
        for (let item in rsp.lvlist) {    
			for (const index in this.tConfig) {
				if(this.tConfig[index].posId ==item)
				{
					this.tElixirData[item] = this.tConfig[index]
					this.tElixirData[item].level = rsp.lvlist[item]
				}
			}
        }
		this.tElixirArr = rsp.attrs //丹药属性
		GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_ELIXIR_UPDATE)
    }
    ///////////////协议部分////////////////////

	public getElixirData()
	{
		return this.tElixirData
	}

	public getElixirArr()
	{
		return this.tElixirArr
	}



	public Init() {

		this.tConfig = GameGlobal.Config.PanaceaConfig

		super.Init()
	}






}

