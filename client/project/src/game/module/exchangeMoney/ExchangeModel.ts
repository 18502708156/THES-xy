/**
 * 银两兑换Model
 */
class ExchangeModel extends BaseSystem
{
	//兑换
	public exchange():void
	{
		let req = new Sproto.cs_exchange_gold_perform_request

		this.Rpc(C2sProtocol.cs_exchange_gold_perform,req, (rsp: Sproto.cs_exchange_gold_perform_response) => {
			GameGlobal.MessageCenter.dispatch(MessageDef.EXCHANGE_COUNT, rsp);
		}, this)
	}
	//银两兑换信息
	public exchangeInfo():void
	{
		let req = new Sproto.cs_exchange_gold_info_request
		
		this.Rpc(C2sProtocol.cs_exchange_gold_info,req, (rsp: Sproto.cs_exchange_gold_info_response) => {
			GameGlobal.MessageCenter.dispatch(MessageDef.EXCHANGE_COUNT, rsp);
		}, this)
	}
}