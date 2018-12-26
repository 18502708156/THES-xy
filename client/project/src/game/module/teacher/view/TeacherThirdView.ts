/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒邀请详情
 * 
 **/

class TeacherThirdView extends BaseView implements ICommonWindowTitle {


	tPanelData = [];//界面总体数据数据

	protected listView:eui.List;

	public constructor() {
		super()
		this.skinName = "TeacherThird"
		this.listView.itemRenderer = TeacherInvItem;
	}

    

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent)//
		GameGlobal.TeacherManage.getMessage()
		this.UpdateContent()
	}

	public UpdateContent()
	{
		this.setData()
		this.listView.dataProvider = new eui.ArrayCollection(this.tPanelData) // 
	}


	public setData()
	{
		this.tPanelData = GameGlobal.TeacherController.getInvList() //招收列表
	}

}


