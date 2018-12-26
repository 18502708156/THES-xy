/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 11:15
 * @meaning: 答题管理类
 * 
 **/

class AnswerManage extends BaseSystem {



	public constructor() {
		super();
        this.regNetMsg(S2cProtocol.sc_answer_info, this.doAnswerInfo);
        this.regNetMsg(S2cProtocol.sc_answer_update, this.doAnswerUpDateInfo);
        this.regNetMsg(S2cProtocol.sc_answer_reward, this.doAnswerReward);
        this.regNetMsg(S2cProtocol.sc_answer_rank_res, this.doAnswerRank);
	}

	public Init() {
		super.Init()
	}



    //答题
 	// no			0 : integer #第几题
	// answer		1 : string #答案
    public sendAnswer(no,answer) {
		let req = new Sproto.cs_answer_answer_request;
        req.no = no
        req.answer = answer
        this.Rpc(C2sProtocol.cs_answer_answer, req)
	};

    //请求排行吧
    public sendRetRank() {
		let req = new Sproto.cs_answer_answer_rank_request;
        this.Rpc(C2sProtocol.cs_answer_answer_rank, req)
	};


    //打开界面
    public openAnswer()
    {
         this.Rpc(C2sProtocol.cs_answer_answer_ui,(rsp)=>{
             let rspData: Sproto.cs_answer_answer_ui_response = rsp;
         })
    }


    //#活动中发送数据
    public doAnswerInfo(rsp : Sproto.sc_answer_info_request)
    {


        GameGlobal.AnswerController.updateAnswer(rsp)

        //答题数据更新
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE)
    }


    public doAnswerUpDateInfo(rsp : Sproto.sc_answer_update_request)
    {


        GameGlobal.AnswerController.updateAnswer(rsp)

        //答题数据更新
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE)
    }

    


    public doAnswerReward(rsp : Sproto.sc_answer_reward_request)
    {
        //奖励界面
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_REWARD) //
        //直接打开界面
        //open
        ViewManager.ins().open(AnswerResultLayer,rsp)


        //强行把状态设置为0
        let pData = {type:0}
        pData.type = 0
        GameGlobal.AnswerController.updateAnswer(pData)
        GameGlobal.MessageCenter.dispatch(MessageDef.ANSWER_CHANGE)
    }


    public doAnswerRank(rsp : Sproto.sc_answer_rank_res_request)
    {
        //直接打开界面
        ViewManager.ins().open(AnswerRankWin,rsp.rank)



    }


   




}