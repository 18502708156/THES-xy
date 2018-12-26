/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/29 16:15
 * @meaning: 师徒管理类
 * 
 **/
 
class TeacherManage extends BaseSystem {



	public constructor() {
		super();


        this.regNetMsg(S2cProtocol.sc_teachers_info, this.doInfo);
        this.regNetMsg(S2cProtocol.sc_teachers_update, this.doUpdate);
        this.regNetMsg(S2cProtocol.sc_teachers_graduation, this.dograduation);
        this.regNetMsg(S2cProtocol.sc_teachers_message_add, this.messageAdd);

        

	}

	public Init() {
		super.Init()
	}



    //广播招师
    public message() {
        this.Rpc(C2sProtocol.cs_teachers_message)
	};

    //获取徒弟列表
    public getMessage() {
        this.Rpc(C2sProtocol.cs_teachers_get_message,null, (rsp) => {
			let rspData: Sproto.cs_teachers_get_message_response = rsp;
            if(rspData.data)
            {
                GameGlobal.TeacherController.posStudent(rspData.data)
                MessageCenter.ins().dispatch(MessageDef.TEACHER_CHANGE);
            }
		})
	};



    //师傅招收徒弟
    public applyTeacher(sDbid:number) {
        let req = new Sproto.cs_teachers_apply_teacher_request;
        req.sDbid = sDbid //学生id
        this.Rpc(C2sProtocol.cs_teachers_apply_teacher,req, (rsp) => {
			let rspData: Sproto.cs_teachers_apply_teacher_response = rsp;
            if(rspData.ret)
            {
                UserTips.ins().showTips("已发送收徒请求")

            }
		})
	};

    
    //徒弟答应
    public applyConfirm(tDbid:number,res:boolean) {
        let req = new Sproto.cs_teachers_apply_confirm_request;
        req.tDbid = tDbid
        req.res = res
        this.Rpc(C2sProtocol.cs_teachers_apply_confirm,req)
        GameGlobal.TeacherController.deleteMessage(tDbid)
	};

    //师傅传功
    public teachExp(no:number) {
        let req = new Sproto.cs_teachers_teach_exp_request;
        req.no = no

        this.Rpc(C2sProtocol.cs_teachers_teach_exp,req)

	};

    //徒弟领取
    public getExp(no:number) {
        let req = new Sproto.cs_teachers_get_exp_request;
        req.no = no
        this.Rpc(C2sProtocol.cs_teachers_get_exp,req)
    
	};


    //出师
    public graduation(no:number,typ:number) {
        let req = new Sproto.cs_teachers_graduation_request;
        req.no = no
        req.typ = typ
        this.Rpc(C2sProtocol.cs_teachers_graduation,req)
	};


    //领取任务奖励(经验)
    public forceGetReward(no:number,act:number){
        if(!no)return ;
        if(!act)return ;
        let req = new Sproto.cs_teachers_force_get_reward_request;
        req.no = no
        req.act = act
        this.Rpc(C2sProtocol.cs_teachers_force_get_reward,req, (rsp) => {
			let rspData: Sproto.cs_teachers_force_get_reward_response = rsp;
            if(rspData.ret)
            {
                GameGlobal.TeacherController.changeRewards(rspData.rewards)
                MessageCenter.ins().dispatch(MessageDef.TEACHER_CHANGE);
            }
		})
	};


    /////////////////接收部分//////////////

    public doInfo(rsp: Sproto.sc_teachers_info_request) {
        GameGlobal.TeacherController.doInfo(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE)
    }

    public doUpdate(rsp: Sproto.sc_teachers_update_request) {
        GameGlobal.TeacherController.doUpdate(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE)
   }

    public dograduation(rsp: Sproto.sc_teachers_graduation_request) {
        GameGlobal.TeacherController.dograduation(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE)
    }

    public messageAdd(rsp: Sproto.sc_teachers_message_add_request) {
        GameGlobal.TeacherController.messageAdd(rsp)
        GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE)
   }




}