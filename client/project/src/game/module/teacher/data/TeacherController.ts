/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/29 16:15
 * @meaning: 师徒控制类
 * 
 **/
class TeacherController extends BaseSystem {


   public  teacherInfo :Sproto.sc_teachers_info_request; // 师徒数据
   public tPosStudent :Sproto.teachers_student_data[]; //收徒列表

   public tInvList  =  [];//邀请列表

	public constructor() {
		super();
	}

	public Init() {
		super.Init()
	}




    public doInfo(rsp: Sproto.sc_teachers_info_request) {
        this.teacherInfo = rsp
    }


    public changeRewards(reward)
    {
        if(reward)
        {
           this.teacherInfo.teacherData.rewards = reward
        }
    }

    public doUpdate(rsp: Sproto.sc_teachers_update_request) {
        if(rsp.studentData)
        {
            for (const item in this.teacherInfo.studentData) {
                let tStu = this.teacherInfo.studentData[item]
                if(tStu.no ==rsp.studentData.no)
                {
                    this.analyze(tStu,rsp.studentData)
                }
            }
        }
        if(rsp.teacherData)
        {
            this.analyze(this.teacherInfo.teacherData,rsp.teacherData)
        }

    }

    public posStudent(rsp:Sproto.teachers_student_data[])
    {
        this.tPosStudent  = rsp
    }

    //lv 等级 type 1为徒弟, 2为师傅
    public lookForReward(_lv,_type)
    {
        let tReward = []
        if(_lv)
        {
            let tList = GlobalConfig.ins().MasterTaskRewardConfig
            for (const item in tList) {
                let data = tList[item]
                if(data.level)
                {
                    let one = data.level[0] || 1
                    let two = data.level[1] || 100000
                    if(_lv>=one&&_lv<= two)
                    {
                        if(_type==1)
                        {
                            tReward = data.pupilreward
                        }
                        else if(_type==2)
                        {
                            tReward = data.masterreward
                        }
                    }
                }
            }
        }
        return tReward
    }

    public dograduation(rsp: Sproto.sc_teachers_graduation_request) {
        let tStu = this.teacherInfo.studentData
        let tTea = this.teacherInfo.teacherData
        if(tStu)
        {
            for(let i = 0;i<tStu.length;i++)
            {
                if(tStu[i].no === rsp.no)
                {
                    tStu.splice(i,1)
                    return
                }
            }
        }
        if(tTea)
        {
            if(tTea.no === rsp.no)
            {
                for (const item in tTea) {
                    delete tTea[item]//清空数据对象
                }
            }
        }
    }
    
    public messageAdd(rsp: Sproto.sc_teachers_message_add_request) {
        if(this.teacherInfo.messageData)
        {
            this.teacherInfo.messageData.push(rsp)
        }
        else
        {
            this.teacherInfo.messageData = []
            this.teacherInfo.messageData.push(rsp)
        }
    }

    //把邀请内容删除
    public deleteMessage(_id)
    {
        let object = this.teacherInfo.messageData
        for(let i = 0;i<object.length;i++)
        {
            if(object[i].dbid&&object[i].dbid===_id)
            {
                object.splice(i,1)
                GameGlobal.MessageCenter.dispatch(MessageDef.TEACHER_CHANGE)
                break
            }
        }
    }


    //对匹配的对象进行替换
    public analyze(_origanal,_update) //解析
    {
        for (const item in _origanal) {
            if(_update.hasOwnProperty(item))//
            {
                _origanal[item] = _update[item] //赋值
            }
        }
    }

    //获取邀请列表
    public getInvList() //用于师徒邀请列表
    {
        let tList = []

        //接受邀请
        for (const item in this.teacherInfo.messageData) {
            let data = this.teacherInfo.messageData[item]
            let tMess = {dbid:0,name:"name",lv:0,type:0,tag:false}
            tMess.dbid  = data.dbid
            tMess.name  = data.name
            tMess.lv  = data.lv
            tMess.type  = 2
            tList.push(tMess)    
        }

        for (const item in this.tPosStudent) {
            let data = this.tPosStudent[item]
            let tMess = {dbid:0,name:"name",lv:0,type:0,tag:false}
            tMess.dbid  = data.dbid
            tMess.name  = data.name
            tMess.lv  = data.lv
            tMess.type  = 1
            tMess.tag = data.tag
            tList.push(tMess)    
        }

        //增加下标
        for (const item in tList) {
            tList[item].index = parseInt(item)
        }

        return tList //整合列表
    }

    //获取师傅界面师徒id
    public getTeacherIdInFirst():number
    {
        let id = 0
        if(this.teacherInfo&&this.teacherInfo.teacherData&&this.teacherInfo.teacherData.no)
        {
            id = this.teacherInfo.teacherData.no
        }
        return id
    }


}