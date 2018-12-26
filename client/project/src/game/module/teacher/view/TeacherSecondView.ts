/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒徒弟详情
 * 
 **/

class TeacherSecondView extends BaseView implements ICommonWindowTitle {

	protected pPop1: eui.Component;
	protected checkBox: eui.CheckBox;
	protected bar: eui.ProgressBar;

	protected lbVip: eui.Label;
	protected lbGd: eui.Label;



	protected infoItem0: TeacherInfoItem;
	protected infoItem1: TeacherInfoItem;
	protected tabBar: eui.TabBar;

	// protected scroller :eui.Scroller;
	protected gReward: eui.Group;

	protected lbTip: eui.Label;


	protected listReward: eui.List;





	private selectedIndex = 0;

	tPanelData: Sproto.teachers_data[];//师徒数据

	tNowData: Sproto.teachers_data //当前徒弟数据

	protected tRewardData = [];



	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "TeacherSecendSkin"
		this.tabBar.dataProvider = new eui.ArrayCollection(["大徒弟", "小徒弟"])
		this.listReward.itemRenderer = TeacherGetReLtItem
	}

	public childrenCreated() {

	}

	public OnOpen(...param: any[]) {

		this._AddClick(this.lbTip, this.onClick)
		this.observe(MessageDef.POWER_CHANGE, this.UpdateContent)
		this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent)
		this.tabBar.selectedIndex = 0;
		this.selectedIndex = 0
		this.AddItemClick(this.tabBar, this.onTabTap)
		this.UpdateContent()
		
	}



	private onTabTap() {
		this.selectedIndex = this.tabBar.selectedIndex
		this.UpdateContent()
	}


	public UpdateContent() {
		this.setData()
		this.upDateStuCon()
		this.infoItem0.onUpdate(1, this.tPanelData[0])
		this.infoItem1.onUpdate(1, this.tPanelData[1])

	}

	private upDateStuCon() { //更新学生内容
		if (this.tNowData && this.tNowData.no) {
			(this.listReward.dataProvider as eui.ArrayCollection).replaceAll(this.tRewardData);
			let mitDay = GlobalConfig.ins().MasterBaseConfig.graduate //出师天数
			if (this.tNowData.day && this.tNowData.day >= mitDay) {
				//可以出师
				this.gReward.visible = false
				this.lbTip.text = "等待徒弟出师"
			}
			else {
				//已经有徒弟内容
				this.gReward.visible = true
				this.lbTip.text = ""
			}
		}
		else {
			//没有徒弟内容
			this.gReward.visible = false
			this.lbTip.text = "仙君还没收徒"
		}
	}



	public setData() {
		this.tPanelData = GameGlobal.TeacherController.teacherInfo.studentData //获取徒弟列表数据
		this.tNowData = this.tPanelData[this.selectedIndex]

		if (this.tNowData && this.tNowData.day) {
			this.tRewardData = []
			var rewardMarks = []
			if (this.tNowData.rewards != null) {
				rewardMarks = CommonUtils.uintToVecBool(this.tNowData.rewards, 16);
			}

			let tTask = GlobalConfig.ins().MasterTaskConfig
			for (const item in tTask) {
				let oData = { actNo: 0, num: 0, bGet: false, condition: 0, pupilreward: [], masterreward: [], taskname: "", id: 0 }
				let oTask = tTask[item]

				oData.bGet = rewardMarks[item] || false
				oData.condition = oTask.condition
				oData.pupilreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 1)
				oData.masterreward = GameGlobal.TeacherController.lookForReward(GameGlobal.actorModel.level, 2)
				oData.taskname = oTask.taskname
				oData.id = oTask.id

				//整合后端消息
				if (this.tNowData.data) {
					let tData = this.tNowData.data
					if (tData) {
						for (const index in tData) {
							if (tData[index].actNo === oTask.id) {
								oData.actNo = tData[index].actNo
								oData.num = tData[index].num
							}
						}
					}
				}
				this.tRewardData.push(oData)
			}
			this.sortReward()
		}

	}



	//排序
	private sortReward() {
		let weight = (config) => {
			if (config.condition - config.num > 0)//不可领取
			{
				return 0;
			}
			else //可以领取
			{
				return 1;
			}
		}
		this.tRewardData.sort((lhs, rhs) => {
			return weight(lhs) - weight(rhs)
		})
	}



	private onClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.lbTip:
				//跳到 寻找界面
				MessageCenter.ins().dispatch(MessageDef.TEACHER_TURN, 2);
				break

		}
	}


}


