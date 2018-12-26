/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒师傅详情
 * 
 **/

class TeacherFirstView extends BaseView implements ICommonWindowTitle {
	// "TeacherFirstSkin"


	tPanelData :Sproto.sc_teachers_info_request;//师徒数据


	protected cTeacher:eui.Component;
	protected lbSend : eui.Label;
	protected imgSend : eui.Image;
	protected listView : eui.List;
	protected infoItem : TeacherInfoItem;

	protected depart1 : TeacherDepartItem;
	protected depart2 : TeacherDepartItem;



	state = 1;//当前状态


	protected tRewardData = [];
    
	public constructor() {
		super()
		this.skinName = "TeacherFirstSkin"
		this.listView.itemRenderer = TeacherGetReItem
		
	}

	public OnOpen(...param: any[]) {

        this._AddClick(this.imgSend, this.onClick)
        this._AddClick(this.lbSend, this.onClick)
		this.observe(MessageDef.POWER_CHANGE, this.UpdateContent)
		this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent)

		this.UpdateContent()
	}

	public UpdateContent()
	{
		this.setData()


		if(this.state===1)
		{
			this.infoItem.visible = false
		}
		else if(this.state===2)
		{
			this.upDateTeacherState()
		}
		else if(this.state ===3)
		{
			this.upDateDepartState()
		}

	}

	private upDateTeacherState() {
		this.infoItem.visible = true
		this.infoItem.onUpdate(0,this.tPanelData.teacherData);//更新师傅数据
		this.listView.dataProvider = new eui.ArrayCollection(this.tRewardData)
	}

	private upDateDepartState() {
		this.infoItem.visible = true
		this.infoItem.onUpdate(0,this.tPanelData.teacherData);//更新师傅数据
		this.depart1.onUpdate(2)
		this.depart2.onUpdate(1)
	}

	public upState()
	{
		let day = this.tPanelData.teacherData.day
		let mitDay = GlobalConfig.ins().MasterBaseConfig.graduate //出师天数
		if(day)
		{
			if(day>=mitDay)
			{
				this.state = 3
				this.currentState = "depart"
			}
			else
			{
				this.state = 2 
				this.currentState = "teacher"
			}
		}
		else
		{
			this.state = 1 
			this.currentState = "null"
		}
	}


	public setData()
	{
		 this.tPanelData = GameGlobal.TeacherController.teacherInfo //获取师徒数据

	 	 this.upState()

		 if(this.state ===2)
		 {
				this.tRewardData = []//整合奖励数据

				var rewardMarks = []
				if(this.tPanelData.teacherData.rewards != null){
					rewardMarks = CommonUtils.uintToVecBool(this.tPanelData.teacherData.rewards,16);
				}

				let tTask =  GlobalConfig.ins().MasterTaskConfig
				for (const item in tTask) {
					let oData = {actNo:0,num:0,bGet:false,condition:0,pupilreward:[],masterreward:[],taskname:"",id:0,jump:0}
					let oTask = tTask[item]

					oData.bGet = rewardMarks[item] ||false
					oData.condition = oTask.condition
					oData.pupilreward  =   GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level,1)
					oData.masterreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level,2)

					oData.taskname = oTask.taskname
					oData.jump = oTask.jump
					oData.id = oTask.id

					//整合后端消息
					if(this.tPanelData.teacherData.data)
					{
						let tData = this.tPanelData.teacherData.data
						if(tData)
						{
							for (const index in tData) {
								if(tData[index].actNo ===oTask.id )
								{
									oData.actNo = tData[index].actNo
									oData.num = tData[index].num
								}
							}
						}
					}
					this.tRewardData.push(oData)

				}

				//奖励排序
				this.sortReward()


		 }

		

	}

	//排序
	private sortReward() {
		let weight = (config) => {
			if(config.bGet)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
		this.tRewardData.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
	}




	private onClick(e: egret.TouchEvent)
	{

		UserTips.ins().showTips("发送寻求名师广播")
		GameGlobal.TeacherManage.message()
		// switch (e.target) {
		// 		case this.imgSend:
					
		// 		break
				
		// 	}
	}

	
}


